import React, { useState } from 'react';
import { usePlayback } from '../../context/PlaybackContext';
import { ChevronDown, Play, Pause, SkipBack, SkipForward, ListMusic, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MixPlayerModal: React.FC = () => {
  const {
    currentMashup,
    currentMix,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    pause,
    resume,
    next,
    previous,
    seek,
    isMixPlayerOpen,
    setIsMixPlayerOpen,
    openMashupDetail,
  } = usePlayback();

  const [showQueue, setShowQueue] = useState(false);

  if (!isMixPlayerOpen || !currentMashup) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden"
      >
        {/* VIDEO BACKGROUND BACKDROP */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-105 blur-sm hidden sm:block"
          >
            <source src="/videos/desktop_format.mp4" type="video/mp4" />
          </video>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-105 blur-sm sm:hidden"
          >
            <source src="/videos/mobile_format.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black to-black" />
        </div>

        {/* MODAL HEADER */}
        <div className="relative z-10 pt- safe px-6 flex items-center justify-between h-16">
          <button
            onClick={() => setIsMixPlayerOpen(false)}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
          >
            <ChevronDown className="w-5 h-5" />
          </button>

          <div className="text-center min-w-0 px-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">
              {currentMix ? currentMix.title : currentMashup.categoryName}
            </span>
            <h2 className="text-sm font-bold text-white truncate">{currentMashup.title}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openMashupDetail(currentMashup)}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              title="Info"
            >
              <Info className="w-5 h-5" />
            </button>
            {currentMix && (
              <button
                onClick={() => setShowQueue(!showQueue)}
                className={`p-2 rounded-xl border transition-all ${
                  showQueue ? 'bg-white text-black border-white' : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                }`}
              >
                <ListMusic className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* MAIN PLAYER BODY */}
        <div className="relative z-10 flex-1 px-6 flex flex-col justify-center items-center space-y-6 py-4">
          {/* ARTWORK CARD */}
          <motion.div
            key={currentMashup.id}
            initial={{ scale: 0.95, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 25 }}
            className="w-64 h-64 sm:w-72 sm:h-72 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl relative group"
          >
            <img
              src={currentMashup.artwork}
              alt={currentMashup.title}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* METADATA */}
          <div className="w-full max-w-sm text-center space-y-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight truncate">{currentMashup.title}</h1>
            <p className="text-sm font-medium text-zinc-400 truncate">
              {currentMashup.sourceTracks.map(t => `${t.title} (${t.artist})`).join(' × ')}
            </p>
          </div>

          {/* SCRUBBER */}
          <div className="w-full max-w-sm space-y-1.5 pt-2">
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = clickX / rect.width;
                seek(ratio * duration);
              }}
              className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden cursor-pointer relative"
            >
              <div
                className="h-full bg-white rounded-full transition-all duration-200"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs font-mono font-bold text-zinc-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="flex items-center justify-center gap-6 pt-2">
            <button
              onClick={previous}
              disabled={!currentMix || currentIndex === 0}
              className="p-3 rounded-full bg-zinc-900 border border-zinc-800 text-white disabled:opacity-30 hover:bg-zinc-800 transition-all"
            >
              <SkipBack className="w-5 h-5 fill-white" />
            </button>

            <button
              onClick={isPlaying ? pause : resume}
              className="p-4 rounded-full bg-white text-black hover:bg-zinc-200 active:scale-95 transition-all shadow-md"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-black" /> : <Play className="w-6 h-6 fill-black ml-0.5" />}
            </button>

            <button
              onClick={next}
              disabled={!currentMix || currentIndex >= currentMix.mashups.length - 1}
              className="p-3 rounded-full bg-zinc-900 border border-zinc-800 text-white disabled:opacity-30 hover:bg-zinc-800 transition-all"
            >
              <SkipForward className="w-5 h-5 fill-white" />
            </button>
          </div>
        </div>

        {/* QUEUE SHEET OVERLAY */}
        {showQueue && currentMix && (
          <div className="absolute inset-x-0 bottom-0 top-16 z-30 bg-zinc-950 p-6 overflow-y-auto space-y-4 rounded-t-2xl border-t border-zinc-800">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white">Mix Sequence ({currentMix.mashups.length})</h3>
              <button onClick={() => setShowQueue(false)} className="text-xs font-mono font-bold text-zinc-400 hover:text-white">Close</button>
            </div>
            <div className="space-y-2">
              {currentMix.mashups.map((m, idx) => (
                <div
                  key={m.id + idx}
                  onClick={() => {
                    usePlayback().playMix(currentMix, idx);
                    setShowQueue(false);
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    idx === currentIndex
                      ? 'bg-zinc-800 border-zinc-700 text-white font-bold'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono w-5 text-center text-zinc-500">{idx + 1}</span>
                    <img src={m.artwork} alt={m.title} className="w-10 h-10 rounded-lg object-cover border border-zinc-800" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate">{m.title}</p>
                      <p className="text-xs opacity-60 truncate">{m.sourceTracks.map(t => t.artist).join(' × ')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
