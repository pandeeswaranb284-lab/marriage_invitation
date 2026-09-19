import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, MapPin, Heart } from 'lucide-react';

function FamilyPanel({ role, name, parentLine, grandparentLine, education, profession, native, familyTitle, side }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === 'groom' ? -24 : 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8 }}
      className="relative rounded-3xl p-6 md:p-8 bg-white/95 border border-[#FCE4E8] flex flex-col justify-between shadow-[0_10px_35px_rgba(232,93,117,0.08)]"
    >
      {/* Role tag */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-3 border-b border-[#FCE4E8]">
          <div>
            <span className="font-cinzel text-[10px] font-semibold tracking-[0.25em] text-[#E85D75] uppercase block">
              The {role}
            </span>
            <h3 className="font-serif italic text-2xl md:text-3xl font-bold text-[#8F3045] mt-0.5">
              {name}
            </h3>
            {parentLine && (
              <p className="font-serif italic text-sm text-[#8F3045]/80 mt-1">
                {parentLine}
              </p>
            )}
            {grandparentLine && (
              <p className="font-sans text-xs text-[#8F3045]/60 mt-0.5">
                {grandparentLine}
              </p>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3 pt-1">
          {education && (
            <div className="flex items-start gap-3">
              <GraduationCap className="w-4 h-4 text-[#E85D75] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-cinzel text-[9px] font-semibold tracking-wider text-[#8F3045]/60 uppercase block">Education</span>
                <span className="font-sans text-sm text-[#8F3045]/90">{education}</span>
              </div>
            </div>
          )}
          {profession && (
            <div className="flex items-start gap-3">
              <Briefcase className="w-4 h-4 text-[#E85D75] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-cinzel text-[9px] font-semibold tracking-wider text-[#8F3045]/60 uppercase block">Profession</span>
                <span className="font-sans text-sm text-[#8F3045]/90">{profession}</span>
              </div>
            </div>
          )}
          {native && (
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#E85D75] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-cinzel text-[9px] font-semibold tracking-wider text-[#8F3045]/60 uppercase block">Native</span>
                <span className="font-sans text-sm text-[#8F3045]/90">{native}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {familyTitle && (
        <div className="mt-5 pt-4 border-t border-[#FCE4E8] text-center">
          <span className="font-cinzel text-[10px] font-semibold tracking-wider text-[#E85D75] uppercase">
            {familyTitle}
          </span>
        </div>
      )}
    </motion.div>
  );
}

export default function FamilySection({ id, couple, families, languageMode }) {
  const showTamil   = languageMode === 'tamil'   || languageMode === 'both';
  const showEnglish = languageMode === 'english' || languageMode === 'both';

  return (
    <section
      id={id}
      className="relative py-20 md:py-28 px-4 bg-[#FFF7F9] scroll-mt-[70px]"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[50vh] bg-[#FCE4E8] opacity-60 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-12">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-2"
        >
          <span className="font-cinzel text-[10px] font-semibold tracking-[0.3em] text-[#8F3045]/70 uppercase">
            Sacred Lineage & Traditions
          </span>
          <h2 className="font-serif italic text-3xl md:text-5xl font-bold text-[#8F3045]">
            Two Families
          </h2>
          <h3 className="font-serif italic text-lg md:text-xl text-[#E85D75]">
            One New Beginning
          </h3>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="w-12 h-[1px] bg-[#E85D75]/30" />
            <Heart className="w-3 h-3 fill-[#E85D75] text-[#E85D75]" />
            <div className="w-12 h-[1px] bg-[#E85D75]/30" />
          </div>
        </motion.div>

        {/* Elder blessings block */}
        {(families?.elder_blessing_text || families?.elder_blessing_tamil) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="max-w-2xl mx-auto p-5 md:p-6 rounded-3xl bg-white/90 border border-[#FCE4E8] text-center space-y-3 shadow-sm"
          >
            {showTamil && families?.elder_blessing_tamil && (
              <p className="font-tamil text-sm md:text-base text-[#8F3045] font-medium leading-relaxed">
                {families.elder_blessing_tamil}
              </p>
            )}
            {showEnglish && families?.elder_blessing_text && (
              <p className="font-serif italic text-sm md:text-base text-[#8F3045]/80 leading-relaxed">
                "{families.elder_blessing_text}"
              </p>
            )}
          </motion.div>
        )}

        {/* Groom + Bride panels */}
        {couple && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <FamilyPanel
              side="groom"
              role="Groom"
              name={couple.groom_name}
              parentLine={
                couple.groom_father && couple.groom_mother
                  ? `Son of ${couple.groom_father} & ${couple.groom_mother}`
                  : undefined
              }
              grandparentLine={
                families?.groom_grandparents
                  ? `Grandson of ${families.groom_grandparents}`
                  : undefined
              }
              education={couple.groom_education}
              profession={couple.groom_profession}
              native={couple.groom_native}
              familyTitle={families?.groom_family_title}
            />
            <FamilyPanel
              side="bride"
              role="Bride"
              name={couple.bride_name}
              parentLine={
                couple.bride_father && couple.bride_mother
                  ? `Daughter of ${couple.bride_father} & ${couple.bride_mother}`
                  : undefined
              }
              grandparentLine={
                families?.bride_grandparents
                  ? `Granddaughter of ${families.bride_grandparents}`
                  : undefined
              }
              education={couple.bride_education}
              profession={couple.bride_profession}
              native={couple.bride_native}
              familyTitle={families?.bride_family_title}
            />
          </div>
        )}
      </div>
    </section>
  );
}
