import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { usePlayback } from '../../context/PlaybackContext';
import { mashupService } from '../../services/MashupService';
import { Play, Plus, Trash2, User, Music } from 'lucide-react';
import { motion } from 'framer-motion';

export const MeView: React.FC = () => {
  const { customPlaylists, likedTrackIds, createPlaylist, deletePlaylist } = useUser();
  const { playMix, setIsMixPlayerOpen } = usePlayback();
  const [newMixTitle, setNewMixTitle] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateMix = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMixTitle.trim()) return;
    createPlaylist(newMixTitle.trim(), 'My personal custom mashup mix');
    setNewMixTitle('');
    setShowCreateModal(false);
  };

  const handlePlayCustomMix = async (playlist: any) => {
    if (!playlist.tracks || playlist.tracks.length === 0) return;
    const allMashups = await mashupService.getTrendingMashups();
    const mix = {
      id: `mix-custom-${playlist.id}`,
      title: playlist.title || playlist.name,
      subtitle: `${playlist.tracks.length} mashups`,
      description: playlist.description || 'Personal custom mashup session',
      artwork: playlist.coverUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
      category: 'bollywood_english' as const,
      mashups: allMashups,
      totalDuration: 3600,
      updatedAt: 'Updated just now',
    };
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
            <h1 className="text-xl font-bold text-white tracking-tight">Profile & Saved Mixes</h1>
            <p className="text-xs font-mono text-zinc-400">{customPlaylists.length} Personal Mixes • {likedTrackIds.length} Saved</p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-all flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Mix
        </button>
      </div>

      {/* PERSONAL MIX BUILDER */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-zinc-400">
            My Personal Mixes
          </h2>
        </div>

        {customPlaylists.length === 0 ? (
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center space-y-2">
            <p className="text-sm font-bold text-zinc-300">No Personal Mixes Yet</p>
            <p className="text-xs text-zinc-500">Search any mashup and tap "+ Add to Mix" to construct your custom continuous mix session.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {customPlaylists.map((ply) => {
              const trackCount = ply.tracks?.length || ply.trackIds?.length || 0;
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
                      src={ply.coverUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80'}
                      alt={ply.title || ply.name}
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-zinc-800"
                    />
                    <div className="min-w-0">
                      <p className="text-base font-bold text-white group-hover:text-zinc-200 truncate">
                        {ply.title || ply.name}
                      </p>
                      <p className="text-xs font-mono text-zinc-400">{trackCount} Mashups</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePlayCustomMix(ply)}
                      className="p-2.5 rounded-xl bg-zinc-800 text-white border border-zinc-700 group-hover:bg-white group-hover:text-black transition-all"
                    >
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </button>
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
            <h3 className="text-lg font-bold text-white">Create Personal Mix</h3>
            <form onSubmit={handleCreateMix} className="space-y-4">
              <input
                type="text"
                value={newMixTitle}
                onChange={(e) => setNewMixTitle(e.target.value)}
                placeholder="Mix title (e.g. My Night Drive)..."
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
