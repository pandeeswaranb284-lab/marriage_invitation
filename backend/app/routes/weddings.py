import csv
import io
import re
import uuid
from datetime import datetime
from pathlib import Path
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Response, status, File, UploadFile
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_admin
from app.database import get_db
from app.models.couple_detail import CoupleDetail
from app.models.family import Family
from app.models.gallery_image import GalleryImage
from app.models.guest_wish import GuestWish
from app.models.marriage_detail import MarriageDetail
from app.models.reception_detail import ReceptionDetail
from app.models.rsvp import RSVP
from app.models.wedding import Wedding
from app.schemas.wedding import (
    CoupleDetailSchema,
    FamilySchema,
    GalleryImageSchema,
    GuestWishCreate,
    GuestWishOut,
    MarriageDetailSchema,
    ReceptionDetailSchema,
    RSVPCreate,
    RSVPOut,
    WeddingAdminOut,
    WeddingPublic,
    WeddingUpdate,
)

router = APIRouter(prefix="/weddings", tags=["weddings"])


def generate_wedding_slug(groom: str, bride: str) -> str:
    cleaned = f"{groom.strip()} {bride.strip()}"
    slug_candidate = re.sub(r'[^a-zA-Z0-9\s-]', '', cleaned).strip().lower()
    slug_candidate = re.sub(r'[\s_]+', '-', slug_candidate)
    return slug_candidate or "wedding-invitation"


def find_wedding_by_slug_or_default(db: Session, slug: str) -> Optional[Wedding]:
    if slug and slug != "current":
        wedding = db.query(Wedding).filter(Wedding.slug == slug).first()
        if wedding:
            return wedding
    wedding = db.query(Wedding).filter(Wedding.slug == "k-prabhu-m-nalini").first()
    if not wedding:
        wedding = db.query(Wedding).order_by(Wedding.id.asc()).first()
    return wedding


# --- PUBLIC ENDPOINTS ---

@router.get("/public/{slug}", response_model=WeddingPublic)
def get_public_wedding(slug: str, response: Response, db: Session = Depends(get_db)):
    wedding = find_wedding_by_slug_or_default(db, slug)
    if not wedding:
        raise HTTPException(status_code=404, detail="Invitation not found")
    if not wedding.is_published:
        raise HTTPException(status_code=404, detail="Invitation is not published yet")

    # Enable edge/CDN and browser caching with stale-while-revalidate
    response.headers["Cache-Control"] = "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400"

    approved_wishes = [w for w in wedding.guest_wishes if w.is_approved and w.visibility == 'public']
    
    # Construct response
    data = {
        "id": wedding.id,
        "slug": wedding.slug,
        "title": wedding.title,
        "groom_name": wedding.groom_name,
        "bride_name": wedding.bride_name,
        "wedding_date": wedding.wedding_date,
        "wedding_time": wedding.wedding_time,
        "opening_blessing": wedding.opening_blessing,
        "invitation_cover_style": wedding.invitation_cover_style,
        "gold_seal_initials": wedding.gold_seal_initials,
        "tagline": wedding.tagline,
        "language_mode": wedding.language_mode or "both",
        "music_enabled": wedding.music_enabled,
        "music_url": wedding.music_url,
        "theme": wedding.theme,
        "is_published": wedding.is_published,
        "couple_details": wedding.couple_details,
        "families": wedding.families,
        "marriage_details": wedding.marriage_details,
        "reception_details": wedding.reception_details,
        "gallery_images": wedding.gallery_images,
        "guest_wishes": approved_wishes,
    }
    return data


@router.post("/public/{slug}/rsvp", status_code=201)
def submit_public_rsvp(slug: str, payload: RSVPCreate, db: Session = Depends(get_db)):
    wedding = find_wedding_by_slug_or_default(db, slug)
    if not wedding:
        raise HTTPException(status_code=404, detail="Invitation not found")

    rsvp = RSVP(
        wedding_id=wedding.id,
        guest_name=payload.guest_name,
        phone=payload.phone,
        email=payload.email,
        attending=payload.attending,
        guest_count=payload.guest_count,
        message=payload.message,
    )
    db.add(rsvp)
    db.commit()
    db.refresh(rsvp)
    return {
        "message": "Thank you. Your response has been received.",
        "rsvp_id": rsvp.id,
        "attending": rsvp.attending,
    }


