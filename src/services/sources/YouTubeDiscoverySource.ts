import { Mashup, MashupAvailability } from '../../types/mashup';

export class YouTubeDiscoverySource {
  public id = 'youtube';
  public name = 'YouTube Authorized Discovery';

  public async getOEmbedData(videoId: string) {
    try {
      const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
      const res = await fetch(url);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  public getYouTubeMashups(): Mashup[] {
    return [
      {
        id: 'yt-husn-let-her-go',
        title: 'Husn × Let Her Go',
        slug: 'husn-let-her-go',
        description: 'Official YouTube Mashup: Anuv Jain Husn blended with Passenger Let Her Go.',
        artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
        creator: { id: 'dj-vibe', name: 'DJ Vibe (YouTube)', externalUrl: 'https://www.youtube.com/watch?v=1fR3H0g01eA' },
        sourceTracks: [
          { title: 'Husn', artist: 'Anuv Jain' },
          { title: 'Let Her Go', artist: 'Passenger' },
        ],
        duration: 222,
        category: 'bollywood_english',
        categoryName: 'Bollywood × English',
        language: ['Hindi', 'English'],
        tags: ['YouTube Mashup', 'Acoustic', 'Viral'],
        releaseDate: '2026-01-15',
        trendingScore: 99,
        popularity: 98,
        availability: 'playable' as MashupAvailability,
        playback: {
          type: 'youtube_embed',
          videoId: '1fR3H0g01eA',
          provider: 'YouTube',
          duration: 222,
          attributionUrl: 'https://www.youtube.com/watch?v=1fR3H0g01eA',
        },
        externalUrl: 'https://www.youtube.com/watch?v=1fR3H0g01eA',
        isFeatured: true,
        createdAt: '2026-01-15T00:00:00Z',
        updatedAt: '2026-08-11T00:00:00Z',
      },
      {
        id: 'yt-chaleya-until-found-you',
        title: 'Chaleya × Until I Found You',
        slug: 'chaleya-until-i-found-you',
        description: 'Official YouTube Mashup: Anirudh & Arijit Chaleya with Stephen Sanchez retro ballad.',
        artwork: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
        creator: { id: 'dj-nyk', name: 'DJ NYK (YouTube)', externalUrl: 'https://www.youtube.com/watch?v=b1K4x4Jk1wU' },
        sourceTracks: [
          { title: 'Chaleya', artist: 'Anirudh & Arijit Singh' },
          { title: 'Until I Found You', artist: 'Stephen Sanchez' },
        ],
        duration: 205,
        category: 'bollywood_english',
        categoryName: 'Bollywood × English',
        language: ['Hindi', 'English'],
        tags: ['YouTube Mashup', 'Romantic'],
        releaseDate: '2026-02-01',
        trendingScore: 95,
        popularity: 94,
        availability: 'playable' as MashupAvailability,
        playback: {
          type: 'youtube_embed',
          videoId: 'b1K4x4Jk1wU',
          provider: 'YouTube',
          duration: 205,
          attributionUrl: 'https://www.youtube.com/watch?v=b1K4x4Jk1wU',
        },
        externalUrl: 'https://www.youtube.com/watch?v=b1K4x4Jk1wU',
        createdAt: '2026-02-01T00:00:00Z',
        updatedAt: '2026-08-11T00:00:00Z',
      },
      {
        id: 'yt-heeriye-perfect',
        title: 'Heeriye × Perfect',
        slug: 'heeriye-perfect',
        description: 'Official YouTube Mashup: Jasleen Royal & Arijit Singh melody combined with Ed Sheeran Perfect.',
        artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
        creator: { id: 'dj-chetas', name: 'DJ Chetas (YouTube)', externalUrl: 'https://www.youtube.com/watch?v=d6R3X7g89lK' },
        sourceTracks: [
          { title: 'Heeriye', artist: 'Jasleen Royal & Arijit Singh' },
          { title: 'Perfect', artist: 'Ed Sheeran' },
        ],
        duration: 218,
        category: 'romantic',
        categoryName: 'Romantic Beats',
        language: ['Hindi', 'English'],
        tags: ['YouTube Mashup', 'Love'],
        releaseDate: '2026-02-10',
        trendingScore: 92,
        popularity: 90,
        availability: 'playable' as MashupAvailability,
        playback: {
          type: 'youtube_embed',
          videoId: 'd6R3X7g89lK',
          provider: 'YouTube',
          duration: 218,
          attributionUrl: 'https://www.youtube.com/watch?v=d6R3X7g89lK',
        },
        externalUrl: 'https://www.youtube.com/watch?v=d6R3X7g89lK',
        createdAt: '2026-02-10T00:00:00Z',
        updatedAt: '2026-08-11T00:00:00Z',
      },
      {
        id: 'yt-sajni-i-like-me-better',
        title: 'Sajni × I Like Me Better',
        slug: 'sajni-i-like-me-better',
        description: 'Official YouTube Mashup: Sajni by Arijit Singh fused with Lauv I Like Me Better.',
        artwork: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&auto=format&fit=crop&q=80',
        creator: { id: 'dj-vibe', name: 'DJ Vibe (YouTube)', externalUrl: 'https://www.youtube.com/watch?v=c8N2a3B45vM' },
        sourceTracks: [
          { title: 'Sajni', artist: 'Arijit Singh' },
          { title: 'I Like Me Better', artist: 'Lauv' },
        ],
        duration: 195,
        category: 'bollywood_english',
        categoryName: 'Bollywood × English',
        language: ['Hindi', 'English'],
        tags: ['YouTube Mashup', 'Upbeat'],
        releaseDate: '2026-03-01',
        trendingScore: 90,
        popularity: 88,
        availability: 'playable' as MashupAvailability,
        playback: {
          type: 'youtube_embed',
          videoId: 'c8N2a3B45vM',
          provider: 'YouTube',
          duration: 195,
          attributionUrl: 'https://www.youtube.com/watch?v=c8N2a3B45vM',
        },
        externalUrl: 'https://www.youtube.com/watch?v=c8N2a3B45vM',
        createdAt: '2026-03-01T00:00:00Z',
        updatedAt: '2026-08-11T00:00:00Z',
      },
    ];
  }
}

export const youtubeDiscoverySource = new YouTubeDiscoverySource();
