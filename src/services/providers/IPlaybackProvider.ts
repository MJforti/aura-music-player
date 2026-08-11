import { PlaybackSource } from '../../types/catalog';

/**
 * IPlaybackProvider
 * Decoupled stream resolver resolving authorized audio streams
 * independently from catalog metadata providers.
 */
export interface IPlaybackProvider {
  providerId: string;

  /**
   * Resolve authorized stream source (URL, format, bitRate, expiration) for a given track ID.
   */
  getStream(trackId: string, providerId?: string): Promise<PlaybackSource>;
}
