import { catalogManager } from './CatalogManager';
import { Track } from '../types/catalog';

/**
 * TrendingService
 * Modular service calculating real-time popularity signals across categories.
 */
export class TrendingService {
  async getTrendingGlobal(): Promise<Track[]> {
    const res = await catalogManager.search('Taylor Swift The Weeknd Drake Coldplay Billie Eilish', { limit: 25 });
    return res.tracks.items;
  }

  async getTrendingIndia(): Promise<Track[]> {
    const res = await catalogManager.search('Arijit Singh Pritam Diljit Dosanjh AR Rahman Shreya Ghoshal Badshah', { limit: 25 });
    return res.tracks.items;
  }

  async getTrendingViral(): Promise<Track[]> {
    const res = await catalogManager.search('Karan Aujla AP Dhillon Divine Badshah Travis Scott', { limit: 20 });
    return res.tracks.items;
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
    const res = await catalogManager.search(q, { limit: 20 });
    return res.tracks.items;
  }
}

export const trendingService = new TrendingService();
