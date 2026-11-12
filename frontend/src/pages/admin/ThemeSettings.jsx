import React, { useEffect, useState } from 'react';
import { Save, CheckCircle2, ExternalLink } from 'lucide-react';
import { API_BASE } from '../../services/api';
import { notifyAdminUpdate } from '../../services/realtimeSync';
import { saveWeddingToCache } from '../../services/weddingCache';

export default function ThemeSettings() {
  const [wedding, setWedding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [originalSlug, setOriginalSlug] = useState('');
  const token = localStorage.getItem('admin_token');
  const apiBase = API_BASE;

  useEffect(() => {
    fetchWedding();
  }, []);

  // Prevent accidental navigation with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleDiscard = () => {
    if (isDirty && !window.confirm('Discard unsaved changes and reload from database?')) {
      return;
    }
    fetchWedding();
    setIsDirty(false);
    setNotice('Reloaded latest saved settings from database.');
  };

  const fetchWedding = async () => {
    try {
      const res = await fetch(`${apiBase}/weddings/admin/current?t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setWedding(data);
        if (data?.slug) {
          setOriginalSlug(data.slug);
        }
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
      const targetSlug = originalSlug || wedding?.slug || 'current';
      // 1. Send PUT request
      const res = await fetch(`${apiBase}/weddings/admin/${targetSlug}`, {
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

      // 2. Verify backend response
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || 'Save failed. Please check form values.');
      }

      const saveResult = await res.json();
      const updatedSlug = saveResult.slug || targetSlug;

      // 3. Fetch server-confirmed record
      const verifyRes = await fetch(`${apiBase}/weddings/admin/${updatedSlug}?t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const confirmedData = verifyRes.ok ? await verifyRes.json() : (saveResult.wedding || saveResult);

      // 4. Update Admin state with confirmed values
      setWedding(confirmedData);
      setOriginalSlug(confirmedData.slug || updatedSlug);
      setIsDirty(false);

      // 5. Update frontend cache
      saveWeddingToCache(confirmedData.slug, confirmedData);
      saveWeddingToCache('current', confirmedData);

      // Realtime sync notification
      notifyAdminUpdate(confirmedData.slug, { updated_at: confirmedData.updated_at, source: 'theme_settings' });

      // 6. Display success notice
      setNotice('✓ Saved & verified! Theme and language preferences confirmed in database.');
    } catch (err) {
      setNotice(err.message || 'Failed to update settings. Unsaved changes have been kept in your form.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-gold-300 font-cinzel">Loading settings...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="border-b border-gold-500/20 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <span className="font-cinzel text-[10px] tracking-[0.25em] text-gold-400 uppercase">
            Appearance & Language
          </span>
          <h2 className="font-cinzel text-xl md:text-2xl font-bold gold-text-gradient mt-1">
            THEME & LANGUAGE SETTINGS
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
                onClick={() => {
                  setIsDirty(true);
                  setWedding({ ...wedding, language_mode: item.key });
                }}
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
                onClick={() => {
                  setIsDirty(true);
                  setWedding({ ...wedding, theme: t.key });
                }}
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

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 text-navy-950 font-cinzel font-bold text-xs tracking-widest uppercase hover:brightness-110 shadow-gold-glow flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'SAVING & SYNCHRONIZING LIVE...' : 'SAVE THEME PREFERENCES'}</span>
          </button>

          {isDirty && (
            <button
              type="button"
              onClick={handleDiscard}
              className="px-6 py-3 rounded-full bg-navy-900 border border-rose-500/40 text-rose-300 font-cinzel font-semibold text-xs tracking-wider uppercase hover:bg-rose-950/40 transition-colors"
            >
              Discard Changes
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
