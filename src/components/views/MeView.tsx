import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { useMixPlayback } from '../../context/MixPlaybackContext';
import { mixGenerator } from '../../services/MixGenerator';
import { Play, Plus, Trash2, User, Music } from 'lucide-react';
import { motion } from 'framer-motion';

export const MeView: React.FC = () => {
  const { customPlaylists, likedTrackIds, createPlaylist, deletePlaylist } = useUser();
  const { playMix, setIsMixPlayerOpen } = useMixPlayback();
  const [newMixTitle, setNewMixTitle] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateMix = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMixTitle.trim()) return;
    createPlaylist(newMixTitle.trim(), 'My personal custom discovery mix');
    setNewMixTitle('');
    setShowCreateModal(false);
  };

  const handlePlayCustomMix = (playlist: any) => {
    if (!playlist.tracks || playlist.tracks.length === 0) return;
    const mix = mixGenerator.createMix(
      `mix-custom-${playlist.id}`,
      playlist.title || playlist.name,
      'My Custom Discovery Mix',
      playlist.description || '',
      'trending',
      'Personal Mix',
      playlist.tracks
    );
    playMix(mix);
    setIsMixPlayerOpen(true);
  };

  return (
    <div className="pb-36 pt- safe px-4 space-y-7 no-scrollbar">
      {/* Header Profile */}
      <div className="flex items-center justify-between pt-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
            <User className="w-5 h-5 text-zinc-300" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Profile & Mixes</h1>
            <p className="text-xs font-mono text-zinc-400">{customPlaylists.length} Custom Mixes • {likedTrackIds.length} Saved Clips</p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-all flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Mix
        </button>
      </div>

      {/* MY MIXES SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-zinc-400">
            My Custom Mixes
          </h2>
        </div>

        {customPlaylists.length === 0 ? (
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center space-y-2">
            <p className="text-sm font-bold text-zinc-300">No Custom Mixes Yet</p>
            <p className="text-xs text-zinc-400">Search any track and tap "+ Add to Mix" to build your custom continuous mix.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {customPlaylists.map((ply) => {
              const trackCount = ply.tracks?.length || 0;
              return (
                <div
                  key={ply.id}
                  className="p-4 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 transition-all flex items-center justify-between group"
                >
                  <div
                    onClick={() => handlePlayCustomMix(ply)}
                    className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                  >
                    <img
                      src={ply.coverUrl || ply.artworkUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'}
                      alt={ply.title || ply.name}
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-zinc-800"
                    />
                    <div className="min-w-0">
                      <p className="text-base font-bold text-white group-hover:text-zinc-200 truncate">
                        {ply.title || ply.name}
                      </p>
                      <p className="text-xs font-mono text-zinc-400">{trackCount} Tracks</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {trackCount > 0 && (
                      <button
                        onClick={() => handlePlayCustomMix(ply)}
                        className="p-2.5 rounded-xl bg-zinc-800 text-white border border-zinc-700 group-hover:bg-white group-hover:text-black transition-all"
                      >
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </button>
                    )}
                    <button
                      onClick={() => deletePlaylist(ply.id)}
                      className="p-2.5 rounded-xl bg-zinc-900 text-zinc-500 hover:text-rose-400 transition-colors"
                      title="Delete Mix"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE MIX MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-2xl"
          >
            <h3 className="text-lg font-bold text-white">Create Custom Mix</h3>
            <form onSubmit={handleCreateMix} className="space-y-4">
              <input
                type="text"
                value={newMixTitle}
                onChange={(e) => setNewMixTitle(e.target.value)}
                placeholder="Mix title..."
                className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 text-sm font-medium"
                autoFocus
              />
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-bold text-xs hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200"
                >
                  Create Mix
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
