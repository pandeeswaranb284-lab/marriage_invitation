import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ExternalLink, Sparkles } from 'lucide-react';
import { KalasamMotif, KolamDivider } from './Ornaments';

export default function MarriageInvitation({ marriage, groomName, brideName, languageMode = "both" }) {
  if (!marriage) return null;

  const showTamil = languageMode === "tamil" || languageMode === "both";
  const showEnglish = languageMode === "english" || languageMode === "both";

  const formattedDate = new Date(marriage.ceremony_date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="text-center space-y-8 py-2">
      {/* Temple Motif & Auspicious Blessing */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="space-y-2"
      >
        <KalasamMotif className="w-12 h-12 mx-auto text-[#8c6d33]" />
        
        {showTamil && (
          <h2 className="font-tamil text-2xl md:text-4xl font-bold text-[#631235] tracking-wide">
            {marriage.title_tamil || "திருமண அழைப்பிதழ்"}
          </h2>
        )}

        {showEnglish && (
          <h3 className="font-cinzel text-base md:text-xl font-bold text-[#8c6d33] tracking-[0.25em] uppercase">
            {marriage.title_english || "MARRIAGE CEREMONY"}
          </h3>
        )}

        <KolamDivider className="mx-auto my-4 text-[#8c6d33]" />
      </motion.div>

      {/* Couple Names */}
      <div className="space-y-1">
        <h3 className="font-serif text-3xl md:text-4xl font-bold text-[#1c040d]">
          {groomName}
        </h3>
        <span className="font-cinzel text-lg text-[#8c6d33] font-semibold block">&</span>
        <h3 className="font-serif text-3xl md:text-4xl font-bold text-[#1c040d]">
          {brideName}
        </h3>
      </div>

      <p className="font-serif italic text-base md:text-lg text-[#4a3b2c] max-w-lg mx-auto">
        With the blessings of our families, we cordially invite you to witness and bless their marriage.
      </p>

      {/* Muhurtham & Ceremony Highlight Card */}
      <div className="max-w-xl mx-auto rounded-2xl p-6 md:p-8 bg-[#f6f0e4] border-2 border-[#dfba73] shadow-md space-y-6">
        {marriage.muhurtham_time && (
          <div className="p-3 rounded-lg bg-[#ede2cf] border border-[#dfba73]/70">
            <span className="font-tamil text-sm md:text-base font-bold text-[#631235] block">
              {marriage.muhurtham_time}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {/* Date & Time */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-[#8c6d33] flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-cinzel tracking-wider text-[#8c6d33] font-bold block uppercase">
                  DATE
                </span>
                <span className="font-serif text-base font-semibold text-[#1c040d]">
                  {formattedDate}
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-[#8c6d33] flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-cinzel tracking-wider text-[#8c6d33] font-bold block uppercase">
                  TIME
                </span>
                <span className="font-serif text-sm md:text-base text-[#1c040d]">
                  {marriage.ceremony_time || "9:00 AM to 10:30 AM"}
                </span>
              </div>
            </div>
          </div>

          {/* Venue & Address */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-[#8c6d33] flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-cinzel tracking-wider text-[#8c6d33] font-bold block uppercase">
                  VENUE
                </span>
                <span className="font-serif text-base font-bold text-[#1c040d] block">
                  {marriage.venue_name}
                </span>
                <p className="font-sans text-xs text-[#524336] mt-1 leading-relaxed">
                  {marriage.venue_address}
                </p>
                {marriage.landmark && (
                  <p className="font-sans text-[11px] text-[#8c6d33] mt-1 font-medium">
                    Landmark: {marriage.landmark}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {marriage.google_maps_url && (
          <div className="pt-2">
            <a
              href={marriage.google_maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#8c6d33] via-[#dfba73] to-[#8c6d33] text-[#1c040d] font-cinzel font-bold text-xs tracking-widest uppercase hover:brightness-110 shadow-md transition-all"
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
