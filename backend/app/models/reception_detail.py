from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class ReceptionDetail(Base):
    __tablename__ = "reception_details"

    id = Column(Integer, primary_key=True, index=True)
    wedding_id = Column(Integer, ForeignKey("weddings.id"), unique=True, nullable=False)
    title_tamil = Column(String(200), default="வரவேற்பு")
    title_english = Column(String(200), default="WEDDING RECEPTION")
    reception_date = Column(DateTime(timezone=True), nullable=False)
    reception_time = Column(String(100), default="6:30 PM onwards")
    venue_name = Column(String(200), nullable=False)
    venue_address = Column(Text, nullable=False)
    landmark = Column(String(255), nullable=True)
    parking_info = Column(String(255), nullable=True)
    google_maps_url = Column(String(500), nullable=True)
    map_embed_url = Column(String(1000), nullable=True)
    reception_note = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    wedding = relationship("Wedding", back_populates="reception_details")
