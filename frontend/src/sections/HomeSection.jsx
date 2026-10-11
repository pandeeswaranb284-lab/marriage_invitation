import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Heart, Sparkles } from 'lucide-react';

function CountdownTimer({ weddingDate }) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, done: false });

  useEffect(() => {
    const calc = () => {
      const diff = new Date(weddingDate).getTime() - Date.now();
      if (diff <= 0) { setTime(t => ({ ...t, done: true })); return; }
      setTime({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        done: false,
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [weddingDate]);

  if (time.done) {
    return (
      <div className="py-4 px-8 rounded-2xl bg-[#FCE4E8] border border-[#E85D75]/40 text-center shadow-sm">
        <p className="font-cinzel text-lg text-[#8F3045] tracking-widest">✦ TODAY IS THE WEDDING DAY ✦</p>
      </div>
    );
  }

  const units = [
    { label: 'DAYS',    val: time.days },
    { label: 'HOURS',   val: time.hours },
    { label: 'MINUTES', val: time.minutes },
    { label: 'SECONDS', val: time.seconds },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-md mx-auto">
        {units.map(({ label, val }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex flex-col items-center justify-center py-3.5 px-2 rounded-2xl bg-white/90 border border-[#FCE4E8] shadow-[0_4px_16px_rgba(232,93,117,0.08)]"
          >
            <span className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#8F3045] leading-none tabular-nums">
              {String(val).padStart(2, '0')}
            </span>
            <span className="font-cinzel text-[8px] sm:text-[9px] text-[#8F3045]/60 font-semibold tracking-widest mt-1.5">
              {label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function HomeSection({ id, wedding, formattedDate }) {
  const artworkUrl =
    wedding.couple_details?.artwork_url ||
    wedding.gallery_images?.find(g => g.is_hero)?.image_url ||
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80';

  const coupleDetails = wedding.couple_details || {};
  const artworkSizeRaw = coupleDetails.artwork_size || 'medium';
  const artworkFit = coupleDetails.artwork_fit || 'cover';
  const artworkPosition = coupleDetails.artwork_position || 'center';
  const artworkZoom = Number(coupleDetails.artwork_zoom) || 100;

  const getCircleDiameter = (val) => {
    if (!val) return 272;
    if (typeof val === 'number') return Math.max(180, Math.min(val, 400));
    const lower = String(val).toLowerCase();
    if (lower === 'small') return 220;
    if (lower === 'medium') return 272;
    if (lower === 'large') return 324;
    if (lower === 'xlarge') return 376;
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? 272 : Math.max(180, Math.min(parsed, 400));
  };

  const circleDiameter = getCircleDiameter(artworkSizeRaw);
  const outerDiameter = Math.round(circleDiameter * 1.19);
  const innerDiameter = Math.round(circleDiameter * 1.085);
  const auraDiameter = Math.round(circleDiameter * 1.25);
  const charmDiameter = Math.round(circleDiameter * 1.14);

  return (
    <section
      id={id}
      className="relative min-h-screen flex flex-col items-center justify-center pt-[90px] pb-20 px-4 overflow-hidden bg-[#FFF7F9]"
    >
      {/* Background soft blush ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] h-[55vh] bg-[#FCE4E8] opacity-70 rounded-full blur-[90px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-[45vh] bg-[#FFF0F3] opacity-60 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center gap-7 text-center">

        {/* Auspicious header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="space-y-1.5"
        >
          <p className="font-tamil text-sm md:text-base text-[#8F3045]/85 font-medium">
            {wedding.opening_blessing || '॥ ஸ்ரீ விநாயகர் துணை ॥'}
          </p>
          <p className="font-serif italic text-sm md:text-base text-[#8F3045]/70 max-w-md mx-auto">
            With the blessings of our parents and elders
          </p>
        </motion.div>

        {/* Animated Center Couple Photo Circle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-center justify-center my-3 select-none"
        >
          {/* 1. Luminous Breathing Aurora Halo */}
          <motion.div
            animate={{
              scale: [1, 1.14, 1],
              opacity: [0.35, 0.7, 0.35],
            }}
            transition={{
              duration: 4.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute rounded-full blur-[28px] pointer-events-none"
            style={{
              width: `min(90vw, ${auraDiameter}px)`,
              height: `min(90vw, ${auraDiameter}px)`,
              background:
                'radial-gradient(circle, rgba(232,93,117,0.42) 0%, rgba(246,211,101,0.28) 45%, rgba(232,93,117,0) 72%)',
            }}
          />

          {/* 2. Outer Rotating Floral / Mandala Ring (Clockwise, 38s) */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: `min(86vw, ${outerDiameter}px)`,
              height: `min(86vw, ${outerDiameter}px)`,
            }}
          >
            <svg viewBox="0 0 320 320" className="w-full h-full overflow-visible">
              <circle
                cx="160"
                cy="160"
                r="152"
                fill="none"
                stroke="url(#roseGoldCircleGrad)"
                strokeWidth="1.5"
                strokeDasharray="4 8"
                opacity="0.8"
              />
              {/* 12 Celestial Golden & Rose Beads */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180;
                const x = 160 + 152 * Math.cos(angle);
                const y = 160 + 152 * Math.sin(angle);
                const isCardinal = i % 3 === 0;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={isCardinal ? 3.5 : 2}
                    fill={isCardinal ? '#D4AF37' : '#E85D75'}
                    opacity={isCardinal ? 0.95 : 0.75}
                  />
                );
              })}
              <defs>
                <linearGradient id="roseGoldCircleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D4AF37" />
                  <stop offset="50%" stopColor="#E85D75" />
                  <stop offset="100%" stopColor="#F6D365" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          {/* 3. Inner Counter-Rotating Orbit Ring (Counter-Clockwise, 24s) */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
            className="absolute rounded-full border border-dashed border-[#E85D75]/40 pointer-events-none"
            style={{
              width: `min(78vw, ${innerDiameter}px)`,
              height: `min(78vw, ${innerDiameter}px)`,
            }}
          />

          {/* 4. Orbiting Sparkling Charms (Clockwise, 32s) */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
            className="absolute pointer-events-none"
            style={{
              width: `min(82vw, ${charmDiameter}px)`,
              height: `min(82vw, ${charmDiameter}px)`,
            }}
          >
            {/* Top Cardinal: Floating Heart */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <motion.div
                animate={{ scale: [0.85, 1.2, 0.85] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-5 h-5 rounded-full bg-white/95 border border-[#FCE4E8] shadow-[0_2px_10px_rgba(232,93,117,0.3)] flex items-center justify-center"
              >
                <Heart className="w-2.5 h-2.5 fill-[#E85D75] text-[#E85D75]" />
              </motion.div>
            </div>

            {/* Right Cardinal: Golden Star */}
            <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2">
              <motion.div
                animate={{ scale: [0.85, 1.25, 0.85] }}
                transition={{ duration: 2.2, repeat: Infinity, delay: 0.55, ease: 'easeInOut' }}
                className="w-5 h-5 rounded-full bg-white/95 border border-[#FDF2D0] shadow-[0_2px_10px_rgba(212,175,55,0.35)] flex items-center justify-center text-[#D4AF37]"
              >
                <Sparkles className="w-2.5 h-2.5 fill-[#D4AF37] text-[#D4AF37]" />
              </motion.div>
            </div>

            {/* Bottom Cardinal: Floating Heart */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
              <motion.div
                animate={{ scale: [0.85, 1.2, 0.85] }}
                transition={{ duration: 2.2, repeat: Infinity, delay: 1.1, ease: 'easeInOut' }}
                className="w-5 h-5 rounded-full bg-white/95 border border-[#FCE4E8] shadow-[0_2px_10px_rgba(232,93,117,0.3)] flex items-center justify-center"
              >
                <Heart className="w-2.5 h-2.5 fill-[#E85D75] text-[#E85D75]" />
              </motion.div>
            </div>

            {/* Left Cardinal: Golden Star */}
            <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2">
              <motion.div
                animate={{ scale: [0.85, 1.25, 0.85] }}
                transition={{ duration: 2.2, repeat: Infinity, delay: 1.65, ease: 'easeInOut' }}
                className="w-5 h-5 rounded-full bg-white/95 border border-[#FDF2D0] shadow-[0_2px_10px_rgba(212,175,55,0.35)] flex items-center justify-center text-[#D4AF37]"
              >
                <Sparkles className="w-2.5 h-2.5 fill-[#D4AF37] text-[#D4AF37]" />
              </motion.div>
            </div>
          </motion.div>

          {/* 5. Center Levitating Couple Photo Circle */}
          <motion.div
            animate={{
              y: [-4, 4, -4],
            }}
            transition={{
              duration: 4.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            whileHover={{ scale: 1.035 }}
            className="relative z-10 rounded-full p-[4px] bg-gradient-to-tr from-[#E85D75] via-[#FDA085] to-[#F6D365] shadow-[0_16px_50px_rgba(232,93,117,0.35),0_0_28px_rgba(246,211,101,0.22)] cursor-pointer group"
            style={{
              width: `min(72vw, ${circleDiameter}px)`,
              height: `min(72vw, ${circleDiameter}px)`,
            }}
          >
            {/* Crisp Inner White Ring */}
            <div className="w-full h-full rounded-full p-[4px] bg-white shadow-inner">
              <div className="relative w-full h-full rounded-full overflow-hidden shadow-inner bg-[#FFF0F3]">
                <img
                  src={artworkUrl}
                  alt={`${wedding.groom_name} & ${wedding.bride_name}`}
                  className="w-full h-full transition-transform duration-500 group-hover:scale-108"
                  style={{
                    objectFit: artworkFit,
                    objectPosition: artworkPosition,
                    transform: `scale(${artworkZoom / 100})`,
                  }}
                  loading="eager"
                />

                {/* Shimmer Light Sweeping Accent */}
                <motion.div
                  animate={{
                    x: ['-140%', '240%'],
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    repeatDelay: 4.5,
                    ease: 'easeInOut',
                  }}
                  className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] pointer-events-none"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Couple names (Romantic Calligraphy Serif) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="space-y-1"
        >
          <h1 className="font-serif italic text-[clamp(2.2rem,8vw,3.8rem)] font-bold text-[#8F3045] leading-tight">
            {wedding.groom_name}
          </h1>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-[1px] bg-[#E85D75]/40" />
            <span className="text-[#E85D75] text-2xl not-italic">♡</span>
            <div className="w-12 h-[1px] bg-[#E85D75]/40" />
          </div>
          <h2 className="font-serif italic text-[clamp(2.2rem,8vw,3.8rem)] font-bold text-[#8F3045] leading-tight">
            {wedding.bride_name}
          </h2>
        </motion.div>

        {/* Invitation lead text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="font-serif text-base sm:text-lg text-[#8F3045]/75 max-w-lg mx-auto leading-relaxed"
        >
          Request the pleasure of your gracious presence at their wedding celebrations
        </motion.p>

        {/* Auspicious Muhurtham Date Badge (from Mockup Step 5) */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/95 border border-[#FCE4E8] shadow-[0_2px_14px_rgba(232,93,117,0.1)] text-[#8F3045]"
        >
          <Calendar className="w-4 h-4 text-[#E85D75]" />
          <span className="font-cinzel text-xs font-bold tracking-wider uppercase">
            {formattedDate}
          </span>
          {wedding.wedding_time && (
            <>
              <span className="text-[#E85D75]">·</span>
              <span className="font-cinzel text-xs font-semibold text-[#8F3045]/80">
                {wedding.wedding_time}
              </span>
            </>
          )}
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="w-full max-w-lg mt-1"
        >
          <CountdownTimer weddingDate={wedding.wedding_date} />
        </motion.div>

        {/* Quote: "Two Hearts, Two Families, One Beautiful Beginning" */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.95 }}
          className="pt-2"
        >
          <p className="font-serif italic text-base sm:text-lg text-[#E85D75] tracking-wide font-medium">
            Two Hearts · Two Families · One Beautiful Beginning
          </p>
        </motion.div>
      </div>
    </section>
  );
}
