from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class CoupleDetail(Base):
    __tablename__ = "couple_details"

    id = Column(Integer, primary_key=True, index=True)
    wedding_id = Column(Integer, ForeignKey("weddings.id"), unique=True, nullable=False)
    artwork_url = Column(String(500), nullable=True)
    
    # Groom details
    groom_name = Column(String(150), nullable=True)
    groom_father = Column(String(150), nullable=True)
    groom_mother = Column(String(150), nullable=True)
    groom_education = Column(String(200), nullable=True)
    groom_profession = Column(String(200), nullable=True)
    groom_native = Column(String(150), nullable=True)
    groom_photo = Column(String(500), nullable=True)
    groom_bio = Column(Text, nullable=True)
    
    # Bride details
    bride_name = Column(String(150), nullable=True)
    bride_father = Column(String(150), nullable=True)
    bride_mother = Column(String(150), nullable=True)
    bride_education = Column(String(200), nullable=True)
    bride_profession = Column(String(200), nullable=True)
    bride_native = Column(String(150), nullable=True)
    bride_photo = Column(String(500), nullable=True)
    bride_bio = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    wedding = relationship("Wedding", back_populates="couple_details")
