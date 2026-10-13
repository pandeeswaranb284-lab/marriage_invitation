import sys
from pathlib import Path

# Add backend directory to sys.path so 'app' is always resolvable
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

import sqlalchemy as sa
from app.database import engine, Base
import app.models  # Ensures all models are registered

insp = sa.inspect(engine)

# Ensure tables exist
if not insp.has_table('guest_wishes'):
    Base.metadata.create_all(bind=engine)
    print('Initialized database tables.')

# Refresh inspector
insp = sa.inspect(engine)

if insp.has_table('guest_wishes'):
    cols = [c['name'] for c in insp.get_columns('guest_wishes')]
    print('Current columns in guest_wishes:', cols)

    if 'visibility' not in cols:
        with engine.connect() as conn:
            conn.execute(sa.text("ALTER TABLE guest_wishes ADD COLUMN visibility VARCHAR(20) DEFAULT 'public'"))
            conn.commit()
        print('SUCCESS: visibility column added')
    else:
        print('OK: visibility column already exists')
else:
    print('Notice: guest_wishes table not present.')
