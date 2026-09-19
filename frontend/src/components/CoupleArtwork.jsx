import React from 'react';
import { motion } from 'framer-motion';
import { KalasamMotif, KolamDivider } from './Ornaments';

export default function CoupleArtwork({
  groomName = "Arun Sundaram",
  brideName = "Priya Meenakshi",
  weddingDate = "November 20, 2026",
  openingBlessing = "॥ ஸ்ரீ விநாயகர் துணை ॥",
  artworkUrl = "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
  tagline,
}) {
  return (
    <div className="flex flex-col items-center text-center space-y-6">
      {/* Sacred Top Invocation */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="space-y-1"
      >
        <KalasamMotif className="w-10 h-10 mx-auto text-gold-400" />
        <p className="font-tamil text-sm md:text-base text-gold-300 font-medium tracking-wide pt-1">
          {openingBlessing}
        </p>
      </motion.div>

      {/* Cinematic Couple Artwork in Elegant Ornamental Frame */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        className="relative group p-3 rounded-2xl bg-gradient-to-tr from-gold-700 via-gold-400 to-gold-600 shadow-gold-glow-lg max-w-md w-full"
      >
        <div className="relative rounded-xl overflow-hidden aspect-[4/4.5] border-2 border-[#1c040d] bg-[#070c18]">
          <img
            src={artworkUrl}
            alt={`${groomName} and ${brideName}`}
            className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
            loading="lazy"
          />
          {/* Subtle vignette lighting */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070c18]/80 via-transparent to-transparent" />
        </div>
      </motion.div>

      {/* Auspicious Blessing & Names */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
        className="space-y-3 max-w-xl"
      >
        <p className="font-serif italic text-base md:text-lg text-gold-200/90">
          With the blessings of our parents and elders
        </p>

        <div className="space-y-1">
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-wide text-white">
            {groomName}
          </h1>
          <div className="text-gold-400 font-cinzel text-xl font-semibold my-1">
            &
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-wide text-white">
            {brideName}
          </h1>
        </div>

        <p className="font-serif text-base md:text-lg text-gold-100/85 leading-relaxed pt-2">
          request the pleasure of your gracious presence at their wedding celebrations
        </p>

        {tagline && (
          <p className="font-serif italic text-sm text-gold-300/80">
            "{tagline}"
          </p>
        )}

        <KolamDivider className="mx-auto my-4 text-gold-500" />

        <div className="inline-block px-6 py-2 rounded-full border border-gold-500/40 bg-navy-950/60 shadow-inner">
          <span className="font-cinzel text-xs md:text-sm tracking-[0.25em] text-gold-300 font-bold uppercase">
            {weddingDate}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