@router.post("/public/{slug}/wishes", status_code=201)
def submit_public_wish(slug: str, payload: GuestWishCreate, db: Session = Depends(get_db)):
    wedding = find_wedding_by_slug_or_default(db, slug)
    if not wedding:
        raise HTTPException(status_code=404, detail="Invitation not found")

    visibility = payload.visibility if payload.visibility in ("public", "private") else "public"
    is_public = visibility == "public"

    wish = GuestWish(
        wedding_id=wedding.id,
        guest_name=payload.guest_name,
        message=payload.message,
        visibility=visibility,
        status="approved" if is_public else "private",
        is_approved=is_public,
    )
    db.add(wish)
    db.commit()
    db.refresh(wish)
    msg = (
        "Your blessing has been published successfully."
        if is_public
        else "Your private blessing has been sent to the couple."
    )
    return {"message": msg, "wish_id": wish.id, "visibility": visibility}


@router.get("/public/{slug}/wishes", response_model=List[GuestWishOut])
def get_public_wishes(slug: str, response: Response, db: Session = Depends(get_db)):
    wedding = find_wedding_by_slug_or_default(db, slug)
    if not wedding:
        raise HTTPException(status_code=404, detail="Invitation not found")
    response.headers["Cache-Control"] = "public, max-age=30, s-maxage=300, stale-while-revalidate=3600"
    # Only return public + approved blessings — never expose private ones
    return [w for w in wedding.guest_wishes if w.is_approved and w.visibility == 'public']


# --- ADMIN ENDPOINTS ---

@router.get("/admin/list")
def list_admin_weddings(db: Session = Depends(get_db), _: object = Depends(get_current_admin)):
    weddings = db.query(Wedding).all()
    results = []
    for w in weddings:
        results.append({
            "id": w.id,
            "slug": w.slug,
            "title": w.title,
            "groom_name": w.groom_name,
            "bride_name": w.bride_name,
            "wedding_date": w.wedding_date,
            "is_published": w.is_published,
            "rsvp_count": len(w.rsvps),
            "wishes_count": len(w.guest_wishes),
        })
    return results


@router.get("/admin/{slug}")
def get_admin_wedding(slug: str, db: Session = Depends(get_db), _: object = Depends(get_current_admin)):
    wedding = find_wedding_by_slug_or_default(db, slug)
    if not wedding:
        raise HTTPException(status_code=404, detail="Wedding not found")

    return {
        "id": wedding.id,
        "slug": wedding.slug,
        "title": wedding.title,
        "groom_name": wedding.groom_name,
        "bride_name": wedding.bride_name,
        "wedding_date": wedding.wedding_date,
        "wedding_time": wedding.wedding_time,
        "opening_blessing": wedding.opening_blessing,
        "invitation_cover_style": wedding.invitation_cover_style,
        "gold_seal_initials": wedding.gold_seal_initials,
        "tagline": wedding.tagline,
        "language_mode": wedding.language_mode,
        "music_enabled": wedding.music_enabled,
        "music_url": wedding.music_url,
        "theme": wedding.theme,
        "is_published": wedding.is_published,
        "couple_details": wedding.couple_details,
        "families": wedding.families,
        "marriage_details": wedding.marriage_details,
        "reception_details": wedding.reception_details,
        "gallery_images": wedding.gallery_images,
        "rsvps": wedding.rsvps,
        "guest_wishes": wedding.guest_wishes,
    }


UPLOAD_DIR = Path(__file__).parent.parent.parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/admin/upload-music")
async def upload_music(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin),
):
    allowed_exts = {".mp3", ".wav", ".ogg", ".m4a", ".aac", ".flac", ".weba"}
    ext = Path(file.filename).suffix.lower() if file.filename else ""
    if ext not in allowed_exts:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported audio format '{ext}'. Please upload an MP3, WAV, OGG, or M4A file."
        )

    clean_stem = re.sub(r'[^a-zA-Z0-9_-]', '_', Path(file.filename).stem)[:40]
    unique_filename = f"music_{clean_stem}_{uuid.uuid4().hex[:8]}{ext}"
    target_path = UPLOAD_DIR / unique_filename

    contents = await file.read()
    with open(target_path, "wb") as f:
        f.write(contents)

    relative_url = f"/uploads/{unique_filename}"

    # Auto-update current wedding's music_url and enable music
    wedding = db.query(Wedding).first()
    if wedding:
        wedding.music_url = relative_url
        wedding.music_enabled = True
        db.commit()

    return {
        "url": relative_url,
        "filename": file.filename,
        "saved_as": unique_filename,
        "size": len(contents),
    }


