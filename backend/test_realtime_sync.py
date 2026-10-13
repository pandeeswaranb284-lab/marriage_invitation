import json
from datetime import datetime
from fastapi.testclient import TestClient
from app.main import app
from app.services.event_bus import event_bus
from app.auth.security import create_access_token

client = TestClient(app)

# 1. Check initial public data
r1 = client.get("/api/weddings/public/k-prabhu-m-nalini")
assert r1.status_code == 200, f"Status: {r1.status_code}"
data1 = r1.json()
slug = data1["slug"]
print("Initial Bride:", data1["bride_name"], "Groom:", data1["groom_name"], "Slug:", slug)

# 2. Subscribe to EventBus for this wedding
q = event_bus.subscribe(slug)

# 3. Simulate Admin Update
admin_token = create_access_token(subject="admin@wedding.com")
headers = {"Authorization": f"Bearer {admin_token}"}

new_tagline = f"Two Hearts, One Sacred Bond - Verified Live Sync at {datetime.utcnow().strftime('%H:%M:%S')}"
update_payload = {
    "title": "Wedding Invitation | K. Prabhu & M. Nalini",
    "groom_name": "K. Prabhu",
    "bride_name": "M. Nalini",
    "tagline": new_tagline,
    "wedding_time": "காலை 7:30 AM - 9:00 AM",
}

r_update = client.put(f"/api/weddings/admin/{slug}", json=update_payload, headers=headers)
assert r_update.status_code == 200, f"Update failed: {r_update.text}"
update_res = r_update.json()
print("Admin PUT Update response:", update_res)

# 4. Verify EventBus broadcast
assert not q.empty(), "EventBus queue is empty!"
event_msg = json.loads(q.get_nowait())
print("Live Event received by Subscriber:", event_msg)
assert event_msg["type"] == "wedding_updated"
assert event_msg["slug"] == slug

# 5. Verify public version endpoint
r_ver = client.get(f"/api/weddings/public/{slug}/version")
assert r_ver.status_code == 200
ver_data = r_ver.json()
print("Public Version endpoint response:", ver_data)
assert ver_data["updated_at"] == update_res["updated_at"]

# 6. Verify public wedding endpoint immediately reflects updated info
r2 = client.get(f"/api/weddings/public/{slug}")
assert r2.status_code == 200
data2 = r2.json()
print("Refreshed Public Tagline:", data2["tagline"])
assert data2["tagline"] == new_tagline

# Clean up
event_bus.unsubscribe(slug, q)
print("\nALL VERIFICATIONS PASSED: Real-time Admin-to-Public Synchronization is working flawlessly!")
