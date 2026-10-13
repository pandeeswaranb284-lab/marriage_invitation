import asyncio
import json
import logging
import time
from typing import Dict, Optional, Set

logger = logging.getLogger("uvicorn")


class EventBus:
    """Thread-safe and async-compatible real-time event bus for wedding updates.

    Supports Server-Sent Events (SSE) subscribers and version tracking.
    """

    def __init__(self):
        # Slug -> Set of asyncio.Queue instances
        self._subscribers: Dict[str, Set[asyncio.Queue]] = {}
        # Global subscribers listening to all updates
        self._global_subscribers: Set[asyncio.Queue] = set()
        # In-memory latest version information per slug
        self._latest_versions: Dict[str, dict] = {}

    def _normalize_slug(self, slug: Optional[str]) -> str:
        if not slug:
            return "current"
        return slug.strip().lower()

    def subscribe(self, slug: Optional[str]) -> asyncio.Queue:
        """Create and register a new event queue for a given wedding slug."""
        q: asyncio.Queue = asyncio.Queue(maxsize=100)
        norm_slug = self._normalize_slug(slug)

        if norm_slug not in self._subscribers:
            self._subscribers[norm_slug] = set()
        self._subscribers[norm_slug].add(q)

        logger.info(f"[RealTime Sync] Client subscribed to wedding stream: '{norm_slug}' (total subscribers: {len(self._subscribers[norm_slug])})")
        return q

    def unsubscribe(self, slug: Optional[str], q: asyncio.Queue):
        """Unregister an event queue when client disconnects."""
        norm_slug = self._normalize_slug(slug)
        if norm_slug in self._subscribers:
            self._subscribers[norm_slug].discard(q)
            if not self._subscribers[norm_slug]:
                del self._subscribers[norm_slug]
        self._global_subscribers.discard(q)
        logger.info(f"[RealTime Sync] Client disconnected from wedding stream: '{norm_slug}'")

    def record_version(self, slug: str, updated_at: str):
        """Record the latest updated timestamp for version checking."""
        norm_slug = self._normalize_slug(slug)
        payload = {
            "slug": slug,
            "updated_at": updated_at,
            "timestamp": time.time(),
        }
        self._latest_versions[norm_slug] = payload
        self._latest_versions["current"] = payload

    def get_version(self, slug: str) -> Optional[dict]:
        """Retrieve recorded version for a wedding slug."""
        norm_slug = self._normalize_slug(slug)
        return self._latest_versions.get(norm_slug) or self._latest_versions.get("current")

    def publish(self, slug: str, payload: dict):
        """Synchronously enqueue an update event to all subscribers."""
        norm_slug = self._normalize_slug(slug)
        updated_at = payload.get("updated_at") or time.strftime("%Y-%m-%dT%H:%M:%SZ")
        self.record_version(norm_slug, updated_at)

        message = json.dumps(payload)
        targets: Set[asyncio.Queue] = set()

        if norm_slug in self._subscribers:
            targets.update(self._subscribers[norm_slug])
        if "current" in self._subscribers:
            targets.update(self._subscribers["current"])
        targets.update(self._global_subscribers)

        dispatched = 0
        for q in targets:
            try:
                q.put_nowait(message)
                dispatched += 1
            except asyncio.QueueFull:
                try:
                    q.get_nowait()
                    q.put_nowait(message)
                    dispatched += 1
                except Exception:
                    pass

        logger.info(f"[RealTime Sync] Published update for '{norm_slug}' to {dispatched} active stream(s): {payload.get('source', 'update')}")


# Singleton instance shared across FastAPI application
event_bus = EventBus()
