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
    existing_wedding = db.query(Wedding).filter(Wedding.slug == "arun-priya").first()
    if not existing_wedding:
        wedding_dt = datetime(2026, 11, 20, 9, 30, tzinfo=timezone.utc)
        reception_dt = datetime(2026, 11, 20, 18, 30, tzinfo=timezone.utc)

        wedding = Wedding(
            slug="arun-priya",
            title="Wedding Invitation of Arun & Priya",
            groom_name="Arun Sundaram",
            bride_name="Priya Meenakshi",
            wedding_date=wedding_dt,
            wedding_time="9:00 AM - 10:30 AM",
            opening_blessing="॥ ஸ்ரீ விநாயகர் துணை ॥",
            invitation_cover_style="royal_navy_burgundy",
            gold_seal_initials="A × P",
            tagline="With the blessings of our elders, two families unite in sacred tradition.",
            language_mode="both",
            music_enabled=True,
            music_url="https://actions.google.com/sounds/v1/ambiences/temple_bells_and_chants.ogg",
            theme="royal_gold",
            is_published=True,
        )
        db.add(wedding)
        db.commit()
        db.refresh(wedding)

        # Couple Details (Strictly arranged marriage, no dating/love story)
        couple = CoupleDetail(
            wedding_id=wedding.id,
            artwork_url="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
            # Groom
            groom_name="Arun Sundaram",
            groom_father="Thiru. S. Sundaram",
            groom_mother="Thirumathi. S. Lakshmi",
            groom_education="B.Tech (NIT Trichy), M.S. (Computer Science)",
            groom_profession="Lead System Architect",
            groom_native="Madurai, Tamil Nadu",
            groom_bio="Grandson of Late Thiru. Ramasamy & Thirumathi. Meenakshi Ammal",
            # Bride
            bride_name="Priya Meenakshi",
            bride_father="Thiru. K. Meenakshisundaram",
            bride_mother="Thirumathi. M. Rajeshwari",
            bride_education="B.E., M.B.A.",
            bride_profession="Senior Product Specialist",
            bride_native="Chennai, Tamil Nadu",
            bride_bio="Granddaughter of Late Thiru. Krishnan & Thirumathi. Sarojini Ammal",
        )
        db.add(couple)

        # Family Details
        family = Family(
            wedding_id=wedding.id,
            elder_blessing_text="With the gracious blessings of our kula deivam, beloved parents, grandparents, and respected elders, our families cordially welcome you to grace this sacred union.",
            elder_blessing_tamil="நமது குலதெய்வம் மற்றும் பெரியோர்களின் நல்லாசியுடன், அருமை மகன் அருண் சுந்தரம் மற்றும் செல்வி பிரியா மீனாட்சி ஆகியோரின் திருமண நன்னாளுக்கு தங்களை அன்போடு அழைக்கின்றோம்.",
            groom_family_title="M.S.S. Family, Madurai",
            groom_family_notes="Sundaram & Family, Madurai",
            groom_grandparents="Late Thiru. V. Ramasamy & Late Thirumathi. R. Meenakshi",
            bride_family_title="K.M. Family, Chennai",
            bride_family_notes="Meenakshisundaram & Family, Chennai",
            bride_grandparents="Late Thiru. S. Krishnan & Late Thirumathi. K. Sarojini",
        )
        db.add(family)

        # Marriage Details (Sacred, warm ivory & gold)
        marriage = MarriageDetail(
            wedding_id=wedding.id,
            title_tamil="திருமண அழைப்பிதழ்",
            title_english="MARRIAGE CEREMONY",
            ceremony_date=wedding_dt,
            ceremony_time="காலை 9:00 AM முதல் 10:30 AM வரை",
            muhurtham_time="சுப முகூர்த்தம்: காலை 9:15 AM - 10:15 AM (விருச்சிக லக்னம்)",
            venue_name="Raja Muthiah Mandapam",
            venue_address="Police Commissioner Office Road, Egmore, Chennai, Tamil Nadu 600008",
            landmark="Opposite Egmore Railway Station, Near Government Museum",
            parking_info="Ample valet and guest parking available inside the premises",
            google_maps_url="https://maps.google.com/?q=Raja+Muthiah+Mandapam+Egmore+Chennai",
            map_embed_url="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.4853050967397!2d80.2589!3d13.0805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52660057ea4d8f%3A0x6b24508ecf661001!2sRaja%20Muthiah%20Mandapam!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin",
            traditional_note="Traditional South Indian Vedic Wedding Rites & Mangalyadharanam",
        )
        db.add(marriage)

        # Reception Details (Royal Evening, Midnight Navy & Champagne)
        reception = ReceptionDetail(
            wedding_id=wedding.id,
            title_tamil="வரவேற்பு",
            title_english="WEDDING RECEPTION",
            reception_date=reception_dt,
            reception_time="மாலை 6:30 PM முதல்",
            venue_name="The Royal Ballroom, ITC Grand Chola",
            venue_address="63 Mount Road, Guindy, Chennai, Tamil Nadu 600032",
            landmark="Near Guindy Flyover & Raj Bhavan",
            parking_info="Dedicated 4-tier multi-level banquet parking with dedicated valet team",
            google_maps_url="https://maps.google.com/?q=ITC+Grand+Chola+Chennai",
            map_embed_url="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.377626359267!2d80.2185!3d13.0102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52670e3097e9d7%3A0x3347b744974f0b2f!2sITC%20Grand%20Chola!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin",
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
