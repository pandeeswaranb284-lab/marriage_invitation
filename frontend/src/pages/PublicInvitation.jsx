import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import ScratchInvitationPage from './ScratchInvitationPage';
import WeddingWebsite from './WeddingWebsite';
import { API_BASE } from '../services/api';
import { getInitialWeddingData, saveWeddingToCache } from '../services/weddingCache';

export default function PublicInvitation() {
  const { slug } = useParams();

  // Instant SWR initial data resolution (< 50ms FCP)
  const initialWedding = getInitialWeddingData(slug);
  const [wedding, setWedding] = useState(initialWedding);
  const [loading, setLoading] = useState(!initialWedding);
  const [error, setError] = useState(null);

  // Keep a ref to current wedding for resilient error handling
  const weddingRef = useRef(wedding);
  weddingRef.current = wedding;

  // THE GATE: false = show scratch entry only, true = show website only
  const [invitationOpened, setInvitationOpened] = useState(false);

  const fetchWedding = useCallback(async (isUserRefresh = false) => {
    const querySlug = slug || 'current';
    // Only show full-page loading if we have zero cached data to display
    if (!weddingRef.current && !isUserRefresh) {
      setLoading(true);
    }

    try {
      // SWR strategy: try edge-cached local proxy first, then direct API_BASE
      const candidateEndpoints = [];
      if (typeof window !== 'undefined') {
        candidateEndpoints.push(`/api/weddings/public/${querySlug}`);
      }
      if (API_BASE && !candidateEndpoints.includes(`${API_BASE}/weddings/public/${querySlug}`)) {
        candidateEndpoints.push(`${API_BASE}/weddings/public/${querySlug}`);
      }

      let freshData = null;
      let lastError = null;

      for (const endpoint of candidateEndpoints) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 12000);
          const res = await fetch(endpoint, { signal: controller.signal });
          clearTimeout(timeoutId);

          if (res.ok) {
            freshData = await res.json();
            break;
          }
        } catch (fetchErr) {
          lastError = fetchErr;
        }
      }

      if (freshData) {
        setWedding(freshData);
        saveWeddingToCache(querySlug, freshData);
        setError(null);

        // Auto-update browser URL bar to match the wedding's active URL name
        if (freshData.slug && freshData.slug !== slug && typeof window !== 'undefined') {
          window.history.replaceState(null, '', `/invite/${freshData.slug}`);
        }
      } else if (!weddingRef.current) {
        throw lastError || new Error('Invitation not found or not published yet.');
      }
    } catch (err) {
      // If we already have verified data displayed, do NOT break the user's view
      if (!weddingRef.current) {
        setError(err.message || 'Invitation not found or not published yet.');
      }
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchWedding();
  }, [fetchWedding]);

  useEffect(() => {
    if (wedding) {
      const groom = wedding.groom_name?.replace(/\s+/g, ' ').trim();
      const bride = wedding.bride_name?.replace(/\s+/g, ' ').trim();
      const cleanTitle = wedding.title?.replace(/\s+/g, ' ').trim();
      if (cleanTitle) {
        document.title = cleanTitle;
      } else if (groom && bride) {
        document.title = `Wedding Invitation | ${groom} & ${bride}`;
      } else {
        document.title = 'Wedding Invitation';
      }
    }
  }, [wedding]);

  // ── LOADING (Only displayed if no initial or cached data exists) ─────────
  if (loading && !wedding) {
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

  // ── ERROR (Only displayed if no wedding data could be loaded) ────────────
  if (error && !wedding) {
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
          onRefresh={() => fetchWedding(true)}
        />
      )}
    </AnimatePresence>
  );
}
