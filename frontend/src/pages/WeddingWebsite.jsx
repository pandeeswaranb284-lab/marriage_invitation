import React, { useState } from 'react';
import { motion } from 'framer-motion';

import WebsiteNavigation from '../components/WebsiteNavigation';
import WhatsAppShare     from '../components/WhatsAppShare';
import MusicPlayer       from '../components/MusicPlayer';

import HomeSection      from '../sections/HomeSection';
import FamilySection    from '../sections/FamilySection';
import MarriageSection  from '../sections/MarriageSection';
import ReceptionSection from '../sections/ReceptionSection';
import VenueSection     from '../sections/VenueSection';
import GallerySection   from '../sections/GallerySection';
import BlessingsSection from '../sections/BlessingsSection';

/**
 * WeddingWebsite
 *
 * This is the ACTUAL WEDDING WEBSITE — a complete, independent, scrollable application.
 * It only renders AFTER the ScratchInvitationPage gate has been passed.
 * It has its own header, navigation, hero, sections, and footer.
 */
export default function WeddingWebsite({ wedding, apiBase, onRefresh }) {
  const [languageMode, setLanguageMode] = useState(wedding?.language_mode || 'both');

  const formattedDate = new Date(wedding.wedding_date).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const hasGallery = wedding.gallery_images?.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      className="min-h-screen bg-[#FFF7F9] text-[#8F3045] overflow-x-hidden"
    >
      {/* ── Sticky Navigation ── */}
      <WebsiteNavigation
        groomName={wedding.groom_name}
        brideName={wedding.bride_name}
        languageMode={languageMode}
        onLanguageChange={setLanguageMode}
      />

      {/* ── Sections ── */}
      <HomeSection
        id="home"
        wedding={wedding}
        formattedDate={formattedDate}
      />

      <FamilySection
        id="family"
        couple={wedding.couple_details}
        families={wedding.families}
        languageMode={languageMode}
      />

      <MarriageSection
        id="marriage"
        marriage={wedding.marriage_details}
        groomName={wedding.groom_name}
        brideName={wedding.bride_name}
        languageMode={languageMode}
      />

      <ReceptionSection
        id="reception"
        reception={wedding.reception_details}
        groomName={wedding.groom_name}
        brideName={wedding.bride_name}
        languageMode={languageMode}
      />

      <VenueSection
        id="venue"
        marriage={wedding.marriage_details}
        reception={wedding.reception_details}
      />

      {hasGallery && (
        <GallerySection
          id="gallery"
          images={wedding.gallery_images}
        />
      )}

      {/* ── Blessings (replaces RSVP) ── */}
      <BlessingsSection
        id="blessings"
        slug={wedding.slug}
        wishes={wedding.guest_wishes}
        apiBase={apiBase}
        onWishAdded={onRefresh}
        languageMode={languageMode}
        groomName={wedding.groom_name}
        brideName={wedding.bride_name}
      />

      {/* ── Footer ── */}
      <footer className="py-14 border-t border-[#FCE4E8] text-center space-y-3 bg-gradient-to-b from-[#FFF7F9] to-[#FCE4E8]">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E85D75] to-[#B83A53] mx-auto flex items-center justify-center shadow-md text-white">
          <span className="font-serif text-[11px] font-bold tracking-wider">
            {wedding.groom_name?.[0]} &amp; {wedding.bride_name?.[0]}
          </span>
        </div>
        <p className="font-tamil text-sm text-[#8F3045]/70">
          {wedding.opening_blessing || '॥ ஸ்ரீ விநாயகர் துணை ॥'}
        </p>
        <p className="font-serif italic text-base text-[#8F3045]">
          {wedding.groom_name} &amp; {wedding.bride_name}
        </p>
        <p className="text-[11px] tracking-[0.25em] text-[#8F3045]/60 uppercase font-medium">
          {formattedDate}
        </p>
        <p className="text-[10px] tracking-widest text-[#8F3045]/50 uppercase mt-4">
          With the blessings of our families
        </p>
      </footer>

      {/* ── Floating Controls ── */}
      <WhatsAppShare
        groomName={wedding.groom_name}
        brideName={wedding.bride_name}
        weddingDate={formattedDate}
        slug={wedding.slug}
      />

      <MusicPlayer
        musicUrl={wedding.music_url}
        enabled={wedding.music_enabled}
      />
    </motion.div>
  );
}
