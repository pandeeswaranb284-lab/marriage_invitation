import logging
import mimetypes
import os
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import Depends, FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.config import FRONTEND_URL, ALLOWED_ORIGINS
from app.database import Base, SessionLocal, engine, get_db
import app.models  # Ensures all models are registered with Base
from app.models.uploaded_file import UploadedFile
from app.routes import auth, weddings
from app.seed import seed_default_data

logger = logging.getLogger("uvicorn")

# Create all tables on startup
Base.metadata.create_all(bind=engine)

# Ensure new columns exist on couple_details table
try:
    from sqlalchemy import text
    with engine.connect() as conn:
        for col, col_def in [
            ("artwork_size", "VARCHAR(50) DEFAULT 'medium'"),
            ("artwork_fit", "VARCHAR(50) DEFAULT 'cover'"),
            ("artwork_position", "VARCHAR(50) DEFAULT 'center'"),
            ("artwork_zoom", "INTEGER DEFAULT 100"),
        ]:
            try:
                conn.execute(text(f"ALTER TABLE couple_details ADD COLUMN {col} {col_def}"))
                conn.commit()
            except Exception:
                pass
except Exception as exc:
    logger.warning(f"Column migration note: {exc}")


UPLOAD_DIR = Path(__file__).parent.parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def sync_disk_uploads_to_db(db: Session):
    """Seed existing disk uploads into database so they persist across container restarts."""
    if not UPLOAD_DIR.exists():
        return
    for item in UPLOAD_DIR.glob("*"):
        if item.is_file() and not item.name.startswith("."):
            try:
                clean_name = item.name
                existing = db.query(UploadedFile).filter(UploadedFile.filename == clean_name).first()
                if not existing:
                    data = item.read_bytes()
                    mime_type, _ = mimetypes.guess_type(clean_name)
                    record = UploadedFile(
                        filename=clean_name,
                        content_type=mime_type or "application/octet-stream",
                        file_size=len(data),
                        data=data,
                    )
                    db.add(record)
                    db.commit()
            except Exception as e:
                db.rollback()
                logger.warning(f"Could not sync file {item.name} to DB: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Seed default data and sync disk uploads
    db = SessionLocal()
    try:
        seed_default_data(db)
        sync_disk_uploads_to_db(db)
    except Exception as e:
        logger.error(f"Error seeding database or syncing uploads: {e}")
    finally:
        db.close()
    yield
    # Shutdown logic if needed


app = FastAPI(title="Royal Wedding Invitation API", version="2.0.0", lifespan=lifespan)

# Build configured CORS origins
cors_origins = set()
if FRONTEND_URL:
    for o in FRONTEND_URL.split(","):
        if o.strip():
            cors_origins.add(o.strip().rstrip("/"))

if ALLOWED_ORIGINS:
    for o in ALLOWED_ORIGINS.split(","):
        if o.strip():
            cors_origins.add(o.strip().rstrip("/"))

# Standard local dev origins
for local_o in ["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174", "http://127.0.0.1:8001"]:
    cors_origins.add(local_o)

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(cors_origins),
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(weddings.router, prefix="/api")


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "royal-wedding-invitation"}


# ── Persistent Uploads serving with Database fallback ─────────────
@app.api_route("/uploads/{file_path:path}", methods=["GET", "HEAD"])
async def serve_uploaded_file(file_path: str, db: Session = Depends(get_db)):
    clean_name = Path(file_path).name
    disk_path = UPLOAD_DIR / clean_name

    # 1. Local disk fast-path (instant zero-db latency)
    if disk_path.is_file():
        mime_type, _ = mimetypes.guess_type(clean_name)
        return FileResponse(
            str(disk_path),
            media_type=mime_type or "application/octet-stream",
            headers={
                "Cache-Control": "public, max-age=31536000, immutable",
                "Access-Control-Allow-Origin": "*",
            },
        )

    # 2. Resilient database fallback (survives container spin-downs, restarts & redeployments)
    db_file = db.query(UploadedFile).filter(UploadedFile.filename == clean_name).first()
    if db_file and db_file.data:
        try:
            with open(disk_path, "wb") as f:
                f.write(db_file.data)
        except Exception:
            pass

        mime_type = db_file.content_type or mimetypes.guess_type(clean_name)[0] or "application/octet-stream"
        return Response(
            content=db_file.data,
            media_type=mime_type,
            headers={
                "Cache-Control": "public, max-age=31536000, immutable",
                "Access-Control-Allow-Origin": "*",
            },
        )

    raise HTTPException(status_code=404, detail="File not found")


@app.api_route("/api/uploads/{file_path:path}", methods=["GET", "HEAD"])
async def serve_api_uploaded_file(file_path: str, db: Session = Depends(get_db)):
    return await serve_uploaded_file(file_path, db)


# ── Serve built React frontend (production) ──────────────────────
STATIC_DIR = Path(__file__).parent.parent / "static"

if STATIC_DIR.exists():
    # Serve static assets (JS/CSS/images) if assets directory exists
    assets_dir = STATIC_DIR / "assets"
    if assets_dir.exists():
        from fastapi.staticfiles import StaticFiles
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

    # Catch-all: serve file if exists, else serve index.html for SPA routing
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = STATIC_DIR / full_path
        if full_path and file_path.is_file():
            return FileResponse(str(file_path))
        index = STATIC_DIR / "index.html"
        if index.exists():
            return FileResponse(str(index))
        return {"message": "Royal Wedding Invitation API is running", "version": "2.0.0"}

else:
    @app.get("/")
    def root():
        return {"message": "Royal Wedding Invitation API is running", "version": "2.0.0"}
