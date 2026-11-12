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
    if target_url.startswith("postgres://"):
        target_url = target_url.replace("postgres://", "postgresql://", 1)
    try:
        if target_url.startswith("sqlite"):
            eng = create_engine(target_url, connect_args={"check_same_thread": False})
        else:
            connect_args = {}
            if "localhost" not in target_url and "127.0.0.1" not in target_url and "sslmode" not in target_url:
                connect_args["sslmode"] = "require"
            eng = create_engine(target_url, pool_pre_ping=True, connect_args=connect_args)
        # Test connection
        with eng.connect() as conn:
            pass
        logger.info(f"Database connected successfully using: {target_url.split('@')[-1] if '@' in target_url else target_url}")
        return eng
    except Exception as exc:
        is_render = bool(os.getenv("RENDER") or os.getenv("RENDER_SERVICE_ID"))
        if is_render:
            logger.error(f"CRITICAL PRODUCTION WARNING: Failed to connect to cloud database ({exc}). Ensure DATABASE_URL is valid in Render dashboard!")
        else:
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
