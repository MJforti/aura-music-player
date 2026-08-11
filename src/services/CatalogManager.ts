import { ICatalogProvider } from './providers/ICatalogProvider';
import { IPlaybackProvider } from './providers/IPlaybackProvider';
import { ITunesCatalogProvider } from './providers/ITunesCatalogProvider';
import { StandardPlaybackProvider } from './providers/StandardPlaybackProvider';
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
  PlaybackSource,
} from '../types/catalog';

/**
 * CatalogManager
 * Centralized service facade unifying ICatalogProvider and IPlaybackProvider.
 * Provides complete provider independence for the AURA frontend.
 */
export class CatalogManager {
  private catalogProvider: ICatalogProvider;
  private playbackProvider: IPlaybackProvider;

  constructor(catalogProvider?: ICatalogProvider, playbackProvider?: IPlaybackProvider) {
    this.catalogProvider = catalogProvider || new ITunesCatalogProvider();
    this.playbackProvider = playbackProvider || new StandardPlaybackProvider();
  }

  public setCatalogProvider(provider: ICatalogProvider): void {
    this.catalogProvider = provider;
  }

  public setPlaybackProvider(provider: IPlaybackProvider): void {
    this.playbackProvider = provider;
  }

  public get activeCatalogProviderId(): string {
    return this.catalogProvider.providerId;
  }

  public get activePlaybackProviderId(): string {
    return this.playbackProvider.providerId;
  }

  // --- Catalog Facade Methods ---

  public async search(query: string, options?: SearchOptions): Promise<SearchResults> {
    return this.catalogProvider.search(query, options);
  }

  public async getTrack(id: string): Promise<Track | null> {
    return this.catalogProvider.getTrack(id);
  }

  public async getArtist(id: string): Promise<Artist | null> {
    return this.catalogProvider.getArtist(id);
  }

  public async getAlbum(id: string): Promise<Album | null> {
    return this.catalogProvider.getAlbum(id);
  }

  public async getPlaylist(id: string): Promise<Playlist | null> {
    return this.catalogProvider.getPlaylist(id);
  }

  public async getArtistAlbums(id: string, options?: PaginationOptions): Promise<PaginatedResult<Album>> {
    return this.catalogProvider.getArtistAlbums(id, options);
  }

  public async getAlbumTracks(id: string, options?: PaginationOptions): Promise<PaginatedResult<Track>> {
    return this.catalogProvider.getAlbumTracks(id, options);
  }

  public async getArtistTracks(id: string, options?: PaginationOptions): Promise<PaginatedResult<Track>> {
    return this.catalogProvider.getArtistTracks(id, options);
  }

  public async getNewReleases(options?: PaginationOptions): Promise<PaginatedResult<Album>> {
    return this.catalogProvider.getNewReleases(options);
  }

  public async getTrending(options?: PaginationOptions): Promise<PaginatedResult<Track>> {
    return this.catalogProvider.getTrending(options);
  }

  public async getRecommendations(options?: RecommendationOptions): Promise<PaginatedResult<Track>> {
    return this.catalogProvider.getRecommendations(options);
  }

  public async getGenres(): Promise<Genre[]> {
    return this.catalogProvider.getGenres();
  }

  // --- Playback Facade Methods ---

  public async getStream(track: Track): Promise<PlaybackSource> {
    const url = track.previewStreamUrl || track.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
    return {
      url,
      format: 'mp3',
      bitRate: 320,
      providerId: track.providerId || 'standard',
      trackId: track.id,
    };
  }
}

export const catalogManager = new CatalogManager();
