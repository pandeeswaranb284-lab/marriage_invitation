import React from 'react';
import { Languages } from 'lucide-react';

export default function LanguageSwitcher({ currentMode = "both", onModeChange }) {
  const modes = [
    { key: "both", label: "Tamil + English" },
    { key: "ta", label: "தமிழ்" },
    { key: "en", label: "English" },
  ];

  return (
    <div className="flex items-center space-x-1 p-1 bg-navy-950/85 rounded-full border border-gold-500/40 shadow-inner">
      <div className="pl-2 pr-1 text-gold-400">
        <Languages className="w-3.5 h-3.5" />
      </div>
      {modes.map((m) => (
        <button
          key={m.key}
          onClick={() => onModeChange(m.key)}
          className={`px-2.5 py-1 rounded-full text-[10px] font-cinzel font-semibold tracking-wider transition-all ${
            currentMode === m.key
              ? "bg-gold-500 text-navy-950 shadow-sm"
              : "text-gold-200/70 hover:text-gold-100"
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
