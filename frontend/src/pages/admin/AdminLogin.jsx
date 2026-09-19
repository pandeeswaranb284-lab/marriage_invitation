import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { CornerOrnament } from '../../components/Ornaments';
import { API_BASE } from '../../services/api';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@wedding.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error('Invalid email or password');
      }

      const data = await res.json();
      localStorage.setItem('admin_token', data.access_token);
      localStorage.setItem('admin_email', data.email);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070c18] flex items-center justify-center p-4 relative overflow-hidden bg-silk-texture text-[#f7e7ce]">
      <div className="absolute inset-0 bg-kolam-pattern opacity-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md p-8 md:p-10 rounded-2xl bg-gradient-to-b from-navy-900/95 to-navy-950/95 border-2 border-gold-400/50 shadow-royal z-10"
      >
        <CornerOrnament position="top-left" className="absolute top-3 left-3 w-7 h-7 text-gold-400" />
        <CornerOrnament position="top-right" className="absolute top-3 right-3 w-7 h-7 text-gold-400" />
        <CornerOrnament position="bottom-left" className="absolute bottom-3 left-3 w-7 h-7 text-gold-400" />
        <CornerOrnament position="bottom-right" className="absolute bottom-3 right-3 w-7 h-7 text-gold-400" />

        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 rounded-full mx-auto bg-gradient-to-br from-gold-400 to-gold-600 p-0.5 flex items-center justify-center shadow-gold-glow">
            <div className="w-full h-full rounded-full bg-navy-950 flex items-center justify-center text-gold-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
          <h2 className="font-cinzel text-xl md:text-2xl font-bold gold-text-gradient">
            ROYAL ADMIN PORTAL
          </h2>
          <p className="font-serif italic text-xs md:text-sm text-gold-200/80">
            Manage your digital wedding invitation & guests
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-burgundy-900/80 border border-gold-500/30 text-xs text-center text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5 font-sans">
          <div>
            <label className="block text-xs font-cinzel tracking-wider text-gold-300 uppercase mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@wedding.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-navy-950 border border-gold-500/40 text-white placeholder-gold-500/30 text-sm focus:outline-none focus:border-gold-400"
              />
              <Mail className="w-4 h-4 text-gold-400/60 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-cinzel tracking-wider text-gold-300 uppercase mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-navy-950 border border-gold-500/40 text-white placeholder-gold-500/30 text-sm focus:outline-none focus:border-gold-400"
              />
              <Lock className="w-4 h-4 text-gold-400/60 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 text-navy-950 font-cinzel font-bold text-xs tracking-widest uppercase hover:brightness-110 shadow-gold-glow transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'AUTHENTICATING...' : 'ENTER DASHBOARD'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-gold-500/20 text-center">
          <p className="text-[11px] text-gold-300/60 font-sans">
            Default credentials: <strong className="text-gold-300">admin@wedding.com</strong> / <strong className="text-gold-300">admin123</strong>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
