import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { usePlayback } from '../../context/PlaybackContext';
import { Track, Album, Artist, Playlist } from '../../types/music';
import { MOCK_ALBUMS, MOCK_ARTISTS, MOCK_TRACKS, MOCK_PLAYLISTS, musicProvider } from '../../services/MockMusicProvider';
import { Heart, Plus, FolderPlus, Trash2, Edit3, Play, Music, History, Disc, User } from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { GlassButton } from '../ui/GlassButton';

interface LibraryViewProps {
  onOpenDetail: (type: 'album' | 'artist' | 'playlist', item: Album | Artist | Playlist, tracks: Track[]) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ onOpenDetail }) => {
  const { likedTracks, customPlaylists, createPlaylist, renamePlaylist, deletePlaylist, historyTrackIds } =
    useUser();
  const { playTrack } = usePlayback();

  const [activeTab, setActiveTab] = useState<'liked' | 'playlists' | 'albums' | 'artists' | 'history'>('liked');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const historyTracks: Track[] = MOCK_TRACKS.filter((t: Track) => historyTrackIds.includes(t.id));

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createPlaylist(newTitle.trim());
    setNewTitle('');
    setShowCreateModal(false);
  };

  const handleRenameSubmit = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    renamePlaylist(id, editTitle.trim());
    setEditingId(null);
  };

  return (
    <div className="pb-36 pt-safe px-4 space-y-6 no-scrollbar">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <Music className="w-6 h-6 text-purple-400" /> Your Library
        </h1>
        <GlassButton
          variant="pill"
          size="sm"
          onClick={() => setShowCreateModal(true)}
          className="cursor-pointer"
        >
          <Plus className="w-4 h-4" /> New Playlist
        </GlassButton>
      </div>

      {/* Library Section Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'liked', label: `Liked (${likedTracks.length})`, icon: Heart },
          { id: 'playlists', label: `Playlists (${customPlaylists.length + MOCK_PLAYLISTS.length})`, icon: FolderPlus },
          { id: 'albums', label: 'Albums', icon: Disc },
          { id: 'artists', label: 'Artists', icon: User },
          { id: 'history', label: 'History', icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer flex-shrink-0 ${
                isActive
                  ? 'bg-white text-black border-white shadow-lg'
                  : 'bg-white/5 hover:bg-white/10 text-white/70 border-white/10'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-purple-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* CREATE PLAYLIST MODAL */}
      {showCreateModal && (
        <div className="p-4 bg-white/10 border border-white/20 rounded-3xl backdrop-blur-xl space-y-3">
          <h3 className="text-sm font-bold text-white">Create New Playlist</h3>
          <form onSubmit={handleCreateSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Playlist title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              autoFocus
              className="flex-1 bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-white text-black font-bold text-xs rounded-xl hover:bg-white/90 cursor-pointer"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-3 py-2 text-white/60 hover:text-white text-xs cursor-pointer"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* LIKED SONGS TAB */}
      {activeTab === 'liked' && (
        <div className="space-y-4">
          <GlassPanel glow intensity="heavy" className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Heart className="w-7 h-7 fill-white text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Liked Songs</h2>
                <p className="text-xs text-white/60">{likedTracks.length} saved tracks</p>
              </div>
            </div>

            {likedTracks.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => playTrack(likedTracks[0], likedTracks)}
                  className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title="Play All"
                >
                  <Play className="w-5 h-5 fill-black ml-0.5" />
                </button>
              </div>
            )}
          </GlassPanel>

          {likedTracks.length === 0 ? (
            <div className="py-12 text-center text-white/40 space-y-2">
              <Heart className="w-10 h-10 mx-auto text-white/20" />
              <p className="text-sm font-semibold">No liked songs yet</p>
              <p className="text-xs">Tap the heart icon on any song to save it to your library.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {likedTracks.map((track: Track, idx: number) => (
                <div
                  key={track.id}
                  onClick={() => playTrack(track, likedTracks)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] hover:bg-white/10 border border-white/10 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 text-center text-xs font-mono text-white/40 font-bold">
                      {idx + 1}
                    </span>
                    <img
                      src={track.artworkUrl}
                      alt={track.title}
                      className="w-11 h-11 rounded-xl object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate group-hover:text-purple-300">
                        {track.title}
                      </p>
                      <p className="text-xs text-white/50 truncate">{track.artistName}</p>
                    </div>
                  </div>
                  <Play className="w-4 h-4 fill-white text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PLAYLISTS TAB */}
      {activeTab === 'playlists' && (
        <div className="space-y-3">
          {/* Custom Playlists */}
          {customPlaylists.map((playlist: Playlist) => (
            <div
              key={playlist.id}
              className="p-3.5 rounded-2xl bg-white/[0.05] hover:bg-white/10 border border-white/10 flex items-center justify-between transition-all group"
            >
              {editingId === playlist.id ? (
                <form
                  onSubmit={(e) => handleRenameSubmit(playlist.id, e)}
                  className="flex items-center gap-2 flex-1"
                >
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    autoFocus
                    className="bg-black/60 border border-white/30 rounded-xl px-3 py-1.5 text-sm text-white focus:outline-none"
                  />
                  <button type="submit" className="text-xs font-bold px-3 py-1 bg-white text-black rounded-lg">
                    Save
                  </button>
                </form>
              ) : (
                <div
                  onClick={async () => {
                    const tracks = MOCK_TRACKS.filter((t: Track) => playlist.trackIds.includes(t.id));
                    onOpenDetail('playlist', playlist, tracks);
                  }}
                  className="flex items-center gap-3.5 flex-1 min-w-0 cursor-pointer"
                >
                  <img
                    src={playlist.coverUrl}
                    alt={playlist.title}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{playlist.title}</p>
                    <p className="text-xs text-white/50">{playlist.trackIds.length} tracks • Custom Playlist</p>
                  </div>
                </div>
              )}

              {/* Playlist Action Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setEditingId(playlist.id);
                    setEditTitle(playlist.title);
                  }}
                  className="p-2 text-white/40 hover:text-white rounded-full hover:bg-white/10 cursor-pointer"
                  title="Rename"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deletePlaylist(playlist.id)}
                  className="p-2 text-white/40 hover:text-rose-400 rounded-full hover:bg-white/10 cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Curated Standard Playlists */}
          {MOCK_PLAYLISTS.map((playlist: Playlist) => (
            <div
              key={playlist.id}
              onClick={async () => {
                const res = await musicProvider.getPlaylist(playlist.id);
                if (res) onOpenDetail('playlist', res.playlist, res.tracks);
              }}
              className="p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/10 border border-white/10 flex items-center justify-between transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={playlist.coverUrl}
                  alt={playlist.title}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">{playlist.title}</p>
                  <p className="text-xs text-white/50 truncate">{playlist.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ALBUMS TAB */}
      {activeTab === 'albums' && (
        <div className="grid grid-cols-2 gap-3">
          {MOCK_ALBUMS.map((album: Album) => (
            <div
              key={album.id}
              onClick={async () => {
                const res = await musicProvider.getAlbum(album.id);
                if (res) onOpenDetail('album', res.album, res.tracks);
              }}
              className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/10 border border-white/10 transition-all cursor-pointer group"
            >
              <div className="w-full aspect-square rounded-xl overflow-hidden mb-2">
                <img src={album.artworkUrl} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <p className="text-sm font-bold text-white truncate">{album.title}</p>
              <p className="text-xs text-white/50 truncate">{album.artistName}</p>
            </div>
          ))}
        </div>
      )}

      {/* ARTISTS TAB */}
      {activeTab === 'artists' && (
        <div className="space-y-2">
          {MOCK_ARTISTS.map((artist: Artist) => (
            <div
              key={artist.id}
              onClick={async () => {
                const res = await musicProvider.getArtist(artist.id);
                if (res) onOpenDetail('artist', res.artist, res.tracks);
              }}
              className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/10 border border-white/10 flex items-center gap-3 transition-all cursor-pointer"
            >
              <img src={artist.avatarUrl} alt={artist.name} className="w-12 h-12 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white truncate">{artist.name}</p>
                <p className="text-xs text-white/50">{artist.genres.join(', ')}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="space-y-2">
          {historyTracks.length === 0 ? (
            <p className="text-xs text-center text-white/40 py-8">No listening history recorded yet.</p>
          ) : (
            historyTracks.map((track: Track) => (
              <div
                key={track.id}
                onClick={() => playTrack(track, historyTracks)}
                className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img src={track.artworkUrl} alt={track.title} className="w-11 h-11 rounded-xl object-cover" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{track.title}</p>
                    <p className="text-xs text-white/50 truncate">{track.artistName}</p>
                  </div>
                </div>
                <Play className="w-4 h-4 text-white/60" />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
