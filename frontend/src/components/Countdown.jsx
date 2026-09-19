import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import { KolamDivider } from './Ornaments';

export default function Countdown({ weddingDate, receptionDate }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isToday: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const target = new Date(weddingDate).getTime();
      const difference = target - now;

      if (difference <= 0 && difference > -86400000) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isToday: true });
        return;
      }

      if (difference <= -86400000) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isToday: false, completed: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isToday: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [weddingDate]);

  const units = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds },
  ];

  return (
    <div className="text-center space-y-6 max-w-xl mx-auto py-2">
      <div className="space-y-1">
        <span className="font-cinzel text-[10px] tracking-[0.25em] text-gold-400 uppercase">
          Auspicious Muhurtham
        </span>
        <h2 className="font-cinzel text-xl md:text-3xl font-bold gold-text-gradient">
          COUNTING DOWN TO THE WEDDING
        </h2>
      </div>

      {timeLeft.isToday ? (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="p-6 rounded-2xl bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 text-navy-950 font-cinzel font-bold text-xl md:text-2xl shadow-gold-glow-lg border-2 border-white"
        >
          ✦ TODAY IS THE WEDDING DAY ✦
        </motion.div>
      ) : (
        <div className="grid grid-cols-4 gap-2 md:gap-4">
          {units.map((unit, index) => (
            <motion.div
              key={unit.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-3 md:p-5 rounded-xl bg-navy-950/80 border border-gold-400/40 shadow-card-inner flex flex-col items-center justify-center"
            >
              <span className="font-serif text-2xl md:text-4xl font-bold text-white tracking-wider">
                {String(unit.value).padStart(2, '0')}
              </span>
              <span className="font-cinzel text-[9px] md:text-xs text-gold-300/80 tracking-widest mt-1">
                {unit.label}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
