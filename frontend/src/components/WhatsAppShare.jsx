import React from 'react';
import { Share2 } from 'lucide-react';

export default function WhatsAppShare({
  groomName = "Arun",
  brideName = "Priya",
  weddingDate = "November 20, 2026",
  slug = "arun-priya",
}) {
  const handleShare = () => {
    const origin = window.location.origin;
    const url = `${origin}/invite/${slug}`;
    const text = `॥ திருமண அழைப்பிதழ் ॥\n\nYou are warmly invited to celebrate the wedding of ${groomName} and ${brideName} on ${weddingDate}. We would be delighted to have your gracious presence and blessings with our families.\n\nView the digital invitation card:\n${url}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleShare}
      title="Share invitation on WhatsApp"
      className="fixed bottom-6 right-6 z-40 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#E85D75] via-[#F43F5E] to-[#E85D75] text-white font-medium text-xs tracking-wider uppercase shadow-lg shadow-rose-300/40 flex items-center space-x-2 border border-white/50 hover:scale-105 active:scale-95 transition-all"
    >
      <Share2 className="w-4 h-4 text-white" />
      <span className="hidden sm:inline">SHARE INVITATION</span>
      <span className="sm:hidden">SHARE</span>
    </button>
  );
}
