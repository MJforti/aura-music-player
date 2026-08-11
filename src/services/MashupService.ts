import { Mashup, MashupMix, MashupCategory, MashupAvailability } from '../types/mashup';
import { audioResolver } from './engine/AudioResolver';
import { youtubeDiscoverySource } from './sources/YouTubeDiscoverySource';

export class MashupService {
  private rawMashups: Omit<Mashup, 'availability'>[] = [
    {
      id: 'mashup-husn-let-her-go',
      title: 'Husn × Let Her Go',
      slug: 'husn-let-her-go',
      description: 'Anuv Jain acoustic feel fused with Passenger folk-pop classic.',
      artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
      creator: { id: 'dj-vibe', name: 'DJ Vibe' },
      sourceTracks: [
        { title: 'Husn', artist: 'Anuv Jain' },
        { title: 'Let Her Go', artist: 'Passenger' },
      ],
      duration: 222,
      category: 'bollywood_english',
      categoryName: 'Bollywood × English',
      language: ['Hindi', 'English'],
      tags: ['Acoustic', 'Chill', 'Viral'],
      releaseDate: '2026-01-15',
      trendingScore: 98,
      popularity: 95,
      playback: {
        type: 'youtube_embed',
        videoId: '1fR3H0g01eA',
        provider: 'YouTube Official Embed',
        duration: 222,
      },
      externalUrl: 'https://www.youtube.com/watch?v=1fR3H0g01eA',
      isFeatured: true,
      createdAt: '2026-01-15T00:00:00Z',
      updatedAt: '2026-08-11T00:00:00Z',
    },
    {
      id: 'mashup-chaleya-until-found-you',
      title: 'Chaleya × Until I Found You',
      slug: 'chaleya-until-i-found-you',
      description: 'Anirudh & Arijit romantic beat blended with Stephen Sanchez retro ballad.',
      artwork: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
      creator: { id: 'dj-nyk', name: 'DJ NYK' },
      sourceTracks: [
        { title: 'Chaleya', artist: 'Anirudh Ravichander & Arijit Singh' },
        { title: 'Until I Found You', artist: 'Stephen Sanchez' },
      ],
      duration: 205,
      category: 'bollywood_english',
      categoryName: 'Bollywood × English',
      language: ['Hindi', 'English'],
      tags: ['Romantic', 'Groove'],
      releaseDate: '2026-02-01',
      trendingScore: 94,
      popularity: 92,
      playback: {
        type: 'youtube_embed',
        videoId: 'b1K4x4Jk1wU',
        provider: 'YouTube Official Embed',
        duration: 205,
      },
      externalUrl: 'https://www.youtube.com/watch?v=b1K4x4Jk1wU',
      createdAt: '2026-02-01T00:00:00Z',
      updatedAt: '2026-08-11T00:00:00Z',
    },
    {
      id: 'mashup-heeriye-perfect',
      title: 'Heeriye × Perfect',
      slug: 'heeriye-perfect',
      description: 'Jasleen Royal & Arijit Singh melody combined with Ed Sheeran ballad.',
      artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
      creator: { id: 'dj-chetas', name: 'DJ Chetas' },
      sourceTracks: [
        { title: 'Heeriye', artist: 'Jasleen Royal & Arijit Singh' },
        { title: 'Perfect', artist: 'Ed Sheeran' },
      ],
      duration: 218,
      category: 'romantic',
      categoryName: 'Romantic Beats',
      language: ['Hindi', 'English'],
      tags: ['Love', 'Acoustic'],
      releaseDate: '2026-02-10',
      trendingScore: 91,
      popularity: 89,
      playback: {
        type: 'youtube_embed',
        videoId: 'd6R3X7g89lK',
        provider: 'YouTube Official Embed',
        duration: 218,
      },
      externalUrl: 'https://www.youtube.com/watch?v=d6R3X7g89lK',
      createdAt: '2026-02-10T00:00:00Z',
      updatedAt: '2026-08-11T00:00:00Z',
    },
    {
      id: 'mashup-sajni-i-like-me-better',
      title: 'Sajni × I Like Me Better',
      slug: 'sajni-i-like-me-better',
      description: 'Laapataa Ladies Sajni fused with Lauv synth-pop anthem.',
      artwork: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&auto=format&fit=crop&q=80',
      creator: { id: 'dj-vibe', name: 'DJ Vibe' },
      sourceTracks: [
        { title: 'Sajni', artist: 'Arijit Singh' },
        { title: 'I Like Me Better', artist: 'Lauv' },
      ],
      duration: 195,
      category: 'bollywood_english',
      categoryName: 'Bollywood × English',
      language: ['Hindi', 'English'],
      tags: ['Indie', 'Upbeat'],
      releaseDate: '2026-03-01',
      trendingScore: 88,
      popularity: 86,
      playback: {
        type: 'youtube_embed',
        videoId: 'c8N2a3B45vM',
        provider: 'YouTube Official Embed',
        duration: 195,
      },
      externalUrl: 'https://www.youtube.com/watch?v=c8N2a3B45vM',
      createdAt: '2026-03-01T00:00:00Z',
      updatedAt: '2026-08-11T00:00:00Z',
    },
  ];

