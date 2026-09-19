import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Send, Users, User, Phone, Mail } from 'lucide-react';
import { KolamDivider } from './Ornaments';
import { API_BASE } from '../services/api';

export default function RSVPForm({ slug = "arun-priya", apiBase = API_BASE }) {
  const [formData, setFormData] = useState({
    guest_name: '',
    phone: '',
    email: '',
    attending: true,
    guest_count: 1,
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.guest_name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch(`${apiBase}/weddings/public/${slug}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit RSVP');
      }

      setIsSuccess(true);
    } catch (err) {
      setErrorMessage('Could not record your RSVP. Please try again or reach out directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-2">
      <div className="text-center space-y-2 mb-8">
        <span className="font-cinzel text-[10px] tracking-[0.3em] text-gold-400 uppercase">
          Kindly Respond
        </span>
        <h2 className="font-cinzel text-2xl md:text-4xl font-bold gold-text-gradient">
          YOUR PRESENCE MATTERS
        </h2>
        <p className="font-serif italic text-sm md:text-base text-gold-200/90 max-w-md mx-auto">
          We would be truly honoured by your presence and blessings at our wedding celebrations.
        </p>
        <KolamDivider className="mx-auto my-3 text-gold-500" />
      </div>

      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-2xl bg-gradient-to-b from-navy-900 to-navy-950 border-2 border-gold-400/60 text-center space-y-4 shadow-royal"
          >
            <CheckCircle2 className="w-12 h-12 text-gold-400 mx-auto animate-pulse" />
            <h3 className="font-serif text-2xl font-bold text-white">
              Thank you. Your response has been received.
            </h3>
            <p className="font-sans text-sm text-gold-200/90 leading-relaxed">
              We look forward to celebrating this sacred beginning with you and your family!
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                setFormData({
                  guest_name: '',
                  phone: '',
                  email: '',
                  attending: true,
                  guest_count: 1,
                  message: '',
                });
              }}
              className="mt-4 px-6 py-2 rounded-full border border-gold-500/40 text-xs font-cinzel text-gold-300 hover:bg-gold-500/10 transition-colors uppercase tracking-widest"
            >
              Submit another response
            </button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            className="p-6 md:p-8 rounded-2xl bg-gradient-to-b from-navy-900/90 to-navy-950/95 border border-gold-400/40 shadow-royal space-y-5 text-left font-sans"
          >
            {/* Name */}
            <div>
              <label className="block text-xs font-cinzel tracking-wider text-gold-300 uppercase mb-1.5">
                Your Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Sundaram & Family"
                  value={formData.guest_name}
                  onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-navy-950 border border-gold-500/40 text-white placeholder-gold-500/30 text-sm focus:outline-none focus:border-gold-400"
                />
                <User className="w-4 h-4 text-gold-400/60 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Attendance Toggle */}
            <div>
              <label className="block text-xs font-cinzel tracking-wider text-gold-300 uppercase mb-2">
                Will you be attending? *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, attending: true })}
                  className={`py-2.5 px-4 rounded-lg font-cinzel text-xs tracking-wider font-semibold border transition-all ${
                    formData.attending
                      ? "bg-gradient-to-r from-gold-600 to-gold-500 text-navy-950 border-gold-300 shadow-gold-glow"
                      : "bg-navy-950 text-gold-300/70 border-gold-500/30 hover:border-gold-400/50"
                  }`}
                >
                  ✓ Yes, I will attend
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, attending: false })}
                  className={`py-2.5 px-4 rounded-lg font-cinzel text-xs tracking-wider font-semibold border transition-all ${
                    !formData.attending
                      ? "bg-gradient-to-r from-burgundy-800 to-burgundy-700 text-white border-gold-300 shadow-md"
                      : "bg-navy-950 text-gold-300/70 border-gold-500/30 hover:border-gold-400/50"
                  }`}
                >
                  ✗ Sorry, I cannot attend
                </button>
              </div>
            </div>

            {/* Number of Guests (if attending) */}
            {formData.attending && (
              <div>
                <label className="block text-xs font-cinzel tracking-wider text-gold-300 uppercase mb-1.5">
                  Number of Guests
                </label>
                <div className="relative">
                  <select
                    value={formData.guest_count}
                    onChange={(e) => setFormData({ ...formData, guest_count: parseInt(e.target.value) || 1 })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-navy-950 border border-gold-500/40 text-white text-sm focus:outline-none focus:border-gold-400 appearance-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num} className="bg-navy-950 text-white">
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                  <Users className="w-4 h-4 text-gold-400/60 absolute left-3.5 top-3 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Contact Phone & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-cinzel tracking-wider text-gold-300/80 uppercase mb-1.5">
                  Contact Phone (Optional)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-navy-950 border border-gold-500/40 text-white placeholder-gold-500/30 text-sm focus:outline-none focus:border-gold-400"
                  />
                  <Phone className="w-4 h-4 text-gold-400/60 absolute left-3.5 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-cinzel tracking-wider text-gold-300/80 uppercase mb-1.5">
                  Email (Optional)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="guest@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-navy-950 border border-gold-500/40 text-white placeholder-gold-500/30 text-sm focus:outline-none focus:border-gold-400"
                  />
                  <Mail className="w-4 h-4 text-gold-400/60 absolute left-3.5 top-2.5" />
                </div>
              </div>
            </div>

            {/* Message / Blessings */}
            <div>
              <label className="block text-xs font-cinzel tracking-wider text-gold-300 uppercase mb-1.5">
                Message or Blessings for the Family
              </label>
              <textarea
                rows="3"
                placeholder="Share your warm thoughts..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-navy-950 border border-gold-500/40 text-white placeholder-gold-500/30 text-sm focus:outline-none focus:border-gold-400"
              />
            </div>

            {errorMessage && (
              <p className="text-red-400 text-xs font-sans text-center">{errorMessage}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 text-navy-950 font-cinzel font-bold text-xs tracking-widest uppercase hover:brightness-110 shadow-gold-glow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'CONFIRMING...' : 'CONFIRM ATTENDANCE'}</span>
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
