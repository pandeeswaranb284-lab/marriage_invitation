import json
from datetime import datetime, timezone
from fastapi.testclient import TestClient
from app.main import app
from app.services.event_bus import event_bus
from app.auth.security import create_access_token

client = TestClient(app)
admin_token = create_access_token(subject="admin@wedding.com")
headers = {"Authorization": f"Bearer {admin_token}"}

slug = "k-prabhu-m-nalini"
q = event_bus.subscribe(slug)

print("--- 1. Testing Core Wedding Details Update ---")
res = client.put(f"/api/weddings/admin/{slug}", json={
    "groom_name": "K. Prabhu",
    "bride_name": "M. Nalini",
    "opening_blessing": "॥ ஸ்ரீ விநாயகர் துணை ॥",
    "wedding_time": "காலை 7:30 AM - 9:00 AM",
    "tagline": "Two Hearts, One Sacred Bond, A Beautiful New Beginning."
}, headers=headers)
assert res.status_code == 200
assert not q.empty()
evt = json.loads(q.get_nowait())
assert evt["type"] == "wedding_updated"
print("✓ Core details updated & broadcasted:", evt["source"])

print("--- 2. Testing Couple & Artwork Update ---")
res = client.put(f"/api/weddings/admin/{slug}", json={
    "couple_details": {
        "groom_name": "K. Prabhu",
        "groom_education": "M.Sc., MBA",
        "bride_name": "M. Nalini",
        "bride_education": "M.Sc., M.Phil.",
        "artwork_size": "medium",
        "artwork_fit": "cover"
    }
}, headers=headers)
assert res.status_code == 200
assert not q.empty()
evt = json.loads(q.get_nowait())
assert evt["type"] == "wedding_updated"
print("✓ Couple details updated & broadcasted")

print("--- 3. Testing Families & Blessings Update ---")
res = client.put(f"/api/weddings/admin/{slug}", json={
    "families": {
        "elder_blessing_text": "With the blessings of our elders and well-wishers, we cordially invite you.",
        "elder_blessing_tamil": "பெரியோர்களின் நல்லாசியுடனும் குடும்பத்தினரின் அன்புடனும்...",
        "best_compliments": "Compliments from near & dear"
    }
}, headers=headers)
assert res.status_code == 200
assert not q.empty()
evt = json.loads(q.get_nowait())
assert evt["type"] == "wedding_updated"
print("✓ Family details updated & broadcasted")

print("--- 4. Testing Ceremony & Reception Details Update ---")
res = client.put(f"/api/weddings/admin/{slug}", json={
    "marriage_details": {
        "venue_name": "Arulmigu Sri Angalammman Shrine",
        "venue_address": "Opasamuthiram Village, Gummidipoondi, Tamil Nadu",
        "muhurtham_time": "சுப முகூர்த்தம்: காலை 7:30 - 9:00 மணிக்குள்"
    },
    "reception_details": {
        "venue_name": "Raghavendra Thirumana Mahal",
        "venue_address": "No. 94/R, 2nd Main Road, Mathur MMDA, Chennai – 68, Tamil Nadu",
        "reception_time": "6:30 PM onwards"
    }
}, headers=headers)
assert res.status_code == 200
assert not q.empty()
evt = json.loads(q.get_nowait())
assert evt["type"] == "wedding_updated"
print("✓ Ceremonies & reception details updated & broadcasted")

print("--- 5. Testing Theme & Language Preferences Update ---")
res = client.put(f"/api/weddings/admin/{slug}", json={
    "language_mode": "both",
    "theme": "royal_gold",
    "invitation_cover_style": "royal_navy_burgundy"
}, headers=headers)
assert res.status_code == 200
assert not q.empty()
evt = json.loads(q.get_nowait())
assert evt["type"] == "wedding_updated"
print("✓ Theme preferences updated & broadcasted")

print("--- 6. Testing Gallery Image Management ---")
img_res = client.post(f"/api/weddings/admin/{slug}/gallery", json={
    "image_url": "https://images.unsplash.com/photo-test-wedding",
    "caption": "Live Sync Gallery Test",
    "category": "celebration",
    "display_order": 99,
    "is_hero": False
}, headers=headers)
assert img_res.status_code == 200
assert not q.empty()
evt = json.loads(q.get_nowait())
assert evt["source"] == "gallery_added"
img_id = img_res.json()["id"]
print("✓ Gallery image added & broadcasted, ID:", img_id)

del_res = client.delete(f"/api/weddings/admin/gallery/{img_id}", headers=headers)
assert del_res.status_code == 200
assert not q.empty()
evt = json.loads(q.get_nowait())
assert evt["source"] == "gallery_deleted"
print("✓ Gallery image deleted & broadcasted")

print("--- 7. Testing Public Endpoint Freshness & Cache Headers ---")
pub_res = client.get(f"/api/weddings/public/{slug}")
assert pub_res.status_code == 200
pub_data = pub_res.json()
cache_header = pub_res.headers.get("cache-control")
print("Public Cache-Control header:", cache_header)
assert "max-age=0" in cache_header
assert "must-revalidate" in cache_header
assert pub_data["couple_details"]["groom_education"] == "M.Sc., MBA"
assert pub_data["marriage_details"]["venue_name"] == "Arulmigu Sri Angalammman Shrine"

event_bus.unsubscribe(slug, q)
print("\n🎉 ALL 7 TEST SCENARIOS PASSED WITH 100% SUCCESS!")
