import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ExternalLink, Moon, Sparkles } from 'lucide-react';
import { KolamDivider } from './Ornaments';

export default function ReceptionInvitation({ reception, groomName, brideName, languageMode = "both" }) {
  if (!reception) return null;

  const showTamil = languageMode === "tamil" || languageMode === "both";
  const showEnglish = languageMode === "english" || languageMode === "both";

  const formattedDate = new Date(reception.reception_date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="text-center space-y-8 py-2 relative">
      {/* Subtle Evening Stars / Soft Glow Effect */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-20" />

      {/* Reception Header & Ambiance */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="space-y-2"
      >
        <div className="flex items-center justify-center space-x-2 text-champagne mb-2">
          <Sparkles className="w-4 h-4 text-gold-400" />
          <Moon className="w-5 h-5 text-gold-300" />
          <Sparkles className="w-4 h-4 text-gold-400" />
        </div>

        {showTamil && (
          <h2 className="font-tamil text-2xl md:text-4xl font-bold text-champagne tracking-wide">
            {reception.title_tamil || "வரவேற்பு"}
          </h2>
        )}

        {showEnglish && (
          <h3 className="font-cinzel text-base md:text-xl font-bold text-gold-400 tracking-[0.25em] uppercase">
            {reception.title_english || "WEDDING RECEPTION"}
          </h3>
        )}

        <KolamDivider className="mx-auto my-4 text-gold-400" />
      </motion.div>

      {/* Description & Blessing */}
      <p className="font-serif italic text-base md:text-lg text-champagne/90 max-w-xl mx-auto">
        With the blessings of our families, we invite you to celebrate the joyous occasion of
      </p>

      {/* Couple Names in Royal Champagne Foil */}
      <div className="space-y-1">
        <h3 className="font-serif text-3xl md:text-4xl font-bold text-white tracking-wide">
          {groomName} & {brideName}
        </h3>
      </div>

      {/* Reception Card */}
      <div className="max-w-xl mx-auto rounded-2xl p-6 md:p-8 bg-gradient-to-b from-navy-900/90 to-navy-950/95 border-2 border-gold-400/50 shadow-gold-glow space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {/* Date & Time */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-cinzel tracking-wider text-gold-400 font-bold block uppercase">
                  DATE
                </span>
                <span className="font-serif text-base font-semibold text-white">
                  {formattedDate}
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-cinzel tracking-wider text-gold-400 font-bold block uppercase">
                  TIME
                </span>
                <span className="font-serif text-sm md:text-base text-champagne">
                  {reception.reception_time || "6:30 PM onwards"}
                </span>
              </div>
            </div>
          </div>

          {/* Venue & Address */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-cinzel tracking-wider text-gold-400 font-bold block uppercase">
                  VENUE
                </span>
                <span className="font-serif text-base font-bold text-white block">
                  {reception.venue_name}
                </span>
                <p className="font-sans text-xs text-champagne/80 mt-1 leading-relaxed">
                  {reception.venue_address}
                </p>
                {reception.landmark && (
                  <p className="font-sans text-[11px] text-gold-300 mt-1 font-medium">
                    Landmark: {reception.landmark}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {reception.google_maps_url && (
          <div className="pt-2">
            <a
              href={reception.google_maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 text-navy-950 font-cinzel font-bold text-xs tracking-widest uppercase hover:brightness-110 shadow-gold-glow transition-all"
            >
              <span>VIEW LOCATION</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
