import React, { useEffect, useRef } from 'react';
import { Lyrics } from '../../types/music';

interface SyncedLyricsProps {
  lyrics?: Lyrics;
  currentTime: number;
  onSeekTo: (time: number) => void;
}

export const SyncedLyrics: React.FC<SyncedLyricsProps> = ({
  lyrics,
  currentTime,
  onSeekTo,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLParagraphElement>(null);

  if (!lyrics || !lyrics.lines || lyrics.lines.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 text-white/40">
        <p className="text-sm font-medium">Lyrics unavailable for this track</p>
      </div>
    );
  }

  // Find active line index
  let activeIndex = 0;
  for (let i = 0; i < lyrics.lines.length; i++) {
    if (currentTime >= lyrics.lines[i].time) {
      activeIndex = i;
    } else {
      break;
    }
  }

  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeIndex]);

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto px-4 py-8 space-y-6 no-scrollbar select-none"
    >
      {lyrics.lines.map((line, idx) => {
        const isActive = idx === activeIndex;
        const isPast = idx < activeIndex;

        return (
          <p
            key={idx}
            ref={isActive ? activeLineRef : null}
            onClick={() => onSeekTo(line.time)}
            className={`text-xl sm:text-2xl font-bold tracking-tight transition-all duration-300 cursor-pointer ${
              isActive
                ? 'text-white scale-105 text-glow opacity-100'
                : isPast
                ? 'text-white/30 hover:text-white/70'
                : 'text-white/20 hover:text-white/60'
            }`}
          >
            {line.text}
          </p>
        );
      })}
    </div>
  );
};
