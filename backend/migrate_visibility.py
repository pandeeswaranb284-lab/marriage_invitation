from app.database import engine, Base
from sqlalchemy import text, inspect
import app.models  # Ensures all models are registered

insp = inspect(engine)

# Ensure tables exist
if not insp.has_table('guest_wishes'):
    Base.metadata.create_all(bind=engine)
    print('Initialized database tables.')

# Refresh inspector
insp = inspect(engine)

if insp.has_table('guest_wishes'):
    cols = [c['name'] for c in insp.get_columns('guest_wishes')]
    print('Current columns in guest_wishes:', cols)

    if 'visibility' not in cols:
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE guest_wishes ADD COLUMN visibility VARCHAR(20) DEFAULT 'public'"))
            conn.commit()
        print('SUCCESS: visibility column added')
    else:
        print('OK: visibility column already exists')
else:
    print('Notice: guest_wishes table not present.')
