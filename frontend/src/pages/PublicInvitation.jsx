import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import ScratchInvitationPage from './ScratchInvitationPage';
import WeddingWebsite from './WeddingWebsite';
import { API_BASE } from '../services/api';

export default function PublicInvitation() {
  const { slug } = useParams();
  const [wedding, setWedding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // THE GATE: false = show scratch entry only, true = show website only
  const [invitationOpened, setInvitationOpened] = useState(false);

  useEffect(() => {
    fetchWedding();
  }, [slug]);

  const fetchWedding = async () => {
    try {
      setLoading(true);
      const querySlug = slug || 'current';
      const res = await fetch(`${API_BASE}/weddings/public/${querySlug}`);
      if (!res.ok) throw new Error('Invitation not found or not published yet.');
      const data = await res.json();
      setWedding(data);

      // Auto-update browser URL bar to match the wedding's active URL name
      if (data.slug && data.slug !== slug) {
        window.history.replaceState(null, '', `/invite/${data.slug}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── LOADING ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#070c18] flex flex-col items-center justify-center gap-4">
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          className="w-14 h-14 rounded-full border-2 border-[#dfba73] flex items-center justify-center"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#dfba73] to-[#8c6d33]" />
        </motion.div>
        <p className="font-cinzel text-[11px] tracking-[0.3em] text-[#dfba73] uppercase">
          Preparing Your Invitation
        </p>
        <p className="font-tamil text-sm text-[#dfba73]/50">॥ ஸ்ரீ விநாயகர் துணை ॥</p>
      </div>
    );
  }

  // ── ERROR ─────────────────────────────────────────────────────────────────
  if (error || !wedding) {
    return (
      <div className="fixed inset-0 bg-[#070c18] flex flex-col items-center justify-center text-center px-6">
        <div className="w-12 h-12 rounded-full border border-[#dfba73]/40 flex items-center justify-center mb-4">
          <span className="text-[#dfba73] text-xl">✦</span>
        </div>
        <h2 className="font-cinzel text-xl text-[#dfba73] mb-2">Invitation Notice</h2>
        <p className="font-sans text-sm text-[#dfba73]/60 max-w-sm">
          {error || 'This invitation is not available at the moment.'}
        </p>
      </div>
    );
  }

  // ── TWO-LAYER GATE ────────────────────────────────────────────────────────
  // NEVER render both simultaneously.
  // invitationOpened === false → ONLY ScratchInvitationPage
  // invitationOpened === true  → ONLY WeddingWebsite
  return (
    <AnimatePresence mode="wait">
      {!invitationOpened ? (
        <ScratchInvitationPage
          key="scratch-gate"
          wedding={wedding}
          onOpen={() => setInvitationOpened(true)}
        />
      ) : (
        <WeddingWebsite
          key="wedding-website"
          wedding={wedding}
          apiBase={API_BASE}
          onRefresh={fetchWedding}
        />
      )}
    </AnimatePresence>
  );
}
