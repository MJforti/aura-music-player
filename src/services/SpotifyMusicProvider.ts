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
 * SpotifyMusicProvider
 * Integration for Spotify's Official Web API.
 * Portal: https://developer.spotify.com/dashboard
 */
export class SpotifyMusicProvider implements IMusicProvider {
  private clientId: string | null = null;
  private clientSecret: string | null = null;
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor(clientId?: string, clientSecret?: string, accessToken?: string) {
    this.clientId = clientId || null;
    this.clientSecret = clientSecret || null;
    this.accessToken = accessToken || null;
  }

  /**
   * Automatically fetch an App Access Token using Spotify Client Credentials Flow
   */
  public async authenticateWithClientCredentials(clientId: string, clientSecret: string): Promise<boolean> {
    this.clientId = clientId;
    this.clientSecret = clientSecret;

    try {
      const authHeader = btoa(`${clientId}:${clientSecret}`);
      const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${authHeader}`,
        },
        body: 'grant_type=client_credentials',
      });

      if (!res.ok) {
        console.error('Spotify Auth Failed:', await res.text());
        return false;
      }

      const data = await res.json();
      this.accessToken = data.access_token;
      this.tokenExpiresAt = Date.now() + data.expires_in * 1000;
      return true;
    } catch (e) {
      console.error('Spotify Authentication Error:', e);
      return false;
    }
  }

  public setAccessToken(token: string) {
    this.accessToken = token;
  }

  private async ensureToken(): Promise<boolean> {
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return true;
    }
    if (this.clientId && this.clientSecret) {
      return await this.authenticateWithClientCredentials(this.clientId, this.clientSecret);
    }
    return !!this.accessToken;
  }

  private async fetchSpotify(endpoint: string) {
    const ready = await this.ensureToken();
    if (!ready || !this.accessToken) {
      console.warn('Spotify access token missing. Please provide Client ID & Secret or User Access Token.');
      return null;
    }
    try {
      const res = await fetch(`https://api.spotify.com/v1${endpoint}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });
      if (!res.ok) throw new Error(`Spotify API error HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.error('Spotify API fetch error:', e);
      return null;
    }
  }

  private mapSpotifyTrack(item: any): Track {
    return {
      id: item.id,
      title: item.name,
      artistId: item.artists?.[0]?.id || 'spotify-artist',
      artistName: item.artists?.map((a: any) => a.name).join(', ') || 'Unknown Artist',
      albumId: item.album?.id || 'spotify-album',
      albumName: item.album?.name || 'Single',
      artworkUrl: item.album?.images?.[0]?.url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      audioUrl: item.preview_url || '',
      duration: Math.round((item.duration_ms || 180000) / 1000),
      genre: 'Pop/Modern',
      accentColor: '#1DB954',
      releaseDate: item.album?.release_date || new Date().toISOString(),
      isTrending: true,
    };
  }

  async getHomeFeed(): Promise<HomeFeed> {
    const newReleases = await this.fetchSpotify('/browse/new-releases?limit=10');
    const tracks: Track[] = newReleases?.albums?.items
      ? newReleases.albums.items.map((alb: any) => ({
          id: alb.id,
          title: alb.name,
          artistId: alb.artists?.[0]?.id || '',
          artistName: alb.artists?.[0]?.name || '',
          albumId: alb.id,
          albumName: alb.name,
          artworkUrl: alb.images?.[0]?.url || '',
          audioUrl: '',
          duration: 210,
          genre: 'Pop',
          isNewRelease: true,
        }))
      : [];

    return {
      recentlyPlayed: tracks.slice(0, 4),
      newReleases: tracks,
      trending: tracks,
      recommendations: tracks,
      popularAlbums: [],
      popularArtists: [],
      recentlyAdded: tracks,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }

  async search(query: string): Promise<SearchResult> {
    const data = await this.fetchSpotify(
      `/search?q=${encodeURIComponent(query)}&type=track,artist,album,playlist&limit=10`
    );

    const tracks: Track[] = data?.tracks?.items ? data.tracks.items.map((t: any) => this.mapSpotifyTrack(t)) : [];

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
    const data = await this.fetchSpotify(`/tracks/${id}`);
    return data ? this.mapSpotifyTrack(data) : null;
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
    const track = await this.getTrack(trackId);
    return track ? track.audioUrl : '';
  }
}
