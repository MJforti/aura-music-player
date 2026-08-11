export interface LyricsLine {
  time: number; // in seconds
  text: string;
}

export interface Lyrics {
  trackId: string;
  lines: LyricsLine[];
}

export interface Track {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  albumId: string;
  albumName: string;
  artworkUrl: string;
  audioUrl: string;
  duration: number; // seconds
  genre: string;
  lyrics?: Lyrics;
  accentColor?: string;
  releaseDate?: string;
  isExplicit?: boolean;
  isTrending?: boolean;
  isNewRelease?: boolean;
  playsCount?: number;
}

export interface Artist {
  id: string;
  name: string;
  avatarUrl: string;
  bio: string;
  monthlyListeners: number;
  genres: string[];
  popularTrackIds: string[];
}

export interface Album {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  artworkUrl: string;
  releaseYear: number;
  trackIds: string[];
  genre: string;
}

export interface Playlist {
  id: string;
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
