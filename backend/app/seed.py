from datetime import datetime, timezone
import logging
from sqlalchemy.orm import Session

from app.auth.security import hash_password
from app.models.couple_detail import CoupleDetail
from app.models.family import Family
from app.models.gallery_image import GalleryImage
from app.models.guest_wish import GuestWish
from app.models.marriage_detail import MarriageDetail
from app.models.reception_detail import ReceptionDetail
from app.models.rsvp import RSVP
from app.models.user import User
from app.models.wedding import Wedding

logger = logging.getLogger("uvicorn")


def seed_default_data(db: Session):
    # 1. Admin User
    admin_user = db.query(User).filter(User.email == "admin@wedding.com").first()
    if not admin_user:
        admin_user = User(
            email="admin@wedding.com",
            hashed_password=hash_password("admin123"),
            role="admin",
            is_admin=True,
        )
        db.add(admin_user)
        db.commit()
        logger.info("Created default admin user: admin@wedding.com / admin123")

    # 2. Default Wedding
    existing_wedding = db.query(Wedding).filter(Wedding.slug == "k-prabhu-m-nalini").first() or db.query(Wedding).first()
    if not existing_wedding:
        wedding_dt = datetime(2026, 11, 13, 7, 30, tzinfo=timezone.utc)
        reception_dt = datetime(2026, 11, 15, 18, 30, tzinfo=timezone.utc)

        wedding = Wedding(
            slug="k-prabhu-m-nalini",
            title="Wedding Invitation | K. Prabhu & M. Nalini",
            groom_name="K. Prabhu",
            bride_name="M. Nalini",
            wedding_date=wedding_dt,
            wedding_time="காலை 7:30 AM - 9:00 AM",
            opening_blessing="ஸ்ரீ முனுசாமி துணை",
            invitation_cover_style="royal_navy_burgundy",
            gold_seal_initials="P × N",
            tagline="Two Hearts, One Sacred Bond, A Beautiful New Beginning.",
            language_mode="both",
            music_enabled=True,
            music_url="https://actions.google.com/sounds/v1/ambiences/temple_bells_and_chants.ogg",
            theme="royal_gold",
            is_published=True,
        )
        db.add(wedding)
        db.commit()
        db.refresh(wedding)

        # Couple Details (Verified credentials, parents uninvented)
        couple = CoupleDetail(
            wedding_id=wedding.id,
            artwork_url="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
            # Groom
            groom_name="K. Prabhu",
            groom_education="M.Sc., MBA",
            # Bride
            bride_name="M. Nalini",
            bride_education="M.Sc., M.Phil.",
        )
        db.add(couple)

        # Family Details
        family = Family(
            wedding_id=wedding.id,
            elder_blessing_text="With the blessings of our elders, family members, and well-wishers, we cordially invite you to grace the auspicious wedding of M. Nalini and K. Prabhu and bless the couple as they begin their married life together.",
            elder_blessing_tamil="பெரியோர்களின் நல்லாசியுடனும் குடும்பத்தினரின் அன்புடனும் நடைபெறும் மு. நளினி மற்றும் கே. பிரபு அவர்களின் திருமண விழாவில் தாங்கள் குடும்பத்துடன் கலந்து கொண்டு மணமக்களை வாழ்த்துமாறு அன்புடன் அழைக்கிறோம்.",
        )
        db.add(family)

        # Marriage Details (Arulmigu Sri Angalammman Shrine)
        marriage = MarriageDetail(
            wedding_id=wedding.id,
            title_tamil="திருமண அழைப்பிதழ்",
            title_english="MARRIAGE CEREMONY",
            ceremony_date=wedding_dt,
            ceremony_time="7:30 AM to 9:00 AM",
            muhurtham_time="சுப முகூர்த்தம்: காலை 7:30 - 9:00 மணிக்குள்",
            venue_name="Arulmigu Sri Angalammman Shrine",
            venue_address="Opasamuthiram Village, Gummidipoondi, Tamil Nadu",
            landmark="Opasamuthiram Village",
            parking_info="Ample parking available inside the shrine premises",
            traditional_note="Traditional South Indian Vedic Wedding Rites & Mangalyadharanam",
        )
        db.add(marriage)

        # Reception Details (Raghavendra Thirumana Mahal)
        reception = ReceptionDetail(
            wedding_id=wedding.id,
            title_tamil="வரவேற்பு",
            title_english="WEDDING RECEPTION",
            reception_date=reception_dt,
            reception_time="6:30 PM onwards",
            venue_name="Raghavendra Thirumana Mahal",
            venue_address="No. 94/R, 2nd Main Road, Mathur MMDA, Chennai – 68, Tamil Nadu",
            landmark="Near Mathur MMDA 2nd Main Road",
            parking_info="Dedicated parking available at the mahal",
            reception_note="An evening of celebration, banquet feast, and blessings",
        )
        db.add(reception)

        # Gallery Images (Editorial style)
        gallery_items = [
            GalleryImage(
                wedding_id=wedding.id,
                image_url="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
                caption="Traditional Heritage Portrait",
                category="artwork",
                display_order=1,
                is_hero=True,
            ),
            GalleryImage(
                wedding_id=wedding.id,
                image_url="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
                caption="Groom in Traditional Pattu Veshti",
                category="groom",
                display_order=2,
            ),
            GalleryImage(
                wedding_id=wedding.id,
                image_url="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",
                caption="Bride in Kanchipuram Silk Saree",
                category="bride",
                display_order=3,
            ),
            GalleryImage(
                wedding_id=wedding.id,
                image_url="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80",
                caption="Sacred Rituals & Blessings",
                category="celebration",
                display_order=4,
            ),
            GalleryImage(
                wedding_id=wedding.id,
                image_url="https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=900&q=80",
                caption="Family Gathering & Auspicious Preparations",
                category="family",
                display_order=5,
            ),
        ]
        for item in gallery_items:
            db.add(item)

        # Initial Approved Wishes
        wishes = [
            GuestWish(
                wedding_id=wedding.id,
                guest_name="K. Sundaralingam & Family",
                message="இனிய நல்வாழ்த்துகள்! இரு வீட்டார் ஆசியுடன் நடைபெறும் இந்தத் திருமண விழா இனிதே சிறக்க மனமார்ந்த வாழ்த்துகள்.",
                status="approved",
                is_approved=True,
            ),
            GuestWish(
                wedding_id=wedding.id,
                guest_name="Dr. V. Narayanan",
                message="Heartiest congratulations Arun and Priya! Wishing you a blessed, harmonious married life filled with peace and prosperity.",
                status="approved",
                is_approved=True,
            ),
        ]
        for w in wishes:
            db.add(w)

        db.commit()
        logger.info(f"Seeded default arranged marriage invitation: /invite/{wedding.slug}")
