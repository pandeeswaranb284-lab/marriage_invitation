import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export default function PageNavigation({ pages = [], activePageId, onNavigate }) {
  const currentIndex = pages.findIndex(p => p.id === activePageId);

  return (
    <nav className="fixed right-3 md:right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center space-y-2">
      {/* Up Button */}
      {currentIndex > 0 && (
        <button
          onClick={() => onNavigate(pages[currentIndex - 1].id)}
          className="p-1.5 rounded-full bg-navy-950/80 border border-gold-500/30 text-gold-300 hover:text-white transition-colors"
          title="Previous Page"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      )}

      {/* Gilded Page Indicators */}
      <div className="flex flex-col space-y-2 p-1.5 bg-navy-950/85 rounded-full border border-gold-500/40 shadow-royal">
        {pages.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => onNavigate(p.id)}
            title={p.title}
            className="group relative flex items-center"
          >
            <span className={`w-2.5 h-2.5 rounded-full transition-all ${
              activePageId === p.id
                ? "bg-gold-400 scale-125 shadow-gold-glow"
                : "bg-gold-600/40 hover:bg-gold-400/80"
            }`} />

            {/* Hover Tooltip */}
            <span className="absolute right-6 px-2.5 py-1 rounded bg-navy-950 border border-gold-400/40 text-[10px] font-cinzel tracking-wider text-gold-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
              {p.pageNumber}: {p.title}
            </span>
          </button>
        ))}
      </div>

      {/* Down Button */}
      {currentIndex < pages.length - 1 && (
        <button
          onClick={() => onNavigate(pages[currentIndex + 1].id)}
          className="p-1.5 rounded-full bg-navy-950/80 border border-gold-500/30 text-gold-300 hover:text-white transition-colors"
          title="Next Page"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      )}
    </nav>
  );
}
