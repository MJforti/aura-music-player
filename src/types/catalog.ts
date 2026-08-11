/**
 * AURA Scalable Catalog Architecture Types
 */

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  nextCursor?: string;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  cursor?: string;
}

export interface SearchOptions extends PaginationOptions {
  category?: 'all' | 'songs' | 'artists' | 'albums' | 'playlists';
  genre?: string;
}

export interface RecommendationOptions extends PaginationOptions {
  seedTrackIds?: string[];
  seedArtistIds?: string[];
  seedGenres?: string[];
}

export interface TrackLyricsLine {
  time: number;
  text: string;
}

export interface TrackLyrics {
  trackId: string;
  lines: TrackLyricsLine[];
  syncType?: 'LINE_SYNC' | 'UNSYNCED';
  copyright?: string;
}

export interface Track {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  artists?: { id: string; name: string }[];
  featuredArtists?: { id: string; name: string }[];
  albumId: string;
  albumName: string;
  artworkUrl: string;
  audioUrl?: string;
  duration: number; // in seconds
  releaseDate?: string;
  genre: string;
  explicit?: boolean;
  isrc?: string;
  previewStreamUrl?: string;
  providerId?: string;
  externalLinks?: { spotify?: string; appleMusic?: string; audius?: string };
  availability?: string[];
  lyrics?: TrackLyrics;
  isTrending?: boolean;
  isNewRelease?: boolean;
  playsCount?: number;
  accentColor?: string;
}

export interface Artist {
  id: string;
  name: string;
  avatarUrl: string;
  bannerUrl?: string;
  bio?: string;
  genres: string[];
  monthlyListeners?: number;
  popularTracks?: Track[];
  popularTrackIds?: string[];
  albums?: Album[];
  singles?: Album[];
  collaborations?: Track[];
  relatedArtists?: Artist[];
  providerId?: string;
  externalLinks?: { spotify?: string; appleMusic?: string };
}

export interface Album {
  id: string;
  title: string;
  artworkUrl: string;
  artists?: { id: string; name: string }[];
  artistId: string;
  artistName: string;
  releaseDate?: string;
  releaseYear: number;
  albumType?: 'album' | 'single' | 'ep' | 'compilation';
  genres?: string[];
  genre?: string;
  totalTracks?: number;
  trackList?: Track[];
  trackIds?: string[];
  providerId?: string;
}

export interface Playlist {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  artworkUrl?: string;
  coverUrl?: string;
  owner?: { id: string; name: string; avatarUrl?: string };
  tracks?: Track[];
  trackIds?: string[];
  totalTracks?: number;
  followersCount?: number;
  isPublic?: boolean;
  isCustom?: boolean;
  providerId?: string;
  createdAt?: string;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
  color: string;
  artworkUrl?: string;
  description?: string;
}

export interface PlaybackSource {
  url: string;
  format: 'mp3' | 'aac' | 'hls' | 'dash';
  bitRate?: number; // e.g. 256, 320
  expiresAt?: number;
  providerId: string;
  trackId: string;
}

export interface SearchResults {
  topResult?: Track | Artist | Album;
  tracks: PaginatedResult<Track>;
  artists: PaginatedResult<Artist>;
  albums: PaginatedResult<Album>;
  playlists: PaginatedResult<Playlist>;
}
