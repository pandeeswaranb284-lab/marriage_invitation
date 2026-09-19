import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Lock, Heart, CheckCircle, RefreshCcw } from 'lucide-react';

const MAX_CHARS = 500;

/* ─── Single blessing card ─────────────────────────────────── */
function BlessingCard({ wish, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="rounded-2xl p-5 bg-white border border-[#FCE4E8] shadow-[0_4px_18px_rgba(232,93,117,0.06)] space-y-3"
    >
      <div className="flex items-start gap-2">
        <span className="text-[#E85D75] text-lg leading-none mt-0.5">♡</span>
        <p className="font-serif italic text-base text-[#8F3045]/90 leading-relaxed flex-1">
          "{wish.message}"
        </p>
      </div>
      <div className="flex items-center justify-between pt-1 border-t border-[#FCE4E8]/60">
        <span className="font-cinzel text-[10px] font-semibold tracking-wider text-[#E85D75] uppercase">
          — {wish.guest_name}
        </span>
        <Heart className="w-3 h-3 fill-[#E85D75] text-[#E85D75]" />
      </div>
    </motion.div>
  );
}

/* ─── Main Blessings Section ───────────────────────────────── */
export default function BlessingsSection({
  id,
  slug,
  wishes = [],
  apiBase,
  onWishAdded,
  languageMode = 'both',
  groomName = '',
  brideName  = '',
}) {
  const [name,       setName]       = useState('');
  const [message,    setMessage]    = useState('');
  const [sending,    setSending]    = useState(false);
  const [sentType,   setSentType]   = useState(null);   // 'public' | 'private' | null
  const [error,      setError]      = useState('');
  const [localWishes, setLocalWishes] = useState(wishes.filter(w => w.is_approved && w.visibility !== 'private'));

  // Keep local list in sync if parent refreshes
  useEffect(() => {
    setLocalWishes(wishes.filter(w => w.is_approved && w.visibility !== 'private'));
  }, [wishes]);

  const validate = () => {
    if (!name.trim())    { setError('Please enter your name.'); return false; }
    if (!message.trim()) { setError('Please write your blessing.'); return false; }
    if (message.length > MAX_CHARS) { setError(`Message must be under ${MAX_CHARS} characters.`); return false; }
    return true;
  };

  const submit = async (visibility) => {
    if (!validate()) return;
    setSending(true);
    setError('');
    try {
      const res = await fetch(`${apiBase}/weddings/public/${slug}/wishes`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          guest_name: name.trim(),
          message:    message.trim(),
          visibility,
        }),
      });
      if (!res.ok) throw new Error('Could not send blessing. Please try again.');
      const data = await res.json();

      setSentType(visibility);

      if (visibility === 'public') {
        // Instantly add to visible wall without waiting for page refresh
        setLocalWishes(prev => [
          { id: data.wish_id, guest_name: name.trim(), message: message.trim(), is_approved: true, visibility: 'public', created_at: new Date().toISOString() },
          ...prev,
        ]);
        if (onWishAdded) onWishAdded();
      }

      setName('');
      setMessage('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const resetForm = () => {
    setSentType(null);
    setError('');
  };

  const showTamil   = languageMode === 'both' || languageMode === 'tamil';
  const showEnglish = languageMode === 'both' || languageMode === 'english';

  return (
    <section
      id={id}
      className="relative py-20 md:py-28 px-4 bg-[#FFF7F9] scroll-mt-[70px] overflow-hidden"
    >
      {/* Soft background blob */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[50vh] bg-[#FCE4E8] opacity-50 rounded-full blur-[90px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto space-y-12">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-3"
        >
          {showTamil && (
            <p className="font-tamil text-sm text-[#8F3045]/75 leading-relaxed">
              மணமக்களுக்கு உங்கள் அன்பான வாழ்த்துகளை தெரிவிக்கவும்
            </p>
          )}

          <span className="font-cinzel text-[10px] font-semibold tracking-[0.3em] text-[#8F3045]/60 uppercase">
            Send Your Love
          </span>

          <h2 className="font-serif italic text-3xl md:text-5xl font-bold text-[#8F3045]">
            Blessings for the Couple
          </h2>

          <div className="flex items-center justify-center gap-2 mt-1">
            <div className="w-14 h-[1px] bg-[#E85D75]/25" />
            <Heart className="w-3.5 h-3.5 fill-[#E85D75] text-[#E85D75]" />
            <div className="w-14 h-[1px] bg-[#E85D75]/25" />
          </div>

          {showEnglish && (
            <p className="font-serif italic text-sm text-[#8F3045]/65 max-w-sm mx-auto leading-relaxed">
              Share your heartfelt blessings with the couple
            </p>
          )}
        </motion.div>

        {/* ── Form Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-white border border-[#FCE4E8] p-6 md:p-8 shadow-[0_10px_40px_rgba(232,93,117,0.09)]"
        >
          <AnimatePresence mode="wait">

            {/* ── Success State ── */}
            {sentType ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8 space-y-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 14 }}
                >
                  <CheckCircle className="w-14 h-14 text-[#E85D75] mx-auto" />
                </motion.div>

                <div className="space-y-1">
                  <p className="font-serif text-xl font-bold text-[#8F3045]">
                    {sentType === 'public'
                      ? 'Your blessing has been published successfully. ❤️'
                      : 'Your private blessing has been sent to the couple. ❤️'}
                  </p>
                  {showTamil && (
                    <p className="font-tamil text-sm text-[#E85D75]">
                      {sentType === 'public'
                        ? '॥ உங்கள் வாழ்த்துகள் பிரசுரிக்கப்பட்டது ॥'
                        : '॥ உங்கள் வாழ்த்துகள் அனுப்பப்பட்டது ॥'}
                    </p>
                  )}
                </div>

                <button
                  onClick={resetForm}
                  className="inline-flex items-center gap-2 font-cinzel text-xs text-[#E85D75] hover:text-[#8F3045] transition-colors underline underline-offset-4"
                >
                  <RefreshCcw className="w-3 h-3" />
                  Send another blessing
                </button>
              </motion.div>

            ) : (

              /* ── Blessing Form ── */
              <motion.div key="form" className="space-y-5">

                {/* Your Name */}
                <div className="space-y-1.5">
                  <label className="font-cinzel text-[10px] font-semibold tracking-wider text-[#8F3045]/75 uppercase block">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => { setName(e.target.value); setError(''); }}
                    placeholder="Your name / family name"
                    className="w-full px-4 py-3 rounded-xl bg-[#FFF7F9] border border-[#FCE4E8] text-[#8F3045] placeholder-[#8F3045]/35 text-sm focus:outline-none focus:border-[#E85D75] focus:ring-2 focus:ring-[#E85D75]/15 transition-all"
                  />
                </div>

                {/* Your Blessing + char counter */}
                <div className="space-y-1.5">
                  <label className="font-cinzel text-[10px] font-semibold tracking-wider text-[#8F3045]/75 uppercase block">
                    Your Blessing
                  </label>
                  <div className="relative">
                    <textarea
                      rows={4}
                      value={message}
                      onChange={e => { setMessage(e.target.value.slice(0, MAX_CHARS)); setError(''); }}
                      placeholder="Share your heartfelt wishes for the couple..."
                      className="w-full px-4 py-3 rounded-xl bg-[#FFF7F9] border border-[#FCE4E8] text-[#8F3045] placeholder-[#8F3045]/35 text-sm focus:outline-none focus:border-[#E85D75] focus:ring-2 focus:ring-[#E85D75]/15 transition-all resize-none"
                    />
                    <span className={`absolute bottom-2.5 right-3 text-[10px] font-mono transition-colors ${
                      message.length > MAX_CHARS * 0.9 ? 'text-[#E85D75]' : 'text-[#8F3045]/35'
                    }`}>
                      {message.length} / {MAX_CHARS}
                    </span>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <p className="text-[#E11D48] text-xs font-sans">{error}</p>
                )}

                {/* ── Two action buttons ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">

                  {/* BUTTON 1 — PUBLISH PUBLICLY */}
                  <button
                    type="button"
                    disabled={sending}
                    onClick={() => submit('public')}
                    className="relative group flex flex-col items-center gap-1.5 py-4 px-5 rounded-2xl bg-gradient-to-br from-[#E85D75] to-[#C0435E] text-white shadow-[0_6px_22px_rgba(232,93,117,0.35)] hover:brightness-105 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
                  >
                    {/* subtle shimmer */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                    <Globe className="w-5 h-5" />
                    <span className="font-cinzel font-bold text-sm tracking-widest uppercase">
                      {sending ? 'Sending…' : 'Publish Publicly'}
                    </span>
                    <span className="text-[10px] font-sans text-white/80">
                      Show my blessing on the website
                    </span>
                  </button>

                  {/* BUTTON 2 — SEND PRIVATELY */}
                  <button
                    type="button"
                    disabled={sending}
                    onClick={() => submit('private')}
                    className="relative group flex flex-col items-center gap-1.5 py-4 px-5 rounded-2xl bg-white border-2 border-[#E85D75] text-[#8F3045] hover:bg-[#FFF7F9] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(232,93,117,0.12)] overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FCE4E8]/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                    <Lock className="w-5 h-5 text-[#E85D75]" />
                    <span className="font-cinzel font-bold text-sm tracking-widest uppercase text-[#8F3045]">
                      {sending ? 'Sending…' : 'Send Privately'}
                    </span>
                    <span className="text-[10px] font-sans text-[#8F3045]/65">
                      Send your blessing privately to the couple
                    </span>
                  </button>

                </div>

                {showTamil && (
                  <p className="text-center font-tamil text-xs text-[#8F3045]/55 pt-1">
                    ✦ உங்கள் வாழ்த்துகளை பொது அல்லது தனிப்பட்ட முறையில் அனுப்பவும்
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Guest Blessings Wall ── */}
        {localWishes.length > 0 && (
          <div className="space-y-5">
            <div className="text-center">
              <p className="font-cinzel text-[10px] font-semibold tracking-[0.28em] text-[#8F3045]/55 uppercase">
                Guest Blessings
              </p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <div className="w-10 h-[1px] bg-[#E85D75]/20" />
                <Heart className="w-2.5 h-2.5 fill-[#E85D75]/60 text-[#E85D75]/60" />
                <div className="w-10 h-[1px] bg-[#E85D75]/20" />
              </div>
            </div>
            <div className="space-y-3">
              {localWishes.map((w, i) => (
                <BlessingCard key={w.id || i} wish={w} index={i} />
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
