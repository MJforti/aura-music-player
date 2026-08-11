import { IMusicProvider } from './MusicProvider';
import { AudiusMusicProvider } from './AudiusMusicProvider';
import { SpotifyMusicProvider } from './SpotifyMusicProvider';
import { ITunesMusicProvider } from './ITunesMusicProvider';
import {
  Track,
  Artist,
  Album,
  Playlist,
  HomeFeed,
  SearchResult,
} from '../types/music';

// Real high-fidelity sample audio URLs (Royalty-free SoundHelix streams)
const SAMPLE_AUDIO_BASE = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-';

export const MOCK_TRACKS: Track[] = [
  {
    id: 'trk-1',
    title: 'Midnight Horizons',
    artistId: 'art-1',
    artistName: 'Kora & The Wave',
    albumId: 'alb-1',
    albumName: 'Neon Ether',
    artworkUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    audioUrl: `${SAMPLE_AUDIO_BASE}1.mp3`,
    duration: 372,
    genre: 'Synthwave',
    accentColor: '#8B5CF6',
    releaseDate: '2026-01-15',
    isTrending: true,
    isNewRelease: true,
    playsCount: 2450900,
    lyrics: {
      trackId: 'trk-1',
      lines: [
        { time: 0, text: 'Instrumental Ambient Intro...' },
        { time: 15, text: 'Neon lights cascading through the rain' },
        { time: 28, text: 'Echoes of a future we once knew' },
        { time: 42, text: 'Floating in the silence of the night' },
        { time: 58, text: 'Where the city meets the cosmic sky' },
        { time: 74, text: 'Hold on to the frequency of sound' },
        { time: 92, text: 'Synthesizing dreams inside our hearts' },
        { time: 115, text: 'We are bound by liquid glass and light' },
        { time: 140, text: 'Outro synth fade...' }
      ]
    }
  },
  {
    id: 'trk-2',
    title: 'Celestial Drift',
    artistId: 'art-2',
    artistName: 'Lina Vance',
    albumId: 'alb-2',
    albumName: 'Orbiting Memories',
    artworkUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    audioUrl: `${SAMPLE_AUDIO_BASE}2.mp3`,
    duration: 424,
    genre: 'Chillout',
    accentColor: '#06B6D4',
    releaseDate: '2026-02-01',
    isTrending: true,
    isNewRelease: true,
    playsCount: 1890300,
  }
];

export const MOCK_ARTISTS: Artist[] = [
  {
    id: 'art-1',
    name: 'Kora & The Wave',
    avatarUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    bio: 'Electronic synthwave duo crafting immersive sonic landscapes.',
    monthlyListeners: 1450200,
    genres: ['Synthwave', 'Electronic'],
    popularTrackIds: ['trk-1']
  }
];

export const MOCK_ALBUMS: Album[] = [
  {
    id: 'alb-1',
    title: 'Neon Ether',
    artistId: 'art-1',
    artistName: 'Kora & The Wave',
    artworkUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    releaseYear: 2026,
    genre: 'Synthwave',
    trackIds: ['trk-1']
  }
];

export const MOCK_PLAYLISTS: Playlist[] = [
  {
    id: 'ply-1',
    title: 'Liquid Glass Sessions',
    description: 'Ultra-smooth ambient, synthwave, and chillout tracks.',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    trackIds: ['trk-1', 'trk-2'],
    createdAt: '2026-01-01'
  }
];

export class MockMusicProvider implements IMusicProvider {
  private lastUpdated: string = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  async getHomeFeed(): Promise<HomeFeed> {
    return {
      recentlyPlayed: MOCK_TRACKS,
      newReleases: MOCK_TRACKS,
      trending: MOCK_TRACKS,
      recommendations: MOCK_TRACKS,
      popularAlbums: MOCK_ALBUMS,
      popularArtists: MOCK_ARTISTS,
      recentlyAdded: MOCK_TRACKS,
      lastUpdated: this.lastUpdated
    };
  }

  async search(query: string): Promise<SearchResult> {
    const q = query.toLowerCase().trim();
    if (!q) return { tracks: [], artists: [], albums: [], playlists: [] };

    const tracks = MOCK_TRACKS.filter((t) => t.title.toLowerCase().includes(q) || t.artistName.toLowerCase().includes(q));
    return { tracks, artists: MOCK_ARTISTS, albums: MOCK_ALBUMS, playlists: MOCK_PLAYLISTS };
  }

