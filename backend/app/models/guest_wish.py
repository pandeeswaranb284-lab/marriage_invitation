from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class GuestWish(Base):
    __tablename__ = "guest_wishes"

    id = Column(Integer, primary_key=True, index=True)
    wedding_id = Column(Integer, ForeignKey("weddings.id"), nullable=False)
    guest_name = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String(30), default="pending")   # pending, approved, rejected
    is_approved = Column(Boolean, default=False)
    visibility = Column(String(20), default="public") # public | private
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    wedding = relationship("Wedding", back_populates="guest_wishes")
