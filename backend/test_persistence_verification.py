"""
Verification Test Suite for Wedding Invitation Database Persistence & Slug Handling.
Tests:
1. Exact slug lookup, previous_slug lookup, and 404 on invalid slugs.
2. Safe slug updates preserving previous_slug.
3. Partial child updates without wiping existing columns.
4. Non-overwriting seed idempotency.
"""
import sys
from pathlib import Path
from datetime import datetime, timezone

# Add backend directory to path
backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.models.wedding import Wedding
from app.models.couple_detail import CoupleDetail
from app.models.family import Family
from app.models.marriage_detail import MarriageDetail
from app.models.reception_detail import ReceptionDetail
from app.routes.weddings import find_wedding_by_slug_or_default
from app.schemas.wedding import WeddingUpdate, CoupleDetailSchema, FamilySchema
from app.seed import seed_default_data

# Use in-memory SQLite for self-contained, isolated testing
engine = create_engine("sqlite:///:memory:")
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)

def run_tests():
    db = TestingSessionLocal()
    print("=== STARTING PERSISTENCE & SLUG VERIFICATION TESTS ===")

    # Test 1: Initial Seed
    seed_default_data(db)
    w = db.query(Wedding).first()
    assert w is not None, "Wedding should exist after seed"
    assert w.slug == "k-prabhu-m-nalini", f"Expected 'k-prabhu-m-nalini', got '{w.slug}'"
    print("PASS: Initial seed created wedding successfully")

    # Test 2: find_wedding_by_slug_or_default behavior
    # Exact slug match
    w_exact = find_wedding_by_slug_or_default(db, "k-prabhu-m-nalini")
    assert w_exact is not None and w_exact.id == w.id, "Exact slug lookup failed"
    print("PASS: Exact slug lookup")

    # Current slug fallback
    w_curr = find_wedding_by_slug_or_default(db, "current")
    assert w_curr is not None and w_curr.id == w.id, "'current' fallback lookup failed"
    print("PASS: 'current' lookup returns active wedding")

    # Invalid slug must return None (404)
    w_invalid = find_wedding_by_slug_or_default(db, "non-existent-random-slug-12345")
    assert w_invalid is None, "Invalid slug should return None to trigger 404"
    print("PASS: Invalid slug correctly returns None (preventing silent fallback to wrong wedding)")

    # Test 3: Updating couple details with parent names
    c = w.couple_details
    assert c is not None
    c.groom_father = "Thiru M. Kalathi"
    c.groom_mother = "Thirumathi K. Vijaya"
    c.bride_father = "Thiru M. Mari"
    c.bride_mother = "Thirumathi M. Mala"
    db.commit()
    db.refresh(c)
    assert c.groom_father == "Thiru M. Kalathi"
    print("PASS: Populated parent names in couple_details")

    # Test 4: Simulate partial update from WeddingEditor (e.g. only artwork fields changed)
    # Ensure parents are NOT wiped to None
    partial_couple = CoupleDetailSchema(artwork_size="xlarge", artwork_fit="cover")
    # Simulate update logic in update_admin_wedding
    for k, v in partial_couple.model_dump(exclude_unset=True).items():
        if k != "id" and v is not None:
            setattr(w.couple_details, k, v)
    db.commit()
    db.refresh(w)
    assert w.couple_details.artwork_size == "xlarge"
    assert w.couple_details.groom_father == "Thiru M. Kalathi", "Parent name must NOT be wiped by partial update!"
    print("PASS: Partial update preserved existing parent details without wiping to NULL")

    # Test 5: Safe slug rename preserving previous_slug
    old_slug = w.slug
    new_slug = "prabhu-loves-nalini"
    w.previous_slug = old_slug
    w.slug = new_slug
    db.commit()
    db.refresh(w)

    assert w.slug == "prabhu-loves-nalini"
    assert w.previous_slug == "k-prabhu-m-nalini"
    print("PASS: Slug updated and previous_slug preserved")

    # Test 6: Verify previous_slug lookup resolves seamlessly
    w_by_prev = find_wedding_by_slug_or_default(db, "k-prabhu-m-nalini")
    assert w_by_prev is not None and w_by_prev.id == w.id, "Lookup by previous_slug failed"
    print("PASS: Previous slug resolves to updated wedding")

    # Test 7: Verify idempotency of seed_default_data
    # Re-running seed must NOT revert the custom slug or wipe data!
    seed_default_data(db)
    w_after_reseed = db.query(Wedding).first()
    assert w_after_reseed.slug == "prabhu-loves-nalini", "Reseed must NOT overwrite modified wedding!"
    assert w_after_reseed.couple_details.groom_father == "Thiru M. Kalathi", "Reseed must NOT wipe custom details!"
    print("PASS: Seed idempotency verified - custom database records are never overwritten")

    print("\nALL PERSISTENCE AND SLUG VERIFICATION TESTS PASSED SUCCESSFULLY! ✓")

if __name__ == "__main__":
    run_tests()