@router.post("/admin/upload-artwork")
async def upload_artwork(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin),
):
    allowed_exts = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"}
    ext = Path(file.filename).suffix.lower() if file.filename else ""
    if ext not in allowed_exts:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported image format '{ext}'. Please upload a JPG, PNG, WEBP, or GIF image."
        )

    clean_stem = re.sub(r'[^a-zA-Z0-9_-]', '_', Path(file.filename).stem)[:40]
    unique_filename = f"couple_{clean_stem}_{uuid.uuid4().hex[:8]}{ext}"
    target_path = UPLOAD_DIR / unique_filename

    contents = await file.read()
    with open(target_path, "wb") as f:
        f.write(contents)

    relative_url = f"/uploads/{unique_filename}"

    wedding = db.query(Wedding).first()
    if wedding:
        if not wedding.couple_details:
            cd = CoupleDetail(wedding_id=wedding.id, artwork_url=relative_url)
            db.add(cd)
        else:
            wedding.couple_details.artwork_url = relative_url
        db.commit()

    return {
        "url": relative_url,
        "filename": file.filename,
        "saved_as": unique_filename,
        "size": len(contents),
    }


@router.put("/admin/{slug}")
def update_admin_wedding(slug: str, payload: WeddingUpdate, db: Session = Depends(get_db), _: object = Depends(get_current_admin)):
    wedding = find_wedding_by_slug_or_default(db, slug)
    if not wedding:
        raise HTTPException(status_code=404, detail="Wedding not found")

    # Update top-level wedding properties
    top_level_fields = [
        "title", "wedding_date", "wedding_time",
        "opening_blessing", "invitation_cover_style", "gold_seal_initials", "tagline",
        "language_mode", "music_enabled", "music_url", "theme", "is_published"
    ]
    for field in top_level_fields:
        val = getattr(payload, field, None)
        if val is not None:
            setattr(wedding, field, val)

    # Automatically generate / update URL name (slug) when Groom or Bride name is updated
    groom_updated = payload.groom_name is not None
    bride_updated = payload.bride_name is not None
    if groom_updated:
        wedding.groom_name = payload.groom_name
    if bride_updated:
        wedding.bride_name = payload.bride_name

    # Automatically generate or clean title
    if payload.title and payload.title.strip():
        wedding.title = re.sub(r'\s+', ' ', payload.title).strip()
    elif groom_updated or bride_updated:
        if wedding.groom_name and wedding.bride_name:
            wedding.title = f"Wedding Invitation | {wedding.groom_name.strip()} & {wedding.bride_name.strip()}"

    if payload.slug and payload.slug.strip():
        wedding.slug = payload.slug.strip().lower()
    elif groom_updated or bride_updated:
        wedding.slug = generate_wedding_slug(wedding.groom_name, wedding.bride_name)

    # Update Couple Details
    if payload.couple_details:
        if not wedding.couple_details:
            wedding.couple_details = CoupleDetail(wedding_id=wedding.id)
            db.add(wedding.couple_details)
        for k, v in payload.couple_details.model_dump(exclude_unset=True).items():
            if k != "id":
                setattr(wedding.couple_details, k, v)

    # Update Families
    if payload.families:
        if not wedding.families:
            wedding.families = Family(wedding_id=wedding.id)
            db.add(wedding.families)
        for k, v in payload.families.model_dump(exclude_unset=True).items():
            if k != "id":
                setattr(wedding.families, k, v)

    # Update Marriage Details
    if payload.marriage_details:
        if not wedding.marriage_details:
            wedding.marriage_details = MarriageDetail(wedding_id=wedding.id, ceremony_date=wedding.wedding_date, venue_name="", venue_address="")
            db.add(wedding.marriage_details)
        for k, v in payload.marriage_details.model_dump(exclude_unset=True).items():
            if k != "id":
                setattr(wedding.marriage_details, k, v)

    # Update Reception Details
    if payload.reception_details:
        if not wedding.reception_details:
            wedding.reception_details = ReceptionDetail(wedding_id=wedding.id, reception_date=wedding.wedding_date, venue_name="", venue_address="")
            db.add(wedding.reception_details)
        for k, v in payload.reception_details.model_dump(exclude_unset=True).items():
            if k != "id":
                setattr(wedding.reception_details, k, v)

    db.commit()
    db.refresh(wedding)
    return {"message": "Wedding updated successfully", "slug": wedding.slug}


