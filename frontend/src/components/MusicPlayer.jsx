import React, { useEffect, useRef, useState } from 'react';
import { Music, VolumeX, Volume2 } from 'lucide-react';

export default function MusicPlayer({
  musicUrl = "https://actions.google.com/sounds/v1/ambiences/temple_bells_and_chants.ogg",
  enabled = true,
}) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // If disabled by admin, stop playing
    if (!enabled && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [enabled]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    setHasInteracted(true);

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          setIsPlaying(false);
        });
    }
  };

  if (!enabled) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-center space-x-2">
      <audio
        ref={audioRef}
        src={musicUrl}
        loop
        preload="none"
      />

      <button
        onClick={toggleMusic}
        title={isPlaying ? "Music OFF" : "Music ON"}
        aria-label={isPlaying ? "Mute Background Music" : "Play Background Music"}
        className={`px-3.5 py-2.5 rounded-full border transition-all flex items-center space-x-2 text-xs tracking-wider uppercase font-medium shadow-md ${
          isPlaying
            ? "bg-gradient-to-r from-[#E85D75] to-[#E11D48] text-white border-white/50 shadow-rose-300/50 animate-pulse-subtle"
            : "bg-white/90 backdrop-blur-md text-[#8F3045] border-[#FCE4E8] hover:border-[#E85D75] hover:text-[#E85D75]"
        }`}
      >
        <span className="text-base font-bold leading-none">♫</span>
        <span className="hidden sm:inline">
          {isPlaying ? "Music ON" : "Music OFF"}
        </span>
      </button>
    </div>
  );
}
