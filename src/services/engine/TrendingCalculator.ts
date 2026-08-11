import { CanonicalTrack } from '../../types/discovery';

/**
 * TrendingCalculator
 * Computes unified cross-source trending scores for canonical tracks.
 */
export class TrendingCalculator {
  public calculateScore(track: CanonicalTrack): number {
    let score = 50;

    // 1. Cross-Source Presence (20%)
    const sourceCount = Object.keys(track.sourceIds || {}).length;
    score += Math.min(20, (sourceCount - 1) * 10);

    // 2. Chart Signals (30%)
    if (track.popularitySignals && track.popularitySignals.length > 0) {
      const topPosition = Math.min(
        ...track.popularitySignals.map(s => s.chartPosition || 100)
      );
      if (topPosition <= 10) score += 30;
      else if (topPosition <= 25) score += 20;
      else if (topPosition <= 50) score += 10;
    }

    // 3. Release Freshness (15%)
    if (track.releaseDate) {
      const releaseYear = parseInt(track.releaseDate.split('-')[0] || '2026');
      if (releaseYear >= 2026) score += 15;
      else if (releaseYear === 2025) score += 10;
    }

    // 4. Base Trending Flag (15%)
    if (track.isTrending) score += 15;

    return Math.min(100, Math.max(1, score));
  }

  public rankTracks(tracks: CanonicalTrack[]): CanonicalTrack[] {
    return tracks
      .map(t => ({
        ...t,
        trendingScore: this.calculateScore(t),
      }))
      .sort((a, b) => b.trendingScore - a.trendingScore);
  }
}

export const trendingCalculator = new TrendingCalculator();