@router.get("/admin/{slug}/rsvps", response_model=List[RSVPOut])
def get_wedding_rsvps(slug: str, db: Session = Depends(get_db), _: object = Depends(get_current_admin)):
    wedding = find_wedding_by_slug_or_default(db, slug)
    if not wedding:
        raise HTTPException(status_code=404, detail="Wedding not found")
    return wedding.rsvps


@router.get("/admin/{slug}/export-rsvps")
def export_wedding_rsvps_csv(slug: str, db: Session = Depends(get_db), _: object = Depends(get_current_admin)):
    wedding = find_wedding_by_slug_or_default(db, slug)
    if not wedding:
        raise HTTPException(status_code=404, detail="Wedding not found")

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Guest Name", "Attending", "Guest Count", "Phone", "Email", "Message", "Submission Date"])

    for r in wedding.rsvps:
        writer.writerow([
            r.id,
            r.guest_name,
            "Yes" if r.attending else "No",
            r.guest_count,
            r.phone or "",
            r.email or "",
            r.message or "",
            r.created_at.strftime("%Y-%m-%d %H:%M") if r.created_at else ""
        ])

    csv_data = output.getvalue()
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=rsvps_{wedding.slug}.csv"}
    )


@router.get("/admin/{slug}/wishes", response_model=List[GuestWishOut])
def get_wedding_wishes_admin(slug: str, db: Session = Depends(get_db), _: object = Depends(get_current_admin)):
    wedding = find_wedding_by_slug_or_default(db, slug)
    if not wedding:
        raise HTTPException(status_code=404, detail="Wedding not found")
    return wedding.guest_wishes


@router.put("/admin/wishes/{wish_id}/status")
def update_wish_status(wish_id: int, status_val: str, db: Session = Depends(get_db), _: object = Depends(get_current_admin)):
    wish = db.query(GuestWish).filter(GuestWish.id == wish_id).first()
    if not wish:
        raise HTTPException(status_code=404, detail="Wish not found")
    wish.status = status_val
    wish.is_approved = (status_val.lower() == "approved")
    db.commit()
    return {"message": f"Wish status updated to {status_val}"}


@router.delete("/admin/wishes/{wish_id}")
def delete_wish_admin(wish_id: int, db: Session = Depends(get_db), _: object = Depends(get_current_admin)):
    wish = db.query(GuestWish).filter(GuestWish.id == wish_id).first()
    if not wish:
        raise HTTPException(status_code=404, detail="Wish not found")
    db.delete(wish)
    db.commit()
    return {"message": "Wish deleted successfully"}


@router.post("/admin/{slug}/gallery")
def add_gallery_image(slug: str, payload: GalleryImageSchema, db: Session = Depends(get_db), _: object = Depends(get_current_admin)):
    wedding = find_wedding_by_slug_or_default(db, slug)
    if not wedding:
        raise HTTPException(status_code=404, detail="Wedding not found")

    item = GalleryImage(
        wedding_id=wedding.id,
        image_url=payload.image_url,
        caption=payload.caption,
        category=payload.category or "celebration",
        display_order=payload.display_order or 0,
        is_hero=payload.is_hero or False,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/admin/gallery/{image_id}")
def delete_gallery_image(image_id: int, db: Session = Depends(get_db), _: object = Depends(get_current_admin)):
    item = db.query(GalleryImage).filter(GalleryImage.id == image_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    db.delete(item)
    db.commit()
    return {"message": "Gallery image deleted"}
