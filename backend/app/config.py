import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

DEFAULT_POSTGRES_URL = "postgresql://invitation:postgres@localhost:5432/invitation"

DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_POSTGRES_URL).strip() or DEFAULT_POSTGRES_URL
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "super-secret-dev-key-change-me")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")
