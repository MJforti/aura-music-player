import { IMusicProvider } from './MusicProvider';
import {
  Track,
  Artist,
  Album,
  Playlist,
  HomeFeed,
  SearchResult,
} from '../types/music';

/**
 * AudiusMusicProvider
 * Audius is a free, decentralized, legal open-source music streaming network
 * with over 1M+ real songs, artists, albums, and streaming audio.
 * No API key required!
 */
export class AudiusMusicProvider implements IMusicProvider {
  private apiHost = 'https://discoveryprovider.audius.co/v1';

  private async fetchJson(endpoint: string) {
    try {
      const res = await fetch(`${this.apiHost}${endpoint}?app_name=AURA_MUSIC`);
      if (!res.ok) throw new Error(`Audius API HTTP ${res.status}`);
      const json = await res.json();
      return json.data;
    } catch (e) {
      console.error('Audius API fetch error:', e);
      return null;
    }
  }

  private mapAudiusTrack(t: any): Track {
    return {
      id: t.id,
      title: t.title || 'Untitled Track',
      artistId: t.user?.id || 'audius-artist',
      artistName: t.user?.name || t.user?.handle || 'Unknown Artist',
      albumId: `alb-${t.id}`,
      albumName: t.genre || 'Audius Release',
      artworkUrl: t.artwork?.['480x480'] || t.artwork?.['150x150'] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      audioUrl: `${this.apiHost}/tracks/${t.id}/stream?app_name=AURA_MUSIC`,
      duration: t.duration || 180,
      genre: t.genre || 'Electronic',
      accentColor: '#8B5CF6',
      releaseDate: t.release_date || new Date().toISOString(),
      playsCount: t.play_count || 1000,
      isTrending: true,
    };
  }

  async getHomeFeed(): Promise<HomeFeed> {
    const trendingData = await this.fetchJson('/tracks/trending');
    const tracks: Track[] = Array.isArray(trendingData)
      ? trendingData.slice(0, 20).map((t) => this.mapAudiusTrack(t))
      : [];

    return {
      recentlyPlayed: tracks.slice(0, 4),
      newReleases: tracks.slice(4, 10),
      trending: tracks,
      recommendations: tracks.slice(10, 16),
      popularAlbums: [],
      popularArtists: [],
      recentlyAdded: tracks.slice(6, 14),
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }

  async search(query: string): Promise<SearchResult> {
    const data = await this.fetchJson(`/tracks/search?query=${encodeURIComponent(query)}`);
    const tracks: Track[] = Array.isArray(data)
      ? data.map((t) => this.mapAudiusTrack(t))
      : [];

    return {
      tracks,
      artists: [],
      albums: [],
      playlists: [],
    };
  }

  async getNewReleases(): Promise<Track[]> {
    const feed = await this.getHomeFeed();
    return feed.newReleases;
  }

  async getTrending(): Promise<Track[]> {
    const feed = await this.getHomeFeed();
    return feed.trending;
  }

  async getRecommendations(): Promise<Track[]> {
    const feed = await this.getHomeFeed();
    return feed.recommendations;
  }

  async getTrack(id: string): Promise<Track | null> {
    const data = await this.fetchJson(`/tracks/${id}`);
    return data ? this.mapAudiusTrack(data) : null;
  }

  async getAlbum(): Promise<{ album: Album; tracks: Track[] } | null> {
    return null;
  }

  async getArtist(): Promise<{ artist: Artist; tracks: Track[]; albums: Album[] } | null> {
    return null;
  }

  async getPlaylist(): Promise<{ playlist: Playlist; tracks: Track[] } | null> {
    return null;
  }

  async getStreamUrl(trackId: string): Promise<string> {
    return `${this.apiHost}/tracks/${trackId}/stream?app_name=AURA_MUSIC`;
  }
}
