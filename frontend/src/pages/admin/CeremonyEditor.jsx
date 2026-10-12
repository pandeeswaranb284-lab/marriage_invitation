import React, { useEffect, useState } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import { API_BASE } from '../../services/api';

const toDatetimeLocal = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

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
          wedding_date: wedding.marriage_details?.ceremony_date || wedding.wedding_date,
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

  const [activeTab, setActiveTab] = useState(type || 'both');

  useEffect(() => {
    if (type) setActiveTab(type);
  }, [type]);

  const showMarriage = activeTab === 'marriage' || activeTab === 'both';
  const showReception = activeTab === 'reception' || activeTab === 'both';

  return (
    <div className="max-w-4xl space-y-6">
      <div className="border-b border-gold-500/20 pb-4">
        <span className="font-cinzel text-[10px] tracking-[0.25em] text-gold-400 uppercase">
          Countdown & Venue Management
        </span>
        <h2 className="font-cinzel text-xl md:text-2xl font-bold gold-text-gradient mt-1">
          MARRIAGE & RECEPTION CEREMONIES
        </h2>
        <p className="text-xs text-gold-300/70 mt-1">
          Set the exact Date and Time for both events to drive the live Marriage and Reception countdowns on the invitation card.
        </p>
      </div>

      {notice && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gold-500/20 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('marriage')}
          className={`px-4 py-2 rounded-xl text-xs font-cinzel font-bold tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'marriage'
              ? 'bg-gold-500 text-navy-950 shadow-gold-glow'
              : 'bg-navy-950 text-gold-300/80 hover:bg-navy-900 border border-gold-500/30'
          }`}
        >
          <span>💍</span>
          <span>Marriage Muhurtham Countdown</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reception')}
          className={`px-4 py-2 rounded-xl text-xs font-cinzel font-bold tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'reception'
              ? 'bg-gold-500 text-navy-950 shadow-gold-glow'
              : 'bg-navy-950 text-gold-300/80 hover:bg-navy-900 border border-gold-500/30'
          }`}
        >
          <span>✨</span>
          <span>Reception Countdown</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('both')}
          className={`px-4 py-2 rounded-xl text-xs font-cinzel font-bold tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'both'
              ? 'bg-gold-500 text-navy-950 shadow-gold-glow'
              : 'bg-navy-950 text-gold-300/80 hover:bg-navy-900 border border-gold-500/30'
          }`}
        >
          <span>📋</span>
          <span>View Both Events</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8 font-sans">
        {/* MARRIAGE SECTION */}
        {showMarriage && (
        <div className="p-6 rounded-xl bg-navy-950/80 border border-gold-500/30 space-y-4">
          <div className="border-b border-gold-500/20 pb-2 flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="font-tamil text-sm text-gold-300 block font-semibold">திருமண நிகழ்வு</span>
              <h3 className="font-cinzel text-sm font-bold text-gold-400 uppercase">
                1. Marriage Ceremony (Sacred Muhurtham)
              </h3>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-gold-500/10 text-gold-300 border border-gold-500/30">
              💍 Marriage Countdown Target
            </span>
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
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                Marriage Date & Time (Countdown Target)
              </label>
              <input
                type="datetime-local"
                value={toDatetimeLocal(marriage.ceremony_date || wedding?.wedding_date)}
                onChange={(e) => {
                  const val = e.target.value ? new Date(e.target.value).toISOString() : null;
                  updateMarriage('ceremony_date', val);
                  setWedding(prev => ({ ...prev, wedding_date: val }));
                }}
                className="w-full px-3 py-2 rounded bg-navy-900 border border-gold-500/40 text-white text-xs focus:outline-none focus:border-gold-400"
              />
              <span className="text-[10px] text-gold-300/60 mt-0.5 block">
                Controls the live countdown timer for Marriage Muhurtham.
              </span>
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
        )}

        {/* RECEPTION SECTION */}
        {showReception && (
        <div className="p-6 rounded-xl bg-navy-950/80 border border-gold-500/30 space-y-4">
          <div className="border-b border-gold-500/20 pb-2 flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="font-tamil text-sm text-gold-300 block font-semibold">வரவேற்பு நிகழ்வு</span>
              <h3 className="font-cinzel text-sm font-bold text-gold-400 uppercase">
                2. Wedding Reception (Royal Evening Celebration)
              </h3>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-gold-500/10 text-gold-300 border border-gold-500/30">
              ✨ Reception Countdown Target
            </span>
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
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                Reception Date & Time (Countdown Target)
              </label>
              <input
                type="datetime-local"
                value={toDatetimeLocal(reception.reception_date)}
                onChange={(e) => {
                  const val = e.target.value ? new Date(e.target.value).toISOString() : null;
                  updateReception('reception_date', val);
                }}
                className="w-full px-3 py-2 rounded bg-navy-900 border border-gold-500/40 text-white text-xs focus:outline-none focus:border-gold-400"
              />
              <span className="text-[10px] text-gold-300/60 mt-0.5 block">
                Controls the live countdown timer for Wedding Reception.
              </span>
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
        )}

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
