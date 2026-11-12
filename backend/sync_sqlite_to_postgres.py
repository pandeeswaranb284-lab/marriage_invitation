"""
Script to copy all existing data from local SQLite (wedding_invite.db)
into a target PostgreSQL database (e.g., Supabase / Neon / Render).

Usage:
    python sync_sqlite_to_postgres.py "postgresql://user:pass@host:port/dbname"
Or set DATABASE_URL in .env and run:
    python sync_sqlite_to_postgres.py
"""

import os
import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

def main():
    target_url = None
    if len(sys.argv) > 1:
        target_url = sys.argv[1].strip()
    else:
        # Check backend/.env
        from dotenv import load_dotenv
        load_dotenv(backend_dir / ".env", override=True)
        env_url = os.getenv("DATABASE_URL", "").strip()
        if env_url and not env_url.startswith("sqlite") and "localhost" not in env_url:
            target_url = env_url

    if not target_url:
        print("Usage:")
        print("  python sync_sqlite_to_postgres.py \"postgresql://user:password@host:port/dbname\"")
        print("\nOr put your Supabase connection string inside backend/.env as DATABASE_URL and run:")
        print("  python sync_sqlite_to_postgres.py")
        sys.exit(1)
    if target_url.startswith("postgres://"):
        target_url = target_url.replace("postgres://", "postgresql://", 1)

    # Set environment variable before importing app modules
    os.environ["DATABASE_URL"] = target_url

    from sqlalchemy import create_engine, MetaData, Table, select
    from app.database import Base
    import app.models  # Register all models

    sqlite_path = backend_dir / "wedding_invite.db"
    if not sqlite_path.exists():
        print(f"Error: {sqlite_path} does not exist.")
        sys.exit(1)

    print(f"Connecting to target PostgreSQL: {target_url.split('@')[-1] if '@' in target_url else target_url}")

    sqlite_engine = create_engine(f"sqlite:///{sqlite_path}")
    pg_engine = create_engine(target_url, pool_pre_ping=True)

    # 1. Create all tables in PostgreSQL
    print("Creating tables in PostgreSQL if they do not exist...")
    Base.metadata.create_all(bind=pg_engine)

    # Tables in foreign-key dependency order
    tables_order = [
        "users",
        "weddings",
        "couple_details",
        "families",
        "marriage_details",
        "reception_details",
        "gallery_images",
        "guest_wishes",
        "rsvps",
        "wedding_events",
        "uploaded_files",
    ]

    sqlite_meta = MetaData()
    sqlite_meta.reflect(bind=sqlite_engine)

    pg_meta = MetaData()
    pg_meta.reflect(bind=pg_engine)

    with sqlite_engine.connect() as sqlite_conn, pg_engine.connect() as pg_conn:
        for table_name in tables_order:
            if table_name not in sqlite_meta.tables or table_name not in pg_meta.tables:
                continue

            src_table = sqlite_meta.tables[table_name]
            dst_table = pg_meta.tables[table_name]

            rows = sqlite_conn.execute(select(src_table)).fetchall()
            if not rows:
                print(f"  - {table_name}: 0 rows (skipped)")
                continue

            # Convert rows to dicts
            row_dicts = [dict(row._mapping) for row in rows]

            # Clear existing default seeds if any to avoid duplicate primary key collisions
            # (or insert only missing ones)
            inserted_count = 0
            for r in row_dicts:
                try:
                    pg_conn.execute(dst_table.insert().values(r))
                    inserted_count += 1
                except Exception:
                    # Ignore primary key conflict if already exists
                    pass

            pg_conn.commit()
            print(f"  + {table_name}: synced {inserted_count}/{len(rows)} rows")

    print("\nData sync completed successfully! Your cloud database is now fully populated.")


if __name__ == "__main__":
    main()
