import React, { useEffect, useState, useRef } from 'react';
import { Save, CheckCircle2, Image as ImageIcon, Upload, AlertCircle, Loader2, Sparkles, RefreshCw, Sliders, ExternalLink } from 'lucide-react';
import { API_BASE, resolveMediaUrl } from '../../services/api';
import { notifyAdminUpdate } from '../../services/realtimeSync';

export default function CoupleEditor() {
  const [wedding, setWedding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [uploadingArtwork, setUploadingArtwork] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const fileInputRef = useRef(null);
  const token = localStorage.getItem('admin_token');
  const apiBase = API_BASE;

  useEffect(() => {
    fetchWedding();
  }, []);

  const handleArtworkUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingArtwork(true);
    setUploadError('');
    setNotice('');

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
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to upload image file');
      }

      const data = await res.json();
      updateCoupleField('artwork_url', data.url);
      notifyAdminUpdate(wedding?.slug || 'current', { source: 'artwork_upload' });
      setNotice(`Couple photo "${file.name}" uploaded successfully & synchronized live across all devices!`);
    } catch (err) {
      setUploadError(err.message || 'Image upload failed. Please try a JPG or PNG file.');
    } finally {
      setUploadingArtwork(false);
      e.target.value = '';
    }
  };

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
          couple_details: wedding.couple_details,
        }),
      });

      if (res.ok) {
        setIsDirty(false);
        notifyAdminUpdate(targetSlug, { source: 'couple_editor' });
        setNotice('✓ Couple information & artwork saved and synchronized live across all devices!');
      } else {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || 'Update failed');
      }
    } catch (err) {
      setNotice(err.message || 'Failed to update. Please check values.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-gold-300 font-cinzel">Loading couple details...</div>;

  const couple = wedding?.couple_details || {};

  const updateCoupleField = (field, val) => {
    setIsDirty(true);
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
      <div className="border-b border-gold-500/20 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <span className="font-cinzel text-[10px] tracking-[0.25em] text-gold-400 uppercase">
            Profiles
          </span>
          <h2 className="font-cinzel text-xl md:text-2xl font-bold gold-text-gradient mt-1">
            COUPLE & ARTWORK
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

      <form onSubmit={handleSave} className="space-y-8 font-sans">
        {/* Center Couple Photo / Artwork */}
        <div className="p-6 rounded-2xl bg-navy-950/80 border border-gold-500/30 space-y-5">
          <div className="flex items-center justify-between border-b border-gold-500/20 pb-3">
            <div className="flex items-center space-x-2">
              <ImageIcon className="w-5 h-5 text-gold-400" />
              <div>
                <span className="font-cinzel text-sm font-bold text-gold-300 uppercase block">
                  Center Couple Image
                </span>
                <span className="text-[11px] text-gold-200/60 block">
                  The primary photo shown inside the animated circular frame on your wedding invitation
                </span>
              </div>
            </div>
            {couple.artwork_url && (
              <span className="text-[10px] font-medium text-emerald-300 bg-emerald-950/70 px-2.5 py-1 rounded-full border border-emerald-500/40">
                Photo Configured
              </span>
            )}
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*,.jpg,.jpeg,.png,.webp,.gif"
            onChange={handleArtworkUpload}
            className="hidden"
          />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Upload Dropzone */}
            <div className="md:col-span-8">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-6 rounded-xl border-2 border-dashed border-gold-500/40 bg-navy-900/60 hover:bg-navy-900 hover:border-gold-400 transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-2.5 group"
              >
                <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:scale-110 transition-transform">
                  {uploadingArtwork ? (
                    <Loader2 className="w-6 h-6 animate-spin text-gold-300" />
                  ) : (
                    <Upload className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <span className="font-cinzel font-bold text-xs text-gold-300 block">
                    {uploadingArtwork ? 'Uploading Photo...' : 'Click to Upload Couple Photo from Computer'}
                  </span>
                  <span className="text-[11px] text-gold-200/60 block mt-0.5">
                    Supports JPG, PNG, WEBP (portrait or square recommended)
                  </span>
                </div>
                {uploadingArtwork && (
                  <div className="w-40 h-1 bg-navy-950 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-gold-400 animate-pulse w-full" />
                  </div>
                )}
              </div>

              {uploadError && (
                <div className="mt-2.5 p-3 rounded-lg bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* URL Input Alternative */}
              <div className="mt-4">
                <label className="block text-[11px] font-cinzel tracking-wider text-gold-300/80 uppercase mb-1">
                  Or paste an image URL directly:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={couple.artwork_url || ''}
                    onChange={(e) => updateCoupleField('artwork_url', e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3 py-2 rounded-lg bg-navy-900 border border-gold-500/30 text-white text-xs focus:outline-none focus:border-gold-400 font-mono"
                  />
                  {couple.artwork_url && (
                    <button
                      type="button"
                      onClick={() => updateCoupleField('artwork_url', '')}
                      className="px-3 py-2 rounded-lg bg-navy-900 border border-gold-500/30 text-gold-400 hover:text-rose-400 text-xs"
                      title="Clear photo"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Circular Live Preview */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-navy-900/40 border border-gold-500/20 text-center">
              <span className="font-cinzel text-[10px] text-gold-400/80 tracking-widest uppercase mb-2">
                Center Circle Preview
              </span>
              <div
                className="relative rounded-full p-1 bg-gradient-to-tr from-gold-500 via-rose-400 to-gold-300 shadow-[0_4px_20px_rgba(212,175,55,0.25)] transition-all duration-300 flex items-center justify-center"
                style={{
                  width: `${
                    couple.artwork_size === 'small' ? 120 :
                    couple.artwork_size === 'large' ? 152 :
                    couple.artwork_size === 'xlarge' ? 175 :
                    !isNaN(Number(couple.artwork_size)) ? Math.round(Math.max(180, Math.min(Number(couple.artwork_size), 400)) * 0.47) : 135
                  }px`,
                  height: `${
                    couple.artwork_size === 'small' ? 120 :
                    couple.artwork_size === 'large' ? 152 :
                    couple.artwork_size === 'xlarge' ? 175 :
                    !isNaN(Number(couple.artwork_size)) ? Math.round(Math.max(180, Math.min(Number(couple.artwork_size), 400)) * 0.47) : 135
                  }px`,
                }}
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-navy-900 border border-white/20">
                  {couple.artwork_url ? (
                    <img
                      src={resolveMediaUrl(couple.artwork_url)}
                      alt="Couple Center Preview"
                      className="w-full h-full transition-all duration-300"
                      style={{
                        objectFit: couple.artwork_fit || 'cover',
                        objectPosition: couple.artwork_position || 'center',
                        transform: `scale(${(couple.artwork_zoom || 100) / 100})`,
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gold-400/50 p-2">
                      <ImageIcon className="w-7 h-7 mb-1" />
                      <span className="text-[9px]">No photo</span>
                    </div>
                  )}
                </div>
              </div>
              <span className="text-[10px] text-gold-300/60 mt-2">
                Live animated circle preview
              </span>
            </div>
          </div>

          {/* Edit Options for Size, Crop & Framing */}
          {couple.artwork_url && (
            <div className="mt-4 pt-4 border-t border-gold-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-cinzel text-xs font-bold text-gold-300 uppercase flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-gold-400" />
                  Circle Image Size & Framing Adjuster
                </span>
                <span className="text-[10px] text-gold-300/60 font-medium">
                  Adjust dimensions & photo focus
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Circle Size Presets & Slider */}
                <div className="p-3.5 rounded-xl bg-navy-900/60 border border-gold-500/20 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-cinzel text-gold-300 uppercase block">
                      Circle Frame Size
                    </label>
                    <span className="text-[11px] font-mono text-gold-400 font-bold">
                      {couple.artwork_size === 'small' ? '220px (Small)' :
                       couple.artwork_size === 'large' ? '324px (Large)' :
                       couple.artwork_size === 'xlarge' ? '376px (Grand)' :
                       !isNaN(Number(couple.artwork_size)) ? `${couple.artwork_size}px` : '272px (Medium)'}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { key: 'small', label: 'Small', px: 220 },
                      { key: 'medium', label: 'Medium', px: 272 },
                      { key: 'large', label: 'Large', px: 324 },
                      { key: 'xlarge', label: 'Grand', px: 376 },
                    ].map(preset => {
                      const isActive = (couple.artwork_size || 'medium') === preset.key || Number(couple.artwork_size) === preset.px;
                      return (
                        <button
                          key={preset.key}
                          type="button"
                          onClick={() => updateCoupleField('artwork_size', preset.key)}
                          className={`py-1.5 px-1.5 rounded-lg text-[10px] font-cinzel font-semibold transition-all border ${
                            isActive
                              ? 'bg-gradient-to-r from-gold-600 to-gold-500 text-navy-950 border-gold-400 shadow-sm'
                              : 'bg-navy-900 text-gold-300/80 border-gold-500/30 hover:border-gold-400 hover:text-white'
                          }`}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Size Fine-Tune Slider */}
                  <div className="pt-1">
                    <input
                      type="range"
                      min="200"
                      max="380"
                      step="10"
                      value={
                        couple.artwork_size === 'small' ? 220 :
                        couple.artwork_size === 'medium' ? 272 :
                        couple.artwork_size === 'large' ? 324 :
                        couple.artwork_size === 'xlarge' ? 376 :
                        Number(couple.artwork_size) || 272
                      }
                      onChange={(e) => updateCoupleField('artwork_size', e.target.value)}
                      className="w-full accent-[#D4AF37] cursor-pointer"
                    />
                  </div>
                </div>

                {/* 2. Vertical Alignment / Face Focus */}
                <div className="p-3.5 rounded-xl bg-navy-900/60 border border-gold-500/20 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-cinzel text-gold-300 uppercase block">
                      Vertical Focus / Face Alignment
                    </label>
                    <span className="text-[11px] font-mono text-gold-400 capitalize">
                      {couple.artwork_position || 'center'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'top', label: 'Top (Faces)' },
                      { key: 'center', label: 'Center' },
                      { key: 'bottom', label: 'Bottom' },
                    ].map(pos => {
                      const isActive = (couple.artwork_position || 'center') === pos.key;
                      return (
                        <button
                          key={pos.key}
                          type="button"
                          onClick={() => updateCoupleField('artwork_position', pos.key)}
                          className={`py-2 px-2 rounded-lg text-[10px] font-cinzel font-semibold transition-all border ${
                            isActive
                              ? 'bg-gradient-to-r from-gold-600 to-gold-500 text-navy-950 border-gold-400 shadow-sm'
                              : 'bg-navy-900 text-gold-300/80 border-gold-500/30 hover:border-gold-400 hover:text-white'
                          }`}
                        >
                          <span>{pos.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-gold-200/50">
                    Select "Top" if the couple's heads get clipped by the circle top edge.
                  </p>
                </div>

                {/* 3. Photo Zoom */}
                <div className="p-3.5 rounded-xl bg-navy-900/60 border border-gold-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-cinzel text-gold-300 uppercase block">
                      Photo Zoom / Scale
                    </label>
                    <span className="text-[11px] font-mono text-gold-400 font-bold">
                      {couple.artwork_zoom || 100}%
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-gold-300/60 font-mono">80%</span>
                    <input
                      type="range"
                      min="80"
                      max="160"
                      step="5"
                      value={couple.artwork_zoom || 100}
                      onChange={(e) => updateCoupleField('artwork_zoom', Number(e.target.value))}
                      className="flex-1 accent-[#D4AF37] cursor-pointer"
                    />
                    <span className="text-[10px] text-gold-300/60 font-mono">160%</span>
                  </div>
                </div>

                {/* 4. Fit Mode */}
                <div className="p-3.5 rounded-xl bg-navy-900/60 border border-gold-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-cinzel text-gold-300 uppercase block">
                      Image Fit Mode
                    </label>
                    <span className="text-[11px] font-mono text-gold-400 capitalize">
                      {couple.artwork_fit || 'cover'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'cover', label: 'Cover (Fill Circle)' },
                      { key: 'contain', label: 'Contain (Entire Photo)' },
                    ].map(fit => {
                      const isActive = (couple.artwork_fit || 'cover') === fit.key;
                      return (
                        <button
                          key={fit.key}
                          type="button"
                          onClick={() => updateCoupleField('artwork_fit', fit.key)}
                          className={`py-2 px-2 rounded-lg text-[10px] font-cinzel font-semibold transition-all border ${
                            isActive
                              ? 'bg-gradient-to-r from-gold-600 to-gold-500 text-navy-950 border-gold-400 shadow-sm'
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
          <span>{saving ? 'SAVING & SYNCHRONIZING LIVE...' : 'SAVE COUPLE DETAILS'}</span>
        </button>
      </form>
    </div>
  );
}
