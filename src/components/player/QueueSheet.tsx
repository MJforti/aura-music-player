import React from 'react';
import { usePlayback } from '../../context/PlaybackContext';
import { X, Trash2, Play, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QueueSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QueueSheet: React.FC<QueueSheetProps> = ({ isOpen, onClose }) => {
  const { queue, queueIndex, currentTrack, playTrack, removeFromQueue, clearQueue } = usePlayback();

  if (!isOpen) return null;

  const upcomingTracks = queue.slice(queueIndex + 1);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="w-full max-w-md bg-aura-surface/95 border border-white/15 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col max-h-[85vh] backdrop-blur-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Music className="w-5 h-5 text-purple-400" /> Playback Queue
              </h3>
              <p className="text-xs text-white/50">{queue.length} tracks total</p>
            </div>
            <div className="flex items-center gap-2">
              {queue.length > 1 && (
                <button
                  onClick={clearQueue}
                  className="text-xs text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear Queue
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Queue List Content */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 no-scrollbar">
            {/* Now Playing section */}
            {currentTrack && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-purple-400 mb-2 px-1">
                  Now Playing
                </p>
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/10 border border-purple-500/30">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={currentTrack.artworkUrl}
                      alt={currentTrack.title}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{currentTrack.title}</p>
                      <p className="text-xs text-white/60 truncate">{currentTrack.artistName}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-purple-300 font-semibold px-2.5 py-1 bg-purple-500/20 rounded-full">
                    Active
                  </span>
                </div>
              </div>
            )}

            {/* Next Up section */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2 px-1">
                Next Up ({upcomingTracks.length})
              </p>
              {upcomingTracks.length === 0 ? (
                <div className="p-6 text-center text-white/30 text-xs border border-dashed border-white/10 rounded-2xl">
                  No upcoming tracks in queue
                </div>
              ) : (
                <div className="space-y-1.5">
                  {upcomingTracks.map((track, idx) => {
                    const actualIndex = queueIndex + 1 + idx;
                    return (
                      <div
                        key={`${track.id}-${actualIndex}`}
                        className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.07] transition-all border border-transparent hover:border-white/10"
                      >
                        <div
                          onClick={() => playTrack(track)}
                          className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                        >
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={track.artworkUrl}
                              alt={track.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                            </div>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white/90 group-hover:text-white truncate">
                              {track.title}
                            </p>
                            <p className="text-xs text-white/50 truncate">{track.artistName}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => removeFromQueue(actualIndex)}
                          className="p-2 text-white/30 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-white/10 cursor-pointer"
                          title="Remove from queue"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
