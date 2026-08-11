import React from 'react';
import { Track, Album, Artist, Playlist } from '../../types/music';
import { usePlayback } from '../../context/PlaybackContext';
import { useUser } from '../../context/UserContext';
import { X, Play, Shuffle, Heart, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTime } from '../ui/ProgressBar';

interface DetailModalProps {
  type: 'album' | 'artist' | 'playlist' | null;
  data: {
    item: Album | Artist | Playlist;
    tracks: Track[];
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectTrack: (track: Track, queue: Track[]) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  type,
  data,
  isOpen,
  onClose,
  onSelectTrack,
}) => {
  const { currentTrack, isPlaying, togglePlay } = usePlayback();
  const { isLiked, toggleLikeTrack } = useUser();

  if (!isOpen || !data || !type) return null;

  const { item, tracks } = data;

  const coverUrl =
    'artworkUrl' in item
      ? item.artworkUrl
      : 'avatarUrl' in item
      ? item.avatarUrl
      : 'coverUrl' in item
      ? item.coverUrl
      : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';

  const title =
    'name' in item
      ? (item as Artist).name
      : 'title' in item
      ? (item as Album | Playlist).title
      : 'Detail';

  const subtitle =
    'artistName' in item
      ? item.artistName
      : 'monthlyListeners' in item
      ? `${(item.monthlyListeners / 1000000).toFixed(1)}M Monthly Listeners`
      : 'description' in item
      ? item.description
      : '';

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      onSelectTrack(tracks[0], tracks);
    }
  };

  const handleShuffleAll = () => {
    if (tracks.length > 0) {
      const shuffled = [...tracks].sort(() => Math.random() - 0.5);
      onSelectTrack(shuffled[0], shuffled);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="w-full max-w-md bg-aura-surface/95 border border-white/15 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden backdrop-blur-2xl text-white"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 relative z-10 bg-black/40">
            <span className="text-xs uppercase font-bold tracking-widest text-white/50">
              {type} Overview
            </span>
            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 no-scrollbar pb-8">
            {/* Banner Section */}
            <div className="relative p-6 flex flex-col items-center text-center bg-gradient-to-b from-purple-900/30 via-white/[0.03] to-transparent">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden shadow-2xl border border-white/20 mb-4">
                <img src={coverUrl} alt={title} className="w-full h-full object-cover" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{title}</h1>
              {subtitle && <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-xs">{subtitle}</p>}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-5">
                <button
                  onClick={handlePlayAll}
                  className="px-6 py-3 bg-white text-black font-bold text-sm rounded-full flex items-center gap-2 hover:bg-white/90 active:scale-95 transition-all shadow-lg shadow-white/10 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-black" /> Play All
                </button>
                <button
                  onClick={handleShuffleAll}
                  className="p-3 bg-white/10 border border-white/20 text-white rounded-full hover:bg-white/20 active:scale-95 transition-all cursor-pointer"
                  title="Shuffle Play"
                >
                  <Shuffle className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Track List */}
            <div className="px-4 space-y-1 mt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3 px-2">
                Tracks ({tracks.length})
              </p>

              {tracks.map((t, idx) => {
                const isCurrent = currentTrack?.id === t.id;
                const liked = isLiked(t.id);

                return (
                  <div
                    key={t.id}
                    className={`group flex items-center justify-between p-3 rounded-2xl transition-all border ${
                      isCurrent
                        ? 'bg-purple-500/20 border-purple-500/40 text-white'
                        : 'hover:bg-white/[0.07] border-transparent text-white/80'
                    }`}
                  >
                    <div
                      onClick={() => {
                        if (isCurrent) {
                          togglePlay();
                        } else {
                          onSelectTrack(t, tracks);
                        }
                      }}
                      className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                    >
                      <span className="w-6 text-center text-xs font-mono text-white/40 font-bold">
                        {idx + 1}
                      </span>
                      <img
                        src={t.artworkUrl}
                        alt={t.title}
                        className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p
                          className={`text-sm font-semibold truncate ${
                            isCurrent ? 'text-purple-300 font-bold' : 'group-hover:text-white'
                          }`}
                        >
                          {t.title}
                        </p>
                        <p className="text-xs text-white/50 truncate">{t.artistName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleLikeTrack(t.id)}
                        className="p-2 text-white/40 hover:text-rose-400 transition-colors rounded-full cursor-pointer"
                      >
                        <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>
                      <span className="text-xs font-mono text-white/40">{formatTime(t.duration)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
