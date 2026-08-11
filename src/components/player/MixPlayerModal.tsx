import React, { useState } from 'react';
import { useMixPlayback } from '../../context/MixPlaybackContext';
import { mixGenerator } from '../../services/MixGenerator';
import { ChevronDown, Play, Pause, SkipBack, SkipForward, Flame, ListMusic, Heart, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MixPlayerModal: React.FC = () => {
  const {
    currentMix,
    currentTrack,
    currentMixTrack,
    trackIndex,
    isPlaying,
    currentTime,
    duration,
    mixCurrentTime,
    mixDuration,
    pause,
    resume,
    nextTrack,
    previousTrack,
    seek,
    volume,
    setVolume,
    isMixPlayerOpen,
    setIsMixPlayerOpen,
  } = useMixPlayback();

  const [showQueue, setShowQueue] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  if (!isMixPlayerOpen || !currentMix || !currentTrack) return null;

  const nextMixTrack = currentMix.tracks[trackIndex + 1] || null;
  const progressPercent = mixDuration > 0 ? (mixCurrentTime / mixDuration) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden"
      >
        {/* DYNAMIC BACKGROUND BACKDROP BLUR */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src={currentTrack.artworkUrl || currentMix.artworkUrl}
            alt="Backdrop"
            className="w-full h-full object-cover scale-125 blur-3xl opacity-40 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />
        </div>

        {/* MODAL HEADER */}
        <div className="relative z-10 pt- safe px-6 flex items-center justify-between h-16">
          <button
            onClick={() => setIsMixPlayerOpen(false)}
            className="p-2 rounded-full bg-white/10 border border-white/15 text-white/80 hover:text-white"
          >
            <ChevronDown className="w-5 h-5" />
          </button>

          <div className="text-center min-w-0 px-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-400">
              {currentMix.categoryName}
            </span>
            <h2 className="text-sm font-black text-white truncate">{currentMix.title}</h2>
          </div>

          <button
            onClick={() => setShowQueue(!showQueue)}
            className={`p-2 rounded-full border transition-all ${
              showQueue ? 'bg-orange-500 text-white border-orange-400' : 'bg-white/10 text-white/80 border-white/15'
            }`}
          >
            <ListMusic className="w-5 h-5" />
          </button>
        </div>

        {/* MAIN PLAYER BODY */}
        <div className="relative z-10 flex-1 px-6 flex flex-col justify-center items-center space-y-6 py-4">
          {/* ARTWORK CARD */}
          <motion.div
            key={currentTrack.id}
            initial={{ scale: 0.9, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 25 }}
            className="w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden border border-white/20 shadow-2xl shadow-orange-500/20 relative group"
          >
            <img
              src={currentTrack.artworkUrl || currentMix.artworkUrl}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-extrabold uppercase tracking-wider text-orange-400">
              Track {trackIndex + 1} / {currentMix.trackCount}
            </div>
          </motion.div>

          {/* TRACK METADATA */}
          <div className="w-full max-w-sm text-center space-y-1">
            <h1 className="text-2xl font-black text-white tracking-tight truncate">{currentTrack.title}</h1>
            <p className="text-sm font-semibold text-white/60 truncate">{currentTrack.artistName}</p>
          </div>

          {/* NEXT UP SNIPPET BADGE */}
          {nextMixTrack && (
            <div className="w-full max-w-sm p-3 rounded-2xl bg-white/[0.08] border border-white/15 backdrop-blur-md flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <img src={nextMixTrack.track.artworkUrl} alt={nextMixTrack.track.title} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                <div className="min-w-0 text-left">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-orange-400">Up Next Clip</p>
                  <p className="text-xs font-bold text-white truncate">{nextMixTrack.track.title}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-white/50 px-2 py-1 rounded-full bg-white/10">30s</span>
            </div>
          )}

          {/* MIX PROGRESS SCRUBBER */}
          <div className="w-full max-w-sm space-y-1.5 pt-2">
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = clickX / rect.width;
                seek(ratio * duration);
              }}
              className="h-2 w-full bg-white/15 rounded-full overflow-hidden cursor-pointer relative"
            >
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-rose-500 rounded-full transition-all duration-200"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-white/50">
              <span>{mixGenerator.formatDuration(mixCurrentTime)}</span>
              <span>{mixGenerator.formatDuration(mixDuration)}</span>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="flex items-center justify-center gap-6 pt-2">
            <button
              onClick={previousTrack}
              disabled={trackIndex === 0}
              className="p-3 rounded-full bg-white/10 text-white disabled:opacity-30 hover:bg-white/20 transition-all"
            >
              <SkipBack className="w-6 h-6 fill-white" />
            </button>

            <button
              onClick={isPlaying ? pause : resume}
              className="p-5 rounded-full bg-gradient-to-tr from-orange-500 to-rose-600 text-white shadow-xl shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all"
            >
              {isPlaying ? <Pause className="w-7 h-7 fill-white" /> : <Play className="w-7 h-7 fill-white ml-0.5" />}
            </button>

            <button
              onClick={nextTrack}
              disabled={trackIndex >= currentMix.tracks.length - 1}
              className="p-3 rounded-full bg-white/10 text-white disabled:opacity-30 hover:bg-white/20 transition-all"
            >
              <SkipForward className="w-6 h-6 fill-white" />
            </button>
          </div>
        </div>

        {/* QUEUE SHEET OVERLAY */}
        {showQueue && (
          <div className="absolute inset-x-0 bottom-0 top-16 z-30 bg-zinc-900/95 backdrop-blur-2xl p-6 overflow-y-auto space-y-4 rounded-t-3xl border-t border-white/20">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-lg font-black text-white">Mix Track Sequence ({currentMix.trackCount})</h3>
              <button onClick={() => setShowQueue(false)} className="text-xs font-bold text-orange-400">Close</button>
            </div>
            <div className="space-y-2">
              {currentMix.tracks.map((mt, idx) => (
                <div
                  key={mt.track.id + idx}
                  onClick={() => {
                    useMixPlayback().playMix(currentMix, idx);
                    setShowQueue(false);
                  }}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                    idx === trackIndex
                      ? 'bg-orange-500/20 border-orange-500/40 text-orange-300'
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-bold w-5 text-center text-white/50">{idx + 1}</span>
                    <img src={mt.track.artworkUrl} alt={mt.track.title} className="w-10 h-10 rounded-xl object-cover" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate">{mt.track.title}</p>
                      <p className="text-xs opacity-60 truncate">{mt.track.artistName}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold opacity-50">{mt.duration}s</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
