import React from 'react';
import { useMixPlayback } from '../../context/MixPlaybackContext';
import { Play, Pause, SkipForward } from 'lucide-react';
import { motion } from 'framer-motion';

export const MiniPlayer: React.FC = () => {
  const {
    currentMix,
    currentTrack,
    isPlaying,
    pause,
    resume,
    nextTrack,
    mixCurrentTime,
    mixDuration,
    setIsMixPlayerOpen,
  } = useMixPlayback();

  if (!currentMix || !currentTrack) return null;

  const progressPercent = mixDuration > 0 ? (mixCurrentTime / mixDuration) * 100 : 0;

  return (
    <div className="fixed bottom-20 left-0 right-0 z-30 px-4 pointer-events-auto">
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onClick={() => setIsMixPlayerOpen(true)}
        className="max-w-md mx-auto rounded-2xl bg-zinc-950/95 backdrop-blur-2xl border border-zinc-800 p-2.5 shadow-xl flex items-center justify-between cursor-pointer group"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <img
            src={currentTrack.artworkUrl || currentMix.artworkUrl}
            alt={currentTrack.title}
            className="w-11 h-11 rounded-xl object-cover border border-zinc-800 flex-shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 truncate">
                {currentMix.title}
              </span>
            </div>
            <p className="text-xs font-bold text-white truncate">{currentTrack.title}</p>
            <p className="text-[11px] text-zinc-400 truncate">{currentTrack.artistName}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0 pr-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              isPlaying ? pause() : resume();
            }}
            className="p-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 transition-all shadow-sm"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-black" /> : <Play className="w-3.5 h-3.5 fill-black ml-0.5" />}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextTrack();
            }}
            className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white transition-all border border-zinc-800"
          >
            <SkipForward className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>

        {/* TOP MINI PROGRESS BAR */}
        <div className="absolute top-0 left-3 right-3 h-0.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </motion.div>
    </div>
  );
};
