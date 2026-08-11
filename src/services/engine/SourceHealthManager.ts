import { SourceHealthStatus, SourceStatusState } from '../../types/discovery';

/**
 * SourceHealthManager
 * Monitors health status, response latencies, error rates, and rate limits across discovery sources.
 */
export class SourceHealthManager {
  private healthMap = new Map<string, SourceHealthStatus>();

  constructor() {
    this.registerSource('itunes', 'iTunes Search API');
    this.registerSource('deezer', 'Deezer Global API');
    this.registerSource('spotify', 'Spotify Web API');
    this.registerSource('musicbrainz', 'MusicBrainz Open API');
  }

  public registerSource(id: string, name: string): void {
    this.healthMap.set(id, {
      sourceId: id,
      sourceName: name,
      status: 'healthy',
      latencyMs: 120,
      errorCount: 0,
      rateLimitStatus: 'normal',
      lastSuccess: new Date().toLocaleTimeString(),
    });
  }

  public recordSuccess(sourceId: string, latencyMs: number): void {
    const current = this.healthMap.get(sourceId);
    if (current) {
      current.status = 'healthy';
      current.latencyMs = Math.round((current.latencyMs + latencyMs) / 2);
      current.lastSuccess = new Date().toLocaleTimeString();
      current.rateLimitStatus = 'normal';
    }
  }

  public recordFailure(sourceId: string, errorMsg?: string): void {
    const current = this.healthMap.get(sourceId);
    if (current) {
      current.errorCount += 1;
      current.lastFailure = new Date().toLocaleTimeString();
      if (current.errorCount > 3) {
        current.status = 'failed';
      } else {
        current.status = 'degraded';
      }
    }
  }

  public getHealthSummary(): SourceHealthStatus[] {
    return Array.from(this.healthMap.values());
  }

  public isHealthy(sourceId: string): boolean {
    const status = this.healthMap.get(sourceId);
    return status ? status.status !== 'failed' : true;
  }
}

export const sourceHealthManager = new SourceHealthManager();
