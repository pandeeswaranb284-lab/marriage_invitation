// Vercel Edge Function for High-Performance Public Wedding Caching
// Provides global Edge CDN response times (< 30ms) and shields users from Render cold starts.

export const config = {
  runtime: 'edge',
};

const VERIFIED_WEDDING_DATA = {
  id: 1,
  slug: "k-prabhu-m-nalini",
  title: "Wedding Invitation | Prabhu & Nalini",
  groom_name: "Prabhu",
  bride_name: "Nalini",
  wedding_date: "2026-11-13T07:30:00Z",
  wedding_time: "காலை 7:30 AM - 9:00 AM",
  opening_blessing: "ஸ்ரீ முனுசாமி துணை",
  invitation_cover_style: "royal_navy_burgundy",
  gold_seal_initials: "P × N",
  tagline: "Two Hearts, One Sacred Bond, A Beautiful New Beginning.",
  language_mode: "english",
  music_enabled: true,
  music_url: "/uploads/music_vidssave_com_Grand_Wedding_Invitation_Vi_5f891a5b.mp3",
  theme: "temple_sacred",
  is_published: true,
  couple_details: {
    id: 1,
    artwork_url: "/uploads/couple_Ghibli-Inspired_Indian_Wedding_Kiss_00e26a13.png",
    artwork_size: "medium",
    artwork_fit: "cover",
    artwork_position: "top",
    artwork_zoom: 100,
    groom_name: "K. Prabhu",
    groom_father: "Mr. M. Kalathi (Late)",
    groom_mother: "Mrs. K. Vijaya",
    groom_education: "M.Sc., MBA",
    groom_profession: "",
    groom_native: "Chennai, Tamil Nadu",
    groom_photo: null,
    groom_bio: "Grandson of Late Thiru. Ramasamy & Thirumathi. Meenakshi Ammal",
    bride_name: "M. Nalini",
    bride_father: "Mr. M. Mari",
    bride_mother: "Mrs. M. Mala",
    bride_education: "M.Sc., M.Phil.",
    bride_profession: "",
    bride_native: "Chennai, Tamil Nadu",
    bride_photo: null,
    bride_bio: "Granddaughter of Late Thiru. Krishnan & Thirumathi. Sarojini Ammal"
  },
  families: {
    id: 1,
    elder_blessing_text: "With the blessings of our elders, family members, and well-wishers, we cordially invite you to grace the auspicious wedding of M. Nalini and K. Prabhu and bless the couple as they begin their married life together.",
    elder_blessing_tamil: "பெரியோர்களின் நல்லாசியுடனும் குடும்பத்தினரின் அன்புடனும் நடைபெறும் மு. நளினி மற்றும் கே. பிரபு அவர்களின் திருமண விழாவில் தாங்கள் குடும்பத்துடன் கலந்து கொண்டு மணமக்களை வாழ்த்துமாறு அன்புடன் அழைக்கிறோம்.",
    groom_family_title: "",
    groom_family_notes: "Sundaram & Family, Madurai",
    groom_grandparents: "",
    bride_family_title: "",
    bride_family_notes: "Meenakshisundaram & Family, Chennai",
    bride_grandparents: "",
    best_compliments: "M. Gopi B.E., - T. Yogapriya B.E., M.E. & G.Y. Dhruvan"
  },
  marriage_details: {
    id: 1,
    title_tamil: "திருமண அழைப்பிதழ்",
    title_english: "MARRIAGE CEREMONY",
    ceremony_date: "2026-11-13T07:30:00Z",
    ceremony_time: "7:30 AM to 9:00 AM",
    muhurtham_time: "சுப முகூர்த்தம்: காலை 7:30 - 9:00 மணிக்குள்",
    venue_name: "Arulmigu Sri Angalammman Shrine",
    venue_address: "Opasamuthiram Village, Gummidipoondi, Tamil Nadu",
    landmark: "Opasamuthiram Village, Gummidipoondi",
    parking_info: "Ample guest parking available inside the shrine premises",
    google_maps_url: "https://maps.google.com/?q=Arulmigu+Sri+Angalamman+Temple+Opasamuthiram+Gummidipoondi",
    map_embed_url: "https://maps.google.com/maps?q=Arulmigu+Sri+Angalamman+Temple+Opasamuthiram+Gummidipoondi&t=&z=15&ie=UTF8&iwloc=&output=embed",
    traditional_note: "Traditional South Indian Vedic Wedding Rites & Mangalyadharanam"
  },
  reception_details: {
    id: 1,
    title_tamil: "வரவேற்பு",
    title_english: "WEDDING RECEPTION",
    reception_date: "2026-11-15T13:00:00Z",
    reception_time: "6:30 PM onwards",
    venue_name: "Raghavendra Thirumana Mahal",
    venue_address: "No. 94/R, 2nd Main Road, Mathur MMDA, Chennai – 68, Tamil Nadu",
    landmark: "Near Mathur MMDA 2nd Main Road, Chennai – 68",
    parking_info: "Dedicated parking available at the mahal",
    google_maps_url: "https://maps.google.com/?q=Raghavendra+Thirumana+Mahal+Mathur+MMDA+Chennai",
    map_embed_url: "https://maps.google.com/maps?q=Raghavendra+Thirumana+Mahal+Mathur+MMDA+Chennai&t=&z=15&ie=UTF8&iwloc=&output=embed",
    reception_note: "An evening of celebration, banquet feast, and blessings"
  },
  gallery_images: [
    {
      id: 1,
      image_url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
      caption: "Traditional Heritage Portrait",
      category: "artwork",
      display_order: 1,
      is_hero: true
    },
    {
      id: 2,
      image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
      caption: "Groom in Traditional Pattu Veshti",
      category: "groom",
      display_order: 2,
      is_hero: false
    },
    {
      id: 3,
      image_url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",
      caption: "Bride in Kanchipuram Silk Saree",
      category: "bride",
      display_order: 3,
      is_hero: false
    },
    {
      id: 4,
      image_url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80",
      caption: "Sacred Rituals & Blessings",
      category: "celebration",
      display_order: 4,
      is_hero: false
    },
    {
      id: 5,
      image_url: "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=900&q=80",
      caption: "Family Gathering & Auspicious Preparations",
      category: "family",
      display_order: 5,
      is_hero: false
    }
  ],
  guest_wishes: [
    {
      id: 10,
      guest_name: "Pandi",
      message: "God bless you akka 🥰👋 Byee akka",
      status: "approved",
      is_approved: true,
      visibility: "public",
      created_at: "2026-10-12T18:33:59.681258Z"
    }
  ]
};

export default async function handler(request) {
  const url = new URL(request.url);
  const segments = url.pathname.split('/').filter(Boolean);
  const slug = segments[segments.length - 1] || 'current';

  const backendOrigin = process.env.VITE_API_URL || 'https://wedding-invitation-backend-0qez.onrender.com';
  const targetUrl = `${backendOrigin.replace(/\/$/, '')}/api/weddings/public/${slug}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000); // 4s timeout before serving edge cache

    const upstreamRes = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });
    clearTimeout(timeout);

    if (upstreamRes.ok) {
      const data = await upstreamRes.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          'CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          'Vercel-CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  } catch (_) {
    // Upstream timed out (e.g. Render spin-up) or threw network error
  }

  // Graceful fallback for the default wedding
  const norm = slug.toLowerCase();
  if (norm === 'k-prabhu-m-nalini' || norm === 'prabhu-nalini' || norm === 'current') {
    return new Response(JSON.stringify(VERIFIED_WEDDING_DATA), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
        'CDN-Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
        'Access-Control-Allow-Origin': '*',
        'X-Cache-Fallback': 'true',
      },
    });
  }

  return new Response(JSON.stringify({ detail: 'Invitation not found' }), {
    status: 404,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
