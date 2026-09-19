import React, { useEffect, useState } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import { API_BASE } from '../../services/api';

export default function CeremonyEditor({ type = "both" }) {
  const [wedding, setWedding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const token = localStorage.getItem('admin_token');
  const apiBase = API_BASE;

  useEffect(() => {
    fetchWedding();
  }, []);

  const fetchWedding = async () => {
    try {
      const res = await fetch(`${apiBase}/weddings/admin/current`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setWedding(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotice('');

    try {
      const res = await fetch(`${apiBase}/weddings/admin/${wedding.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          marriage_details: wedding.marriage_details,
          reception_details: wedding.reception_details,
        }),
      });

      if (res.ok) {
        setNotice('Ceremony and venue details saved successfully!');
      } else {
        throw new Error('Update failed');
      }
    } catch (err) {
      setNotice('Failed to update details.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-gold-300 font-cinzel">Loading ceremonies...</div>;

  const marriage = wedding?.marriage_details || {};
  const reception = wedding?.reception_details || {};

  const updateMarriage = (field, val) => {
    setWedding({
      ...wedding,
      marriage_details: { ...wedding.marriage_details, [field]: val },
    });
  };

  const updateReception = (field, val) => {
    setWedding({
      ...wedding,
      reception_details: { ...wedding.reception_details, [field]: val },
    });
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div className="border-b border-gold-500/20 pb-4">
        <span className="font-cinzel text-[10px] tracking-[0.25em] text-gold-400 uppercase">
          Events & Venues
        </span>
        <h2 className="font-cinzel text-xl md:text-2xl font-bold gold-text-gradient mt-1">
          MARRIAGE & RECEPTION CEREMONIES
        </h2>
      </div>

      {notice && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8 font-sans">
        {/* MARRIAGE SECTION */}
        <div className="p-6 rounded-xl bg-navy-950/80 border border-gold-500/30 space-y-4">
          <div className="border-b border-gold-500/20 pb-2">
            <span className="font-tamil text-sm text-gold-300 block font-semibold">திருமண நிகழ்வு</span>
            <h3 className="font-cinzel text-sm font-bold text-gold-400 uppercase">
              1. Marriage Ceremony (Sacred & Traditional)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gold-300 mb-1">Tamil Title</label>
              <input
                type="text"
                value={marriage.title_tamil || ''}
                onChange={(e) => updateMarriage('title_tamil', e.target.value)}
                placeholder="திருமண அழைப்பிதழ்"
                className="w-full px-3 py-2 rounded bg-navy-900 border border-gold-500/30 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs text-gold-300 mb-1">Muhurtham Timing</label>
              <input
                type="text"
                value={marriage.muhurtham_time || ''}
                onChange={(e) => updateMarriage('muhurtham_time', e.target.value)}
                placeholder="சுப முகூர்த்தம்: காலை 9:15 - 10:15 மணிக்குள்"
                className="w-full px-3 py-2 rounded bg-navy-900 border border-gold-500/30 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs text-gold-300 mb-1">Venue Name</label>
              <input
                type="text"
                value={marriage.venue_name || ''}
                onChange={(e) => updateMarriage('venue_name', e.target.value)}
                placeholder="Raja Muthiah Mandapam"
                className="w-full px-3 py-2 rounded bg-navy-900 border border-gold-500/30 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs text-gold-300 mb-1">Timing Details</label>
              <input
                type="text"
                value={marriage.ceremony_time || ''}
                onChange={(e) => updateMarriage('ceremony_time', e.target.value)}
                placeholder="9:00 AM to 10:30 AM"
                className="w-full px-3 py-2 rounded bg-navy-900 border border-gold-500/30 text-white text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs text-gold-300 mb-1">Full Venue Address</label>
              <textarea
                rows="2"
                value={marriage.venue_address || ''}
                onChange={(e) => updateMarriage('venue_address', e.target.value)}
                placeholder="Police Commissioner Office Road, Egmore, Chennai, Tamil Nadu"
                className="w-full px-3 py-2 rounded bg-navy-900 border border-gold-500/30 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs text-gold-300 mb-1">Landmark</label>
              <input
                type="text"
                value={marriage.landmark || ''}
                onChange={(e) => updateMarriage('landmark', e.target.value)}
                placeholder="Opp. Egmore Railway Station"
                className="w-full px-3 py-2 rounded bg-navy-900 border border-gold-500/30 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs text-gold-300 mb-1">Google Maps URL</label>
              <input
                type="url"
                value={marriage.google_maps_url || ''}
                onChange={(e) => updateMarriage('google_maps_url', e.target.value)}
                placeholder="https://maps.google.com/..."
                className="w-full px-3 py-2 rounded bg-navy-900 border border-gold-500/30 text-white text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* RECEPTION SECTION */}
        <div className="p-6 rounded-xl bg-navy-950/80 border border-gold-500/30 space-y-4">
          <div className="border-b border-gold-500/20 pb-2">
            <span className="font-tamil text-sm text-gold-300 block font-semibold">வரவேற்பு நிகழ்வு</span>
            <h3 className="font-cinzel text-sm font-bold text-gold-400 uppercase">
              2. Wedding Reception (Royal Evening Celebration)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gold-300 mb-1">Tamil Title</label>
              <input
                type="text"
                value={reception.title_tamil || ''}
                onChange={(e) => updateReception('title_tamil', e.target.value)}
                placeholder="வரவேற்பு"
                className="w-full px-3 py-2 rounded bg-navy-900 border border-gold-500/30 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs text-gold-300 mb-1">Reception Timing</label>
              <input
                type="text"
                value={reception.reception_time || ''}
                onChange={(e) => updateReception('reception_time', e.target.value)}
                placeholder="6:30 PM onwards"
                className="w-full px-3 py-2 rounded bg-navy-900 border border-gold-500/30 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs text-gold-300 mb-1">Venue Name</label>
              <input
                type="text"
                value={reception.venue_name || ''}
                onChange={(e) => updateReception('venue_name', e.target.value)}
                placeholder="The Royal Ballroom, ITC Grand Chola"
                className="w-full px-3 py-2 rounded bg-navy-900 border border-gold-500/30 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs text-gold-300 mb-1">Parking Information</label>
              <input
                type="text"
                value={reception.parking_info || ''}
                onChange={(e) => updateReception('parking_info', e.target.value)}
                placeholder="Dedicated valet and banquet parking available"
                className="w-full px-3 py-2 rounded bg-navy-900 border border-gold-500/30 text-white text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs text-gold-300 mb-1">Full Venue Address</label>
              <textarea
                rows="2"
                value={reception.venue_address || ''}
                onChange={(e) => updateReception('venue_address', e.target.value)}
                placeholder="63 Mount Road, Guindy, Chennai, Tamil Nadu"
                className="w-full px-3 py-2 rounded bg-navy-900 border border-gold-500/30 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs text-gold-300 mb-1">Landmark</label>
              <input
                type="text"
                value={reception.landmark || ''}
                onChange={(e) => updateReception('landmark', e.target.value)}
                placeholder="Near Guindy Flyover & Raj Bhavan"
                className="w-full px-3 py-2 rounded bg-navy-900 border border-gold-500/30 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs text-gold-300 mb-1">Google Maps URL</label>
              <input
                type="url"
                value={reception.google_maps_url || ''}
                onChange={(e) => updateReception('google_maps_url', e.target.value)}
                placeholder="https://maps.google.com/..."
                className="w-full px-3 py-2 rounded bg-navy-900 border border-gold-500/30 text-white text-xs font-mono"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 text-navy-950 font-cinzel font-bold text-xs tracking-widest uppercase hover:brightness-110 shadow-gold-glow flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'SAVING...' : 'SAVE VENUES & CEREMONIES'}</span>
        </button>
      </form>
    </div>
  );
}
