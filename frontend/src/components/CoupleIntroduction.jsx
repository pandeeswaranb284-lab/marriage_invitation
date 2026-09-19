import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, MapPin, HeartHandshake } from 'lucide-react';
import { KolamDivider } from './Ornaments';

export default function CoupleIntroduction({ couple, families }) {
  if (!couple) return null;

  return (
    <div className="space-y-10">
      {/* Section Headings */}
      <div className="text-center space-y-2">
        <span className="text-[11px] font-cinzel tracking-[0.3em] text-gold-400 uppercase">
          Sacred Lineage & Traditions
        </span>
        <h2 className="font-cinzel text-2xl md:text-4xl font-bold gold-text-gradient">
          TWO FAMILIES
        </h2>
        <div className="h-[1px] w-16 mx-auto bg-gold-400/60 my-1" />
        <h3 className="font-serif italic text-xl md:text-2xl text-gold-200">
          One New Beginning
        </h3>
      </div>

      {/* Elder Blessings Quote */}
      {families?.elder_blessing_text && (
        <div className="max-w-2xl mx-auto p-4 rounded-xl bg-navy-950/40 border border-gold-500/30 text-center">
          {families.elder_blessing_tamil && (
            <p className="font-tamil text-xs md:text-sm text-gold-300 leading-relaxed mb-2">
              {families.elder_blessing_tamil}
            </p>
          )}
          <p className="font-serif italic text-sm md:text-base text-gold-200/90 leading-relaxed">
            "{families.elder_blessing_text}"
          </p>
        </div>
      )}

      {/* Two Elegant Dignified Panels: Groom & Bride */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* GROOM PANEL */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-xl p-6 md:p-8 bg-gradient-to-b from-navy-900/90 to-navy-950/90 border border-gold-400/40 shadow-royal flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="border-b border-gold-500/20 pb-3">
              <span className="font-cinzel text-[10px] tracking-[0.25em] text-gold-400 uppercase">
                The Groom
              </span>
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mt-1">
                {couple.groom_name || "Arun Sundaram"}
              </h3>
              <p className="font-serif italic text-sm text-gold-200/90 mt-1">
                Son of <strong className="font-semibold text-white">{couple.groom_father}</strong> & <strong className="font-semibold text-white">{couple.groom_mother}</strong>
              </p>
              {families?.groom_grandparents && (
                <p className="font-serif text-xs text-gold-300/70 mt-0.5">
                  Grandson of {families.groom_grandparents}
                </p>
              )}
            </div>

            {/* Background Details */}
            <div className="space-y-3 pt-2 text-sm text-gold-100/90 font-sans">
              {couple.groom_education && (
                <div className="flex items-start space-x-3">
                  <GraduationCap className="w-4 h-4 text-gold-400 flex-shrink-0 mt-1" />
                  <div>
                    <span className="text-xs text-gold-400/80 block font-cinzel">Education</span>
                    <span>{couple.groom_education}</span>
                  </div>
                </div>
              )}

              {couple.groom_profession && (
                <div className="flex items-start space-x-3">
                  <Briefcase className="w-4 h-4 text-gold-400 flex-shrink-0 mt-1" />
                  <div>
                    <span className="text-xs text-gold-400/80 block font-cinzel">Profession</span>
                    <span>{couple.groom_profession}</span>
                  </div>
                </div>
              )}

              {couple.groom_native && (
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0 mt-1" />
                  <div>
                    <span className="text-xs text-gold-400/80 block font-cinzel">Native Place</span>
                    <span>{couple.groom_native}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gold-500/20 text-center">
            <span className="font-cinzel text-[10px] tracking-wider text-gold-400/70 uppercase">
              {families?.groom_family_title || "Sundaram Family, Madurai"}
            </span>
          </div>
        </motion.div>

        {/* BRIDE PANEL */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-xl p-6 md:p-8 bg-gradient-to-b from-burgundy-900/90 to-burgundy-950/90 border border-gold-400/40 shadow-royal flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="border-b border-gold-500/20 pb-3">
              <span className="font-cinzel text-[10px] tracking-[0.25em] text-gold-400 uppercase">
                The Bride
              </span>
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mt-1">
                {couple.bride_name || "Priya Meenakshi"}
              </h3>
              <p className="font-serif italic text-sm text-gold-200/90 mt-1">
                Daughter of <strong className="font-semibold text-white">{couple.bride_father}</strong> & <strong className="font-semibold text-white">{couple.bride_mother}</strong>
              </p>
              {families?.bride_grandparents && (
                <p className="font-serif text-xs text-gold-300/70 mt-0.5">
                  Granddaughter of {families.bride_grandparents}
                </p>
              )}
            </div>

            {/* Background Details */}
            <div className="space-y-3 pt-2 text-sm text-gold-100/90 font-sans">
              {couple.bride_education && (
                <div className="flex items-start space-x-3">
                  <GraduationCap className="w-4 h-4 text-gold-400 flex-shrink-0 mt-1" />
                  <div>
                    <span className="text-xs text-gold-400/80 block font-cinzel">Education</span>
                    <span>{couple.bride_education}</span>
                  </div>
                </div>
              )}

              {couple.bride_profession && (
                <div className="flex items-start space-x-3">
                  <Briefcase className="w-4 h-4 text-gold-400 flex-shrink-0 mt-1" />
                  <div>
                    <span className="text-xs text-gold-400/80 block font-cinzel">Profession</span>
                    <span>{couple.bride_profession}</span>
                  </div>
                </div>
              )}

              {couple.bride_native && (
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0 mt-1" />
                  <div>
                    <span className="text-xs text-gold-400/80 block font-cinzel">Native Place</span>
                    <span>{couple.bride_native}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gold-500/20 text-center">
            <span className="font-cinzel text-[10px] tracking-wider text-gold-400/70 uppercase">
              {families?.bride_family_title || "Meenakshisundaram Family, Chennai"}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
