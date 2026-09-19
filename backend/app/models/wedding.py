from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Wedding(Base):
    __tablename__ = "weddings"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(120), unique=True, index=True, nullable=False)
    title = Column(String(200), nullable=False, default="Wedding Invitation")
    groom_name = Column(String(150), nullable=False)
    bride_name = Column(String(150), nullable=False)
    wedding_date = Column(DateTime(timezone=True), nullable=False)
    wedding_time = Column(String(50), nullable=True)
    opening_blessing = Column(String(255), default="॥ ஸ்ரீ விநாயகர் துணை ॥")
    invitation_cover_style = Column(String(50), default="royal_navy_burgundy")
    gold_seal_initials = Column(String(20), default="A × P")
    tagline = Column(Text, nullable=True)
    language_mode = Column(String(20), default="both")  # 'tamil', 'english', 'both'
    music_enabled = Column(Boolean, default=True)
    music_url = Column(String(500), nullable=True)
    theme = Column(String(50), default="royal_gold")
    is_published = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    couple_details = relationship("CoupleDetail", uselist=False, back_populates="wedding", cascade="all, delete-orphan")
    families = relationship("Family", uselist=False, back_populates="wedding", cascade="all, delete-orphan")
    marriage_details = relationship("MarriageDetail", uselist=False, back_populates="wedding", cascade="all, delete-orphan")
    reception_details = relationship("ReceptionDetail", uselist=False, back_populates="wedding", cascade="all, delete-orphan")
    gallery_images = relationship("GalleryImage", back_populates="wedding", cascade="all, delete-orphan", order_by="GalleryImage.display_order")
    rsvps = relationship("RSVP", back_populates="wedding", cascade="all, delete-orphan", order_by="RSVP.created_at.desc()")
    guest_wishes = relationship("GuestWish", back_populates="wedding", cascade="all, delete-orphan", order_by="GuestWish.created_at.desc()")
