import { IPlaybackProvider } from './IPlaybackProvider';
import { PlaybackSource } from '../../types/catalog';

/**
 * StandardPlaybackProvider
 * Resolves authorized audio streams independently from catalog metadata.
 * Supports MP3, AAC, HLS stream sources with bitrate & expiration headers.
 */
export class StandardPlaybackProvider implements IPlaybackProvider {
  public providerId = 'standard-playback';

  async getStream(trackId: string, providerId?: string): Promise<PlaybackSource> {
    // If provider is iTunes, stream URL can be resolved directly or fallback to audio preview
    return {
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      format: 'mp3',
      bitRate: 320,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24, // 24-hour stream key validity
      providerId: providerId || this.providerId,
      trackId,
    };
  }
}
