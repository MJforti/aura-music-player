import { MusicDiscoverySource, CanonicalTrack, ChartEntry, CanonicalArtist, CanonicalAlbum } from '../../types/discovery';
import { sourceHealthManager } from '../engine/SourceHealthManager';

export class ITunesDiscoverySource implements MusicDiscoverySource {
  public id = 'itunes';
  public name = 'iTunes Search API';
  public isHealthy = true;

  private async fetchApi(url: string) {
    const startTime = Date.now();
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`iTunes HTTP ${res.status}`);
      const data = await res.json();
      sourceHealthManager.recordSuccess(this.id, Date.now() - startTime);
      return data;
    } catch (e) {
      sourceHealthManager.recordFailure(this.id, (e as Error).message);
      return null;
    }
  }

  private mapTrack(item: any): CanonicalTrack {
    const artwork = item.artworkUrl100
      ? item.artworkUrl100.replace('100x100bb', '600x600bb')
      : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';

    return {
      id: `itunes-${item.trackId || Date.now()}`,
      title: item.trackName || 'Untitled Track',
      artistId: `art-${item.artistId || item.artistName}`,
      artistName: item.artistName || 'Unknown Artist',
      artists: [{ id: `art-${item.artistId || item.artistName}`, name: item.artistName || 'Unknown Artist' }],
      albumId: `alb-${item.collectionId || item.collectionName}`,
      albumName: item.collectionName || 'Single',
      artworkUrl: artwork,
      previewStreamUrl: item.previewUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      duration: Math.round((item.trackTimeMillis || 180000) / 1000),
      releaseDate: item.releaseDate,
      genre: item.primaryGenreName || 'Music',
      explicit: item.trackExplicitness === 'explicit',
      isrc: item.isrc,
      trendingScore: 75,
      popularitySignals: [{ sourceId: this.id, rankScore: 80, updatedAt: new Date().toISOString() }],
      sourceIds: { itunes: String(item.trackId || '') },
      externalLinks: [{ provider: 'appleMusic', url: item.trackViewUrl || '' }],
      isTrending: true,
    };
  }

  async search(query: string): Promise<CanonicalTrack[]> {
    const data = await this.fetchApi(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=30`);
    return data?.results ? data.results.map((t: any) => this.mapTrack(t)) : [];
  }

  async getTrending(): Promise<CanonicalTrack[]> {
    const data = await this.fetchApi(`https://itunes.apple.com/search?term=Bollywood+Global+Top+50&entity=song&limit=25`);
    return data?.results ? data.results.map((t: any) => this.mapTrack(t)) : [];
  }

  async getCharts(): Promise<ChartEntry[]> {
    const tracks = await this.getTrending();
    return tracks.map((track, idx) => ({
      position: idx + 1,
      track,
      chartName: 'Apple iTunes Top Chart',
    }));
  }

  async getNewReleases(): Promise<CanonicalTrack[]> {
    const data = await this.fetchApi(`https://itunes.apple.com/search?term=Arijit+Singh+Taylor+Swift+Diljit+Dosanjh&entity=song&limit=25`);
    return data?.results ? data.results.map((t: any) => this.mapTrack(t)) : [];
  }

  async getArtist(id: string): Promise<CanonicalArtist | null> {
    const rawId = id.replace('art-', '');
    const data = await this.fetchApi(`https://itunes.apple.com/search?term=${encodeURIComponent(rawId)}&entity=song&limit=1`);
    if (!data?.results?.[0]) return null;

    const item = data.results[0];
    return {
      id: `art-${item.artistId || item.artistName}`,
      name: item.artistName || 'Artist',
      avatarUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      genres: [item.primaryGenreName || 'Music'],
      sourceIds: { itunes: String(item.artistId || '') },
      externalLinks: [{ provider: 'appleMusic', url: item.artistLinkUrl || '' }],
    };
  }

  async getTrack(id: string): Promise<CanonicalTrack | null> {
    const rawId = id.replace('itunes-', '');
    const data = await this.fetchApi(`https://itunes.apple.com/search?term=${encodeURIComponent(rawId)}&entity=song&limit=1`);
    return data?.results?.[0] ? this.mapTrack(data.results[0]) : null;
  }

  async getAlbum(id: string): Promise<CanonicalAlbum | null> {
    const rawId = id.replace('alb-', '');
    const data = await this.fetchApi(`https://itunes.apple.com/search?term=${encodeURIComponent(rawId)}&entity=song&limit=1`);
    if (!data?.results?.[0]) return null;

    const item = data.results[0];
    return {
      id: `alb-${item.collectionId || item.collectionName}`,
      title: item.collectionName || 'Album',
      artworkUrl: item.artworkUrl100?.replace('100x100bb', '600x600bb') || '',
      artistId: `art-${item.artistId || item.artistName}`,
      artistName: item.artistName || '',
      releaseYear: parseInt(item.releaseDate?.split('-')[0] || '2026'),
      genres: [item.primaryGenreName || 'Music'],
      sourceIds: { itunes: String(item.collectionId || '') },
    };
  }
}
