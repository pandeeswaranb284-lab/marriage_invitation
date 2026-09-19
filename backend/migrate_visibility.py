from app.database import engine
from sqlalchemy import text, inspect

insp = inspect(engine)
cols = [c['name'] for c in insp.get_columns('guest_wishes')]
print('Current columns:', cols)

if 'visibility' not in cols:
    with engine.connect() as conn:
        conn.execute(text("ALTER TABLE guest_wishes ADD COLUMN visibility VARCHAR(20) DEFAULT 'public'"))
        conn.commit()
    print('SUCCESS: visibility column added')
else:
    print('OK: visibility column already exists')
