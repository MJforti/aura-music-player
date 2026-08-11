import {
  Track as CatalogTrack,
  Artist as CatalogArtist,
  Album as CatalogAlbum,
  Playlist as CatalogPlaylist,
  TrackLyricsLine,
  TrackLyrics,
} from './catalog';

export type { TrackLyricsLine, TrackLyrics };
export type Lyrics = TrackLyrics;

export interface Track extends CatalogTrack {
  audioUrl: string;
}

export interface Artist extends CatalogArtist {
  monthlyListeners: number;
  popularTrackIds?: string[];
}

export interface Album extends CatalogAlbum {
  trackIds?: string[];
  genre: string;
}

export interface Playlist extends CatalogPlaylist {
  title: string;
  description: string;
  coverUrl: string;
  trackIds: string[];
  isCustom?: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  likedTrackIds: string[];
  playlistIds: string[];
  historyTrackIds: string[];
}

export type RepeatMode = 'off' | 'all' | 'one';

export interface PlaybackState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  queue: Track[];
  queueIndex: number;
  shuffleEnabled: boolean;
  repeatMode: RepeatMode;
  buffering: boolean;
  loading: boolean;
  error: string | null;
}

export interface SearchResult {
  tracks: Track[];
  artists: Artist[];
  albums: Album[];
  playlists: Playlist[];
}

export interface HomeFeed {
  recentlyPlayed: Track[];
  newReleases: Track[];
  trending: Track[];
  recommendations: Track[];
  popularAlbums: Album[];
  popularArtists: Artist[];
  recentlyAdded: Track[];
  lastUpdated: string;
}
