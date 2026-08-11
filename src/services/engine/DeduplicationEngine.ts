import { CanonicalTrack } from '../../types/discovery';
import { normalizationEngine } from './NormalizationEngine';

/**
 * DeduplicationEngine
 * Merges raw multi-source track records into canonical entities using
 * ISRC codes, provider IDs, and normalized string matching.
 */
export class DeduplicationEngine {
  public deduplicateTracks(rawTracks: CanonicalTrack[]): CanonicalTrack[] {
    const isrcMap = new Map<string, CanonicalTrack>();
    const matchingKeyMap = new Map<string, CanonicalTrack>();
    const canonicalList: CanonicalTrack[] = [];

    for (const track of rawTracks) {
      // 1. Try matching by ISRC code
      if (track.isrc) {
        const existing = isrcMap.get(track.isrc);
        if (existing) {
          this.mergeTracks(existing, track);
          continue;
        }
      }

      // 2. Try matching by Normalized Artist + Title Key
      const key = normalizationEngine.generateMatchingKey(track.title, track.artistName);
      const existingByKey = matchingKeyMap.get(key);
      if (existingByKey) {
        this.mergeTracks(existingByKey, track);
        if (track.isrc) isrcMap.set(track.isrc, existingByKey);
        continue;
      }

      // 3. New Canonical Track
      if (track.isrc) isrcMap.set(track.isrc, track);
      matchingKeyMap.set(key, track);
      canonicalList.push(track);
    }

    return canonicalList;
  }

  private mergeTracks(target: CanonicalTrack, incoming: CanonicalTrack): void {
    // Merge source IDs
    target.sourceIds = { ...target.sourceIds, ...incoming.sourceIds };

    // Merge external links
    const linkProviders = new Set(target.externalLinks.map(l => l.provider));
    incoming.externalLinks.forEach(link => {
      if (!linkProviders.has(link.provider)) {
        target.externalLinks.push(link);
      }
    });

    // Merge popularity signals
    target.popularitySignals = [...target.popularitySignals, ...incoming.popularitySignals];

    // Prefer preview stream URL if missing
    if (!target.previewStreamUrl && incoming.previewStreamUrl) {
      target.previewStreamUrl = incoming.previewStreamUrl;
    }

    // Accumulate trending score boost for appearing on multiple sources
    target.trendingScore = (target.trendingScore || 50) + 15;
  }
}

export const deduplicationEngine = new DeduplicationEngine();
