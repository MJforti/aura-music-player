import { MusicDiscoverySource, CanonicalTrack, ChartEntry } from '../../types/discovery';
import { ITunesDiscoverySource } from '../sources/ITunesDiscoverySource';
import { DeezerDiscoverySource } from '../sources/DeezerDiscoverySource';
import { deduplicationEngine } from './DeduplicationEngine';
import { trendingCalculator } from './TrendingCalculator';

/**
 * MultiSourceDiscoveryManager
 * Aggregates discovery signals across independent music sources,
 * normalizes & deduplicates catalog entries, and calculates multi-source rank scores.
 */
export class MultiSourceDiscoveryManager {
  private sources: MusicDiscoverySource[] = [
    new ITunesDiscoverySource(),
    new DeezerDiscoverySource(),
  ];

  async searchAll(query: string): Promise<CanonicalTrack[]> {
    const results = await Promise.allSettled(
      this.sources.map(s => s.search(query))
    );

    const rawTracks: CanonicalTrack[] = [];
    results.forEach(res => {
      if (res.status === 'fulfilled' && res.value) {
        rawTracks.push(...res.value);
      }
    });

    const deduplicated = deduplicationEngine.deduplicateTracks(rawTracks);
    return trendingCalculator.rankTracks(deduplicated);
  }

  async getTrendingAggregated(): Promise<CanonicalTrack[]> {
    const results = await Promise.allSettled(
      this.sources.map(s => s.getTrending())
    );

    const rawTracks: CanonicalTrack[] = [];
    results.forEach(res => {
      if (res.status === 'fulfilled' && res.value) {
        rawTracks.push(...res.value);
      }
    });

    const deduplicated = deduplicationEngine.deduplicateTracks(rawTracks);
    return trendingCalculator.rankTracks(deduplicated);
  }

  async getChartsAggregated(): Promise<ChartEntry[]> {
    const results = await Promise.allSettled(
      this.sources.map(s => s.getCharts())
    );

    const entries: ChartEntry[] = [];
    results.forEach(res => {
      if (res.status === 'fulfilled' && res.value) {
        entries.push(...res.value);
      }
    });

    return entries;
  }
}

export const multiSourceManager = new MultiSourceDiscoveryManager();
