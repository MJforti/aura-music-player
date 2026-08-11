import { IMusicProvider } from './MusicProvider';
import { AudiusMusicProvider } from './AudiusMusicProvider';
import { SpotifyMusicProvider } from './SpotifyMusicProvider';
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
    lyrics: {
      trackId: 'trk-2',
      lines: [
        { time: 0, text: 'Soft piano ambient wave...' },
        { time: 20, text: 'Watching starlight bend around the room' },
        { time: 38, text: 'Time moves slower when you fade away' },
        { time: 55, text: 'Soft vibrations pulsing through the dark' },
        { time: 75, text: 'Every heartbeat aligned with celestial drift' },
        { time: 98, text: 'Breathe the ambient aura in' }
      ]
    }
  },
  {
    id: 'trk-3',
    title: 'Velvet Echoes',
    artistId: 'art-3',
    artistName: 'Solaris Duo',
    albumId: 'alb-3',
    albumName: 'Luminescent Nights',
    artworkUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
    audioUrl: `${SAMPLE_AUDIO_BASE}3.mp3`,
    duration: 344,
    genre: 'Ambient Lo-Fi',
    accentColor: '#F43F5E',
    releaseDate: '2025-11-20',
    isTrending: true,
    playsCount: 3100450,
  },
  {
    id: 'trk-4',
    title: 'Quantum Bloom',
    artistId: 'art-4',
    artistName: 'Aethel',
    albumId: 'alb-4',
    albumName: 'Prism Architecture',
    artworkUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=80',
    audioUrl: `${SAMPLE_AUDIO_BASE}4.mp3`,
    duration: 540,
    genre: 'Electronic',
    accentColor: '#10B981',
    releaseDate: '2026-02-10',
    isNewRelease: true,
    playsCount: 940120,
  },
  {
    id: 'trk-5',
    title: 'Silk & Shadows',
    artistId: 'art-1',
    artistName: 'Kora & The Wave',
    albumId: 'alb-1',
    albumName: 'Neon Ether',
    artworkUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    audioUrl: `${SAMPLE_AUDIO_BASE}5.mp3`,
    duration: 388,
    genre: 'Synthwave',
    accentColor: '#6366F1',
    releaseDate: '2026-01-15',
    playsCount: 1240000,
  },
  {
    id: 'trk-6',
    title: 'Aura Minimal',
    artistId: 'art-5',
    artistName: 'Subliminal',
    albumId: 'alb-5',
    albumName: 'Pure Tone',
    artworkUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    audioUrl: `${SAMPLE_AUDIO_BASE}6.mp3`,
    duration: 310,
    genre: 'Minimalist',
    accentColor: '#F59E0B',
    releaseDate: '2026-02-05',
    isTrending: true,
    playsCount: 4120000,
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
    popularTrackIds: ['trk-1', 'trk-5']
  },
  {
    id: 'art-2',
    name: 'Lina Vance',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    bio: 'Atmospheric vocal and ambient producer.',
    monthlyListeners: 2310800,
    genres: ['Chillout', 'Ambient'],
    popularTrackIds: ['trk-2']
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
    trackIds: ['trk-1', 'trk-5']
  }
];

export const MOCK_PLAYLISTS: Playlist[] = [
  {
    id: 'ply-1',
    title: 'Liquid Glass Sessions',
    description: 'Ultra-smooth ambient, synthwave, and chillout tracks.',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    trackIds: ['trk-1', 'trk-2', 'trk-6'],
    createdAt: '2026-01-01'
  }
];