  private resolvedCache: Mashup[] | null = null;

  public async getResolvedMashups(): Promise<Mashup[]> {
    if (this.resolvedCache) return this.resolvedCache;

    const ytMashups = youtubeDiscoverySource.getYouTubeMashups();
    const resolvedRaw = await Promise.all(
      this.rawMashups.map(async (raw) => {
        const audio = await audioResolver.resolveMashup(raw as Mashup);
        if (audio) {
          return {
            ...raw,
            availability: 'playable' as MashupAvailability,
            playback: raw.playback || {
              type: 'preview_url' as const,
              url: audio.url,
              provider: audio.provider,
              duration: audio.duration,
            },
          };
        } else {
          return {
            ...raw,
            availability: 'external-only' as MashupAvailability,
          };
        }
      })
    );

    const merged = [...ytMashups, ...resolvedRaw];
    this.resolvedCache = merged;
    return merged;
  }

  public async getFeaturedMashup(): Promise<Mashup> {
    const list = await this.getResolvedMashups();
    return list[0];
  }

  public async getTrendingMashups(): Promise<Mashup[]> {
    const list = await this.getResolvedMashups();
    return [...list].sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0));
  }

  public async getNewMashups(): Promise<Mashup[]> {
    const list = await this.getResolvedMashups();
    return [...list].sort((a, b) => new Date(b.releaseDate || '').getTime() - new Date(a.releaseDate || '').getTime());
  }

  public async getCategoryMashups(category: MashupCategory): Promise<Mashup[]> {
    const list = await this.getResolvedMashups();
    return list.filter(m => m.category === category || m.category === 'bollywood_english');
  }

  public async searchMashups(query: string): Promise<Mashup[]> {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const list = await this.getResolvedMashups();

    if (q.includes('+') || q.includes('&') || q.includes('x')) {
      const parts = q.split(/[+&x]/).map(p => p.trim());
      return list.filter(m => {
        const fullText = `${m.title} ${m.categoryName} ${m.sourceTracks.map(t => `${t.title} ${t.artist}`).join(' ')}`.toLowerCase();
        return parts.every(part => fullText.includes(part));
      });
    }

    return list.filter(m => {
      const fullText = `${m.title} ${m.creator.name} ${m.categoryName} ${m.sourceTracks.map(t => `${t.title} ${t.artist}`).join(' ')}`.toLowerCase();
      return fullText.includes(q);
    });
  }

  public async getMixes(): Promise<MashupMix[]> {
    const list = await this.getResolvedMashups();
    const playableList = list.filter(m => m.availability === 'playable' || m.availability === 'preview');

    return [
      {
        id: 'mix-bollywood-english',
        title: 'BOLLYWOOD × ENGLISH',
        subtitle: `${playableList.length} mashups • Continuous Session`,
        description: 'The definitive continuous mix of Hindi and Western pop crossovers.',
        artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
        category: 'bollywood_english',
        mashups: playableList,
        totalDuration: 4320,
        updatedAt: 'Updated 4 min ago',
      },
      {
        id: 'mix-trending',
        title: 'TRENDING MASHUPS',
        subtitle: `${playableList.length} mashups • Top Rated`,
        description: 'Hottest viral mashups exploding across platforms.',
        artwork: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
        category: 'bollywood_english',
        mashups: playableList,
        totalDuration: 3480,
        updatedAt: 'Updated 12 min ago',
      },
    ];
  }
}

export const mashupService = new MashupService();
