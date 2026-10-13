import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * FloatingFlowersAndButterflies
 * Adds enchanting ambient floating flower petals and fluttering butterflies
 * across the wedding invitation website.
 * Fully responsive, optimized with CSS hardware-accelerated transforms and pointer-events-none.
 */

// ── SVG Butterfly Component with 3D Flapping Wings ──────────────────────────
function Butterfly({ color = '#E85D75', accent = '#D4A017', size = 28 }) {
  return (
    <div
      className="relative flex items-center justify-center select-none pointer-events-none"
      style={{
        width: size,
        height: size,
        perspective: '400px',
        filter: 'drop-shadow(0 2px 6px rgba(232, 93, 117, 0.35))',
      }}
    >
      {/* Left Wing */}
      <motion.svg
        viewBox="0 0 24 24"
        className="w-1/2 h-full absolute right-1/2 origin-right"
        style={{ transformOrigin: 'right center' }}
        animate={{
          rotateY: [0, 68, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 0.28,
          ease: 'easeInOut',
        }}
      >
        <path
          d="M12 12 C10 4, 3 2, 2 8 C1 13, 6 15, 12 14 C7 15, 4 19, 6 22 C9 24, 11 18, 12 14 Z"
          fill={color}
          opacity="0.9"
        />
        <path
          d="M11 11 C9 6, 5 5, 4 9 C3 12, 7 13, 11 13 Z"
          fill={accent}
          opacity="0.8"
        />
        <circle cx="8" cy="18" r="1.5" fill={accent} opacity="0.9" />
      </motion.svg>

      {/* Right Wing */}
      <motion.svg
        viewBox="0 0 24 24"
        className="w-1/2 h-full absolute left-1/2 origin-left"
        style={{ transformOrigin: 'left center' }}
        animate={{
          rotateY: [0, -68, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 0.28,
          ease: 'easeInOut',
        }}
      >
        <path
          d="M12 12 C14 4, 21 2, 22 8 C23 13, 18 15, 12 14 C17 15, 20 19, 18 22 C15 24, 13 18, 12 14 Z"
          fill={color}
          opacity="0.9"
        />
        <path
          d="M13 11 C15 6, 19 5, 20 9 C21 12, 17 13, 13 13 Z"
          fill={accent}
          opacity="0.8"
        />
        <circle cx="16" cy="18" r="1.5" fill={accent} opacity="0.9" />
      </motion.svg>

      {/* Butterfly Body & Antennae */}
      <svg viewBox="0 0 10 24" className="w-1.5 h-full z-10" fill="#4A0E17">
        <ellipse cx="5" cy="13" rx="1.2" ry="6" fill="#4A0E17" />
        <circle cx="5" cy="6" r="1.5" fill="#3A0810" />
        <path d="M4 5 C3 2, 1 1, 0 2 M6 5 C7 2, 9 1, 10 2" stroke="#4A0E17" strokeWidth="0.8" fill="none" />
      </svg>
    </div>
  );
}

// ── SVG Blossom Flower (Jasmine / Royal Blossom) ─────────────────────────────
function FlowerBlossom({ color = '#FFB5C5', center = '#D4A017', size = 20 }) {
  return (
    <svg
      viewBox="0 0 40 40"
      style={{ width: size, height: size }}
      className="select-none pointer-events-none drop-shadow-sm"
    >
      {/* 5 Organic Petals */}
      <circle cx="20" cy="11" r="7" fill={color} opacity="0.88" />
      <circle cx="28.5" cy="17" r="7" fill={color} opacity="0.88" />
      <circle cx="25" cy="28" r="7" fill={color} opacity="0.88" />
      <circle cx="15" cy="28" r="7" fill={color} opacity="0.88" />
      <circle cx="11.5" cy="17" r="7" fill={color} opacity="0.88" />
      {/* Golden Center */}
      <circle cx="20" cy="20" r="4.2" fill={center} />
      <circle cx="20" cy="20" r="2.2" fill="#FFF7ED" opacity="0.9" />
    </svg>
  );
}

// ── Organic Rose Petal ───────────────────────────────────────────────────────
function RosePetal({ color = '#E11D48', size = 18 }) {
  return (
    <div
      style={{
        width: size,
        height: size * 1.35,
        backgroundColor: color,
        borderRadius: '50% 15% 50% 15%',
        boxShadow: `0 2px 8px ${color}33`,
        transform: 'rotate(-25deg)',
      }}
      className="select-none pointer-events-none"
    />
  );
}

// ── Main Floating Experience ────────────────────────────────────────────────
export default function FloatingFlowersAndButterflies({
  butterflyCount = 4,
  flowerCount = 8,
  petalCount = 10,
}) {
  // Generate random stable properties for butterflies
  const butterflies = useMemo(() => {
    return Array.from({ length: butterflyCount }, (_, i) => ({
      id: `butterfly-${i}`,
      size: 26 + (i % 3) * 6,
      startX: `${8 + (i * 24) % 84}vw`,
      startY: `${15 + (i * 22) % 75}vh`,
      flyPathX: [0, 45, -35, 60, 0].map(v => v * ((i % 2 === 0 ? 1 : -1))),
      flyPathY: [0, -65, 40, -80, 0],
      duration: 14 + i * 4,
      delay: i * 2.5,
      color: i % 2 === 0 ? '#E85D75' : '#D4A017',
      accent: i % 2 === 0 ? '#FDE047' : '#F43F5E',
    }));
  }, [butterflyCount]);

  // Generate random stable properties for falling flowers
  const flowers = useMemo(() => {
    const colors = ['#FFC0CB', '#FFE4E6', '#FDE047', '#FDA4AF', '#FFF1F2'];
    return Array.from({ length: flowerCount }, (_, i) => ({
      id: `flower-${i}`,
      left: `${(i * 12 + 4) % 94}%`,
      size: 16 + (i % 4) * 4,
      color: colors[i % colors.length],
      duration: 12 + (i % 5) * 3,
      delay: i * 1.8,
      sway: 35 + (i % 3) * 20,
    }));
  }, [flowerCount]);

  // Generate random stable properties for falling petals
  const petals = useMemo(() => {
    const colors = ['#E11D48', '#F43F5E', '#FB7185', '#BE123C', '#E85D75'];
    return Array.from({ length: petalCount }, (_, i) => ({
      id: `petal-${i}`,
      left: `${(i * 10 + 7) % 96}%`,
      size: 14 + (i % 3) * 4,
      color: colors[i % colors.length],
      duration: 10 + (i % 4) * 3.5,
      delay: i * 1.3,
      sway: 40 + (i % 3) * 25,
    }));
  }, [petalCount]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-10"
      style={{ contain: 'paint' }}
    >
      {/* ── 1. Floating Falling Blossoms ── */}
      {flowers.map((fl) => (
        <motion.div
          key={fl.id}
          className="absolute -top-12"
          style={{ left: fl.left }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, fl.sway, -fl.sway, fl.sway * 0.5, 0],
            rotate: [0, 180, 360],
            opacity: [0, 0.85, 0.9, 0.7, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: fl.duration,
            delay: fl.delay,
            ease: 'linear',
          }}
        >
          <FlowerBlossom color={fl.color} size={fl.size} />
        </motion.div>
      ))}

      {/* ── 2. Floating Rose Petals ── */}
      {petals.map((pt) => (
        <motion.div
          key={pt.id}
          className="absolute -top-10"
          style={{ left: pt.left }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, -pt.sway, pt.sway * 0.7, -pt.sway * 0.4, 0],
            rotate: [0, -140, 240, -360],
            opacity: [0, 0.75, 0.85, 0.6, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: pt.duration,
            delay: pt.delay,
            ease: 'linear',
          }}
        >
          <RosePetal color={pt.color} size={pt.size} />
        </motion.div>
      ))}

      {/* ── 3. Fluttering Butterflies Gliding Across Screen ── */}
      {butterflies.map((bf) => (
        <motion.div
          key={bf.id}
          className="absolute"
          style={{
            left: bf.startX,
            top: bf.startY,
          }}
          animate={{
            x: bf.flyPathX,
            y: bf.flyPathY,
            rotate: [-8, 18, -14, 10, -8],
            opacity: [0.3, 0.95, 0.9, 0.85, 0.3],
            scale: [0.85, 1.05, 0.9, 1, 0.85],
          }}
          transition={{
            repeat: Infinity,
            duration: bf.duration,
            delay: bf.delay,
            ease: 'easeInOut',
          }}
        >
          <Butterfly color={bf.color} accent={bf.accent} size={bf.size} />
        </motion.div>
      ))}
    </div>
  );
}
