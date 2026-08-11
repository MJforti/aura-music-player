import React from 'react';
import { usePlayback } from '../../context/PlaybackContext';
import { useUser } from '../../context/UserContext';
import { Play, Pause, SkipForward, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export const MiniPlayer: React.FC = () => {
  const { currentTrack, isPlaying, togglePlay, next, currentTime, duration, setIsNowPlayingOpen } =
    usePlayback();
  const { isLiked, toggleLikeTrack } = useUser();

  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const liked = isLiked(currentTrack.id);

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed bottom-[74px] left-0 right-0 z-30 max-w-md mx-auto px-3 pointer-events-auto"
    >
      <div
        onClick={() => setIsNowPlayingOpen(true)}
        className="glass-card hover:bg-white/[0.08] transition-all cursor-pointer rounded-2xl p-2.5 flex items-center justify-between gap-3 shadow-2xl shadow-black/90 border border-white/15 relative overflow-hidden backdrop-blur-2xl group"
      >
        {/* Ambient background accent glow derived from artwork accentColor */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none transition-all duration-700 blur-2xl"
          style={{ backgroundColor: currentTrack.accentColor || '#8B5CF6' }}
        />

        {/* Micro progress line at top of miniplayer */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/10">
          <div
            className="h-full bg-white transition-all duration-100"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Album Artwork */}
        <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-md flex-shrink-0 border border-white/10">
          <img
            src={currentTrack.artworkUrl}
            alt={currentTrack.title}
            className="w-full h-full object-cover"
          />
          {isPlaying && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center gap-0.5">
              <span className="w-0.5 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-0.5 h-4 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-0.5 h-2.5 bg-white rounded-full animate-bounce" />
            </div>
          )}
        </div>

        {/* Track Title & Artist */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white truncate tracking-tight">
            {currentTrack.title}
          </h4>
          <p className="text-xs text-white/50 truncate font-medium">{currentTrack.artistName}</p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          {/* Like button */}
          <button
            onClick={() => toggleLikeTrack(currentTrack.id)}
            className="p-2 text-white/60 hover:text-white transition-all rounded-full hover:bg-white/10 active:scale-90 cursor-pointer"
            aria-label="Like song"
          >
            <Heart
              className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`}
            />
          </button>

          {/* Play / Pause Toggle */}
          <button
            onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-black" />
            ) : (
              <Play className="w-4 h-4 fill-black ml-0.5" />
            )}
          </button>

          {/* Skip Next */}
          <button
            onClick={next}
            className="p-2 text-white/70 hover:text-white transition-all rounded-full hover:bg-white/10 active:scale-90 cursor-pointer"
            aria-label="Next song"
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
