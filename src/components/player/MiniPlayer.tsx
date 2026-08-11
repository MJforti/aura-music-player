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
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onClick={() => setIsMixPlayerOpen(true)}
        className="max-w-md mx-auto rounded-3xl bg-zinc-900/90 backdrop-blur-2xl border border-white/20 p-2.5 shadow-2xl flex items-center justify-between cursor-pointer group"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <img
            src={currentTrack.artworkUrl || currentMix.artworkUrl}
            alt={currentTrack.title}
            className="w-12 h-12 rounded-2xl object-cover border border-white/20 flex-shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-400 truncate">
                {currentMix.title}
              </span>
            </div>
            <p className="text-xs font-bold text-white truncate">{currentTrack.title}</p>
            <p className="text-[11px] font-medium text-white/50 truncate">{currentTrack.artistName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 pr-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              isPlaying ? pause() : resume();
            }}
            className="p-3 rounded-full bg-gradient-to-tr from-orange-500 to-rose-600 text-white shadow-md hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextTrack();
            }}
            className="p-2.5 rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-all"
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </button>
        </div>

        {/* TOP MINI PROGRESS BAR */}
        <div className="absolute top-0 left-4 right-4 h-0.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-rose-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </motion.div>
    </div>
  );
};