  async getNewReleases(): Promise<Track[]> { return MOCK_TRACKS; }
  async getTrending(): Promise<Track[]> { return MOCK_TRACKS; }
  async getRecommendations(): Promise<Track[]> { return MOCK_TRACKS; }
  async getTrack(id: string): Promise<Track | null> { return MOCK_TRACKS.find(t => t.id === id) || null; }
  async getAlbum(id: string): Promise<{ album: Album; tracks: Track[] } | null> { return { album: MOCK_ALBUMS[0], tracks: MOCK_TRACKS }; }
  async getArtist(id: string): Promise<{ artist: Artist; tracks: Track[]; albums: Album[] } | null> { return { artist: MOCK_ARTISTS[0], tracks: MOCK_TRACKS, albums: MOCK_ALBUMS }; }
  async getPlaylist(id: string): Promise<{ playlist: Playlist; tracks: Track[] } | null> { return { playlist: MOCK_PLAYLISTS[0], tracks: MOCK_TRACKS }; }
  async getStreamUrl(trackId: string): Promise<string> { return `${SAMPLE_AUDIO_BASE}1.mp3`; }
}

export class UniversalMusicProvider implements IMusicProvider {
  private itunesProvider = new ITunesMusicProvider();
  private spotifyProvider = new SpotifyMusicProvider();
  private audiusProvider = new AudiusMusicProvider();

  async getHomeFeed(): Promise<HomeFeed> {
    const itunesFeed = await this.itunesProvider.getHomeFeed();
    const spotifyFeed = await this.spotifyProvider.getHomeFeed();

    return {
      recentlyPlayed: itunesFeed.recentlyPlayed,
      newReleases: [...itunesFeed.newReleases, ...spotifyFeed.newReleases].slice(0, 10),
      trending: [...itunesFeed.trending, ...spotifyFeed.trending].slice(0, 10),
      recommendations: [...itunesFeed.recommendations, ...spotifyFeed.recommendations].slice(0, 10),
      popularAlbums: [...itunesFeed.popularAlbums, ...spotifyFeed.popularAlbums].slice(0, 10),
      popularArtists: itunesFeed.popularArtists,
      recentlyAdded: itunesFeed.recentlyAdded,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }

  async search(query: string): Promise<SearchResult> {
    const itunesRes = await this.itunesProvider.search(query);
    const spotifyRes = await this.spotifyProvider.search(query);

    const tracks = [...itunesRes.tracks, ...(spotifyRes?.tracks || [])];
    const artists = [...itunesRes.artists, ...(spotifyRes?.artists || [])];
    const albums = [...itunesRes.albums, ...(spotifyRes?.albums || [])];

    return { tracks, artists, albums, playlists: [] };
  }

  async getNewReleases(): Promise<Track[]> {
    return this.itunesProvider.getNewReleases();
  }

  async getTrending(): Promise<Track[]> {
    return this.itunesProvider.getTrending();
  }

  async getRecommendations(seedTrackId?: string): Promise<Track[]> {
    return this.itunesProvider.getRecommendations();
  }

  async getTrack(id: string): Promise<Track | null> {
    if (id.startsWith('itunes-')) return this.itunesProvider.getTrack(id);
    const spotify = await this.spotifyProvider.getTrack(id);
    if (spotify) return spotify;
    return this.itunesProvider.getTrack(id);
  }

  async getAlbum(id: string): Promise<{ album: Album; tracks: Track[] } | null> {
    if (id.startsWith('album-')) return this.itunesProvider.getAlbum(id);
    return this.spotifyProvider.getAlbum(id);
  }

  async getArtist(id: string): Promise<{ artist: Artist; tracks: Track[]; albums: Album[] } | null> {
    if (id.startsWith('artist-')) return this.itunesProvider.getArtist(id);
    return this.spotifyProvider.getArtist(id);
  }

  async getPlaylist(id: string): Promise<{ playlist: Playlist; tracks: Track[] } | null> {
    return this.spotifyProvider.getPlaylist(id);
  }

  async getStreamUrl(trackId: string): Promise<string> {
    if (trackId.startsWith('itunes-')) return this.itunesProvider.getStreamUrl(trackId);
    return this.spotifyProvider.getStreamUrl(trackId);
  }
}

export const musicProvider = new UniversalMusicProvider();
