import { API_BASE, getBackendOrigin } from './api';

const BROADCAST_CHANNEL_NAME = 'wedding_admin_sync';
const SYNC_STORAGE_KEY = 'wedding_sync_signal';

/**
 * Normalizes slug candidates for comparison.
 */
function normalizeSlug(slug) {
  if (!slug) return 'current';
  return String(slug).toLowerCase().trim();
}

/**
 * Broadcast an update event when an administrator successfully saves in the management panel.
 * Notifies all other open tabs in the same browser immediately (0ms latency).
 */
export function notifyAdminUpdate(slug, meta = {}) {
  const normSlug = normalizeSlug(slug);
  const payload = {
    type: 'WEDDING_UPDATED',
    slug: normSlug,
    timestamp: Date.now(),
    source: 'admin_panel',
    ...meta,
  };

  // 1. Cross-tab BroadcastChannel
  try {
    if (typeof window !== 'undefined' && window.BroadcastChannel) {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channel.postMessage(payload);
      channel.close();
    }
  } catch (err) {
    console.warn('[Sync] BroadcastChannel post error:', err);
  }

  // 2. Storage event fallback for cross-tab communication
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify(payload));
    }
  } catch (_) {
    // Ignore storage quota
  }
}

/**
 * Subscribes to real-time wedding updates across all devices and browsers.
 *
 * Employs a robust 4-tier synchronization architecture:
 * 1. BroadcastChannel: 0ms instant local cross-tab sync.
 * 2. Server-Sent Events (SSE): Persistent HTTP push channel from backend for external visitors & mobile devices.
 * 3. Smart Version Polling: Heartbeat fallback checking /version every 6s in case SSE is interrupted.
 * 4. Visibility Revalidation: Instant check when tab regains focus or mobile screen unlocks.
 *
 * @param {string} slug - The active wedding slug.
 * @param {Function} onUpdate - Callback invoked when a remote or local update is detected.
 * @param {string|null} initialUpdatedAt - The current known updated_at ISO string.
 * @returns {Function} cleanup - Cleanup function to unsubscribe and close all connections.
 */
