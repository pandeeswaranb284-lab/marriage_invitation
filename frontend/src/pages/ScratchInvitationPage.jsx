import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

/**
 * ScratchInvitationPage
 *
 * Soft pink and white invitation entry experience:
 * 1. Initial Screen: Soft pink (#FFF7F9) and white background with floating rose petals.
 *    Center heart has a delicate ROSE BLUSH scratch coat with "SCRATCH THE HEART".
 * 2. Canvas Scratch: As user scratches, the rose blush layer dissolves to reveal the real
 *    velvety red rose petal heart underneath.
 * 3. Arrow Sequence: At ~58% scratched, the Rose-Gold Cupid Arrow (blooming red rose bud
 *    with leaves at bottom-left, green stem, and metallic rose-gold arrowhead at top-right)
 *    flies in from the left-bottom on the BACK SIDE of the heart (z-index: 10, heart at z-index: 20).
 * 4. Heart Impact: Heart scales up, pulses with radiant rose luminescence and center impact flash.
 * 5. Heart Burst: Heart bursts into organic flying red rose petals and glowing sparkles.
 * 6. Automatic Opening: Smooth transition -> onOpen() -> Wedding Website appears.
 *
 * NO "Open Website" button. Fully automated, cinematic, and responsive.
 */

const HEART_SVG_PATH =
  'M 150 85 C 150 40, 110 5, 65 5 C 29 5, 0 34, 0 75 C 0 145, 95 205, 150 255 C 205 205, 300 145, 300 75 C 300 34, 271 5, 235 5 C 190 5, 150 40, 150 85 Z';

