import { MusicDiscoverySource, CanonicalTrack, ChartEntry, CanonicalArtist, CanonicalAlbum } from '../../types/discovery';
import { sourceHealthManager } from '../engine/SourceHealthManager';

export class DeezerDiscoverySource implements MusicDiscoverySource {
  public id = 'deezer';
  public name = 'Deezer Global API';
  public isHealthy = true;

  private async fetchApi(url: string) {
    const startTime = Date.now();
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Deezer HTTP ${res.status}`);
      const data = await res.json();
      sourceHealthManager.recordSuccess(this.id, Date.now() - startTime);
      return data;
    } catch (e) {
      sourceHealthManager.recordFailure(this.id, (e as Error).message);
      return null;
    }
  }

  private mapTrack(item: any): CanonicalTrack {
    return {
      id: `deezer-${item.id || Date.now()}`,
      title: item.title || 'Untitled Track',
      artistId: `art-${item.artist?.id || item.artist?.name}`,
      artistName: item.artist?.name || 'Unknown Artist',
      artists: [{ id: `art-${item.artist?.id || item.artist?.name}`, name: item.artist?.name || 'Unknown Artist' }],
      albumId: `alb-${item.album?.id || item.album?.title}`,
      albumName: item.album?.title || 'Single',
      artworkUrl: item.album?.cover_big || item.album?.cover_medium || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      previewStreamUrl: item.preview || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      duration: item.duration || 180,
      releaseDate: item.release_date,
      genre: 'Pop',
      explicit: item.explicit_lyrics || false,
      isrc: item.isrc,
      trendingScore: 70,
      popularitySignals: [{ sourceId: this.id, rankScore: 75, updatedAt: new Date().toISOString() }],
      sourceIds: { deezer: String(item.id || '') },
      externalLinks: [{ provider: 'deezer', url: item.link || '' }],
      isTrending: true,
    };
  }

  async search(query: string): Promise<CanonicalTrack[]> {
    const data = await this.fetchApi(`https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=25`);
    return data?.data ? data.data.map((t: any) => this.mapTrack(t)) : [];
  }

  async getTrending(): Promise<CanonicalTrack[]> {
    const data = await this.fetchApi(`https://api.deezer.com/chart/0/tracks?limit=25`);
    return data?.data ? data.data.map((t: any) => this.mapTrack(t)) : [];
  }

  async getCharts(): Promise<ChartEntry[]> {
    const tracks = await this.getTrending();
    return tracks.map((track, idx) => ({
      position: idx + 1,
      track,
      chartName: 'Deezer Top 50 Global Chart',
    }));
  }

  async getNewReleases(): Promise<CanonicalTrack[]> {
    return this.getTrending();
  }

  async getArtist(id: string): Promise<CanonicalArtist | null> {
    const rawId = id.replace('art-', '');
    const data = await this.fetchApi(`https://api.deezer.com/artist/${rawId}`);
    if (!data) return null;
    return {
      id: `art-${data.id}`,
      name: data.name || 'Artist',
      avatarUrl: data.picture_big || '',
      genres: ['Music'],
      sourceIds: { deezer: String(data.id) },
      externalLinks: [{ provider: 'deezer', url: data.link || '' }],
    };
  }

  async getTrack(id: string): Promise<CanonicalTrack | null> {
    const rawId = id.replace('deezer-', '');
    const data = await this.fetchApi(`https://api.deezer.com/track/${rawId}`);
    return data ? this.mapTrack(data) : null;
  }

  async getAlbum(id: string): Promise<CanonicalAlbum | null> {
    const rawId = id.replace('alb-', '');
    const data = await this.fetchApi(`https://api.deezer.com/album/${rawId}`);
    if (!data) return null;
    return {
      id: `alb-${data.id}`,
      title: data.title || 'Album',
      artworkUrl: data.cover_big || '',
      artistId: `art-${data.artist?.id}`,
      artistName: data.artist?.name || '',
      releaseYear: parseInt(data.release_date?.split('-')[0] || '2026'),
      genres: ['Music'],
      sourceIds: { deezer: String(data.id) },
    };
  }
}
