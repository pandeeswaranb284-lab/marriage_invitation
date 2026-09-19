from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


# Couple Details
class CoupleDetailSchema(BaseModel):
    id: Optional[int] = None
    artwork_url: Optional[str] = None
    groom_name: Optional[str] = None
    groom_father: Optional[str] = None
    groom_mother: Optional[str] = None
    groom_education: Optional[str] = None
    groom_profession: Optional[str] = None
    groom_native: Optional[str] = None
    groom_photo: Optional[str] = None
    groom_bio: Optional[str] = None

    bride_name: Optional[str] = None
    bride_father: Optional[str] = None
    bride_mother: Optional[str] = None
    bride_education: Optional[str] = None
    bride_profession: Optional[str] = None
    bride_native: Optional[str] = None
    bride_photo: Optional[str] = None
    bride_bio: Optional[str] = None

    class Config:
        from_attributes = True


# Family Details
class FamilySchema(BaseModel):
    id: Optional[int] = None
    elder_blessing_text: Optional[str] = None
    elder_blessing_tamil: Optional[str] = None
    groom_family_title: Optional[str] = "Groom's Family"
    groom_family_notes: Optional[str] = None
    groom_grandparents: Optional[str] = None
    bride_family_title: Optional[str] = "Bride's Family"
    bride_family_notes: Optional[str] = None
    bride_grandparents: Optional[str] = None

    class Config:
        from_attributes = True


# Marriage Ceremony Details
class MarriageDetailSchema(BaseModel):
    id: Optional[int] = None
    title_tamil: Optional[str] = "திருமண அழைப்பிதழ்"
    title_english: Optional[str] = "MARRIAGE CEREMONY"
    ceremony_date: datetime
    ceremony_time: Optional[str] = "9:00 AM to 10:30 AM"
    muhurtham_time: Optional[str] = "சுப முகூர்த்தம்: காலை 9:15 - 10:15 மணிக்குள்"
    venue_name: str
    venue_address: str
    landmark: Optional[str] = None
    parking_info: Optional[str] = None
    google_maps_url: Optional[str] = None
    map_embed_url: Optional[str] = None
    traditional_note: Optional[str] = None

    class Config:
        from_attributes = True


# Reception Details
class ReceptionDetailSchema(BaseModel):
    id: Optional[int] = None
    title_tamil: Optional[str] = "வரவேற்பு"
    title_english: Optional[str] = "WEDDING RECEPTION"
    reception_date: datetime
    reception_time: Optional[str] = "6:30 PM onwards"
    venue_name: str
    venue_address: str
    landmark: Optional[str] = None
    parking_info: Optional[str] = None
    google_maps_url: Optional[str] = None
    map_embed_url: Optional[str] = None
    reception_note: Optional[str] = None

    class Config:
        from_attributes = True


# Gallery Image
class GalleryImageSchema(BaseModel):
    id: Optional[int] = None
    image_url: str
    caption: Optional[str] = None
    category: Optional[str] = "celebration"
    display_order: Optional[int] = 0
    is_hero: Optional[bool] = False

    class Config:
        from_attributes = True


# RSVP
class RSVPCreate(BaseModel):
    guest_name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    attending: bool = True
    guest_count: int = 1
    message: Optional[str] = None


class RSVPOut(BaseModel):
    id: int
    guest_name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    attending: bool
    guest_count: int
    message: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# Blessings
class GuestWishCreate(BaseModel):
    guest_name: str
    message: str
    visibility: Optional[str] = "public"  # public | private


class GuestWishOut(BaseModel):
    id: int
    guest_name: str
    message: str
    status: Optional[str] = "approved"
    is_approved: bool
    visibility: Optional[str] = "public"
    created_at: datetime

    class Config:
        from_attributes = True


# Public Invitation View
class WeddingPublic(BaseModel):
    id: int
    slug: str
    title: str
    groom_name: str
    bride_name: str
    wedding_date: datetime
    wedding_time: Optional[str] = None
    opening_blessing: Optional[str] = "॥ ஸ்ரீ விநாயகர் துணை ॥"
    invitation_cover_style: Optional[str] = "royal_navy_burgundy"
    gold_seal_initials: Optional[str] = "A × P"
    tagline: Optional[str] = None
    language_mode: Optional[str] = "both"
    music_enabled: Optional[bool] = True
    music_url: Optional[str] = None
    theme: Optional[str] = "royal_gold"
    is_published: bool

    couple_details: Optional[CoupleDetailSchema] = None
    families: Optional[FamilySchema] = None
    marriage_details: Optional[MarriageDetailSchema] = None
    reception_details: Optional[ReceptionDetailSchema] = None
    gallery_images: List[GalleryImageSchema] = []
    guest_wishes: List[GuestWishOut] = []

    class Config:
        from_attributes = True


# Admin Wedding Update / Create
class WeddingUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    groom_name: Optional[str] = None
    bride_name: Optional[str] = None
    wedding_date: Optional[datetime] = None
    wedding_time: Optional[str] = None
    opening_blessing: Optional[str] = None
    invitation_cover_style: Optional[str] = None
    gold_seal_initials: Optional[str] = None
    tagline: Optional[str] = None
    language_mode: Optional[str] = None
    music_enabled: Optional[bool] = None
    music_url: Optional[str] = None
    theme: Optional[str] = None
    is_published: Optional[bool] = None

    couple_details: Optional[CoupleDetailSchema] = None
    families: Optional[FamilySchema] = None
    marriage_details: Optional[MarriageDetailSchema] = None
    reception_details: Optional[ReceptionDetailSchema] = None


class WeddingAdminOut(WeddingPublic):
    all_wishes: List[GuestWishOut] = []
