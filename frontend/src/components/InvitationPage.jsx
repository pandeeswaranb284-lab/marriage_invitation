import React from 'react';
import { motion } from 'framer-motion';
import { CornerOrnament } from './Ornaments';

export default function InvitationPage({
  id,
  pageNumber,
  pageTitle,
  theme = "dark", // "dark" (Navy/Burgundy) | "ivory" (Sacred Marriage) | "reception" (Royal Evening)
  children,
}) {
  const getThemeStyles = () => {
    switch (theme) {
      case "ivory":
        return "bg-sacred-ivory text-neutral-900 border-[#dfba73]";
      case "reception":
        return "bg-royal-reception text-[#f7e7ce] border-[#dfba73]";
      default:
        return "bg-silk-texture text-[#f7e7ce] border-[#c5a059]/40";
    }
  };

  const getOrnamentColor = () => {
    switch (theme) {
      case "ivory":
        return "text-[#8c6d33]";
      case "reception":
        return "text-[#dfba73]";
      default:
        return "text-gold-400";
    }
  };

  return (
    <section
      id={id}
      className="min-h-screen py-16 px-4 md:px-8 flex items-center justify-center relative overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`relative w-full max-w-4xl mx-auto rounded-2xl p-6 md:p-12 border-2 shadow-royal ${getThemeStyles()}`}
      >
        {/* Ornate Corner Accents */}
        <CornerOrnament position="top-left" className={`absolute top-3 left-3 w-8 h-8 ${getOrnamentColor()}`} />
        <CornerOrnament position="top-right" className={`absolute top-3 right-3 w-8 h-8 ${getOrnamentColor()}`} />
        <CornerOrnament position="bottom-left" className={`absolute bottom-3 left-3 w-8 h-8 ${getOrnamentColor()}`} />
        <CornerOrnament position="bottom-right" className={`absolute bottom-3 right-3 w-8 h-8 ${getOrnamentColor()}`} />

        {/* Top Digital Page Header Indicator */}
        <div className="flex items-center justify-between border-b border-current/15 pb-4 mb-8">
          <div className="flex items-center space-x-2">
            <span className="font-cinzel text-xs tracking-[0.25em] font-bold text-gold-500 uppercase">
              {pageNumber}
            </span>
            <span className="text-current/40 text-xs">•</span>
            <span className="font-cinzel text-xs tracking-wider text-current/70 uppercase">
              {pageTitle}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 rounded-full bg-gold-400" />
            <div className="w-1.5 h-1.5 rounded-full bg-gold-500/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-gold-600/30" />
          </div>
        </div>

        {/* Page Content */}
        <div className="relative z-10">{children}</div>

        {/* Bottom Page Footer Accent */}
        <div className="mt-12 pt-4 border-t border-current/15 flex items-center justify-center text-center">
          <span className="font-cinzel text-[10px] tracking-[0.25em] text-current/50 uppercase">
            Auspicious Wedding Celebration • Digital Invitation
          </span>
        </div>
      </motion.div>
    </section>
  );
}
