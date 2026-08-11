import { multiSourceManager } from './engine/MultiSourceDiscoveryManager';
import { catalogManager } from './CatalogManager';
import { Track } from '../types/catalog';

/**
 * TrendingService
 * Consumes multi-source aggregated signals (iTunes + Deezer + Spotify)
 * to compute trending tracks for Mix generation.
 */
export class TrendingService {
  async getTrendingGlobal(): Promise<Track[]> {
    const canonical = await multiSourceManager.getTrendingAggregated();
    if (canonical.length > 0) return canonical as Track[];
    return (await catalogManager.search('Taylor Swift The Weeknd Drake Coldplay Billie Eilish', { limit: 25 })).tracks.items;
  }

  async getTrendingIndia(): Promise<Track[]> {
    const res = await multiSourceManager.searchAll('Arijit Singh Pritam Diljit Dosanjh AR Rahman Shreya Ghoshal Badshah');
    if (res.length > 0) return res as Track[];
    return (await catalogManager.search('Arijit Singh Pritam Diljit Dosanjh AR Rahman Shreya Ghoshal Badshah', { limit: 25 })).tracks.items;
  }

  async getTrendingViral(): Promise<Track[]> {
    const res = await multiSourceManager.searchAll('Karan Aujla AP Dhillon Divine Badshah Travis Scott');
    if (res.length > 0) return res as Track[];
    return (await catalogManager.search('Karan Aujla AP Dhillon Divine Badshah Travis Scott', { limit: 20 })).tracks.items;
  }

  async getNewAndHot(): Promise<Track[]> {
    const res = await catalogManager.getNewReleases({ limit: 20 });
    const albumTracks = await Promise.all(
      res.items.slice(0, 5).map(alb => catalogManager.getAlbumTracks(alb.id, { limit: 4 }))
    );
    const tracks = albumTracks.flatMap(r => r.items);
    return tracks.length > 0 ? tracks : (await catalogManager.getTrending({ limit: 20 })).items;
  }

  async getCategoryTracks(category: string): Promise<Track[]> {
    const queryMap: Record<string, string> = {
      party: 'Dua Lipa Bruno Mars David Guetta Calvin Harris',
      midnight: 'Lofi Ambient Synthwave Chillout',
      love: 'Romantic Arijit Singh Ed Sheeran',
      hiphop: 'Drake Kendrick Lamar Travis Scott Divine',
      indie: 'Prateek Kuhad Anuv Jain Jasleen Royal Phoebus',
    };
    const q = queryMap[category] || 'Popular Chart';
    const res = await multiSourceManager.searchAll(q);
    return res.length > 0 ? (res as Track[]) : (await catalogManager.search(q, { limit: 20 })).tracks.items;
  }
}

export const trendingService = new TrendingService();
