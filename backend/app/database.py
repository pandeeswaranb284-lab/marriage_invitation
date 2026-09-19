import logging
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config import DATABASE_URL

logger = logging.getLogger("uvicorn")

Base = declarative_base()

def init_engine():
    # Try the configured DATABASE_URL first
    target_url = DATABASE_URL
    try:
        if target_url.startswith("sqlite"):
            eng = create_engine(target_url, connect_args={"check_same_thread": False})
        else:
            eng = create_engine(target_url, pool_pre_ping=True)
        # Test connection
        with eng.connect() as conn:
            pass
        logger.info(f"Database connected successfully using: {target_url.split('@')[-1] if '@' in target_url else target_url}")
        return eng
    except Exception as exc:
        logger.warning(f"Could not connect to {target_url} ({exc}). Falling back to local SQLite database.")
        sqlite_url = "sqlite:///./wedding_invite.db"
        eng = create_engine(sqlite_url, connect_args={"check_same_thread": False})
        return eng

engine = init_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
