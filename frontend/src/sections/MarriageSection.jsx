import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ExternalLink, Heart } from 'lucide-react';

export default function MarriageSection({ id, marriage, groomName, brideName, languageMode }) {
  if (!marriage) return null;

  const showTamil   = languageMode === 'tamil'   || languageMode === 'both';
  const showEnglish = languageMode === 'english' || languageMode === 'both';

  const formattedDate = new Date(marriage.ceremony_date).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <section
      id={id}
      className="relative py-20 md:py-28 px-4 scroll-mt-[70px] overflow-hidden bg-[#FFF7F9]"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vh] bg-[#FCE4E8] opacity-60 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto space-y-10 text-center">

        {/* Header motif */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-3"
        >
          <div className="w-12 h-12 rounded-full bg-[#FCE4E8] text-[#E85D75] mx-auto flex items-center justify-center shadow-sm">
            <Heart className="w-6 h-6 fill-[#E85D75]" />
          </div>

          {showTamil && (
            <h2 className="font-tamil text-3xl md:text-5xl font-bold text-[#8F3045] leading-tight">
              {marriage.title_tamil || 'திருமண அழைப்பிதழ்'}
            </h2>
          )}
          {showEnglish && (
            <h3 className="font-cinzel text-base md:text-xl font-bold text-[#E85D75] tracking-[0.25em] uppercase">
              {marriage.title_english || 'MARRIAGE CEREMONY'}
            </h3>
          )}

          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="w-12 h-[1px] bg-[#E85D75]/30" />
            <Heart className="w-3 h-3 fill-[#E85D75] text-[#E85D75]" />
            <div className="w-12 h-[1px] bg-[#E85D75]/30" />
          </div>
        </motion.div>

        {/* Couple names */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="space-y-1"
        >
          <h3 className="font-serif italic text-3xl md:text-4xl font-bold text-[#8F3045]">{groomName}</h3>
          <span className="text-[#E85D75] text-xl not-italic font-normal block my-1">♡</span>
          <h3 className="font-serif italic text-3xl md:text-4xl font-bold text-[#8F3045]">{brideName}</h3>
          <p className="font-serif text-sm md:text-base text-[#8F3045]/75 max-w-md mx-auto pt-2 leading-relaxed">
            With the blessings of our families, we cordially invite you to witness and bless their marriage.
          </p>
        </motion.div>

        {/* Muhurtham + Ceremony details card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="rounded-3xl bg-white/95 border border-[#FCE4E8] shadow-[0_10px_35px_rgba(232,93,117,0.1)] overflow-hidden"
        >
          {/* Muhurtham banner */}
          {marriage.muhurtham_time && (
            <div className="bg-[#FCE4E8]/70 border-b border-[#FCE4E8] px-6 py-3">
              <p className="font-tamil text-sm md:text-base font-bold text-[#8F3045] text-center">
                {marriage.muhurtham_time}
              </p>
            </div>
          )}

          <div className="p-6 md:p-8 space-y-5 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Date */}
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-[#E85D75] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-cinzel text-[9px] font-semibold tracking-wider text-[#8F3045]/60 uppercase block">Date</span>
                  <span className="font-serif text-base font-semibold text-[#8F3045]">{formattedDate}</span>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#E85D75] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-cinzel text-[9px] font-semibold tracking-wider text-[#8F3045]/60 uppercase block">Time</span>
                  <span className="font-serif text-base text-[#8F3045]">
                    {marriage.ceremony_time || '9:00 AM to 10:30 AM'}
                  </span>
                </div>
              </div>

              {/* Venue */}
              <div className="flex items-start gap-3 sm:col-span-2">
                <MapPin className="w-5 h-5 text-[#E85D75] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-cinzel text-[9px] font-semibold tracking-wider text-[#8F3045]/60 uppercase block">Venue</span>
                  <span className="font-serif text-base font-bold text-[#8F3045] block">{marriage.venue_name}</span>
                  <span className="font-sans text-xs text-[#8F3045]/80 mt-0.5 block leading-relaxed">{marriage.venue_address}</span>
                  {marriage.landmark && (
                    <span className="font-sans text-[11px] text-[#E85D75] mt-1 block font-medium">
                      Landmark: {marriage.landmark}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Traditional note */}
            {marriage.traditional_note && (
              <p className="font-serif italic text-xs text-[#8F3045]/70 text-center border-t border-[#FCE4E8] pt-4">
                {marriage.traditional_note}
              </p>
            )}

            {/* Maps button */}
            {marriage.google_maps_url && (
              <div className="text-center pt-2">
                <a
                  href={marriage.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-gradient-to-r from-[#E85D75] to-[#E11D48] text-white font-cinzel font-bold text-xs tracking-widest uppercase shadow-[0_4px_16px_rgba(232,93,117,0.3)] hover:brightness-105 transition-all"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  VIEW LOCATION
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
