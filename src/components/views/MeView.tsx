import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { useMixPlayback } from '../../context/MixPlaybackContext';
import { mixGenerator } from '../../services/MixGenerator';
import { Play, Plus, Trash2, Heart, History, User, Music, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const MeView: React.FC = () => {
  const { customPlaylists, likedTrackIds, createPlaylist, deletePlaylist, removeTrackFromPlaylist } = useUser();
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
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-500 to-rose-600 p-0.5 shadow-lg">
            <div className="w-full h-full rounded-full bg-black/80 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">My Profile & Mixes</h1>
            <p className="text-xs text-white/50">{customPlaylists.length} Custom Mixes • {likedTrackIds.length} Liked Clips</p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3.5 py-2 rounded-2xl bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-bold hover:bg-orange-500/30 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> New Mix
        </button>
      </div>

      {/* MY MIXES SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
            <Music className="w-4 h-4 text-orange-400" /> My Custom Mixes
          </h2>
        </div>

        {customPlaylists.length === 0 ? (
          <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/10 text-center space-y-2">
            <p className="text-sm font-semibold text-white/70">No Custom Mixes Yet</p>
            <p className="text-xs text-white/40">Search any track and tap "+ Add to Mix" to build your custom continuous mix.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {customPlaylists.map((ply) => {
              const trackCount = ply.tracks?.length || 0;
              return (
                <div
                  key={ply.id}
                  className="p-4 rounded-3xl bg-white/[0.05] hover:bg-white/10 border border-white/10 transition-all flex items-center justify-between group"
                >
                  <div
                    onClick={() => handlePlayCustomMix(ply)}
                    className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                  >
                    <img
                      src={ply.coverUrl || ply.artworkUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'}
                      alt={ply.title || ply.name}
                      className="w-12 h-12 rounded-2xl object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-base font-bold text-white group-hover:text-orange-300 truncate">
                        {ply.title || ply.name}
                      </p>
                      <p className="text-xs text-white/50">{trackCount} Tracks</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {trackCount > 0 && (
                      <button
                        onClick={() => handlePlayCustomMix(ply)}
                        className="p-2.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 hover:scale-105 transition-transform"
                      >
                        <Play className="w-4 h-4 fill-current" />
                      </button>
                    )}
                    <button
                      onClick={() => deletePlaylist(ply.id)}
                      className="p-2.5 rounded-full bg-white/10 text-white/40 hover:text-rose-400 transition-colors"
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
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm p-6 rounded-3xl bg-zinc-900 border border-white/20 space-y-4 shadow-2xl"
          >
            <h3 className="text-lg font-black text-white">Create Custom Mix</h3>
            <form onSubmit={handleCreateMix} className="space-y-4">
              <input
                type="text"
                value={newMixTitle}
                onChange={(e) => setNewMixTitle(e.target.value)}
                placeholder="Mix title (e.g. My Workout Mix)..."
                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-orange-500 text-sm font-medium"
                autoFocus
              />
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 rounded-2xl bg-white/10 text-white font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 text-white font-bold text-xs shadow-lg"
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
