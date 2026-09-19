import logging
import os
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.config import FRONTEND_URL
from app.database import Base, SessionLocal, engine
import app.models  # Ensures all models are registered with Base
from app.routes import auth, weddings
from app.seed import seed_default_data

logger = logging.getLogger("uvicorn")

# Create all tables on startup
Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Seed default data
    db = SessionLocal()
    try:
        seed_default_data(db)
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
    finally:
        db.close()
    yield
    # Shutdown logic if needed


app = FastAPI(title="Royal Wedding Invitation API", version="2.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(weddings.router, prefix="/api")


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "royal-wedding-invitation"}


# ── Serve built React frontend (production) ──────────────────────
STATIC_DIR = Path(__file__).parent.parent / "static"

if STATIC_DIR.exists():
    # Serve static assets (JS/CSS/images) if assets directory exists
    assets_dir = STATIC_DIR / "assets"
    if assets_dir.exists():
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
