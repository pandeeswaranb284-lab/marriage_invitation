import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Heart, MessageCircle } from 'lucide-react';

const NAV_SECTIONS = [
  { id: 'home',      label: 'HOME' },
  { id: 'family',    label: 'FAMILY' },
  { id: 'marriage',  label: 'MARRIAGE' },
  { id: 'reception', label: 'RECEPTION' },
  { id: 'venue',     label: 'VENUE' },
  { id: 'gallery',   label: 'GALLERY' },
  { id: 'blessings', label: 'BLESSINGS' },
];

export default function WebsiteNavigation({ groomName, brideName, languageMode, onLanguageChange }) {
  const [activeId,    setActiveId]    = useState('home');
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [scrolled,    setScrolled]    = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observers = NAV_SECTIONS.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
        { threshold: 0.25, rootMargin: '-80px 0px 0px 0px' }
      );
      obs.observe(el);
      return obs;
    }).filter(Boolean);

    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
    setActiveId(id);
  };

  const firstName = groomName?.split(' ')[0] || 'Arun';
  const firstBride = brideName?.split(' ')[0] || 'Priya';

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(
      `You're invited to the wedding celebration of ${groomName} & ${brideName}!\n\nView details: ${window.location.href}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <>
      {/* ── STICKY HEADER ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#FFF7F9]/92 backdrop-blur-md border-b border-[#FCE4E8] shadow-[0_4px_24px_rgba(232,93,117,0.08)] py-2'
            : 'bg-transparent py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-[56px] flex items-center justify-between">

          {/* Logo / Couple Name */}
          <button
            onClick={() => scrollTo('home')}
            className="flex items-center gap-2 group text-left"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF8FAB] to-[#E85D75] flex items-center justify-center shadow-[0_2px_10px_rgba(232,93,117,0.3)] group-hover:scale-105 transition-transform">
              <Heart className="w-4 h-4 fill-white text-white" />
            </div>
            <span className="font-serif italic font-semibold text-lg sm:text-xl text-[#8F3045] group-hover:text-[#E85D75] transition-colors flex items-center gap-1.5">
              <span>{firstName}</span>
              <span className="text-[#E85D75] text-sm not-italic">❤</span>
              <span>{firstBride}</span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#FFFFFF]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#FCE4E8] shadow-sm">
            {NAV_SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`px-3 py-1 font-cinzel text-[11px] font-semibold tracking-[0.18em] rounded-full transition-all duration-200 ${
                  activeId === id
                    ? 'bg-[#E85D75] text-white shadow-sm'
                    : 'text-[#8F3045]/70 hover:text-[#8F3045] hover:bg-[#FCE4E8]/60'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Right controls: language + WhatsApp + hamburger */}
          <div className="flex items-center gap-2.5">
            {/* WhatsApp Share Button (from Mockup Step 5) */}
            <button
              onClick={shareOnWhatsApp}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#E85D75] to-[#E11D48] text-white font-cinzel text-[10px] font-bold tracking-wider shadow-[0_2px_12px_rgba(232,93,117,0.3)] hover:brightness-105 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Share on WhatsApp</span>
            </button>

            {/* Language switcher */}
            <div className="hidden md:flex items-center gap-1 bg-[#FFFFFF]/80 rounded-full p-1 border border-[#FCE4E8] shadow-sm">
              {[
                { val: 'both',    label: 'TA+EN' },
                { val: 'tamil',   label: 'TA' },
                { val: 'english', label: 'EN' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  onClick={() => onLanguageChange(val)}
                  className={`px-2.5 py-0.5 rounded-full font-cinzel text-[9px] tracking-wider transition-all ${
                    languageMode === val
                      ? 'bg-[#E85D75] text-white font-bold shadow-sm'
                      : 'text-[#8F3045]/60 hover:text-[#8F3045]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Hamburger (mobile) */}
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center bg-white border border-[#FCE4E8] text-[#8F3045] shadow-sm hover:bg-[#FCE4E8]/50 transition-colors"
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE FULL-SCREEN MENU ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-30 bg-[#FFF7F9]/98 backdrop-blur-xl flex flex-col items-center justify-center gap-2 pt-[70px]"
          >
            <p className="font-tamil text-xs text-[#8F3045]/60 mb-6">॥ ஸ்ரீ விநாயகர் துணை ॥</p>

            {NAV_SECTIONS.map(({ id, label }, i) => (
              <motion.button
                key={id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => scrollTo(id)}
                className={`w-60 py-3 rounded-xl font-cinzel text-xs font-semibold tracking-[0.22em] transition-all duration-200 border ${
                  activeId === id
                    ? 'bg-[#E85D75] text-white border-[#E85D75] shadow-[0_4px_16px_rgba(232,93,117,0.3)]'
                    : 'text-[#8F3045] bg-white border-[#FCE4E8] hover:border-[#E85D75]/40 hover:bg-[#FCE4E8]/40'
                }`}
              >
                {label}
              </motion.button>
            ))}

            <button
              onClick={shareOnWhatsApp}
              className="w-60 mt-3 py-3 rounded-xl bg-gradient-to-r from-[#E85D75] to-[#E11D48] text-white font-cinzel text-xs font-bold tracking-wider flex items-center justify-center gap-2 shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </button>

            {/* Mobile language switcher */}
            <div className="flex items-center gap-2 mt-4 bg-white rounded-full p-1.5 border border-[#FCE4E8] shadow-sm">
              {[
                { val: 'both',    label: 'தமிழ் + EN' },
                { val: 'tamil',   label: 'தமிழ்' },
                { val: 'english', label: 'English' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  onClick={() => { onLanguageChange(val); setMenuOpen(false); }}
                  className={`px-3 py-1 rounded-full font-sans text-xs transition-all ${
                    languageMode === val
                      ? 'bg-[#E85D75] text-white font-bold'
                      : 'text-[#8F3045]/60 hover:text-[#8F3045]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