export function subscribeToWeddingUpdates(slug, onUpdate, initialUpdatedAt = null) {
  const normSlug = normalizeSlug(slug);
  let isCleanedUp = false;
  let lastKnownUpdatedAt = initialUpdatedAt;
  let eventSource = null;
  let sseRetryTimer = null;
  let pollIntervalTimer = null;
  let broadcastChannel = null;

  const triggerUpdate = (detail) => {
    if (isCleanedUp) return;
    if (detail?.updated_at) {
      lastKnownUpdatedAt = detail.updated_at;
    }
    try {
      onUpdate(detail);
    } catch (err) {
      console.error('[Sync] onUpdate handler error:', err);
    }
  };

  // ── 1. Local Cross-Tab Communication ──────────────────────────────────────
  try {
    if (typeof window !== 'undefined' && window.BroadcastChannel) {
      broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      broadcastChannel.onmessage = (event) => {
        if (!event?.data) return;
        const msg = event.data;
        const msgSlug = normalizeSlug(msg.slug);
        if (msgSlug === normSlug || msgSlug === 'current' || normSlug === 'current') {
          triggerUpdate({ source: 'broadcast_channel', ...msg });
        }
      };
    }
  } catch (e) {
    console.warn('[Sync] BroadcastChannel init error:', e);
  }

  const handleStorageChange = (e) => {
    if (e.key !== SYNC_STORAGE_KEY || !e.newValue) return;
    try {
      const msg = JSON.parse(e.newValue);
      const msgSlug = normalizeSlug(msg.slug);
      if (msgSlug === normSlug || msgSlug === 'current' || normSlug === 'current') {
        triggerUpdate({ source: 'storage_event', ...msg });
      }
    } catch (_) {}
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorageChange);
  }

  // ── 2. Server-Sent Events (SSE) Stream ────────────────────────────────────
  const connectSSE = () => {
    if (isCleanedUp || typeof window === 'undefined' || !window.EventSource) return;

    try {
      const backendOrigin = getBackendOrigin();
      // Target direct backend or same-origin proxy
      const sseUrl = backendOrigin
        ? `${backendOrigin}/api/weddings/public/${normSlug}/stream`
        : `/api/weddings/public/${normSlug}/stream`;

      eventSource = new EventSource(sseUrl);

      eventSource.addEventListener('wedding_updated', (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data?.updated_at && lastKnownUpdatedAt && data.updated_at === lastKnownUpdatedAt) {
            // Already current
            return;
          }
          triggerUpdate({ source: 'sse', ...data });
        } catch (_) {
          triggerUpdate({ source: 'sse' });
        }
      });

      eventSource.addEventListener('connected', () => {
        // SSE connection successfully established
      });

      eventSource.onerror = () => {
        if (eventSource) {
          eventSource.close();
          eventSource = null;
        }
        if (!isCleanedUp) {
          // Schedule reconnect with 5s backoff
          sseRetryTimer = setTimeout(connectSSE, 5000);
        }
      };
    } catch (err) {
      console.warn('[Sync] SSE setup failed, falling back to smart polling:', err);
    }
  };

  connectSSE();

  // ── 3. Smart Version Polling Check ────────────────────────────────────────
  const checkRemoteVersion = async () => {
    if (isCleanedUp || typeof window === 'undefined') return;

    const candidateUrls = [
      `/api/weddings/public/${normSlug}/version?t=${Date.now()}`,
    ];
    const backendOrigin = getBackendOrigin();
    if (backendOrigin) {
      candidateUrls.push(`${backendOrigin}/api/weddings/public/${normSlug}/version?t=${Date.now()}`);
    }

    for (const url of candidateUrls) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'no-cache, no-store',
            Pragma: 'no-cache',
          },
        });
        clearTimeout(timeout);

        if (res.ok) {
          const versionData = await res.json();
          if (versionData?.updated_at) {
            if (!lastKnownUpdatedAt) {
              lastKnownUpdatedAt = versionData.updated_at;
            } else if (versionData.updated_at !== lastKnownUpdatedAt) {
              lastKnownUpdatedAt = versionData.updated_at;
              triggerUpdate({ source: 'version_check', ...versionData });
            }
          }
          break;
        }
      } catch (_) {
        // Try next candidate endpoint or continue
      }
    }
  };

  // Run initial version check shortly after mount, then every 6s
  const initialCheckTimer = setTimeout(checkRemoteVersion, 1500);
  pollIntervalTimer = setInterval(checkRemoteVersion, 6000);

  // ── 4. Tab Visibility & Focus Revalidation ────────────────────────────────
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      checkRemoteVersion();
    }
  };
  const handleWindowFocus = () => {
    checkRemoteVersion();
  };

  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }
  if (typeof window !== 'undefined') {
    window.addEventListener('focus', handleWindowFocus);
  }

  // ── Cleanup ───────────────────────────────────────────────────────────────
  return () => {
    isCleanedUp = true;
    clearTimeout(initialCheckTimer);
    clearTimeout(sseRetryTimer);
    clearInterval(pollIntervalTimer);

    if (broadcastChannel) {
      try {
        broadcastChannel.close();
      } catch (_) {}
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleWindowFocus);
    }
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
    if (eventSource) {
      try {
        eventSource.close();
      } catch (_) {}
      eventSource = null;
    }
  };
}

/**
 * Fetches the fresh wedding data, bypassing any browser or CDN cache.
 */
export async function fetchFreshWedding(slug) {
  const normSlug = normalizeSlug(slug);
  const cacheBust = Date.now();
  const backendOrigin = getBackendOrigin();

  const candidateUrls = [
    `/api/weddings/public/${normSlug}?v=${cacheBust}`,
  ];
  if (backendOrigin) {
    candidateUrls.push(`${backendOrigin}/api/weddings/public/${normSlug}?v=${cacheBust}`);
  }

  let freshData = null;
  let lastErr = null;

  for (const url of candidateUrls) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 9000);
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
      });
      clearTimeout(timeout);

      if (res.ok) {
        freshData = await res.json();
        break;
      }
    } catch (err) {
      lastErr = err;
    }
  }

  if (!freshData) {
    throw lastErr || new Error('Could not fetch latest wedding data.');
  }

  return freshData;
}
