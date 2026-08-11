import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { Track } from '../../types/music';
import { Plus, Check, X, FolderPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PlaylistModalProps {
  track: Track | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PlaylistModal: React.FC<PlaylistModalProps> = ({ track, isOpen, onClose }) => {
  const { customPlaylists, createPlaylist, addTrackToPlaylist } = useUser();
  const [newTitle, setNewTitle] = useState('');
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [addedIds, setAddedIds] = useState<string[]>([]);

  if (!isOpen || !track) return null;

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newPly = createPlaylist(newTitle.trim(), '', track.id);
    setAddedIds((prev) => [...prev, newPly.id]);
    setNewTitle('');
    setShowCreateInput(false);
  };

  const handleAddToExisting = (playlistId: string) => {
    addTrackToPlaylist(playlistId, track.id);
    setAddedIds((prev) => [...prev, playlistId]);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-sm bg-aura-surface/95 border border-white/15 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl text-white"
        >
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h3 className="text-lg font-bold">Add to Playlist</h3>
              <p className="text-xs text-white/50 truncate max-w-[200px]">"{track.title}"</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-4 space-y-3 max-h-[50vh] overflow-y-auto no-scrollbar">
            {!showCreateInput ? (
              <button
                onClick={() => setShowCreateInput(true)}
                className="w-full p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-dashed border-white/20 flex items-center gap-3 text-sm font-semibold transition-all cursor-pointer"
              >
                <FolderPlus className="w-5 h-5 text-purple-400" /> Create New Playlist
              </button>
            ) : (
              <form onSubmit={handleCreateNew} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Playlist title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  autoFocus
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-white text-black font-bold text-xs rounded-xl hover:bg-white/90 cursor-pointer"
                >
                  Create
                </button>
              </form>
            )}

            {customPlaylists.length === 0 ? (
              <p className="text-xs text-center text-white/40 py-4">No custom playlists created yet.</p>
            ) : (
              <div className="space-y-2 pt-2">
                {customPlaylists.map((playlist) => {
                  const containsTrack = playlist.trackIds.includes(track.id);
                  const isJustAdded = addedIds.includes(playlist.id);
                  return (
                    <div
                      key={playlist.id}
                      onClick={() => !containsTrack && handleAddToExisting(playlist.id)}
                      className={`flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer border ${
                        containsTrack || isJustAdded
                          ? 'bg-purple-500/20 border-purple-500/40 text-white'
                          : 'bg-white/[0.05] hover:bg-white/10 border-white/10 text-white/80'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={playlist.coverUrl}
                          alt={playlist.title}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">{playlist.title}</p>
                          <p className="text-xs text-white/50">{playlist.trackIds.length} tracks</p>
                        </div>
                      </div>

                      {containsTrack || isJustAdded ? (
                        <span className="p-1.5 bg-purple-500 rounded-full text-white">
                          <Check className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white">
                          <Plus className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-3 bg-white/10 hover:bg-white/15 rounded-2xl text-sm font-semibold transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
