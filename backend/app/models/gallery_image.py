from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class GalleryImage(Base):
    __tablename__ = "gallery_images"

    id = Column(Integer, primary_key=True, index=True)
    wedding_id = Column(Integer, ForeignKey("weddings.id"), nullable=False)
    image_url = Column(String(500), nullable=False)
    caption = Column(String(255), nullable=True)
    category = Column(String(50), default="celebration")  # artwork, bride, groom, family, celebration
    display_order = Column(Integer, default=0)
    is_hero = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    wedding = relationship("Wedding", back_populates="gallery_images")
