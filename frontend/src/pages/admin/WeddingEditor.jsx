import React, { useEffect, useState, useRef } from 'react';
import {
  Save,
  CheckCircle2,
  Globe,
  ExternalLink,
  Copy,
  Music,
  Upload,
  Play,
  Pause,
  Trash2,
  AlertCircle,
  Image as ImageIcon,
  Loader2,
  Sliders,
} from 'lucide-react';
import { API_BASE, resolveMediaUrl } from '../../services/api';

const slugify = (groom, bride) => {
  const clean = `${groom || ''} ${bride || ''}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  return clean || 'wedding-invitation';
};

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

export default function WeddingEditor() {
  const [wedding, setWedding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [uploadingMusic, setUploadingMusic] = useState(false);
  const [musicUploadNotice, setMusicUploadNotice] = useState('');
  const [musicUploadError, setMusicUploadError] = useState('');
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const audioPreviewRef = useRef(null);
  const fileInputRef = useRef(null);

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoUploadNotice, setPhotoUploadNotice] = useState('');
  const [photoUploadError, setPhotoUploadError] = useState('');
  const photoInputRef = useRef(null);

  const token = localStorage.getItem('admin_token');
  const apiBase = API_BASE;

  const togglePreview = () => {
    if (!audioPreviewRef.current) return;
    if (previewPlaying) {
      audioPreviewRef.current.pause();
      setPreviewPlaying(false);
    } else {
      audioPreviewRef.current
        .play()
        .then(() => setPreviewPlaying(true))
        .catch(() => setPreviewPlaying(false));
    }
  };

  const handleMusicUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMusic(true);
    setMusicUploadNotice('');
    setMusicUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${apiBase}/weddings/admin/upload-music`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Failed to upload audio file');
      }

      const data = await res.json();
      setWedding((prev) => ({
        ...prev,
        music_url: data.url,
        music_enabled: true,
      }));
      setMusicUploadNotice(`"${file.name}" uploaded successfully! Background music is enabled.`);
      if (audioPreviewRef.current) {
        audioPreviewRef.current.src = resolveMediaUrl(data.url);
      }
    } catch (err) {
      setMusicUploadError(err.message || 'Failed to upload audio file');
    } finally {
      setUploadingMusic(false);
      e.target.value = '';
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setPhotoUploadNotice('');
    setPhotoUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${apiBase}/weddings/admin/upload-artwork`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Failed to upload photo');
      }

      const data = await res.json();
      setWedding((prev) => ({
        ...prev,
        couple_details: {
          ...(prev?.couple_details || {}),
          artwork_url: data.url,
        },
      }));
      setPhotoUploadNotice(`"${file.name}" uploaded successfully! Set as center circle image.`);
    } catch (err) {
      setPhotoUploadError(err.message || 'Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
      e.target.value = '';
    }
  };

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

  const generateTitle = (groom, bride) => {
    const g = groom?.replace(/\s+/g, ' ').trim();
    const b = bride?.replace(/\s+/g, ' ').trim();
    if (g && b) return `Wedding Invitation | ${g} & ${b}`;
    if (g) return `Wedding Invitation | ${g}`;
    if (b) return `Wedding Invitation | ${b}`;
    return 'Wedding Invitation';
  };

  const handleGroomChange = (val) => {
    const nextSlug = slugify(val, wedding?.bride_name);
    const gInitial = val?.trim()?.[0]?.toUpperCase() || 'G';
    const bInitial = wedding?.bride_name?.trim()?.[0]?.toUpperCase() || 'B';
    const shouldUpdateInitials = !wedding?.gold_seal_initials || wedding.gold_seal_initials === 'A × P';
    const nextTitle = generateTitle(val, wedding?.bride_name);
    
    setWedding(prev => ({
      ...prev,
      groom_name: val,
      title: nextTitle,
      slug: nextSlug,
      gold_seal_initials: shouldUpdateInitials ? `${gInitial} × ${bInitial}` : prev.gold_seal_initials,
    }));
  };

  const handleBrideChange = (val) => {
    const nextSlug = slugify(wedding?.groom_name, val);
    const gInitial = wedding?.groom_name?.trim()?.[0]?.toUpperCase() || 'G';
    const bInitial = val?.trim()?.[0]?.toUpperCase() || 'B';
    const shouldUpdateInitials = !wedding?.gold_seal_initials || wedding.gold_seal_initials === 'A × P';
    const nextTitle = generateTitle(wedding?.groom_name, val);

    setWedding(prev => ({
      ...prev,
      bride_name: val,
      title: nextTitle,
      slug: nextSlug,
      gold_seal_initials: shouldUpdateInitials ? `${gInitial} × ${bInitial}` : prev.gold_seal_initials,
    }));
  };

  const updateCoupleField = (field, val) => {
    setWedding(prev => ({
      ...prev,
      couple_details: {
        ...(prev?.couple_details || {}),
        [field]: val,
      },
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
          title: wedding.title,
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
          couple_details: wedding.couple_details,
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
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-cinzel tracking-wider text-gold-300 uppercase">
              Browser Tab Title (Website Title)
            </label>
            <span className="text-[10px] font-medium text-emerald-300 bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-500/40">
              Auto-Syncs with Names
            </span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={wedding?.title || ''}
              onChange={(e) => setWedding({ ...wedding, title: e.target.value })}
              placeholder="e.g. Wedding Invitation | Arun & Priya"
              className="flex-1 px-4 py-2.5 rounded-lg bg-navy-950 border border-gold-500/40 text-white text-sm focus:outline-none focus:border-gold-400"
            />
            <button
              type="button"
              onClick={() => {
                const auto = generateTitle(wedding?.groom_name, wedding?.bride_name);
                setWedding({ ...wedding, title: auto });
              }}
              className="px-3.5 py-2 rounded-lg bg-navy-900 border border-gold-500/40 text-gold-300 font-cinzel text-xs flex items-center gap-1.5 hover:text-white"
              title="Auto-generate title from Groom and Bride names"
            >
              <span>Auto-Generate</span>
            </button>
          </div>
          <p className="text-[11px] text-gold-200/50 mt-1">
            Automatically updates when you type Groom and Bride names below. This title appears in the browser tab for guests.
          </p>
        </div>

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

        {/* Wedding Date & Time Countdown Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-navy-950/70 border border-gold-500/30">
          <div>
            <label className="block text-xs font-cinzel tracking-wider text-gold-300 uppercase mb-1.5 flex items-center justify-between">
              <span>Wedding Date & Time (Countdown Target)</span>
              <span className="text-[10px] text-emerald-400 font-mono">Friday, 13 Nov 2026</span>
            </label>
            <input
              type="datetime-local"
              value={toDatetimeLocal(wedding?.wedding_date)}
              onChange={(e) => {
                const val = e.target.value ? new Date(e.target.value).toISOString() : null;
                setWedding({ ...wedding, wedding_date: val });
              }}
              className="w-full px-4 py-2.5 rounded-lg bg-navy-900 border border-gold-500/40 text-white text-sm focus:outline-none focus:border-gold-400"
            />
            <p className="text-[11px] text-gold-200/50 mt-1">
              Controls the live Marriage countdown timer on the invitation.
            </p>
          </div>

          <div>
            <label className="block text-xs font-cinzel tracking-wider text-gold-300 uppercase mb-1.5">
              Wedding Display Time
            </label>
            <input
              type="text"
              value={wedding?.wedding_time || ''}
              onChange={(e) => setWedding({ ...wedding, wedding_time: e.target.value })}
              placeholder="e.g. காலை 9:00 AM - 10:30 AM"
              className="w-full px-4 py-2.5 rounded-lg bg-navy-900 border border-gold-500/40 text-white text-sm focus:outline-none focus:border-gold-400"
            />
            <p className="text-[11px] text-gold-200/50 mt-1">
              The auspicious timing text displayed on invitation cards.
            </p>
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

        {/* Center Couple Photo Card */}
        <div className="p-5 rounded-xl bg-navy-950/80 border border-gold-500/30 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gold-500/20">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div>
                <span className="font-cinzel text-xs font-bold text-gold-300 uppercase block">
                  Center Couple Image
                </span>
                <span className="text-[11px] text-gold-200/70">
                  The primary photo shown in the animated center circle of your invitation
                </span>
              </div>
            </div>
            {wedding?.couple_details?.artwork_url && (
              <span className="text-[10px] font-medium text-emerald-300 bg-emerald-950/70 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                Photo Set
              </span>
            )}
          </div>

          <input
            type="file"
            ref={photoInputRef}
            accept="image/*,.jpg,.jpeg,.png,.webp,.gif"
            onChange={handlePhotoUpload}
            className="hidden"
          />

          <div className="flex flex-col sm:flex-row items-center gap-5">
            {/* Circular Preview with dynamic size and framing */}
            <div
              className="relative rounded-full p-1 bg-gradient-to-tr from-gold-500 via-rose-400 to-gold-300 shadow-[0_4px_18px_rgba(212,175,55,0.25)] flex-shrink-0 transition-all duration-300 flex items-center justify-center"
              style={{
                width: `${
                  wedding?.couple_details?.artwork_size === 'small' ? 100 :
                  wedding?.couple_details?.artwork_size === 'large' ? 140 :
                  wedding?.couple_details?.artwork_size === 'xlarge' ? 160 :
                  !isNaN(Number(wedding?.couple_details?.artwork_size)) ? Math.round(Math.max(180, Math.min(Number(wedding?.couple_details?.artwork_size), 400)) * 0.42) : 115
                }px`,
                height: `${
                  wedding?.couple_details?.artwork_size === 'small' ? 100 :
                  wedding?.couple_details?.artwork_size === 'large' ? 140 :
                  wedding?.couple_details?.artwork_size === 'xlarge' ? 160 :
                  !isNaN(Number(wedding?.couple_details?.artwork_size)) ? Math.round(Math.max(180, Math.min(Number(wedding?.couple_details?.artwork_size), 400)) * 0.42) : 115
                }px`,
              }}
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-navy-900 border border-white/20">
                {wedding?.couple_details?.artwork_url ? (
                  <img
                    src={resolveMediaUrl(wedding.couple_details.artwork_url)}
                    alt="Center Couple Preview"
                    className="w-full h-full transition-all duration-300"
                    style={{
                      objectFit: wedding.couple_details.artwork_fit || 'cover',
                      objectPosition: wedding.couple_details.artwork_position || 'center',
                      transform: `scale(${(wedding.couple_details.artwork_zoom || 100) / 100})`,
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gold-400/50 p-2 text-center">
                    <ImageIcon className="w-6 h-6 mb-1" />
                    <span className="text-[9px]">Default Image</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons & feedback */}
            <div className="flex-1 space-y-2 text-center sm:text-left w-full">
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                <button
                  type="button"
                  disabled={uploadingPhoto}
                  onClick={() => photoInputRef.current?.click()}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-gold-600 to-gold-500 text-navy-950 font-cinzel font-bold text-xs flex items-center gap-2 hover:brightness-110 shadow-sm"
                >
                  {uploadingPhoto ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading Photo...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Upload Couple Photo</span>
                    </>
                  )}
                </button>

                <a
                  href="/admin/couple"
                  className="px-3.5 py-2 rounded-lg bg-navy-900 border border-gold-500/40 text-gold-300 font-cinzel text-xs flex items-center gap-1.5 hover:text-white"
                >
                  <span>Advanced Profiles &rarr;</span>
                </a>
              </div>

              <p className="text-[11px] text-gold-200/60">
                Accepts JPG, PNG, WEBP. Adjust size, focus, and zoom below.
              </p>

              {photoUploadNotice && (
                <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{photoUploadNotice}</span>
                </div>
              )}

              {photoUploadError && (
                <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{photoUploadError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Framing & Size Controls */}
          {wedding?.couple_details?.artwork_url && (
            <div className="pt-4 border-t border-gold-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-cinzel text-xs font-bold text-gold-300 uppercase flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-gold-400" />
                  Center Circle Framing & Size Options
                </span>
                <span className="text-[10px] text-gold-300/60 font-medium">
                  Fix image framing & circle dimension
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* 1. Circle Size */}
                <div className="p-3 rounded-lg bg-navy-900/60 border border-gold-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-cinzel text-gold-300 uppercase">
                      Circle Size
                    </label>
                    <span className="text-[10px] font-mono text-gold-400 font-bold">
                      {wedding?.couple_details?.artwork_size === 'small' ? 'Small' :
                       wedding?.couple_details?.artwork_size === 'large' ? 'Large' :
                       wedding?.couple_details?.artwork_size === 'xlarge' ? 'Grand' :
                       !isNaN(Number(wedding?.couple_details?.artwork_size)) ? `${wedding.couple_details.artwork_size}px` : 'Medium'}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { key: 'small', label: 'S' },
                      { key: 'medium', label: 'M' },
                      { key: 'large', label: 'L' },
                      { key: 'xlarge', label: 'XL' },
                    ].map(preset => {
                      const isActive = (wedding?.couple_details?.artwork_size || 'medium') === preset.key;
                      return (
                        <button
                          key={preset.key}
                          type="button"
                          onClick={() => updateCoupleField('artwork_size', preset.key)}
                          className={`py-1 text-[10px] font-cinzel font-bold rounded border ${
                            isActive
                              ? 'bg-gradient-to-r from-gold-600 to-gold-500 text-navy-950 border-gold-400'
                              : 'bg-navy-900 text-gold-300/80 border-gold-500/30 hover:border-gold-400 hover:text-white'
                          }`}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Vertical Alignment */}
                <div className="p-3 rounded-lg bg-navy-900/60 border border-gold-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-cinzel text-gold-300 uppercase">
                      Focus (Crop)
                    </label>
                    <span className="text-[10px] font-mono text-gold-400 capitalize">
                      {wedding?.couple_details?.artwork_position || 'center'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { key: 'top', label: 'Top' },
                      { key: 'center', label: 'Center' },
                      { key: 'bottom', label: 'Bottom' },
                    ].map(pos => {
                      const isActive = (wedding?.couple_details?.artwork_position || 'center') === pos.key;
                      return (
                        <button
                          key={pos.key}
                          type="button"
                          onClick={() => updateCoupleField('artwork_position', pos.key)}
                          className={`py-1 text-[10px] font-cinzel font-bold rounded border ${
                            isActive
                              ? 'bg-gradient-to-r from-gold-600 to-gold-500 text-navy-950 border-gold-400'
                              : 'bg-navy-900 text-gold-300/80 border-gold-500/30 hover:border-gold-400 hover:text-white'
                          }`}
                        >
                          {pos.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Zoom */}
                <div className="p-3 rounded-lg bg-navy-900/60 border border-gold-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-cinzel text-gold-300 uppercase">
                      Zoom
                    </label>
                    <span className="text-[10px] font-mono text-gold-400 font-bold">
                      {wedding?.couple_details?.artwork_zoom || 100}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="150"
                    step="5"
                    value={wedding?.couple_details?.artwork_zoom || 100}
                    onChange={(e) => updateCoupleField('artwork_zoom', Number(e.target.value))}
                    className="w-full accent-[#D4AF37] cursor-pointer"
                  />
                </div>

                {/* 4. Fit */}
                <div className="p-3 rounded-lg bg-navy-900/60 border border-gold-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-cinzel text-gold-300 uppercase">
                      Fit Mode
                    </label>
                    <span className="text-[10px] font-mono text-gold-400 capitalize">
                      {wedding?.couple_details?.artwork_fit || 'cover'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {[
                      { key: 'cover', label: 'Cover' },
                      { key: 'contain', label: 'Fit' },
                    ].map(fit => {
                      const isActive = (wedding?.couple_details?.artwork_fit || 'cover') === fit.key;
                      return (
                        <button
                          key={fit.key}
                          type="button"
                          onClick={() => updateCoupleField('artwork_fit', fit.key)}
                          className={`py-1 text-[10px] font-cinzel font-bold rounded border ${
                            isActive
                              ? 'bg-gradient-to-r from-gold-600 to-gold-500 text-navy-950 border-gold-400'
                              : 'bg-navy-900 text-gold-300/80 border-gold-500/30 hover:border-gold-400 hover:text-white'
                          }`}
                        >
                          {fit.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Music Settings */}
        <div className="p-5 rounded-xl bg-navy-950/80 border border-gold-500/30 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gold-500/20">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                <Music className="w-4 h-4" />
              </div>
              <div>
                <span className="font-cinzel text-xs font-bold text-gold-300 uppercase block">
                  Background Music
                </span>
                <span className="text-[11px] text-gold-200/70">
                  Plays soothing music when guests view your wedding invitation
                </span>
              </div>
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

          {/* Upload Audio File Section */}
          <div className="space-y-3">
            <label className="block text-xs font-cinzel tracking-wider text-gold-300 uppercase">
              Upload Music (MP3 / Audio File)
            </label>

            <input
              type="file"
              ref={fileInputRef}
              accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac"
              onChange={handleMusicUpload}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-6 rounded-xl border-2 border-dashed border-gold-500/40 bg-navy-900/60 hover:bg-navy-900 hover:border-gold-400 transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-2 group"
            >
              <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <span className="font-cinzel font-bold text-xs text-gold-300 block">
                  {uploadingMusic ? 'Uploading Song…' : 'Click to Upload MP3 from Computer'}
                </span>
                <span className="text-[11px] text-gold-200/60 block mt-0.5">
                  Supports MP3, WAV, OGG, M4A audio files
                </span>
              </div>
              {uploadingMusic && (
                <div className="w-36 h-1 bg-navy-950 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-gold-400 animate-pulse w-full" />
                </div>
              )}
            </div>

            {musicUploadNotice && (
              <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{musicUploadNotice}</span>
              </div>
            )}

            {musicUploadError && (
              <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{musicUploadError}</span>
              </div>
            )}
          </div>

          {/* Active Audio Player & Controls */}
          {wedding?.music_url && (
            <div className="p-4 rounded-xl bg-navy-900 border border-gold-500/30 space-y-3">
              <audio
                ref={audioPreviewRef}
                src={resolveMediaUrl(wedding.music_url)}
                onEnded={() => setPreviewPlaying(false)}
                className="hidden"
              />

              <div className="flex items-center justify-between">
                <span className="font-cinzel text-xs font-bold text-gold-300 uppercase flex items-center gap-2">
                  <Music className="w-3.5 h-3.5 text-gold-400" />
                  Active Background Track
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (audioPreviewRef.current) audioPreviewRef.current.pause();
                    setPreviewPlaying(false);
                    setWedding({ ...wedding, music_url: '', music_enabled: false });
                  }}
                  className="text-rose-400 hover:text-rose-300 text-xs flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={togglePreview}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-gold-600 to-gold-500 text-navy-950 font-cinzel font-bold text-xs flex items-center gap-2 hover:brightness-110 shadow-sm"
                >
                  {previewPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{previewPlaying ? 'Pause Test' : 'Test Play Song'}</span>
                </button>

                <div className="flex-1 truncate text-xs text-gold-200/80 font-mono bg-navy-950 px-3 py-2 rounded-lg border border-gold-500/20">
                  {wedding.music_url}
                </div>
              </div>
            </div>
          )}

          {/* Quick Presets */}
          <div className="pt-2 border-t border-gold-500/20 space-y-2">
            <span className="font-cinzel text-[11px] font-bold text-gold-300 uppercase block">
              Or Choose a Traditional Preset:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                {
                  label: 'Temple Chants & Bells',
                  url: 'https://actions.google.com/sounds/v1/ambiences/temple_bells_and_chants.ogg',
                },
                {
                  label: 'Shenhai Melody',
                  url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=indian-classical-112191.mp3',
                },
                {
                  label: 'Romantic Flute',
                  url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=indian-flute-18549.mp3',
                },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setWedding({ ...wedding, music_url: preset.url, music_enabled: true });
                    setMusicUploadNotice(`Selected preset "${preset.label}". Click Save to apply.`);
                    if (audioPreviewRef.current) {
                      audioPreviewRef.current.src = preset.url;
                    }
                  }}
                  className={`p-2.5 rounded-lg border text-xs text-left transition-all ${
                    wedding?.music_url === preset.url
                      ? 'bg-navy-900 border-gold-400 text-gold-300 font-semibold shadow-gold-glow'
                      : 'bg-navy-950/60 border-gold-500/20 text-gold-200/70 hover:border-gold-500/40 hover:text-gold-200'
                  }`}
                >
                  <span className="block truncate">{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Direct Link Input */}
          <div className="pt-2 border-t border-gold-500/20">
            <label className="block text-xs font-cinzel tracking-wider text-gold-300/80 uppercase mb-1">
              Direct Audio URL (Optional)
            </label>
            <input
              type="text"
              value={wedding?.music_url || ''}
              onChange={(e) => setWedding({ ...wedding, music_url: e.target.value })}
              placeholder="https://example.com/song.mp3 or /uploads/..."
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