export class MockMusicProvider implements IMusicProvider {
  private lastUpdated: string = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  async getHomeFeed(forceRefresh: boolean = false): Promise<HomeFeed> {
    if (forceRefresh) {
      this.lastUpdated = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return {
      recentlyPlayed: MOCK_TRACKS.slice(0, 4),
      newReleases: MOCK_TRACKS.filter((t) => t.isNewRelease),
      trending: MOCK_TRACKS.filter((t) => t.isTrending),
      recommendations: MOCK_TRACKS.slice(2, 6),
      popularAlbums: MOCK_ALBUMS,
      popularArtists: MOCK_ARTISTS,
      recentlyAdded: MOCK_TRACKS,
      lastUpdated: this.lastUpdated
    };
  }

  async search(query: string): Promise<SearchResult> {
    const q = query.toLowerCase().trim();
    if (!q) return { tracks: [], artists: [], albums: [], playlists: [] };

    const tracks = MOCK_TRACKS.filter(
      (t) => t.title.toLowerCase().includes(q) || t.artistName.toLowerCase().includes(q) || t.genre.toLowerCase().includes(q)
    );
    const artists = MOCK_ARTISTS.filter((a) => a.name.toLowerCase().includes(q));
    const albums = MOCK_ALBUMS.filter((alb) => alb.title.toLowerCase().includes(q));
    const playlists = MOCK_PLAYLISTS.filter((p) => p.title.toLowerCase().includes(q));

    return { tracks, artists, albums, playlists };
  }

  async getNewReleases(): Promise<Track[]> {
    return MOCK_TRACKS.filter((t) => t.isNewRelease);
  }

  async getTrending(): Promise<Track[]> {
    return MOCK_TRACKS.filter((t) => t.isTrending);
  }

  async getRecommendations(): Promise<Track[]> {
    return MOCK_TRACKS.slice(0, 4);
  }

  async getTrack(id: string): Promise<Track | null> {
    return MOCK_TRACKS.find((t) => t.id === id) || null;
  }

  async getAlbum(id: string): Promise<{ album: Album; tracks: Track[] } | null> {
    const album = MOCK_ALBUMS.find((a) => a.id === id);
    if (!album) return null;
    return { album, tracks: MOCK_TRACKS.filter((t) => album.trackIds.includes(t.id)) };
  }

  async getArtist(id: string): Promise<{ artist: Artist; tracks: Track[]; albums: Album[] } | null> {
    const artist = MOCK_ARTISTS.find((a) => a.id === id);
    if (!artist) return null;
    return { artist, tracks: MOCK_TRACKS.filter((t) => t.artistId === id), albums: MOCK_ALBUMS.filter((a) => a.artistId === id) };
  }

  async getPlaylist(id: string): Promise<{ playlist: Playlist; tracks: Track[] } | null> {
    const playlist = MOCK_PLAYLISTS.find((p) => p.id === id);
    if (!playlist) return null;
    return { playlist, tracks: MOCK_TRACKS.filter((t) => playlist.trackIds.includes(t.id)) };
  }

  async getStreamUrl(trackId: string): Promise<string> {
    const track = await this.getTrack(trackId);
    return track ? track.audioUrl : `${SAMPLE_AUDIO_BASE}1.mp3`;
  }
}

export class HybridMusicProvider implements IMusicProvider {
  private mockProvider = new MockMusicProvider();
  private audiusProvider = new AudiusMusicProvider();
  private spotifyProvider = new SpotifyMusicProvider();

  async getHomeFeed(forceRefresh?: boolean): Promise<HomeFeed> {
    const mockFeed = await this.mockProvider.getHomeFeed(forceRefresh);
    const audiusFeed = await this.audiusProvider.getHomeFeed();
    const spotifyFeed = await this.spotifyProvider.getHomeFeed();

    const spotifyNew = spotifyFeed?.newReleases || [];
    const audiusNew = audiusFeed?.newReleases || [];

    return {
      recentlyPlayed: mockFeed.recentlyPlayed,
      newReleases: [...spotifyNew, ...audiusNew, ...mockFeed.newReleases].slice(0, 10),
      trending: audiusFeed.trending.length > 0 ? audiusFeed.trending : mockFeed.trending,
      recommendations: audiusFeed.recommendations.length > 0 ? audiusFeed.recommendations : mockFeed.recommendations,
      popularAlbums: MOCK_ALBUMS,
      popularArtists: MOCK_ARTISTS,
      recentlyAdded: mockFeed.recentlyAdded,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }

  async search(query: string, category?: string): Promise<SearchResult> {
    const spotifyRes = await this.spotifyProvider.search(query);
    const mockRes = await this.mockProvider.search(query);
    const audiusRes = await this.audiusProvider.search(query);

    const tracks = [
      ...(spotifyRes?.tracks || []),
      ...mockRes.tracks,
      ...audiusRes.tracks,
    ];

    return {
      tracks,
      artists: spotifyRes?.artists?.length ? spotifyRes.artists : mockRes.artists,
      albums: spotifyRes?.albums?.length ? spotifyRes.albums : mockRes.albums,
      playlists: mockRes.playlists,
    };
  }

  async getNewReleases(): Promise<Track[]> {
    const live = await this.audiusProvider.getNewReleases();
    return live.length > 0 ? live : this.mockProvider.getNewReleases();
  }

  async getTrending(): Promise<Track[]> {
    const live = await this.audiusProvider.getTrending();
    return live.length > 0 ? live : this.mockProvider.getTrending();
  }

  async getRecommendations(): Promise<Track[]> {
    return this.mockProvider.getRecommendations();
  }

  async getTrack(id: string): Promise<Track | null> {
    const spotify = await this.spotifyProvider.getTrack(id);
    if (spotify) return spotify;
    const mock = await this.mockProvider.getTrack(id);
    if (mock) return mock;
    return this.audiusProvider.getTrack(id);
  }

  async getAlbum(id: string): Promise<{ album: Album; tracks: Track[] } | null> {
    return this.mockProvider.getAlbum(id);
  }

  async getArtist(id: string): Promise<{ artist: Artist; tracks: Track[]; albums: Album[] } | null> {
    return this.mockProvider.getArtist(id);
  }

  async getPlaylist(id: string): Promise<{ playlist: Playlist; tracks: Track[] } | null> {
    return this.mockProvider.getPlaylist(id);
  }

  async getStreamUrl(trackId: string): Promise<string> {
    const spotifyUrl = await this.spotifyProvider.getStreamUrl(trackId);
    if (spotifyUrl) return spotifyUrl;
    const mock = await this.mockProvider.getTrack(trackId);
    if (mock) return mock.audioUrl;
    return this.audiusProvider.getStreamUrl(trackId);
  }
}

export const musicProvider = new SpotifyMusicProvider();
