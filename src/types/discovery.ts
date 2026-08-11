/**
 * AURA MIX Multi-Source Discovery Aggregator Types
 */

export interface ExternalLink {
  provider: 'appleMusic' | 'spotify' | 'deezer' | 'musicbrainz' | 'audius' | 'youtube';
  url: string;
}

export interface PopularitySignal {
  sourceId: string;
  chartPosition?: number;
  rankScore: number;
  updatedAt: string;
}

export interface CanonicalArtist {
  id: string;
  name: string;
  avatarUrl: string;
  genres: string[];
  sourceIds: Record<string, string>;
  externalLinks: ExternalLink[];
}

export interface CanonicalAlbum {
  id: string;
  title: string;
  artworkUrl: string;
  artistId: string;
  artistName: string;
  releaseYear: number;
  genres: string[];
  sourceIds: Record<string, string>;
}

export interface CanonicalTrack {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  artists: { id: string; name: string }[];
  albumId: string;
  albumName: string;
  artworkUrl: string;
  previewStreamUrl?: string;
  duration: number; // in seconds
  releaseDate?: string;
  genre: string;
  explicit?: boolean;
  isrc?: string;
  trendingScore: number;
  popularitySignals: PopularitySignal[];
  sourceIds: Record<string, string>; // e.g. { itunes: "123", deezer: "456", spotify: "789" }
  externalLinks: ExternalLink[];
  isTrending?: boolean;
  isNewRelease?: boolean;
}

export interface DiscoveryResult {
  track?: CanonicalTrack;
  artist?: CanonicalArtist;
  album?: CanonicalAlbum;
  sourceId: string;
}

export interface ChartEntry {
  position: number;
  previousPosition?: number;
  track: CanonicalTrack;
  chartName: string;
}

export interface MusicDiscoverySource {
  id: string;
  name: string;
  isHealthy: boolean;

  search(query: string): Promise<CanonicalTrack[]>;

  getTrending(): Promise<CanonicalTrack[]>;

  getCharts(): Promise<ChartEntry[]>;

  getNewReleases(): Promise<CanonicalTrack[]>;

  getArtist(id: string): Promise<CanonicalArtist | null>;

  getTrack(id: string): Promise<CanonicalTrack | null>;

  getAlbum(id: string): Promise<CanonicalAlbum | null>;
}

export type SourceStatusState = 'healthy' | 'degraded' | 'failed';

export interface SourceHealthStatus {
  sourceId: string;
  sourceName: string;
  status: SourceStatusState;
  lastSuccess?: string;
  lastFailure?: string;
  latencyMs: number;
  errorCount: number;
  rateLimitStatus: 'normal' | 'throttled';
}
