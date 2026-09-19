import React, { useEffect, useState } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import { API_BASE } from '../../services/api';

export default function ThemeSettings() {
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
          language_mode: wedding.language_mode,
          theme: wedding.theme,
          invitation_cover_style: wedding.invitation_cover_style,
        }),
      });

      if (res.ok) {
        setNotice('Theme and language preferences saved!');
      } else {
        throw new Error('Update failed');
      }
    } catch (err) {
      setNotice('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-gold-300 font-cinzel">Loading settings...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="border-b border-gold-500/20 pb-4">
        <span className="font-cinzel text-[10px] tracking-[0.25em] text-gold-400 uppercase">
          Appearance & Language
        </span>
        <h2 className="font-cinzel text-xl md:text-2xl font-bold gold-text-gradient mt-1">
          THEME & LANGUAGE SETTINGS
        </h2>
      </div>

      {notice && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 font-sans">
        {/* Language System Selection */}
        <div className="p-5 rounded-xl bg-navy-950/80 border border-gold-500/30 space-y-3">
          <h3 className="font-cinzel text-xs font-bold text-gold-300 uppercase">
            Default Invitation Language
          </h3>
          <p className="text-xs text-gold-200/70">
            Choose whether the invitation displays in Tamil, English, or Tamil + English dual mode.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {[
              { key: 'both', title: 'Tamil + English', desc: 'Dual headings & sacred Tamil invocations' },
              { key: 'tamil', title: 'தமிழ் (Tamil)', desc: 'Sacred traditional Tamil calligraphy' },
              { key: 'english', title: 'English', desc: 'Regal English typography' },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setWedding({ ...wedding, language_mode: item.key })}
                className={`p-4 rounded-xl border text-left transition-all ${
                  wedding?.language_mode === item.key
                    ? 'bg-navy-900 border-gold-400 shadow-gold-glow'
                    : 'bg-navy-950 border-gold-500/20 hover:border-gold-500/40'
                }`}
              >
                <span className="font-cinzel font-bold text-xs text-gold-300 block">
                  {item.title}
                </span>
                <span className="text-[11px] text-gold-200/70 mt-1 block">
                  {item.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Visual Palette */}
        <div className="p-5 rounded-xl bg-navy-950/80 border border-gold-500/30 space-y-3">
          <h3 className="font-cinzel text-xs font-bold text-gold-300 uppercase">
            Visual Theme Theme Accent
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {[
              { key: 'royal_gold', title: 'Royal Antique Gold', desc: 'Midnight Navy, Deep Wine, Antique Gold & Champagne' },
              { key: 'temple_sacred', title: 'Temple Sacred Ivory', desc: 'Sacred Ivory, Sandalwood & Traditional Gopuram Gold' },
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setWedding({ ...wedding, theme: t.key })}
                className={`p-4 rounded-xl border text-left transition-all ${
                  wedding?.theme === t.key
                    ? 'bg-navy-900 border-gold-400 shadow-gold-glow'
                    : 'bg-navy-950 border-gold-500/20 hover:border-gold-500/40'
                }`}
              >
                <span className="font-cinzel font-bold text-xs text-gold-300 block">
                  {t.title}
                </span>
                <span className="text-[11px] text-gold-200/70 mt-1 block">
                  {t.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 text-navy-950 font-cinzel font-bold text-xs tracking-widest uppercase hover:brightness-110 shadow-gold-glow flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'SAVING...' : 'SAVE THEME PREFERENCES'}</span>
        </button>
      </form>
    </div>
  );
}
