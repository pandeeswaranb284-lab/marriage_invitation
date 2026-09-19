import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Hand } from 'lucide-react';
import { CornerOrnament } from './Ornaments';

export default function ScratchReveal({
  groomName = "Arun",
  brideName = "Priya",
  monogram = "A × P",
  blessing = "॥ ஸ்ரீ விநாயகர் துணை ॥",
  onOpenInvitation,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [revealedPercent, setRevealedPercent] = useState(0);
  const [isReadyToOpen, setIsReadyToOpen] = useState(false);
  const [isScratching, setIsScratching] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const particlesRef = useRef([]);

  // Draw the initial Royal Gold/Burgundy Scratch Coat on Canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    // 1. Base Deep Royal Wine & Navy Silk Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#1c040d');
    bgGrad.addColorStop(0.5, '#2b0714');
    bgGrad.addColorStop(1, '#070c18');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Gold Shimmer Foil dust overlay
    for (let i = 0; i < 400; i++) {
      const px = Math.random() * w;
      const py = Math.random() * h;
      const pr = Math.random() * 1.5;
      ctx.fillStyle = i % 3 === 0 ? 'rgba(255, 235, 175, 0.45)' : 'rgba(197, 160, 89, 0.25)';
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Ornate Gold Borders on the Scratch Cover
    ctx.strokeStyle = 'rgba(223, 186, 115, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(12, 12, w - 24, h - 24);

    ctx.strokeStyle = 'rgba(197, 160, 89, 0.35)';
    ctx.lineWidth = 1;
    ctx.strokeRect(18, 18, w - 36, h - 36);

    // 4. Central Gold Seal Graphic
    const centerX = w / 2;
    const centerY = h * 0.44;
    const sealRadius = Math.min(w, h) * 0.18;

    // Outer Seal Shadow & Rim
    const sealGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, sealRadius);
    sealGrad.addColorStop(0, '#fbf5e7');
    sealGrad.addColorStop(0.3, '#dfba73');
    sealGrad.addColorStop(0.7, '#a88138');
    sealGrad.addColorStop(1, '#694e22');
    ctx.fillStyle = sealGrad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, sealRadius, 0, Math.PI * 2);
    ctx.fill();

    // Inner Seal Core
    ctx.fillStyle = '#1c040d';
    ctx.beginPath();
    ctx.arc(centerX, centerY, sealRadius - 6, 0, Math.PI * 2);
    ctx.fill();

    // Seal Text
    ctx.fillStyle = '#dfba73';
    ctx.font = '600 10px "Cinzel", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('ROYAL SEAL', centerX, centerY - sealRadius * 0.42);

    ctx.font = '700 18px "Cinzel", Georgia, serif';
    ctx.fillStyle = '#fef3c7';
    ctx.fillText(monogram, centerX, centerY + 5);

    ctx.font = '500 9px "Cinzel", Georgia, serif';
    ctx.fillStyle = '#dfba73';
    ctx.fillText('SACRED UNION', centerX, centerY + sealRadius * 0.48);

    // 5. Blessing Text at Top
    ctx.font = '500 13px "Noto Serif Tamil", Georgia, serif';
    ctx.fillStyle = 'rgba(223, 186, 115, 0.85)';
    ctx.fillText(blessing, centerX, 44);

    // 6. Center Card Titles
    ctx.font = '600 11px "Cinzel", serif';
    ctx.fillStyle = 'rgba(247, 231, 206, 0.7)';
    ctx.letterSpacing = '3px';
    ctx.fillText('WEDDING INVITATION', centerX, centerY + sealRadius + 42);

    ctx.font = '700 21px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${groomName}  ×  ${brideName}`, centerX, centerY + sealRadius + 74);

    // 7. Scratch Hint at Bottom
    ctx.font = '600 11px "Cinzel", sans-serif';
    ctx.fillStyle = '#dfba73';
    ctx.fillText('✦  SCRATCH TO REVEAL  ✦', centerX, h - 34);
  }, [blessing, groomName, brideName, monogram]);

  useEffect(() => {
    initCanvas();
    const handleResize = () => initCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initCanvas]);

  // Scratch Action: Eraser with Gold Sparkles
  const scratchAt = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    const x = (clientX - rect.left);
    const y = (clientY - rect.top);

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.globalCompositeOperation = 'destination-out';

    // Soft circular scratch brush
    const brushRadius = Math.max(28, Math.min(rect.width, rect.height) * 0.08);
    const radGrad = ctx.createRadialGradient(x, y, brushRadius * 0.3, x, y, brushRadius);
    radGrad.addColorStop(0, 'rgba(0,0,0,1)');
    radGrad.addColorStop(1, 'rgba(0,0,0,0.85)');
    ctx.fillStyle = radGrad;

    ctx.beginPath();
    ctx.arc(x, y, brushRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    setHasInteracted(true);

    // Calculate percentage revealed occasionally
    if (Math.random() > 0.6) {
      calculateRevealedArea();
    }
  };

  // Check transparent pixels to compute scratch percentage
  const calculateRevealedArea = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const w = canvas.width;
    const h = canvas.height;
    
    // Sample a grid of pixels for high performance (step of 16px)
    const step = 16;
    let totalChecked = 0;
    let transparentCount = 0;
    
    try {
      const imgData = ctx.getImageData(0, 0, w, h).data;
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const alphaIndex = (y * w + x) * 4 + 3;
          if (imgData[alphaIndex] < 80) {
            transparentCount++;
          }
          totalChecked++;
        }
      }
      const percent = Math.min(100, Math.round((transparentCount / totalChecked) * 100));
      setRevealedPercent(percent);

      if (percent >= 50 && !isReadyToOpen) {
        setIsReadyToOpen(true);
      }
    } catch (e) {
      // Security/browser sandbox fallback
    }
  };

  // Mouse & Touch Event Handlers
  const handlePointerDown = (e) => {
    setIsScratching(true);
    scratchAt(e.clientX || e.touches?.[0]?.clientX, e.clientY || e.touches?.[0]?.clientY);
  };

  const handlePointerMove = (e) => {
    if (!isScratching) return;
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    if (clientX && clientY) {
      scratchAt(clientX, clientY);
    }
  };

  const handlePointerUp = () => {
    setIsScratching(false);
    calculateRevealedArea();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[440px] aspect-[4/5.8] mx-auto rounded-xl p-2 select-none"
    >
      {/* Underlying Revealed Invitation Preview (Visible through scratched canvas) */}
      <div className="absolute inset-2 bg-gradient-to-b from-[#111d3d] via-[#1a2952] to-[#0b1329] rounded-lg border-2 border-gold-400/70 p-6 flex flex-col items-center justify-between text-center shadow-royal overflow-hidden">
        {/* Subtle Gold Ornaments in Corners */}
        <CornerOrnament position="top-left" className="absolute top-2 left-2 w-7 h-7 text-gold-400" />
        <CornerOrnament position="top-right" className="absolute top-2 right-2 w-7 h-7 text-gold-400" />
        <CornerOrnament position="bottom-left" className="absolute bottom-2 left-2 w-7 h-7 text-gold-400" />
        <CornerOrnament position="bottom-right" className="absolute bottom-2 right-2 w-7 h-7 text-gold-400" />

        <div className="pt-3">
          <p className="font-tamil text-xs text-gold-300 tracking-wider">
            {blessing}
          </p>
          <div className="h-[1px] w-24 mx-auto bg-gradient-to-r from-transparent via-gold-400 to-transparent mt-2" />
        </div>

        <div className="my-auto space-y-2">
          <span className="text-[11px] font-cinzel tracking-[0.3em] text-gold-300/80 uppercase">
            Together with our families
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-white font-medium">
            {groomName}
          </h2>
          <div className="text-gold-400 font-cinzel text-lg font-bold">×</div>
          <h2 className="font-serif text-3xl md:text-4xl text-white font-medium">
            {brideName}
          </h2>
          <p className="font-serif italic text-gold-200/90 text-sm max-w-xs mx-auto pt-2">
            Request the honour of your presence at the celebration of their marriage
          </p>
        </div>

        <div className="pb-3 text-center">
          <p className="font-cinzel text-[10px] tracking-[0.2em] text-gold-400 uppercase">
            A Sacred Union • Two Families
          </p>
        </div>
      </div>

      {/* Interactive HTML5 Scratch Canvas Layer */}
      <canvas
        ref={canvasRef}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] rounded-lg cursor-pointer touch-none z-20 shadow-2xl transition-opacity duration-700"
        style={{ opacity: revealedPercent >= 80 ? 0 : 1 }}
      />

      {/* Floating Interactive Guide: Animated Finger Hint (Disappears after user starts scratching) */}
      {!hasInteracted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center"
        >
          <motion.div
            animate={{
              x: [-24, 24, -24],
              rotate: [-10, 10, -10],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.2,
              ease: "easeInOut",
            }}
            className="text-gold-300 bg-navy-950/85 p-3 rounded-full border border-gold-400/60 shadow-gold-glow"
          >
            <Hand className="w-6 h-6 animate-pulse" />
          </motion.div>
          <span className="font-cinzel text-[11px] tracking-wider text-gold-200 mt-2 bg-navy-950/90 px-3 py-1 rounded-full border border-gold-500/40">
            Swipe or Scratch to Reveal
          </span>
        </motion.div>
      )}

      {/* Progress & Open Action Bar */}
      <div className="absolute -bottom-16 left-0 right-0 z-40 flex flex-col items-center space-y-2">
        <AnimatePresence>
          {(isReadyToOpen || revealedPercent >= 50) ? (
            <motion.button
              initial={{ scale: 0.8, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenInvitation}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 text-navy-950 font-cinzel font-bold text-sm tracking-widest uppercase shadow-gold-glow-lg flex items-center space-x-2 border border-gold-200 animate-pulse-subtle"
            >
              <Sparkles className="w-4 h-4 text-navy-950" />
              <span>OPEN INVITATION</span>
              <Sparkles className="w-4 h-4 text-navy-950" />
            </motion.button>
          ) : (
            <button
              onClick={onOpenInvitation}
              className="text-xs font-sans text-gold-300/80 hover:text-gold-200 underline underline-offset-4 transition-colors py-1 px-3 bg-navy-950/60 rounded-full border border-gold-500/20"
            >
              Tap here to open directly
            </button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
