import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Heart } from 'lucide-react';

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

        {/* Couple artwork with rose floral aura */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Outer floral ring */}
          <div className="w-[min(72vw,280px)] h-[min(72vw,280px)] rounded-full p-[4px] bg-gradient-to-br from-[#FF8FAB] via-[#E85D75] to-[#E11D48] shadow-[0_12px_45px_rgba(232,93,117,0.3)]">
            <div className="w-full h-full rounded-full p-[4px] bg-white">
              <div className="w-full h-full rounded-full overflow-hidden shadow-inner">
                <img
                  src={artworkUrl}
                  alt={`${wedding.groom_name} & ${wedding.bride_name}`}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            </div>
          </div>

          {/* Delicate dashed ring */}
          <div
            className="absolute inset-[-12px] rounded-full border border-dashed border-[#E85D75]/30"
            style={{ animation: 'spin 35s linear infinite' }}
          />

          {/* Floating mini hearts at cardinal points */}
          {[0, 90, 180, 270].map(deg => (
            <div
              key={deg}
              className="absolute w-3 h-3 rounded-full bg-white shadow-sm flex items-center justify-center border border-[#FCE4E8]"
              style={{
                top:  '50%', left: '50%',
                transform: `rotate(${deg}deg) translateY(-${Math.min(36*window.innerWidth/100+12, 150)}px) translate(-50%, -50%)`,
              }}
            >
              <Heart className="w-2 h-2 fill-[#E85D75] text-[#E85D75]" />
            </div>
          ))}
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
