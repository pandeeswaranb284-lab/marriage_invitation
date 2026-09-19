from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class RSVP(Base):
    __tablename__ = "rsvps"

    id = Column(Integer, primary_key=True, index=True)
    wedding_id = Column(Integer, ForeignKey("weddings.id"), nullable=False)
    guest_name = Column(String(150), nullable=False)
    phone = Column(String(50), nullable=True)
    email = Column(String(255), nullable=True)
    attending = Column(Boolean, nullable=False, default=True)
    guest_count = Column(Integer, default=1)
    message = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    wedding = relationship("Wedding", back_populates="rsvps")
