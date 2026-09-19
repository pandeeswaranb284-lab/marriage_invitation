import React, { useEffect, useState } from 'react';
import { Save, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { API_BASE } from '../../services/api';

export default function CoupleEditor() {
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
          couple_details: wedding.couple_details,
        }),
      });

      if (res.ok) {
        setNotice('Couple information & artwork updated successfully!');
      } else {
        throw new Error('Update failed');
      }
    } catch (err) {
      setNotice('Failed to update. Please check values.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-gold-300 font-cinzel">Loading couple details...</div>;

  const couple = wedding?.couple_details || {};

  const updateCoupleField = (field, val) => {
    setWedding({
      ...wedding,
      couple_details: {
        ...wedding.couple_details,
        [field]: val,
      },
    });
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="border-b border-gold-500/20 pb-4">
        <span className="font-cinzel text-[10px] tracking-[0.25em] text-gold-400 uppercase">
          Profiles
        </span>
        <h2 className="font-cinzel text-xl md:text-2xl font-bold gold-text-gradient mt-1">
          COUPLE & ARTWORK
        </h2>
      </div>

      {notice && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8 font-sans">
        {/* Artwork URL & Preview */}
        <div className="p-5 rounded-xl bg-navy-950/80 border border-gold-500/30 space-y-4">
          <div className="flex items-center space-x-2 border-b border-gold-500/20 pb-2">
            <ImageIcon className="w-4 h-4 text-gold-400" />
            <span className="font-cinzel text-xs font-bold text-gold-300 uppercase">
              Hero Couple Artwork
            </span>
          </div>

          <div>
            <label className="block text-xs font-cinzel tracking-wider text-gold-300/80 uppercase mb-1.5">
              Artwork Image URL (Ghibli artwork / Watercolor / Indian Illustration)
            </label>
            <input
              type="url"
              value={couple.artwork_url || ''}
              onChange={(e) => updateCoupleField('artwork_url', e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2 rounded-lg bg-navy-900 border border-gold-500/40 text-white text-xs focus:outline-none focus:border-gold-400"
            />
          </div>

          {couple.artwork_url && (
            <div className="w-32 aspect-square rounded-xl overflow-hidden border border-gold-400/50 shadow-md">
              <img
                src={couple.artwork_url}
                alt="Artwork Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Groom Profile */}
        <div className="p-5 rounded-xl bg-navy-950/80 border border-gold-500/30 space-y-4">
          <h3 className="font-cinzel text-sm font-bold text-gold-300 uppercase border-b border-gold-500/20 pb-2">
            Groom's Information & Lineage
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gold-300 mb-1">Father's Name</label>
              <input
                type="text"
                value={couple.groom_father || ''}
                onChange={(e) => updateCoupleField('groom_father', e.target.value)}
                placeholder="Thiru. S. Sundaram"
                className="w-full px-3 py-2 rounded bg-navy-900 border border-gold-500/30 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs text-gold-300 mb-1">Mother's Name</label>
              <input
                type="text"
                value={couple.groom_mother || ''}
                onChange={(e) => updateCoupleField('groom_mother', e.target.value)}
                placeholder="Thirumathi. S. Lakshmi"
                className="w-full px-3 py-2 rounded bg-navy-900 border border-gold-500/30 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs text-gold-300 mb-1">Education</label>
              <input
                type="text"
                value={couple.groom_education || ''}
                onChange={(e) => updateCoupleField('groom_education', e.target.value)}
                placeholder="B.Tech, MS"
                className="w-full px-3 py-2 rounded bg-navy-900 border border-gold-500/30 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs text-gold-300 mb-1">Profession</label>
              <input
                type="text"
                value={couple.groom_profession || ''}
                onChange={(e) => updateCoupleField('groom_profession', e.target.value)}
                placeholder="Lead Software Architect"
                className="w-full px-3 py-2 rounded bg-navy-900 border border-gold-500/30 text-white text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs text-gold-300 mb-1">Native Place</label>
              <input
                type="text"
                value={couple.groom_native || ''}
                onChange={(e) => updateCoupleField('groom_native', e.target.value)}
                placeholder="Madurai, Tamil Nadu"
                className="w-full px-3 py-2 rounded bg-navy-900 border border-gold-500/30 text-white text-xs"
              />
            </div>
          </div>
        </div>

        {/* Bride Profile */}
        <div className="p-5 rounded-xl bg-navy-950/80 border border-gold-500/30 space-y-4">
          <h3 className="font-cinzel text-sm font-bold text-gold-300 uppercase border-b border-gold-500/20 pb-2">
            Bride's Information & Lineage
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gold-300 mb-1">Father's Name</label>
              <input
                type="text"
                value={couple.bride_father || ''}
                onChange={(e) => updateCoupleField('bride_father', e.target.value)}
                placeholder="Thiru. K. Meenakshisundaram"
                className="w-full px-3 py-2 rounded bg-navy-900 border border-gold-500/30 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs text-gold-300 mb-1">Mother's Name</label>
              <input
                type="text"
                value={couple.bride_mother || ''}
                onChange={(e) => updateCoupleField('bride_mother', e.target.value)}
                placeholder="Thirumathi. M. Rajeshwari"
                className="w-full px-3 py-2 rounded bg-navy-900 border border-gold-500/30 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs text-gold-300 mb-1">Education</label>
              <input
                type="text"
                value={couple.bride_education || ''}
                onChange={(e) => updateCoupleField('bride_education', e.target.value)}
                placeholder="B.E., MBA"
                className="w-full px-3 py-2 rounded bg-navy-900 border border-gold-500/30 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs text-gold-300 mb-1">Profession</label>
              <input
                type="text"
                value={couple.bride_profession || ''}
                onChange={(e) => updateCoupleField('bride_profession', e.target.value)}
                placeholder="Senior Product Specialist"
                className="w-full px-3 py-2 rounded bg-navy-900 border border-gold-500/30 text-white text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs text-gold-300 mb-1">Native Place</label>
              <input
                type="text"
                value={couple.bride_native || ''}
                onChange={(e) => updateCoupleField('bride_native', e.target.value)}
                placeholder="Chennai, Tamil Nadu"
                className="w-full px-3 py-2 rounded bg-navy-900 border border-gold-500/30 text-white text-xs"
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
          <span>{saving ? 'SAVING...' : 'SAVE COUPLE DETAILS'}</span>
        </button>
      </form>
    </div>
  );
}
