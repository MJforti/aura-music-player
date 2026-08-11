import React, { createContext, useContext, useState, useEffect } from 'react';
import { Playlist, Track } from '../types/music';
import { MOCK_TRACKS } from '../services/MockMusicProvider';

interface UserContextType {
  likedTrackIds: string[];
  likedTracks: Track[];
  toggleLikeTrack: (trackId: string) => void;
  isLiked: (trackId: string) => boolean;

  customPlaylists: Playlist[];
  createPlaylist: (title: string, description?: string, initialTrackId?: string) => Playlist;
  renamePlaylist: (playlistId: string, newTitle: string) => void;
  deletePlaylist: (playlistId: string) => void;
  addTrackToPlaylist: (playlistId: string, trackId: string) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;

  historyTrackIds: string[];
  addToHistory: (trackId: string) => void;
  clearHistory: () => void;

  audioQuality: 'Normal' | 'High' | 'Lossless';
  setAudioQuality: (q: 'Normal' | 'High' | 'Lossless') => void;
  equalizer: 'Flat' | 'Aura Clarity' | 'Bass Boost' | 'Vocal Glow';
  setEqualizer: (eq: 'Flat' | 'Aura Clarity' | 'Bass Boost' | 'Vocal Glow') => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const LOCAL_STORAGE_LIKES = 'aura_user_likes';
const LOCAL_STORAGE_PLAYLISTS = 'aura_user_playlists';
const LOCAL_STORAGE_HISTORY = 'aura_user_history';

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [likedTrackIds, setLikedTrackIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_LIKES);
      return saved ? JSON.parse(saved) : ['trk-1', 'trk-2', 'trk-3', 'trk-6'];
    } catch {
      return ['trk-1', 'trk-2', 'trk-3', 'trk-6'];
    }
  });

  const [customPlaylists, setCustomPlaylists] = useState<Playlist[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PLAYLISTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [historyTrackIds, setHistoryTrackIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_HISTORY);
      return saved ? JSON.parse(saved) : ['trk-1', 'trk-2'];
    } catch {
      return ['trk-1', 'trk-2'];
    }
  });

  const [audioQuality, setAudioQuality] = useState<'Normal' | 'High' | 'Lossless'>('High');
  const [equalizer, setEqualizer] = useState<'Flat' | 'Aura Clarity' | 'Bass Boost' | 'Vocal Glow'>('Aura Clarity');

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_LIKES, JSON.stringify(likedTrackIds));
    } catch (e) {
      console.error('Failed to save likes', e);
    }
  }, [likedTrackIds]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PLAYLISTS, JSON.stringify(customPlaylists));
    } catch (e) {
      console.error('Failed to save playlists', e);
    }
  }, [customPlaylists]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_HISTORY, JSON.stringify(historyTrackIds));
    } catch (e) {
      console.error('Failed to save history', e);
    }
  }, [historyTrackIds]);

  const toggleLikeTrack = (trackId: string) => {
    setLikedTrackIds((prev) =>
      prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId]
    );
  };

  const isLiked = (trackId: string) => likedTrackIds.includes(trackId);

  const likedTracks: Track[] = MOCK_TRACKS.filter((t: Track) => likedTrackIds.includes(t.id));

  const createPlaylist = (title: string, description: string = '', initialTrackId?: string): Playlist => {
    const newPlaylist: Playlist = {
      id: `custom-ply-${Date.now()}`,
      title,
      description: description || 'Custom user playlist on AURA',
      coverUrl: initialTrackId
        ? MOCK_TRACKS.find((t: Track) => t.id === initialTrackId)?.artworkUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      trackIds: initialTrackId ? [initialTrackId] : [],
      isCustom: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setCustomPlaylists((prev) => [newPlaylist, ...prev]);
    return newPlaylist;
  };

  const renamePlaylist = (playlistId: string, newTitle: string) => {
    setCustomPlaylists((prev) =>
      prev.map((p) => (p.id === playlistId ? { ...p, title: newTitle } : p))
    );
  };

  const deletePlaylist = (playlistId: string) => {
    setCustomPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
  };

  const addTrackToPlaylist = (playlistId: string, trackId: string) => {
    setCustomPlaylists((prev) =>
      prev.map((p) => {
        if (p.id === playlistId && !p.trackIds.includes(trackId)) {
          return { ...p, trackIds: [...p.trackIds, trackId] };
        }
        return p;
      })
    );
  };

  const removeTrackFromPlaylist = (playlistId: string, trackId: string) => {
    setCustomPlaylists((prev) =>
      prev.map((p) => {
        if (p.id === playlistId) {
          return { ...p, trackIds: p.trackIds.filter((id) => id !== trackId) };
        }
        return p;
      })
    );
  };

  const addToHistory = (trackId: string) => {
    setHistoryTrackIds((prev) => [trackId, ...prev.filter((id) => id !== trackId)].slice(0, 30));
  };

  const clearHistory = () => {
    setHistoryTrackIds([]);
  };

  return (
    <UserContext.Provider
      value={{
        likedTrackIds,
        likedTracks,
        toggleLikeTrack,
        isLiked,
        customPlaylists,
        createPlaylist,
        renamePlaylist,
        deletePlaylist,
        addTrackToPlaylist,
        removeTrackFromPlaylist,
        historyTrackIds,
        addToHistory,
        clearHistory,
        audioQuality,
        setAudioQuality,
        equalizer,
        setEqualizer,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
