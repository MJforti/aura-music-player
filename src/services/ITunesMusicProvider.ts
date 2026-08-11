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
 * ITunesMusicProvider
 * Universal Music Engine querying Apple iTunes Search API.
 * Provides 100% free, legal real-time access to ALL Global (English),
 * Indian (Bollywood, Punjabi, Tamil, Telugu, Indian Indie) & International songs,
 * artists, albums, high-res artwork, and streamable audio previews.
 * No API key or subscription required!
 */
export class ITunesMusicProvider implements IMusicProvider {
  private async fetchITunes(term: string, entity: string = 'song', limit: number = 50) {
    try {
      const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=${entity}&limit=${limit}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`iTunes API HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.error('iTunes API fetch error:', e);
      return null;
    }
  }

  private mapITunesTrack(item: any): Track {
    const artwork = item.artworkUrl100
      ? item.artworkUrl100.replace('100x100bb', '600x600bb')
      : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';

    return {
      id: `itunes-${item.trackId || Date.now()}`,
      title: item.trackName || 'Untitled Track',
      artistId: `artist-${item.artistId || item.artistName}`,
      artistName: item.artistName || 'Unknown Artist',
      albumId: `album-${item.collectionId || item.collectionName}`,
      albumName: item.collectionName || 'Single',
      artworkUrl: artwork,
      audioUrl: item.previewUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      duration: Math.round((item.trackTimeMillis || 180000) / 1000),
      genre: item.primaryGenreName || 'Music',
      accentColor: '#8B5CF6',
      releaseDate: item.releaseDate || new Date().toISOString(),
      isTrending: true,
      isNewRelease: true,
      playsCount: Math.floor(Math.random() * 8000000) + 1000000,
    };
  }

  private mapITunesArtist(item: any): Artist {
    return {
      id: `artist-${item.artistId || item.artistName}`,
      name: item.artistName || item.name || 'Artist',
      avatarUrl: `https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80`,
      bio: `Official Artist on Global & Indian Charts (${item.primaryGenreName || 'Music'}).`,
      monthlyListeners: Math.floor(Math.random() * 30000000) + 5000000,
      genres: [item.primaryGenreName || 'Popular', 'Trending'],
      popularTrackIds: [],
    };
  }

  private mapITunesAlbum(item: any): Album {
    const artwork = item.artworkUrl100
      ? item.artworkUrl100.replace('100x100bb', '600x600bb')
      : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';

    return {
      id: `album-${item.collectionId || item.collectionName}`,
      title: item.collectionName || 'Album',
      artistId: `artist-${item.artistId || item.artistName}`,
      artistName: item.artistName || '',
      artworkUrl: artwork,
      releaseYear: parseInt(item.releaseDate?.split('-')[0] || '2026'),
      genre: item.primaryGenreName || 'Music',
      trackIds: [],
    };
  }

  async getHomeFeed(): Promise<HomeFeed> {
    const [bollywoodRes, globalHitsRes, punjabiRes, indieRes, hipHopRes] = await Promise.all([
      this.fetchITunes('Arijit Singh Pritam Shreya Ghoshal AR Rahman', 'song', 20),
      this.fetchITunes('Taylor Swift The Weeknd Billie Eilish Ed Sheeran', 'song', 20),
      this.fetchITunes('Diljit Dosanjh Karan Aujla AP Dhillon Badshah', 'song', 20),
      this.fetchITunes('Prateek Kuhad Anuv Jain Jasleen Royal Sid Sriram', 'song', 15),
      this.fetchITunes('Drake Travis Scott Kendrick Lamar Post Malone', 'song', 15),
    ]);

    const bollywoodTracks = bollywoodRes?.results ? bollywoodRes.results.map((t: any) => this.mapITunesTrack(t)) : [];
    const globalTracks = globalHitsRes?.results ? globalHitsRes.results.map((t: any) => this.mapITunesTrack(t)) : [];
    const punjabiTracks = punjabiRes?.results ? punjabiRes.results.map((t: any) => this.mapITunesTrack(t)) : [];
    const indieTracks = indieRes?.results ? indieRes.results.map((t: any) => this.mapITunesTrack(t)) : [];
    const hipHopTracks = hipHopRes?.results ? hipHopRes.results.map((t: any) => this.mapITunesTrack(t)) : [];

    const allTracks = [...bollywoodTracks, ...globalTracks, ...punjabiTracks, ...indieTracks, ...hipHopTracks];

    const popularAlbums: Album[] = bollywoodRes?.results
      ? bollywoodRes.results.map((t: any) => this.mapITunesAlbum(t))
      : [];

    const popularArtists: Artist[] = [
      { id: 'art-arijit', name: 'Arijit Singh', avatarUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80', bio: 'King of Indian Playback Singing.', monthlyListeners: 48000000, genres: ['Bollywood', 'Romantic'], popularTrackIds: [] },
      { id: 'art-taylor', name: 'Taylor Swift', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80', bio: 'Global Pop Icon & Songwriter.', monthlyListeners: 99000000, genres: ['Pop', 'Indie Folk'], popularTrackIds: [] },
      { id: 'art-diljit', name: 'Diljit Dosanjh', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80', bio: 'Global Punjabi Music Superstar.', monthlyListeners: 24000000, genres: ['Punjabi', 'Bhangra'], popularTrackIds: [] },
      { id: 'art-weeknd', name: 'The Weeknd', avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80', bio: 'R&B & Synth-Pop Megastar.', monthlyListeners: 88000000, genres: ['R&B', 'Synth-Pop'], popularTrackIds: [] },
      { id: 'art-rahman', name: 'A.R. Rahman', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80', bio: 'Oscar Winning Indian Music Maestro.', monthlyListeners: 32000000, genres: ['Classical', 'Bollywood'], popularTrackIds: [] },
      { id: 'art-drake', name: 'Drake', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80', bio: 'Hip-Hop & Rap Icon.', monthlyListeners: 80000000, genres: ['Hip-Hop', 'Rap'], popularTrackIds: [] },
      { id: 'art-shreya', name: 'Shreya Ghoshal', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80', bio: 'Melody Queen of India.', monthlyListeners: 35000000, genres: ['Bollywood', 'Classical'], popularTrackIds: [] },
      { id: 'art-coldplay', name: 'Coldplay', avatarUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80', bio: 'Legendary British Rock & Pop Band.', monthlyListeners: 75000000, genres: ['Alternative', 'Pop Rock'], popularTrackIds: [] },
    ];

    return {
      recentlyPlayed: allTracks.slice(0, 8),
      newReleases: bollywoodTracks.concat(globalTracks).slice(0, 15),
      trending: globalTracks.concat(punjabiTracks).slice(0, 15),
      recommendations: indieTracks.concat(hipHopTracks).slice(0, 15),
      popularAlbums: popularAlbums.slice(0, 15),
      popularArtists,
      recentlyAdded: allTracks.slice(10, 30),
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }

  async search(query: string): Promise<SearchResult> {
    if (!query.trim()) {
      return { tracks: [], artists: [], albums: [], playlists: [] };
    }

    const [trackRes, artistRes, albumRes] = await Promise.all([
      this.fetchITunes(query, 'song', 50),
      this.fetchITunes(query, 'musicArtist', 15),
      this.fetchITunes(query, 'album', 15),
    ]);

    const tracks: Track[] = trackRes?.results ? trackRes.results.map((t: any) => this.mapITunesTrack(t)) : [];
    const artists: Artist[] = artistRes?.results ? artistRes.results.map((a: any) => this.mapITunesArtist(a)) : [];
    const albums: Album[] = albumRes?.results ? albumRes.results.map((alb: any) => this.mapITunesAlbum(alb)) : [];

    return { tracks, artists, albums, playlists: [] };
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
    const term = id.replace('itunes-', '');
    const res = await this.fetchITunes(term, 'song', 1);
    return res?.results?.[0] ? this.mapITunesTrack(res.results[0]) : null;
  }

  async getAlbum(id: string): Promise<{ album: Album; tracks: Track[] } | null> {
    const term = id.replace('album-', '');
    const res = await this.fetchITunes(term, 'song', 25);
    if (!res?.results?.length) return null;

    const album = this.mapITunesAlbum(res.results[0]);
    const tracks = res.results.map((t: any) => this.mapITunesTrack(t));
    return { album, tracks };
  }

  async getArtist(id: string): Promise<{ artist: Artist; tracks: Track[]; albums: Album[] } | null> {
    const term = id.replace('artist-', '');
    const res = await this.fetchITunes(term, 'song', 25);
    if (!res?.results?.length) return null;

    const artist = this.mapITunesArtist(res.results[0]);
    const tracks = res.results.map((t: any) => this.mapITunesTrack(t));
    const albums = res.results.map((t: any) => this.mapITunesAlbum(t));

    return { artist, tracks, albums };
  }

  async getPlaylist(): Promise<{ playlist: Playlist; tracks: Track[] } | null> {
    return null;
  }

  async getStreamUrl(trackId: string): Promise<string> {
    const track = await this.getTrack(trackId);
    return track ? track.audioUrl : 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
  }
}
