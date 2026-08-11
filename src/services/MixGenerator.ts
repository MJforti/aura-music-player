import { Track } from '../types/catalog';
import { Mix, MixTrack, MixCategory } from '../types/mix';

/**
 * MixGenerator
 * Generates continuous short-form Mix objects from trending catalog tracks.
 */
export class MixGenerator {
  public createMix(
    id: string,
    title: string,
    subtitle: string,
    description: string,
    category: MixCategory,
    categoryName: string,
    tracks: Track[],
    isHero: boolean = false
  ): Mix {
    const mixTracks: MixTrack[] = tracks.map((t, idx) => {
      const segmentDuration = 30; // 30-second discovery clip per track
      return {
        track: t,
        startTime: idx * segmentDuration,
        duration: segmentDuration,
        order: idx + 1,
      };
    });

    const totalDuration = mixTracks.reduce((acc, curr) => acc + curr.duration, 0);

    const artworkUrl =
      tracks[0]?.artworkUrl ||
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';

    const minutesAgo = Math.floor(Math.random() * 12) + 2;

    return {
      id,
      title,
      subtitle,
      description,
      artworkUrl,
      category,
      categoryName,
      tracks: mixTracks,
      duration: totalDuration,
      trackCount: mixTracks.length,
      updatedAt: `Updated ${minutesAgo} min ago`,
      isHero,
    };
  }

  public formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
}

export const mixGenerator = new MixGenerator();
