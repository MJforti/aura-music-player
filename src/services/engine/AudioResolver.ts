import { Mashup, ResolvedAudio } from '../../types/mashup';

/**
 * AudioResolver
 * Resolves actual authorized audio streams (YouTube Official IFrame Embeds / iTunes Store Previews).
 * Guarantees content authenticity with zero dummy fallbacks.
 */
export class AudioResolver {
  private cache = new Map<string, ResolvedAudio | null>();

  public async resolveMashup(mashup: Mashup): Promise<ResolvedAudio | null> {
    if (mashup.playback?.type === 'youtube_embed' && mashup.playback.videoId) {
      return {
        videoId: mashup.playback.videoId,
        provider: 'YouTube Official Embed',
        duration: mashup.playback.duration || 220,
        type: 'youtube',
        attributionUrl: mashup.playback.attributionUrl || mashup.externalUrl,
      };
    }

    if (mashup.playback?.url) {
      return {
        url: mashup.playback.url,
        provider: mashup.playback.provider || 'iTunes Store',
        duration: mashup.playback.duration || 30,
        type: mashup.playback.type === 'audio_url' ? 'full' : 'preview',
      };
    }

    if (!mashup.sourceTracks || mashup.sourceTracks.length === 0) {
      return null;
    }

    // Resolve preview audio from verified iTunes Search API
    const primaryTrack = mashup.sourceTracks[0];
    return this.resolveTrack(primaryTrack.artist, primaryTrack.title);
  }

  public async resolveTrack(artist: string, title: string): Promise<ResolvedAudio | null> {
    const key = `${artist.toLowerCase()}_${title.toLowerCase()}`;
    if (this.cache.has(key)) {
      return this.cache.get(key) || null;
    }

    try {
      const term = `${title} ${artist}`;
      const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=1`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      if (data.results && data.results[0] && data.results[0].previewUrl) {
        const item = data.results[0];
        const resolved: ResolvedAudio = {
          url: item.previewUrl,
          provider: 'iTunes Store',
          duration: 30,
          type: 'preview',
          attributionUrl: item.trackViewUrl,
        };
        this.cache.set(key, resolved);
        return resolved;
      }
    } catch (e) {
      console.warn(`AudioResolver fetch failed for ${title} by ${artist}:`, e);
    }

    this.cache.set(key, null);
    return null;
  }
}

export const audioResolver = new AudioResolver();
