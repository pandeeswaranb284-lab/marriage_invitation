import React from 'react';

// Ornate Corner for the physical invitation card & frames
export function CornerOrnament({ className = "w-8 h-8 text-gold-500", position = "top-left" }) {
  const getTransform = () => {
    switch (position) {
      case "top-right":
        return "rotate-90";
      case "bottom-right":
        return "rotate-180";
      case "bottom-left":
        return "-rotate-90";
      default:
        return "";
    }
  };

  return (
    <svg
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${getTransform()} transform transition-transform`}
    >
      <path
        d="M2 2H30C45 2 58 15 58 30V58"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="2 4"
      />
      <path
        d="M6 6H24C36 6 46 16 46 28V48"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10 10V20C10 25 15 30 20 30H30"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="6" cy="6" r="3.5" fill="currentColor" />
      <circle cx="20" cy="20" r="2" fill="currentColor" />
      <circle cx="34" cy="10" r="1.5" fill="currentColor" />
      <circle cx="10" cy="34" r="1.5" fill="currentColor" />
    </svg>
  );
}

// Kolam-inspired geometric and floral divider
export function KolamDivider({ className = "w-full max-w-md my-6 text-[#E85D75]" }) {
  return (
    <div className={`flex items-center justify-center space-x-3 ${className}`}>
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#E85D75]/40 to-[#E85D75]" />
      <svg
        viewBox="0 0 48 48"
        className="w-7 h-7 text-[#E85D75] flex-shrink-0"
        fill="none"
        stroke="currentColor"
      >
        <circle cx="24" cy="24" r="5" fill="currentColor" />
        <circle cx="24" cy="24" r="14" strokeWidth="1.5" strokeDasharray="3 3" />
        <path d="M24 4V12M24 36V44M4 24H12M36 24H44" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10 10L16 16M32 32L38 38M38 10L32 16M16 32L10 38" strokeWidth="1" />
      </svg>
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#E85D75]/40 to-[#E85D75]" />
    </div>
  );
}

// Traditional Kalasam & Coconut Motif (Auspicious Indian Wedding Symbol)
export function KalasamMotif({ className = "w-12 h-12 text-[#E85D75]" }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
    >
      {/* Mango leaves & coconut apex */}
      <path
        d="M50 10 C46 22 40 32 34 38 C42 38 58 38 66 38 C60 32 54 22 50 10 Z"
        fill="rgba(232, 93, 117, 0.2)"
        strokeWidth="2"
      />
      {/* Mango Leaves flare */}
      <path
        d="M34 38 C24 32 18 20 22 14 C28 22 34 30 38 38"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M66 38 C76 32 82 20 78 14 C72 22 66 30 62 38"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Pot Rim */}
      <ellipse cx="50" cy="42" rx="20" ry="5" strokeWidth="2" fill="rgba(232, 93, 117, 0.15)" />
      {/* Sacred Pot Body */}
      <path
        d="M30 42 C20 52 20 74 34 84 C44 90 56 90 66 84 C80 74 80 52 70 42"
        strokeWidth="2"
        fill="rgba(232, 93, 117, 0.08)"
      />
      {/* Auspicious threads / Swastik / Kolam on pot */}
      <path d="M50 50 V75 M38 62.5 H62" strokeWidth="1.5" strokeLinecap="round" />
      {/* Base */}
      <path d="M38 88 H62" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// Royal Wax Seal Graphic
export function GoldSealGraphic({ monogram = "A × P", size = "w-28 h-28" }) {
  return (
    <div
      className={`relative ${size} rounded-full flex items-center justify-center p-1 bg-gradient-to-br from-[#FCE4E8] via-[#E85D75] to-[#B83A53] shadow-lg border-2 border-white`}
    >
      <div className="w-full h-full rounded-full border border-dashed border-white/60 flex flex-col items-center justify-center bg-gradient-to-tr from-[#8F3045] via-[#B83A53] to-[#E85D75] p-2 text-center text-white">
        <span className="text-[10px] tracking-[0.25em] text-pink-100 uppercase font-serif">
          ROYAL
        </span>
        <span className="font-serif font-bold text-lg text-white tracking-wider my-0.5">
          {monogram}
        </span>
        <span className="text-[9px] tracking-[0.25em] text-pink-100/90 font-serif">
          INVITATION
        </span>
      </div>
    </div>
  );
}
