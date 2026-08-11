import {
  Track,
  Artist,
  Album,
  Playlist,
  Genre,
  PaginatedResult,
  SearchOptions,
  PaginationOptions,
  RecommendationOptions,
  SearchResults,
} from '../../types/catalog';

/**
 * ICatalogProvider
 * Provider-agnostic metadata contract supporting scaled catalogs (10,000,000+ tracks).
 * Decoupled from audio playback binaries.
 */
export interface ICatalogProvider {
  providerId: string;

  /**
   * Universal search across songs, artists, albums, playlists.
   */
  search(query: string, options?: SearchOptions): Promise<SearchResults>;

  /**
   * Fetch single track metadata by ID.
   */
  getTrack(id: string): Promise<Track | null>;

  /**
   * Fetch full artist profile, bio, popular tracks, albums, related artists.
   */
  getArtist(id: string): Promise<Artist | null>;

  /**
   * Fetch album metadata and tracklist.
   */
  getAlbum(id: string): Promise<Album | null>;

  /**
   * Fetch playlist metadata and tracklist.
   */
  getPlaylist(id: string): Promise<Playlist | null>;

  /**
   * Paginated album list for an artist.
   */
  getArtistAlbums(id: string, options?: PaginationOptions): Promise<PaginatedResult<Album>>;

  /**
   * Paginated tracklist for an album.
   */
  getAlbumTracks(id: string, options?: PaginationOptions): Promise<PaginatedResult<Track>>;

  /**
   * Paginated track list for an artist.
   */
  getArtistTracks(id: string, options?: PaginationOptions): Promise<PaginatedResult<Track>>;

  /**
   * Paginated new release albums/tracks from provider.
   */
  getNewReleases(options?: PaginationOptions): Promise<PaginatedResult<Album>>;

  /**
   * Paginated trending/top tracks from provider.
   */
  getTrending(options?: PaginationOptions): Promise<PaginatedResult<Track>>;

  /**
   * Paginated recommendations based on seed options.
   */
  getRecommendations(options?: RecommendationOptions): Promise<PaginatedResult<Track>>;

  /**
   * Scalable genre and category list.
   */
  getGenres(): Promise<Genre[]>;
}
