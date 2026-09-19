import React, { useEffect, useState } from 'react';
import { Save, CheckCircle2, Globe, ExternalLink, Copy } from 'lucide-react';
import { API_BASE } from '../../services/api';

const slugify = (groom, bride) => {
  const clean = `${groom || ''} ${bride || ''}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  return clean || 'wedding-invitation';
};

export default function WeddingEditor() {
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

  const handleGroomChange = (val) => {
    const nextSlug = slugify(val, wedding?.bride_name);
    const gInitial = val?.trim()?.[0]?.toUpperCase() || 'G';
    const bInitial = wedding?.bride_name?.trim()?.[0]?.toUpperCase() || 'B';
    const shouldUpdateInitials = !wedding?.gold_seal_initials || wedding.gold_seal_initials === 'A × P';
    
    setWedding(prev => ({
      ...prev,
      groom_name: val,
      slug: nextSlug,
      gold_seal_initials: shouldUpdateInitials ? `${gInitial} × ${bInitial}` : prev.gold_seal_initials,
    }));
  };

  const handleBrideChange = (val) => {
    const nextSlug = slugify(wedding?.groom_name, val);
    const gInitial = wedding?.groom_name?.trim()?.[0]?.toUpperCase() || 'G';
    const bInitial = val?.trim()?.[0]?.toUpperCase() || 'B';
    const shouldUpdateInitials = !wedding?.gold_seal_initials || wedding.gold_seal_initials === 'A × P';

    setWedding(prev => ({
      ...prev,
      bride_name: val,
      slug: nextSlug,
      gold_seal_initials: shouldUpdateInitials ? `${gInitial} × ${bInitial}` : prev.gold_seal_initials,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotice('');

    try {
      const targetSlug = wedding.slug || 'arun-priya';
      const res = await fetch(`${apiBase}/weddings/admin/${targetSlug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          groom_name: wedding.groom_name,
          bride_name: wedding.bride_name,
          slug: wedding.slug,
          wedding_date: wedding.wedding_date,
          wedding_time: wedding.wedding_time,
          opening_blessing: wedding.opening_blessing,
          gold_seal_initials: wedding.gold_seal_initials,
          tagline: wedding.tagline,
          music_enabled: wedding.music_enabled,
          music_url: wedding.music_url,
          is_published: wedding.is_published,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.slug) {
          setWedding(prev => ({ ...prev, slug: data.slug }));
        }
        setNotice(`Wedding details & URL successfully updated to /invite/${data.slug || wedding.slug}!`);
      } else {
        throw new Error('Update failed');
      }
    } catch (err) {
      setNotice('Failed to update. Please check values.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-gold-300 font-cinzel">Loading wedding settings...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="border-b border-gold-500/20 pb-4">
        <span className="font-cinzel text-[10px] tracking-[0.25em] text-gold-400 uppercase">
          Settings
        </span>
        <h2 className="font-cinzel text-xl md:text-2xl font-bold gold-text-gradient mt-1">
          WEDDING CORE DETAILS
        </h2>
      </div>

      {notice && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Dynamic Invitation URL Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-navy-950 via-[#0e1628] to-navy-950 border border-gold-500/40 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-cinzel text-xs font-bold text-gold-300 uppercase flex items-center gap-2">
            <Globe className="w-4 h-4 text-gold-400" />
            Live Invitation URL
          </span>
          <span className="text-[10px] font-medium text-emerald-300 bg-emerald-950/70 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
            Auto-Updates with Names
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex-1 px-3 py-2 rounded-lg bg-navy-900/90 border border-gold-500/30 text-gold-200 font-mono text-xs flex items-center overflow-x-auto">
            <span className="text-gold-400/60 mr-1">{window.location.origin}/invite/</span>
            <span className="text-gold-300 font-bold">{wedding?.slug}</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`/invite/${wedding?.slug}`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-gold-600 to-gold-500 text-navy-950 font-cinzel font-bold text-xs flex items-center gap-1.5 hover:brightness-110 shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open</span>
            </a>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/invite/${wedding?.slug}`);
                setNotice(`Copied ${window.location.origin}/invite/${wedding?.slug} to clipboard!`);
              }}
              className="px-3.5 py-2 rounded-lg bg-navy-900 border border-gold-500/40 text-gold-300 font-cinzel text-xs flex items-center gap-1.5 hover:text-white"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </button>
          </div>
        </div>
        <p className="text-[11px] text-gold-200/60">
          Changing Groom Name or Bride Name below immediately recalculates this URL name.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 font-sans">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-cinzel tracking-wider text-gold-300 uppercase mb-1.5">
              Groom Name
            </label>
            <input
              type="text"
              value={wedding?.groom_name || ''}
              onChange={(e) => handleGroomChange(e.target.value)}
              placeholder="e.g. Arun or Rahul"
              className="w-full px-4 py-2.5 rounded-lg bg-navy-950 border border-gold-500/40 text-white text-sm focus:outline-none focus:border-gold-400"
            />
          </div>

          <div>
            <label className="block text-xs font-cinzel tracking-wider text-gold-300 uppercase mb-1.5">
              Bride Name
            </label>
            <input
              type="text"
              value={wedding?.bride_name || ''}
              onChange={(e) => handleBrideChange(e.target.value)}
              placeholder="e.g. Priya or Sneha"
              className="w-full px-4 py-2.5 rounded-lg bg-navy-950 border border-gold-500/40 text-white text-sm focus:outline-none focus:border-gold-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-cinzel tracking-wider text-gold-300 uppercase mb-1.5">
              Opening Blessing (Tamil / Sanskrit)
            </label>
            <input
              type="text"
              value={wedding?.opening_blessing || ''}
              onChange={(e) => setWedding({ ...wedding, opening_blessing: e.target.value })}
              placeholder="॥ ஸ்ரீ விநாயகர் துணை ॥"
              className="w-full px-4 py-2.5 rounded-lg bg-navy-950 border border-gold-500/40 text-white text-sm focus:outline-none focus:border-gold-400"
            />
          </div>

          <div>
            <label className="block text-xs font-cinzel tracking-wider text-gold-300 uppercase mb-1.5">
              Gold Seal Monogram / Initials
            </label>
            <input
              type="text"
              value={wedding?.gold_seal_initials || ''}
              onChange={(e) => setWedding({ ...wedding, gold_seal_initials: e.target.value })}
              placeholder="A × P"
              className="w-full px-4 py-2.5 rounded-lg bg-navy-950 border border-gold-500/40 text-white text-sm focus:outline-none focus:border-gold-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-cinzel tracking-wider text-gold-300 uppercase mb-1.5">
            Wedding Tagline / Sacred Message
          </label>
          <textarea
            rows="2"
            value={wedding?.tagline || ''}
            onChange={(e) => setWedding({ ...wedding, tagline: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg bg-navy-950 border border-gold-500/40 text-white text-sm focus:outline-none focus:border-gold-400"
          />
        </div>

        {/* Music Settings */}
        <div className="p-4 rounded-xl bg-navy-950/60 border border-gold-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-cinzel text-xs font-bold text-gold-300 uppercase block">
                Background Music
              </span>
              <span className="text-[11px] text-gold-200/70">
                Optional soothing instrumental nadaswaram or temple melody
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={wedding?.music_enabled || false}
                onChange={(e) => setWedding({ ...wedding, music_enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-navy-900 border border-gold-500/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gold-400 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-xs font-cinzel tracking-wider text-gold-300/80 uppercase mb-1">
              Music Audio URL
            </label>
            <input
              type="text"
              value={wedding?.music_url || ''}
              onChange={(e) => setWedding({ ...wedding, music_url: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-navy-950 border border-gold-500/40 text-white text-xs focus:outline-none focus:border-gold-400 font-mono"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 text-navy-950 font-cinzel font-bold text-xs tracking-widest uppercase hover:brightness-110 shadow-gold-glow flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'SAVING...' : 'SAVE CHANGES'}</span>
        </button>
      </form>
    </div>
  );
}
