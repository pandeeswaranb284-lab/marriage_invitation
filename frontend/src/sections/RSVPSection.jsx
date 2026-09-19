import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Users, Phone, Mail, MessageSquare, Heart } from 'lucide-react';

export default function RSVPSection({ id, slug, apiBase }) {
  const [form, setForm] = useState({
    guest_name: '',
    phone: '',
    email: '',
    attending: true,
    guest_count: 1,
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [error,      setError]      = useState('');

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.guest_name.trim()) { setError('Please enter your name.'); return; }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${apiBase}/weddings/public/${slug}/rsvp`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Could not submit RSVP. Please try again.');
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id={id}
      className="relative py-20 md:py-28 px-4 bg-[#FFF7F9] scroll-mt-[70px]"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vh] bg-[#FCE4E8] opacity-60 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-2 mb-10"
        >
          <span className="font-cinzel text-[11px] tracking-[0.3em] text-[#8F3045]/70 font-semibold uppercase">
            Confirm Your Presence
          </span>
          <h2 className="font-serif italic text-3xl md:text-5xl font-bold text-[#8F3045]">
            RSVP
          </h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="w-12 h-[1px] bg-[#E85D75]/30" />
            <Heart className="w-3 h-3 fill-[#E85D75] text-[#E85D75]" />
            <div className="w-12 h-[1px] bg-[#E85D75]/30" />
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {submitted ? (
            /* Success state */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-14 space-y-4 rounded-3xl bg-white/90 border border-[#FCE4E8] shadow-[0_8px_30px_rgba(232,93,117,0.1)] p-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <CheckCircle className="w-16 h-16 text-[#E85D75] mx-auto" />
              </motion.div>
              <h3 className="font-serif text-2xl font-bold text-[#8F3045]">Thank You!</h3>
              <p className="font-serif italic text-base text-[#8F3045]/80 max-w-xs mx-auto">
                {form.attending
                  ? 'We are delighted that you will join us. Your presence will make this day even more special.'
                  : 'We understand, and are grateful for your kind regards. You will be missed.'}
              </p>
              <p className="font-tamil text-sm text-[#E85D75]">॥ நன்றி ॥</p>
            </motion.div>
          ) : (
            /* Form */
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="rounded-3xl bg-white/95 border border-[#FCE4E8] p-6 md:p-8 space-y-5 shadow-[0_10px_35px_rgba(232,93,117,0.1)]"
            >
              {/* Guest name */}
              <div className="space-y-1.5">
                <label className="font-cinzel text-[10px] font-semibold tracking-wider text-[#8F3045]/80 uppercase block">
                  Guest Name *
                </label>
                <input
                  type="text"
                  value={form.guest_name}
                  onChange={e => update('guest_name', e.target.value)}
                  placeholder="Your full name"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#FFF7F9] border border-[#FCE4E8] text-[#8F3045] placeholder-[#8F3045]/40 font-sans text-sm focus:outline-none focus:border-[#E85D75] focus:ring-2 focus:ring-[#E85D75]/20 transition-all"
                />
              </div>

              {/* Mobile + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-cinzel text-[10px] font-semibold tracking-wider text-[#8F3045]/80 uppercase block">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8F3045]/50" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => update('phone', e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-4 py-3 rounded-xl bg-[#FFF7F9] border border-[#FCE4E8] text-[#8F3045] placeholder-[#8F3045]/40 font-sans text-sm focus:outline-none focus:border-[#E85D75] focus:ring-2 focus:ring-[#E85D75]/20 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="font-cinzel text-[10px] font-semibold tracking-wider text-[#8F3045]/80 uppercase block">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8F3045]/50" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => update('email', e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-9 pr-4 py-3 rounded-xl bg-[#FFF7F9] border border-[#FCE4E8] text-[#8F3045] placeholder-[#8F3045]/40 font-sans text-sm focus:outline-none focus:border-[#E85D75] focus:ring-2 focus:ring-[#E85D75]/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Attendance */}
              <div className="space-y-2">
                <label className="font-cinzel text-[10px] font-semibold tracking-wider text-[#8F3045]/80 uppercase block">
                  Will You Attend?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { val: true,  label: '✓  Yes, I will attend' },
                    { val: false, label: '✕  Sorry, I cannot attend' },
                  ].map(({ val, label }) => (
                    <button
                      key={String(val)}
                      type="button"
                      onClick={() => update('attending', val)}
                      className={`py-3 px-4 rounded-xl font-cinzel text-xs font-semibold tracking-wider border transition-all ${
                        form.attending === val
                          ? val
                            ? 'bg-[#E85D75] border-[#E85D75] text-white shadow-sm'
                            : 'bg-[#8F3045] border-[#8F3045] text-white'
                          : 'bg-[#FFF7F9] border-[#FCE4E8] text-[#8F3045]/60 hover:border-[#E85D75]/40'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guest count */}
              {form.attending && (
                <div className="space-y-1.5">
                  <label className="font-cinzel text-[10px] font-semibold tracking-wider text-[#8F3045]/80 uppercase block">
                    Number of Guests
                  </label>
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-[#8F3045]/60" />
                    <div className="flex items-center gap-2">
                      {[1,2,3,4,5,6].map(n => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => update('guest_count', n)}
                          className={`w-9 h-9 rounded-lg font-cinzel text-sm font-semibold border transition-all ${
                            form.guest_count === n
                              ? 'bg-[#E85D75] border-[#E85D75] text-white shadow-sm'
                              : 'bg-[#FFF7F9] border-[#FCE4E8] text-[#8F3045]/70 hover:border-[#E85D75]/40'
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Message */}
              <div className="space-y-1.5">
                <label className="font-cinzel text-[10px] font-semibold tracking-wider text-[#8F3045]/80 uppercase block">
                  Message (Optional)
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-[#8F3045]/50" />
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={e => update('message', e.target.value)}
                    placeholder="A warm message for the couple..."
                    className="w-full pl-9 pr-4 py-3 rounded-xl bg-[#FFF7F9] border border-[#FCE4E8] text-[#8F3045] placeholder-[#8F3045]/40 font-sans text-sm focus:outline-none focus:border-[#E85D75] focus:ring-2 focus:ring-[#E85D75]/20 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-[#E11D48] font-sans text-xs text-center">{error}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#E85D75] to-[#E11D48] text-white font-cinzel font-bold text-sm tracking-widest uppercase shadow-[0_4px_18px_rgba(232,93,117,0.35)] hover:brightness-105 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Confirming…' : 'CONFIRM ATTENDANCE'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
