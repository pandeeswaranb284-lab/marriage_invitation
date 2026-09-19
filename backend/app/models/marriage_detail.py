from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class MarriageDetail(Base):
    __tablename__ = "marriage_details"

    id = Column(Integer, primary_key=True, index=True)
    wedding_id = Column(Integer, ForeignKey("weddings.id"), unique=True, nullable=False)
    title_tamil = Column(String(200), default="திருமண அழைப்பிதழ்")
    title_english = Column(String(200), default="MARRIAGE CEREMONY")
    ceremony_date = Column(DateTime(timezone=True), nullable=False)
    ceremony_time = Column(String(100), default="9:00 AM to 10:30 AM")
    muhurtham_time = Column(String(150), default="சுப முகூர்த்தம்: காலை 9:15 - 10:15 மணிக்குள்")
    venue_name = Column(String(200), nullable=False)
    venue_address = Column(Text, nullable=False)
    landmark = Column(String(255), nullable=True)
    parking_info = Column(String(255), nullable=True)
    google_maps_url = Column(String(500), nullable=True)
    map_embed_url = Column(String(1000), nullable=True)
    traditional_note = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    wedding = relationship("Wedding", back_populates="marriage_details")
