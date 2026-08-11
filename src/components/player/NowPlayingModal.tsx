import React, { useState } from 'react';
import { usePlayback } from '../../context/PlaybackContext';
import { useUser } from '../../context/UserContext';
import { ProgressBar } from '../ui/ProgressBar';
import { SyncedLyrics } from './SyncedLyrics';
import { QueueSheet } from './QueueSheet';
import { PlaylistModal } from '../modals/PlaylistModal';
import {
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  ListMusic,
  Mic2,
  PlusCircle,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const NowPlayingModal: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    seek,
    next,
    previous,
    shuffleEnabled,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
    volume,
    setVolume,
    isNowPlayingOpen,
    setIsNowPlayingOpen,
  } = usePlayback();

  const { isLiked, toggleLikeTrack } = useUser();

  const [showLyrics, setShowLyrics] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  if (!isNowPlayingOpen || !currentTrack) return null;

  const liked = isLiked(currentTrack.id);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed inset-0 z-50 flex flex-col bg-aura-bg text-white overflow-hidden max-w-md mx-auto shadow-2xl"
      >
        {/* Dynamic Artwork Ambient Backdrop Lighting */}
        <div
          className="absolute inset-0 opacity-40 transition-all duration-1000 blur-3xl pointer-events-none transform scale-125"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 30%, ${
              currentTrack.accentColor || '#8B5CF6'
            } 0%, transparent 70%), url(${currentTrack.artworkUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Liquid Glass Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-aura-bg/95 backdrop-blur-2xl pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col h-full px-6 pt-safe pb-8 justify-between">
          {/* Top Bar Header */}
          <div className="flex items-center justify-between py-3">
            <button
              onClick={() => setIsNowPlayingOpen(false)}
              className="p-2.5 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-all cursor-pointer"
              aria-label="Minimize Player"
            >
              <ChevronDown className="w-6 h-6" />
            </button>

            <div className="text-center">
              <p className="text-[10px] uppercase font-bold tracking-widest text-white/40">
                PLAYING FROM {currentTrack.genre.toUpperCase()}
              </p>
              <p className="text-xs font-semibold text-white/80 truncate max-w-[200px]">
                {currentTrack.albumName}
              </p>
            </div>

            <button
              onClick={() => setShowLyrics((prev) => !prev)}
              className={`p-2.5 rounded-full transition-all cursor-pointer ${
                showLyrics
                  ? 'bg-white text-black shadow-lg shadow-white/20'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              aria-label="Toggle Lyrics"
            >
              <Mic2 className="w-5 h-5" />
            </button>
          </div>

          {/* Main Hero Section: Artwork OR Synced Lyrics */}
          <div className="flex-1 flex items-center justify-center my-4 relative min-h-0">
            {!showLyrics ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 25 }}
                className="w-full max-w-[320px] aspect-square rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/15 relative group"
              >
                <img
                  src={currentTrack.artworkUrl}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Subtle glass reflection highlight */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-60 pointer-events-none" />
              </motion.div>
            ) : (
              <div className="w-full h-full max-h-[380px] bg-black/30 rounded-3xl border border-white/10 backdrop-blur-xl">
                <SyncedLyrics
                  lyrics={currentTrack.lyrics}
                  currentTime={currentTime}
                  onSeekTo={(t) => seek(t)}
                />
              </div>
            )}
          </div>

          {/* Track Metadata & Like Heart */}
          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold tracking-tight text-white truncate">
                {currentTrack.title}
              </h2>
              <p className="text-base font-medium text-white/60 truncate mt-0.5">
                {currentTrack.artistName}
              </p>
            </div>

            <button
              onClick={() => toggleLikeTrack(currentTrack.id)}
              className="p-3 rounded-full hover:bg-white/10 transition-all cursor-pointer active:scale-90"
              aria-label="Like track"
            >
              <Heart
                className={`w-7 h-7 transition-all ${
                  liked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-white/60 hover:text-white'
                }`}
              />
            </button>
          </div>

          {/* Audio Scrubber Progress Bar */}
          <div className="my-2">
            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              onSeek={(t) => seek(t)}
              showTimeLabel
            />
          </div>

          {/* Main Controls (Shuffle, Prev, Play/Pause, Next, Repeat) */}
          <div className="flex items-center justify-between px-2 my-3">
            {/* Shuffle Button */}
            <button
              onClick={toggleShuffle}
              className={`p-3 rounded-full transition-all cursor-pointer ${
                shuffleEnabled
                  ? 'text-purple-400 bg-purple-500/20 border border-purple-500/40 shadow-md'
                  : 'text-white/40 hover:text-white'
              }`}
              aria-label="Toggle Shuffle"
            >
              <Shuffle className="w-5 h-5" />
            </button>

            {/* Skip Previous */}
            <button
              onClick={previous}
              className="p-3 text-white/80 hover:text-white transition-all active:scale-90 cursor-pointer"
              aria-label="Previous Track"
            >
              <SkipBack className="w-7 h-7 fill-current" />
            </button>

            {/* Play / Pause Toggle Hero Button */}
            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 fill-black" />
              ) : (
                <Play className="w-7 h-7 fill-black ml-1" />
              )}
            </button>

            {/* Skip Next */}
            <button
              onClick={next}
              className="p-3 text-white/80 hover:text-white transition-all active:scale-90 cursor-pointer"
              aria-label="Next Track"
            >
              <SkipForward className="w-7 h-7 fill-current" />
            </button>

            {/* Repeat Button */}
            <button
              onClick={toggleRepeat}
              className={`p-3 rounded-full transition-all cursor-pointer ${
                repeatMode !== 'off'
                  ? 'text-purple-400 bg-purple-500/20 border border-purple-500/40 shadow-md'
                  : 'text-white/40 hover:text-white'
              }`}
              aria-label="Toggle Repeat Mode"
            >
              {repeatMode === 'one' ? (
                <Repeat1 className="w-5 h-5" />
              ) : (
                <Repeat className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Bottom Secondary Action Bar (Volume, Add to Playlist, Queue) */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            {/* Volume Control Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowVolumeSlider((prev) => !prev)}
                className="p-2.5 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-all cursor-pointer"
              >
                {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>

              {showVolumeSlider && (
                <div className="absolute bottom-12 left-0 bg-black/90 border border-white/15 rounded-2xl p-3 backdrop-blur-xl shadow-2xl w-36 z-30">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full accent-white cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Add to Playlist Modal trigger */}
            <button
              onClick={() => setShowPlaylistModal(true)}
              className="p-2.5 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-all cursor-pointer"
              title="Add to Playlist"
            >
              <PlusCircle className="w-5 h-5" />
            </button>

            {/* Queue Sheet trigger */}
            <button
              onClick={() => setShowQueue(true)}
              className="p-2.5 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-all cursor-pointer"
              title="View Queue"
            >
              <ListMusic className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Nested Queue Sheet */}
        <QueueSheet isOpen={showQueue} onClose={() => setShowQueue(false)} />

        {/* Nested Playlist Add Modal */}
        <PlaylistModal
          track={currentTrack}
          isOpen={showPlaylistModal}
          onClose={() => setShowPlaylistModal(false)}
        />
      </motion.div>
    </AnimatePresence>
  );
};
