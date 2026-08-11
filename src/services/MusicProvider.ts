import {
  Track,
  Artist,
  Album,
  Playlist,
  HomeFeed,
  SearchResult,
} from '../types/music';

export interface IMusicProvider {
  /**
   * Fetch home screen feed containing personalized and trending music modules.
   * Supports forceRefresh for catalog update.
   */
  getHomeFeed(forceRefresh?: boolean): Promise<HomeFeed>;

  /**
   * Search songs, artists, albums, playlists, genres.
   */
  search(query: string, category?: string): Promise<SearchResult>;

  /**
   * Get latest track releases.
   */
  getNewReleases(): Promise<Track[]>;

  /**
   * Get currently trending tracks.
   */
  getTrending(): Promise<Track[]>;

  /**
   * Get recommendations based on genre or track ID.
   */
  getRecommendations(seedTrackId?: string): Promise<Track[]>;

  /**
   * Get single track details by ID.
   */
  getTrack(id: string): Promise<Track | null>;

  /**
   * Get single album details and track list.
   */
  getAlbum(id: string): Promise<{ album: Album; tracks: Track[] } | null>;

  /**
   * Get artist profile, bio, popular tracks, and albums.
   */
  getArtist(id: string): Promise<{ artist: Artist; tracks: Track[]; albums: Album[] } | null>;

  /**
   * Get playlist details and track list.
   */
  getPlaylist(id: string): Promise<{ playlist: Playlist; tracks: Track[] } | null>;

  /**
   * Resolve legal streamable audio URL for a given track ID.
   */
  getStreamUrl(trackId: string): Promise<string>;
}
