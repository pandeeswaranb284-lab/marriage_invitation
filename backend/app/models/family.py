from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Family(Base):
    __tablename__ = "families"

    id = Column(Integer, primary_key=True, index=True)
    wedding_id = Column(Integer, ForeignKey("weddings.id"), unique=True, nullable=False)
    elder_blessing_text = Column(Text, nullable=True)
    elder_blessing_tamil = Column(Text, nullable=True)
    groom_family_title = Column(String(200), default="Groom's Family")
    groom_family_notes = Column(Text, nullable=True)
    groom_grandparents = Column(String(255), nullable=True)
    bride_family_title = Column(String(200), default="Bride's Family")
    bride_family_notes = Column(Text, nullable=True)
    bride_grandparents = Column(String(255), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    wedding = relationship("Wedding", back_populates="families")
