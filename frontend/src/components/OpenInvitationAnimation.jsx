import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CornerOrnament, KalasamMotif, KolamDivider } from './Ornaments';

export default function OpenInvitationAnimation({
  groomName = "Arun Sundaram",
  brideName = "Priya Meenakshi",
  weddingDate = "November 20, 2026",
  artworkUrl = "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
  onFinished,
}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Sequence timing: slow, stately, royal
    const t1 = setTimeout(() => setStep(1), 600);   // Seal breaks & disappears
    const t2 = setTimeout(() => setStep(2), 1800);  // Card flaps unfold in 3D
    const t3 = setTimeout(() => setStep(3), 3200);  // Inner parchment revealed with light sweep
    const t4 = setTimeout(() => setStep(4), 4600);  // Artwork and names revealed in glory
    const t5 = setTimeout(() => {
      if (onFinished) onFinished();
    }, 6400); // Complete and transition to page system

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onFinished]);

  return (
    <div className="fixed inset-0 z-50 bg-[#070c18] flex items-center justify-center p-4 overflow-hidden select-none">
      {/* Subtle Background Golden Ambient Glow */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-40" />

      <div className="relative w-full max-w-[560px] aspect-[4/5.8] perspective-1000">
        {/* INNER SACRED PARCHMENT (Revealed as flaps unfold) */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{
            scale: step >= 2 ? 1 : 0.94,
            opacity: step >= 2 ? 1 : 0,
          }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-[#fdfbf7] rounded-xl border-2 border-[#dfba73] shadow-royal p-6 md:p-8 flex flex-col items-center justify-between text-center overflow-hidden"
        >
          {/* Light Sweep Shimmer Effect */}
          {step >= 3 && (
            <motion.div
              initial={{ x: '-150%' }}
              animate={{ x: '200%' }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none transform -skew-x-12 z-30"
            />
          )}

          {/* Ornate Gold Corners */}
          <CornerOrnament position="top-left" className="absolute top-3 left-3 w-8 h-8 text-[#c5a059]" />
          <CornerOrnament position="top-right" className="absolute top-3 right-3 w-8 h-8 text-[#c5a059]" />
          <CornerOrnament position="bottom-left" className="absolute bottom-3 left-3 w-8 h-8 text-[#c5a059]" />
          <CornerOrnament position="bottom-right" className="absolute bottom-3 right-3 w-8 h-8 text-[#c5a059]" />

          {/* Top Auspicious Invocation */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: step >= 3 ? 1 : 0, y: step >= 3 ? 0 : -10 }}
            transition={{ duration: 1 }}
            className="pt-2"
          >
            <p className="font-tamil text-sm text-[#8c6d33] font-medium tracking-wide">
              ॥ ஸ்ரீ விநாயகர் துணை ॥
            </p>
            <p className="font-cinzel text-[10px] tracking-[0.25em] text-[#a88138] uppercase mt-0.5">
              With the blessings of our parents and elders
            </p>
          </motion.div>

          {/* Hero Couple Artwork inside Ornate Frame */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: step >= 4 ? 1 : 0.85, opacity: step >= 4 ? 1 : 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative my-auto w-48 md:w-60 aspect-square rounded-full p-2 bg-gradient-to-br from-[#dfba73] via-[#c5a059] to-[#8c6d33] shadow-lg"
          >
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/80 shadow-inner">
              <img
                src={artworkUrl}
                alt="Bride & Groom Artwork"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Bride & Groom Names */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: step >= 4 ? 1 : 0, y: step >= 4 ? 0 : 15 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="pb-2 space-y-1"
          >
            <h1 className="font-serif text-2xl md:text-3xl font-semibold text-[#1c040d]">
              {groomName}
            </h1>
            <div className="text-[#a88138] font-cinzel text-sm font-semibold">
              &
            </div>
            <h1 className="font-serif text-2xl md:text-3xl font-semibold text-[#1c040d]">
              {brideName}
            </h1>
            <p className="font-cinzel text-[11px] text-[#8c6d33] tracking-[0.2em] uppercase pt-2">
              {weddingDate}
            </p>
          </motion.div>
        </motion.div>

        {/* LEFT FLAP OF CARD (Unfolds to left) */}
        {step < 3 && (
          <motion.div
            initial={{ rotateY: 0 }}
            animate={{ rotateY: step >= 2 ? -140 : 0 }}
            transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1] }}
            style={{ transformOrigin: "left center" }}
            className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-[#1c040d] via-[#2b0714] to-[#130309] rounded-l-xl border-y-2 border-l-2 border-[#dfba73] shadow-2xl z-20 overflow-hidden"
          >
            <CornerOrnament position="top-left" className="absolute top-3 left-3 w-8 h-8 text-[#dfba73]" />
            <CornerOrnament position="bottom-left" className="absolute bottom-3 left-3 w-8 h-8 text-[#dfba73]" />
            <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#dfba73] to-transparent" />
          </motion.div>
        )}

        {/* RIGHT FLAP OF CARD (Unfolds to right) */}
        {step < 3 && (
          <motion.div
            initial={{ rotateY: 0 }}
            animate={{ rotateY: step >= 2 ? 140 : 0 }}
            transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1] }}
            style={{ transformOrigin: "right center" }}
            className="absolute top-0 bottom-0 right-0 w-1/2 bg-gradient-to-l from-[#1c040d] via-[#2b0714] to-[#130309] rounded-r-xl border-y-2 border-r-2 border-[#dfba73] shadow-2xl z-20 overflow-hidden"
          >
            <CornerOrnament position="top-right" className="absolute top-3 right-3 w-8 h-8 text-[#dfba73]" />
            <CornerOrnament position="bottom-right" className="absolute bottom-3 right-3 w-8 h-8 text-[#dfba73]" />
          </motion.div>
        )}

        {/* GOLD WAX SEAL (Centered on closed card, cracks & fades out in Step 1) */}
        {step < 2 && (
          <motion.div
            initial={{ scale: 1, opacity: 1 }}
            animate={{
              scale: step >= 1 ? 1.25 : 1,
              opacity: step >= 1 ? 0 : 1,
              filter: step >= 1 ? "blur(4px)" : "blur(0px)",
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#fef3c7] via-[#dfba73] to-[#8c6d33] p-1 shadow-gold-glow-lg border-2 border-white/60 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#1c040d] border border-dashed border-[#dfba73]/70 flex flex-col items-center justify-center p-2">
                <span className="font-cinzel text-[9px] text-[#dfba73] tracking-widest">
                  ROYAL SEAL
                </span>
                <span className="font-cinzel font-bold text-base text-white">
                  A × P
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Skip button for convenience */}
      <button
        onClick={onFinished}
        className="absolute bottom-6 text-xs text-gold-300/60 hover:text-gold-200 font-cinzel tracking-widest uppercase transition-colors"
      >
        Skip Opening Animation →
      </button>
    </div>
  );
}
