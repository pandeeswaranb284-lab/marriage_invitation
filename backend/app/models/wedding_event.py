from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class WeddingEvent(Base):
    __tablename__ = "wedding_events"

    id = Column(Integer, primary_key=True, index=True)
    wedding_id = Column(Integer, ForeignKey("weddings.id"), nullable=False)
    name = Column(String(150), nullable=False)
    event_date = Column(DateTime(timezone=True), nullable=False)
    event_time = Column(String(50), nullable=True)
    venue = Column(String(250), nullable=True)
    address = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)
    google_maps_url = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    wedding = relationship("Wedding", back_populates="events")
