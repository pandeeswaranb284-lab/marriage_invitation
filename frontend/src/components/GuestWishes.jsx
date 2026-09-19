import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Heart, MessageSquareHeart, CheckCircle2 } from 'lucide-react';
import { KolamDivider } from './Ornaments';
import { API_BASE } from '../services/api';

export default function GuestWishes({
  slug = "arun-priya",
  wishes = [],
  apiBase = API_BASE,
  onWishAdded,
}) {
  const [guestName, setGuestName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusNotice, setStatusNotice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!guestName.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setStatusNotice('');

    try {
      const response = await fetch(`${apiBase}/weddings/public/${slug}/wishes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guest_name: guestName, message }),
      });

      if (!response.ok) throw new Error('Failed to submit wish');

      setStatusNotice('Thank you! Your heartfelt blessing has been shared.');
      setGuestName('');
      setMessage('');
      if (onWishAdded) onWishAdded();
    } catch (err) {
      setStatusNotice('Could not send blessings. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 py-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="font-cinzel text-[10px] tracking-[0.3em] text-gold-400 uppercase">
          Prayers & Well Wishes
        </span>
        <h2 className="font-cinzel text-2xl md:text-4xl font-bold gold-text-gradient">
          BLESSINGS FOR THE COUPLE
        </h2>
        <KolamDivider className="mx-auto my-3 text-gold-500" />
      </div>

      {/* Submission Form */}
      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-2xl bg-navy-950/80 border border-gold-400/40 shadow-royal space-y-4 max-w-xl mx-auto text-left"
      >
        <div>
          <label className="block text-xs font-cinzel tracking-wider text-gold-300 uppercase mb-1.5">
            Your Name / Family Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Ramesh Kumar & Family"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-navy-900 border border-gold-500/40 text-white placeholder-gold-500/30 text-sm focus:outline-none focus:border-gold-400"
          />
        </div>

        <div>
          <label className="block text-xs font-cinzel tracking-wider text-gold-300 uppercase mb-1.5">
            Your Blessing or Message
          </label>
          <textarea
            rows="3"
            required
            placeholder="Wishing the bride and groom lifelong happiness, peace, and prosperity..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-navy-900 border border-gold-500/40 text-white placeholder-gold-500/30 text-sm focus:outline-none focus:border-gold-400"
          />
        </div>

        {statusNotice && (
          <p className="text-gold-300 text-xs text-center font-sans">{statusNotice}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 text-navy-950 font-cinzel font-bold text-xs tracking-widest uppercase hover:brightness-110 shadow-gold-glow transition-all flex items-center justify-center space-x-2"
        >
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? 'SENDING...' : 'SEND BLESSINGS'}</span>
        </button>
      </form>

      {/* Approved Wishes Cards */}
      {wishes && wishes.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-cinzel text-xs tracking-[0.25em] text-gold-400/80 uppercase text-center">
            Heartfelt Wishes from Family & Friends
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wishes.map((wish, index) => (
              <motion.div
                key={wish.id || index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="p-5 rounded-xl bg-gradient-to-b from-navy-900/90 to-navy-950/90 border border-gold-400/30 shadow-md text-left flex flex-col justify-between"
              >
                <p className="font-serif italic text-sm md:text-base text-gold-100/95 leading-relaxed">
                  "{wish.message}"
                </p>
                <div className="mt-4 pt-3 border-t border-gold-500/20 flex items-center justify-between">
                  <span className="font-cinzel text-xs font-semibold text-gold-400">
                    {wish.guest_name}
                  </span>
                  <span className="text-[10px] text-gold-300/60 font-sans">
                    {new Date(wish.created_at).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