export default function ScratchInvitationPage({ wedding, onOpen }) {
  // Stages: 'scratch' -> 'arrow' -> 'impact' -> 'burst' -> 'opening' -> call onOpen()
  const [stage, setStage] = useState('scratch');
  const [hasStarted, setHasStarted] = useState(false);
  const [revealedPct, setRevealedPct] = useState(0);
  const [scratchParticles, setScratchParticles] = useState([]);
  const [burstParticles, setBurstParticles] = useState([]);

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const isInteracting = useRef(false);
  const stageRef = useRef(stage);
  stageRef.current = stage;

  const groomName = wedding?.groom_name || 'Arun Sundaram';
  const brideName = wedding?.bride_name || 'Priya Meenakshi';

  const groomFirst = groomName.split(' ')[0] || groomName;
  const brideFirst = brideName.split(' ')[0] || brideName;

  // ── 1. Draw Canvas Scratch Coat with Delicate Rose Blush Texture ───────────
  const drawScratchCoat = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const W = rect.width;
    const H = rect.height;

    ctx.clearRect(0, 0, W, H);

    // Load rose petal heart to mask the canvas to the exact outline of the petals
    const heartImg = new Image();
    heartImg.src = '/assets/rose_petal_heart_tight.png';

    const renderRoseBlushCoat = () => {
      ctx.save();

      // Clip to heart outline
      if (heartImg.complete && heartImg.naturalWidth > 0) {
        ctx.drawImage(heartImg, 0, 0, W, H);
        ctx.globalCompositeOperation = 'source-in';
      } else {
        const scaleX = W / 300;
        const scaleY = H / 270;
        ctx.scale(scaleX, scaleY);
        const heartPath = new Path2D(HEART_SVG_PATH);
        ctx.clip(heartPath);
        ctx.scale(1 / scaleX, 1 / scaleY);
      }

      // Base: Delicate Rose Blush Gradient (soft romantic pastel blush pink)
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, '#feeaf0');
      grad.addColorStop(0.28, '#fbcfe8');
      grad.addColorStop(0.65, '#f472b6');
      grad.addColorStop(1, '#e85d75');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Rose blush petal texture strokes (soft chalk & pastel lines)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1.6;
      for (let i = -W; i < W * 2; i += 9) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + H * 0.7, H);
        ctx.stroke();
      }

      ctx.strokeStyle = 'rgba(232, 93, 117, 0.16)';
      ctx.lineWidth = 1.2;
      for (let i = 0; i < W * 2; i += 13) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i - H * 0.5, H);
        ctx.stroke();
      }

      // Rose blush pearl shimmer dust
      for (let i = 0; i < 280; i++) {
        const px = Math.random() * W;
        const py = Math.random() * H;
        const pr = Math.random() * 1.5;
        ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 255, 255, 0.55)' : 'rgba(254, 215, 226, 0.4)';
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fill();
      }

      // Rose blush highlight rim
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 2;
      ctx.strokeRect(4, 4, W - 8, H - 8);

      // Centered "SCRATCH THE HEART" on Rose Blush Surface
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#8F3045';
      ctx.font = `700 ${Math.max(13, W * 0.054)}px "Cinzel", "Plus Jakarta Sans", sans-serif`;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      ctx.shadowBlur = 6;
      ctx.fillText('SCRATCH', W / 2, H * 0.42);
      ctx.fillText('THE HEART', W / 2, H * 0.53);

      ctx.shadowBlur = 0;
      ctx.restore();
    };

    if (heartImg.complete) {
      renderRoseBlushCoat();
    } else {
      heartImg.onload = renderRoseBlushCoat;
      heartImg.onerror = renderRoseBlushCoat;
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(drawScratchCoat, 60);
    const handleResize = () => drawScratchCoat();
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', handleResize);
    };
  }, [drawScratchCoat]);

  // ── 2. Measure Scratch Percentage ──────────────────────────────────────────
  const measureReveal = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || stageRef.current !== 'scratch') return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const W = canvas.width;
    const H = canvas.height;
    const step = 14;
    let totalHeartPixels = 0;
    let clearedHeartPixels = 0;

    try {
      const data = ctx.getImageData(0, 0, W, H).data;
      for (let y = Math.floor(H * 0.15); y < H * 0.85; y += step) {
        for (let x = Math.floor(W * 0.15); x < W * 0.85; x += step) {
          const alpha = data[(y * W + x) * 4 + 3];
          totalHeartPixels++;
          if (alpha < 60) {
            clearedHeartPixels++;
          }
        }
      }

      const pct = Math.min(100, Math.round((clearedHeartPixels / totalHeartPixels) * 100));
      setRevealedPct(pct);

      // Trigger ARROW transition when ~58% scratched
      if (pct >= 58 && stageRef.current === 'scratch') {
        stageRef.current = 'arrow';
        setStage('arrow');
      }
    } catch (_) {
      // Sandbox fallback
    }
  }, []);

  // ── 3. Handle Pointer / Touch Scratching ────────────────────────────────────
  const getXY = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches?.[0] || e.changedTouches?.[0];
    return {
      x: (touch?.clientX ?? e.clientX) - rect.left,
      y: (touch?.clientY ?? e.clientY) - rect.top,
    };
  };

  const spawnScratchParticles = (x, y) => {
    const newParticles = Array.from({ length: 4 }).map(() => ({
      id: Math.random(),
      x: x + (Math.random() - 0.5) * 22,
      y: y + (Math.random() - 0.5) * 22,
      size: 5 + Math.random() * 8,
      color: Math.random() > 0.4 ? '#E11D48' : '#F472B6',
      type: Math.random() > 0.5 ? 'petal' : 'sparkle',
      angle: Math.random() * Math.PI * 2,
    }));
    setScratchParticles((prev) => [...prev.slice(-22), ...newParticles]);
  };

  const scratch = useCallback(
    (e) => {
      if (stageRef.current !== 'scratch') return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      const dpr = window.devicePixelRatio || 1;
      const { x, y } = getXY(e);
      const rect = canvas.getBoundingClientRect();
      const brushR = Math.max(26, Math.min(rect.width, rect.height) * 0.088);

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.globalCompositeOperation = 'destination-out';

      // Circular feather eraser
      const rg = ctx.createRadialGradient(x, y, brushR * 0.25, x, y, brushR);
      rg.addColorStop(0, 'rgba(0,0,0,1)');
      rg.addColorStop(0.7, 'rgba(0,0,0,0.85)');
      rg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.arc(x, y, brushR, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (!hasStarted) setHasStarted(true);
      spawnScratchParticles(x, y);

      if (Math.random() > 0.35) {
        measureReveal();
      }
    },
    [hasStarted, measureReveal]
  );

  const onPointerDown = (e) => {
    if (stageRef.current !== 'scratch') return;
    if (e.cancelable) e.preventDefault();
    isInteracting.current = true;
    scratch(e);
  };

  const onPointerMove = (e) => {
    if (!isInteracting.current || stageRef.current !== 'scratch') return;
    if (e.cancelable) e.preventDefault();
    scratch(e);
  };

  const onPointerUp = () => {
    isInteracting.current = false;
    measureReveal();
  };

  // ── 4. Generate Flying Rose Petals for Burst Stage ──────────────────────────
  const initBurst = useCallback(() => {
    const count = 75;
    const particles = [];
    const colors = ['#be123c', '#e11d48', '#f43f5e', '#fb7185', '#fda4af', '#9f1239'];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 150 + Math.random() * 380;
      const size = 12 + Math.random() * 26;

      particles.push({
        id: i,
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
        size,
        color: colors[i % colors.length],
        rotation: (Math.random() - 0.5) * 800,
        delay: Math.random() * 0.12,
        duration: 0.9 + Math.random() * 0.5,
      });
    }
    setBurstParticles(particles);
  }, []);

  // ── 5. State Machine: Arrow -> Impact -> Burst -> Opening ───────────────────
  useEffect(() => {
    if (stage === 'arrow') {
      const timer = setTimeout(() => {
        setStage('impact');
      }, 850);
      return () => clearTimeout(timer);
    }

    if (stage === 'impact') {
      const timer = setTimeout(() => {
        initBurst();
        setStage('burst');
      }, 450);
      return () => clearTimeout(timer);
    }

    if (stage === 'burst') {
      const timer = setTimeout(() => {
        setStage('opening');
      }, 880);
      return () => clearTimeout(timer);
    }

    if (stage === 'opening') {
      const timer = setTimeout(() => {
        onOpen();
      }, 1450);
      return () => clearTimeout(timer);
    }
  }, [stage, initBurst, onOpen]);

  // Floating background rose petals (matching the uploaded image background)
  const floatingPetals = [
    { top: '8%', left: '10%', size: 28, rot: 15, delay: 0, dur: 5 },
    { top: '15%', right: '14%', size: 34, rot: -25, delay: 1, dur: 6 },
    { top: '38%', left: '7%', size: 22, rot: 45, delay: 2, dur: 4.5 },
    { top: '55%', right: '8%', size: 30, rot: -15, delay: 1.5, dur: 5.5 },
    { top: '78%', left: '14%', size: 26, rot: 30, delay: 0.5, dur: 6.2 },
    { top: '74%', right: '18%', size: 24, rot: -40, delay: 2.5, dur: 5 },
  ];

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 overflow-hidden bg-[#FFF7F9] flex flex-col items-center justify-between py-8 px-4 select-none touch-none"
      style={{ touchAction: 'none' }}
    >
      {/* ── Background Soft Pink Accents, Floating Petals & Ambient Glows ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[650px] h-[90vw] max-h-[650px] rounded-full bg-gradient-to-br from-[#FCE4E8] via-[#FFF0F3] to-transparent opacity-80 blur-[90px]" />

        {/* Floating realistic rose petals in the background */}
        {floatingPetals.map((p, idx) => (
          <motion.div
            key={idx}
            style={{
              position: 'absolute',
              top: p.top,
              left: p.left,
              right: p.right,
              width: p.size,
              height: p.size * 0.75,
              borderRadius: '55% 15% 55% 15%',
              backgroundColor: '#e11d48',
              opacity: 0.28,
              filter: 'blur(0.5px)',
            }}
            animate={{
              y: [-12, 14, -12],
              x: [-8, 8, -8],
              rotate: [p.rot - 15, p.rot + 15, p.rot - 15],
              opacity: [0.22, 0.42, 0.22],
            }}
            transition={{
              repeat: Infinity,
              duration: p.dur,
              delay: p.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* ── TOP: YOU ARE INVITED ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative z-10 text-center flex flex-col items-center gap-1 mt-2"
      >
        <span className="text-[11px] sm:text-xs font-semibold tracking-[0.26em] text-[#8F3045]/80 uppercase">
          You Are Invited
        </span>
        <div className="flex items-center gap-2">
          <div className="w-8 h-[1px] bg-[#E85D75]/25" />
          <Heart className="w-3 h-3 fill-[#E85D75] text-[#E85D75]" />
          <div className="w-8 h-[1px] bg-[#E85D75]/25" />
        </div>
      </motion.div>

      {/* ── CENTER: THE ROSE PETAL HEART & ARROW EXPERIENCE ───────────────── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-lg my-auto">
        {/* Heart & Arrow Composition Wrapper */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: 'min(82vw, 340px)', aspectRatio: '896 / 810' }}
        >
          {/* 1. ROSE-GOLD CUPID ARROW ON THE BACK SIDE OF THE HEART (z-index: 10) */}
          {/* Sized at 170% and sliding in from left-bottom on the back side of the heart */}
          <AnimatePresence>
            {(stage === 'arrow' || stage === 'impact') && (
              <motion.div
                initial={{
                  x: '-85vw',
                  y: '75vh',
                  opacity: 0,
                }}
                animate={{
                  x: '0px',
                  y: '0px',
                  opacity: 1,
                }}
                transition={{
                  duration: 0.78,
                  ease: [0.2, 0.9, 0.3, 1],
                }}
                className="absolute pointer-events-none"
                style={{
                  zIndex: 10, // BACK SIDE OF THE HEART
                  width: '170%',
                  height: '170%',
                  left: '-35%',
                  top: '-35%',
                  filter: 'drop-shadow(0 16px 32px rgba(190, 18, 60, 0.42))',
                }}
              >
                {/* Rose-Gold Cupid Arrow: Blooming red rose at bottom-left, green stem behind heart, rose-gold tip at top-right */}
                <img
                  src="/assets/rose_gold_cupid_arrow.png"
                  alt="Rose Gold Cupid Arrow"
                  className="w-full h-full object-contain select-none"
                  draggable="false"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 2. Revealed Rose Petal Heart (z-index: 20, IN FRONT OF THE ARROW) */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              zIndex: 20,
              filter: 'drop-shadow(0 20px 45px rgba(225, 29, 72, 0.38))',
            }}
            animate={
              stage === 'impact'
                ? {
                    scale: [1, 1.14, 1.08],
                    filter: [
                      'drop-shadow(0 20px 45px rgba(225, 29, 72, 0.4))',
                      'drop-shadow(0 0 55px rgba(244, 63, 94, 0.95))',
                      'drop-shadow(0 0 65px rgba(255, 255, 255, 0.95))',
                    ],
                  }
                : stage === 'burst'
                ? { scale: 0, opacity: 0 }
                : {
                    scale: [1, 1.02, 1],
                  }
            }
            transition={
              stage === 'impact'
                ? { duration: 0.42, ease: 'easeOut' }
                : stage === 'burst'
                ? { duration: 0.25 }
                : { repeat: Infinity, duration: 3.2, ease: 'easeInOut' }
            }
          >
            <img
              src="/assets/rose_petal_heart_tight.png"
              alt="Rose Petal Heart"
              className="w-full h-full object-contain select-none"
              draggable="false"
            />
          </motion.div>

          {/* 3. Interactive Rose Blush Scratch Canvas Layer (z-index: 30) */}
          {stage === 'scratch' && (
            <canvas
              ref={canvasRef}
              onMouseDown={onPointerDown}
              onMouseMove={onPointerMove}
              onMouseUp={onPointerUp}
              onMouseLeave={onPointerUp}
              onTouchStart={onPointerDown}
              onTouchMove={onPointerMove}
              onTouchEnd={onPointerUp}
              className="absolute inset-0 w-full h-full cursor-pointer touch-none"
              style={{
                zIndex: 30,
                filter: 'drop-shadow(0 14px 28px rgba(244, 114, 182, 0.35))',
              }}
            />
          )}

          {/* 4. Rose Petal & Blush Dust Particles Around Pointer while Scratching */}
          {scratchParticles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ scale: 1, opacity: 0.95 }}
              animate={{
                x: Math.cos(p.angle) * 26,
                y: Math.sin(p.angle) * 26,
                scale: 0,
                opacity: 0,
                rotate: 90,
              }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="absolute pointer-events-none z-40"
              style={{
                left: p.x,
                top: p.y,
                width: p.size,
                height: p.type === 'petal' ? p.size * 0.75 : p.size,
                backgroundColor: p.color,
                borderRadius: p.type === 'petal' ? '50% 15% 50% 15%' : '50%',
                boxShadow: `0 0 10px ${p.color}`,
              }}
            />
          ))}

          {/* 5. Animated Finger/Cursor Indicator (shown before first scratch) */}
          <AnimatePresence>
            {!hasStarted && stage === 'scratch' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute z-40 pointer-events-none flex flex-col items-center"
                style={{ bottom: '22%', right: '28%' }}
              >
                <motion.div
                  animate={{
                    x: [0, -28, 15, 0],
                    y: [0, -22, 10, 0],
                    rotate: [-12, 14, -10, -12],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.8,
                    ease: 'easeInOut',
                  }}
                  className="p-2.5 rounded-full bg-white/95 text-[#E85D75] shadow-[0_4px_20px_rgba(244,114,182,0.4)] border border-[#FCE4E8]"
                >
                  <svg className="w-6 h-6 fill-[#E85D75]" viewBox="0 0 24 24">
                    <path d="M9 11.24V7.5a2.5 2.5 0 0 1 5 0v3.74c1.21-.81 2-2.18 2-3.74a4.5 4.5 0 0 0-9 0c0 1.56.79 2.93 2 3.74zm9.84 4.63l-4.54-2.26A1.5 1.5 0 0 0 12 14H9v-2.5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 .5.5H13a.5.5 0 0 0 .5-.5v-.5a.5.5 0 0 1 .5-.5h.38l4.46 2.23a1.5 1.5 0 0 0 2.06-.67l.14-.28a1.5 1.5 0 0 0-.67-2.06z" />
                  </svg>
                </motion.div>
                <span className="mt-2 text-[10px] font-bold tracking-wider text-[#8F3045] bg-white/90 px-2.5 py-0.5 rounded-full shadow-sm border border-[#FCE4E8]">
                  SCRATCH HERE
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 6. IMPACT FLASH (Stage: 'impact') */}
          {stage === 'impact' && (
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: [0, 1.8, 2.5], opacity: [1, 0.8, 0] }}
              transition={{ duration: 0.42, ease: 'easeOut' }}
              className="absolute z-50 w-28 h-28 rounded-full bg-gradient-to-r from-white via-[#FF8FAB] to-[#E11D48] blur-md pointer-events-none"
            />
          )}

          {/* 7. HEART BURST: REAL FLYING ROSE PETALS (Stage: 'burst') */}
          {stage === 'burst' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
              {burstParticles.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ x: 0, y: 0, scale: 0.4, opacity: 1, rotate: 0 }}
                  animate={{
                    x: p.x,
                    y: p.y,
                    scale: [0.4, 1.25, 0.9],
                    opacity: [1, 0.95, 0],
                    rotate: p.rotation,
                  }}
                  transition={{
                    duration: p.duration,
                    delay: p.delay,
                    ease: 'easeOut',
                  }}
                  className="absolute"
                >
                  <div
                    style={{
                      width: p.size * 1.3,
                      height: p.size * 0.9,
                      backgroundColor: p.color,
                      borderRadius: '55% 15% 55% 15%',
                      boxShadow: `0 4px 14px ${p.color}`,
                      filter: 'drop-shadow(0 2px 6px rgba(159, 18, 57, 0.5))',
                    }}
                  />
                </motion.div>
              ))}

              {/* Luminous Center Burst Pulse */}
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: [0, 3, 5], opacity: [1, 0.7, 0] }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="w-36 h-36 rounded-full bg-gradient-to-r from-white via-[#FDA4AF] to-[#E11D48] blur-lg"
              />
            </div>
          )}
        </div>
      </div>

      {/* ── BOTTOM: COUPLE NAMES & WEDDING INVITATION ────────────────────── */}
      <AnimatePresence>
        {stage !== 'opening' && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative z-10 text-center flex flex-col items-center gap-1.5 mb-3"
          >
            {/* Groom ♡ Bride */}
            <h1 className="font-serif italic text-3xl sm:text-4xl text-[#8F3045] font-semibold tracking-wide flex items-center justify-center gap-2">
              <span>{groomFirst}</span>
              <span className="text-[#E85D75] text-xl sm:text-2xl not-italic font-normal">♡</span>
              <span>{brideFirst}</span>
            </h1>

            {/* Subtitle with delicate borders */}
            <div className="flex items-center gap-3 mt-0.5">
              <div className="w-10 sm:w-14 h-[1px] bg-[#E85D75]/35" />
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.28em] text-[#8F3045]/70 uppercase">
                Wedding Invitation
              </span>
              <div className="w-10 sm:w-14 h-[1px] bg-[#E85D75]/35" />
            </div>

            <Heart className="w-2.5 h-2.5 fill-[#E85D75]/60 text-[#E85D75]/60 mt-0.5" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── STAGE: OPENING TRANSITION SCREEN ──────────────────────────────── */}
      <AnimatePresence>
        {stage === 'opening' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center text-center bg-[#FFF7F9]/95 px-6 pointer-events-none"
          >
            {/* Drifting petals in transition */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(14)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: (Math.random() - 0.5) * 320,
                    y: (Math.random() - 0.5) * 320,
                    opacity: 0.85,
                    scale: 0.6 + Math.random() * 0.6,
                  }}
                  animate={{
                    y: [(Math.random() - 0.5) * 320, (Math.random() - 0.5) * 550],
                    x: [(Math.random() - 0.5) * 320, (Math.random() - 0.5) * 550],
                    opacity: [0.85, 0],
                    rotate: [0, 220],
                  }}
                  transition={{ duration: 1.4, ease: 'easeOut' }}
                  className="absolute left-1/2 top-1/2 w-4 h-3 bg-[#E11D48]/60 rounded-[55%_15%_55%_15%]"
                />
              ))}
            </div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <p className="font-serif italic text-2xl sm:text-3xl text-[#8F3045] font-semibold">
                  Opening
                </p>
                <p className="font-serif text-lg sm:text-xl text-[#8F3045]/85 tracking-wide">
                  Our Wedding Invitation
                </p>
              </div>

              {/* Animated soft pink progress bar */}
              <div className="w-48 sm:w-56 h-1.5 bg-[#FCE4E8] rounded-full mx-auto overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.1, ease: 'easeInOut' }}
                  className="h-full bg-gradient-to-r from-[#FF8FAB] via-[#E11D48] to-[#8F3045] rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
