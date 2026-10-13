import React, { useEffect, useState } from 'react';
import { Save, CheckCircle2, ExternalLink } from 'lucide-react';
import { API_BASE } from '../../services/api';
import { notifyAdminUpdate } from '../../services/realtimeSync';

export default function FamilyEditor() {
  const [wedding, setWedding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [isDirty, setIsDirty] = useState(false);
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
      const targetSlug = wedding?.slug || 'k-prabhu-m-nalini';
      const res = await fetch(`${apiBase}/weddings/admin/${targetSlug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          families: wedding.families,
        }),
      });

      if (res.ok) {
        setIsDirty(false);
        notifyAdminUpdate(targetSlug, { source: 'family_editor' });
        setNotice('✓ Family details & blessings saved and synchronized live across all devices!');
      } else {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || 'Update failed');
      }
    } catch (err) {
      setNotice(err.message || 'Failed to update family details.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-gold-300 font-cinzel">Loading family settings...</div>;

  const families = wedding?.families || {};

  const updateFamilyField = (field, val) => {
    setIsDirty(true);
    setWedding({
      ...wedding,
      families: {
        ...wedding.families,
        [field]: val,
      },
    });
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="border-b border-gold-500/20 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <span className="font-cinzel text-[10px] tracking-[0.25em] text-gold-400 uppercase">
            Lineage
          </span>
          <h2 className="font-cinzel text-xl md:text-2xl font-bold gold-text-gradient mt-1">
            FAMILIES & ELDER BLESSINGS
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {isDirty ? (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-sans font-medium bg-amber-500/20 text-amber-300 border border-amber-500/40">
              ● Unsaved Changes
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-sans font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              ✓ Synchronized Live
            </span>
          )}
          <a
            href={`/invite/${wedding?.slug || 'k-prabhu-m-nalini'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/30 text-gold-300 hover:text-gold-200 text-xs font-cinzel transition-colors"
          >
            <span>Preview Live</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {notice && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 font-sans">
        <div>
          <label className="block text-xs font-cinzel tracking-wider text-gold-300 uppercase mb-1.5">
            Elder Blessings (English)
          </label>
          <textarea
            rows="3"
            value={families.elder_blessing_text || ''}
            onChange={(e) => updateFamilyField('elder_blessing_text', e.target.value)}
            placeholder="With the gracious blessings of our kula deivam and respected elders..."
            className="w-full px-4 py-2.5 rounded-lg bg-navy-950 border border-gold-500/40 text-white text-sm focus:outline-none focus:border-gold-400"
          />
        </div>

        <div>
          <label className="block text-xs font-cinzel tracking-wider text-gold-300 uppercase mb-1.5">
            Elder Blessings (Tamil)
          </label>
          <textarea
            rows="3"
            value={families.elder_blessing_tamil || ''}
            onChange={(e) => updateFamilyField('elder_blessing_tamil', e.target.value)}
            placeholder="நமது குலதெய்வம் மற்றும் பெரியோர்களின் நல்லாசியுடன்..."
            className="w-full px-4 py-2.5 rounded-lg bg-navy-950 border border-gold-500/40 text-white text-sm focus:outline-none focus:border-gold-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-navy-950/80 border border-gold-500/30 space-y-3">
            <h3 className="font-cinzel text-xs font-bold text-gold-300 uppercase">
              Groom's Family
            </h3>
            <div>
              <label className="block text-xs text-gold-300/80 mb-1">Family Title / House Name</label>
              <input
                type="text"
                value={families.groom_family_title || ''}
                onChange={(e) => updateFamilyField('groom_family_title', e.target.value)}
                placeholder="Sundaram & Family, Madurai"
                className="w-full px-3 py-2 rounded bg-navy-900 border border-gold-500/30 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-gold-300/80 mb-1">Paternal / Maternal Grandparents</label>
              <input
                type="text"
                value={families.groom_grandparents || ''}
                onChange={(e) => updateFamilyField('groom_grandparents', e.target.value)}
                placeholder="Late Thiru. Ramasamy & Late Thirumathi. Meenakshi"
                className="w-full px-3 py-2 rounded bg-navy-900 border border-gold-500/30 text-white text-xs"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-navy-950/80 border border-gold-500/30 space-y-3">
            <h3 className="font-cinzel text-xs font-bold text-gold-300 uppercase">
              Bride's Family
            </h3>
            <div>
              <label className="block text-xs text-gold-300/80 mb-1">Family Title / House Name</label>
              <input
                type="text"
                value={families.bride_family_title || ''}
                onChange={(e) => updateFamilyField('bride_family_title', e.target.value)}
                placeholder="Meenakshisundaram & Family, Chennai"
                className="w-full px-3 py-2 rounded bg-navy-900 border border-gold-500/30 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-gold-300/80 mb-1">Paternal / Maternal Grandparents</label>
              <input
                type="text"
                value={families.bride_grandparents || ''}
                onChange={(e) => updateFamilyField('bride_grandparents', e.target.value)}
                placeholder="Late Thiru. Krishnan & Late Thirumathi. Sarojini"
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
          <span>{saving ? 'SAVING & SYNCHRONIZING LIVE...' : 'SAVE FAMILY DETAILS'}</span>
        </button>
      </form>
    </div>
  );
}
