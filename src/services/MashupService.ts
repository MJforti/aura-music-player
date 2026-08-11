import { Mashup, MashupMix, MashupCategory, MashupAvailability } from '../types/mashup';
import { audioResolver } from './engine/AudioResolver';

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
      externalUrl: 'https://spotify.com',
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
      externalUrl: 'https://spotify.com',
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
      externalUrl: 'https://spotify.com',
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
      externalUrl: 'https://spotify.com',
      createdAt: '2026-03-01T00:00:00Z',
      updatedAt: '2026-08-11T00:00:00Z',
    },
    {
      id: 'mashup-o-maahi-someone-you-loved',
      title: 'O Maahi × Someone You Loved',
      slug: 'o-maahi-someone-you-loved',
      description: 'Dunki O Maahi piano breakdown with Lewis Capaldi emotional vocal.',
      artwork: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop&q=80',
      creator: { id: 'dj-nyk', name: 'DJ NYK' },
      sourceTracks: [
        { title: 'O Maahi', artist: 'Arijit Singh' },
        { title: 'Someone You Loved', artist: 'Lewis Capaldi' },
      ],
      duration: 210,
      category: 'sad_hours',
      categoryName: 'Sad Hours',
      language: ['Hindi', 'English'],
      tags: ['Emotional', 'Piano'],
      releaseDate: '2026-03-12',
      trendingScore: 86,
      popularity: 84,
      externalUrl: 'https://spotify.com',
      createdAt: '2026-03-12T00:00:00Z',
      updatedAt: '2026-08-11T00:00:00Z',
    },
    {
      id: 'mashup-aankh-marey-shape-of-you',
      title: 'Aankh Marey × Shape of You',
      slug: 'aankh-marey-shape-of-you',
      description: 'High energy Bollywood dance anthem blended with Ed Sheeran tropical pop.',
      artwork: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
      creator: { id: 'dj-chetas', name: 'DJ Chetas' },
      sourceTracks: [
        { title: 'Aankh Marey', artist: 'Neha Kakkar' },
        { title: 'Shape of You', artist: 'Ed Sheeran' },
      ],
      duration: 200,
      category: 'desi_party',
      categoryName: 'Desi Party',
      language: ['Hindi', 'English'],
      tags: ['Party', 'Dance'],
      releaseDate: '2026-04-05',
      trendingScore: 93,
      popularity: 90,
      externalUrl: 'https://spotify.com',
      createdAt: '2026-04-05T00:00:00Z',
      updatedAt: '2026-08-11T00:00:00Z',
    },
    {
      id: 'mashup-pasoori-levitating',
      title: 'Pasoori × Levitating',
      slug: 'pasoori-levitating',
      description: 'Coke Studio Punjabi hit Pasoori combined with Dua Lipa disco pop.',
      artwork: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&auto=format&fit=crop&q=80',
      creator: { id: 'dj-vibe', name: 'DJ Vibe' },
      sourceTracks: [
        { title: 'Pasoori', artist: 'Ali Sethi & Shae Gill' },
        { title: 'Levitating', artist: 'Dua Lipa' },
      ],
      duration: 212,
      category: 'punjabi_english',
      categoryName: 'Punjabi × English',
      language: ['Punjabi', 'English'],
      tags: ['Crossover', 'Disco'],
      releaseDate: '2026-04-18',
      trendingScore: 89,
      popularity: 87,
      externalUrl: 'https://spotify.com',
      createdAt: '2026-04-18T00:00:00Z',
      updatedAt: '2026-08-11T00:00:00Z',
    },
    {
      id: 'mashup-kesariya-golden-hour',
      title: 'Kesariya × Golden Hour',
      slug: 'kesariya-golden-hour',
      description: 'Brahmastra Kesariya strings blended with JVKE golden hour orchestral pop.',
      artwork: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
      creator: { id: 'dj-nyk', name: 'DJ NYK' },
      sourceTracks: [
        { title: 'Kesariya', artist: 'Pritam & Arijit Singh' },
        { title: 'Golden Hour', artist: 'JVKE' },
      ],
      duration: 228,
      category: 'late_night',
      categoryName: 'Late Night',
      language: ['Hindi', 'English'],
      tags: ['Orchestral', 'Atmospheric'],
      releaseDate: '2026-05-02',
      trendingScore: 87,
      popularity: 85,
      externalUrl: 'https://spotify.com',
      createdAt: '2026-05-02T00:00:00Z',
      updatedAt: '2026-08-11T00:00:00Z',
    },
  ];

  private resolvedCache: Mashup[] | null = null;

  public async getResolvedMashups(): Promise<Mashup[]> {
    if (this.resolvedCache) return this.resolvedCache;

    const resolved = await Promise.all(
      this.rawMashups.map(async (raw) => {
        const audio = await audioResolver.resolveTrack(raw.sourceTracks[0].artist, raw.sourceTracks[0].title);
        if (audio) {
          return {
            ...raw,
            availability: 'preview' as MashupAvailability,
            playback: {
              type: 'preview_url' as const,
              url: audio.url,
              provider: audio.provider,
              duration: audio.duration,
              attributionUrl: audio.attributionUrl,
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

    this.resolvedCache = resolved;
    return resolved;
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
    // Filter only playable/preview mashups for continuous mixes
    const playableList = list.filter(m => m.availability === 'preview' || m.availability === 'playable');

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
      {
        id: 'mix-desi-party',
        title: 'DESI PARTY',
        subtitle: `${playableList.filter(m => m.category === 'desi_party' || m.category === 'bollywood_english').length} mashups • High Energy`,
        description: 'High energy festival & club mashups.',
        artwork: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
        category: 'desi_party',
        mashups: playableList.filter(m => m.category === 'desi_party' || m.category === 'bollywood_english'),
        totalDuration: 3900,
        updatedAt: 'Updated 18 min ago',
      },
      {
        id: 'mix-midnight',
        title: 'MIDNIGHT MIX',
        subtitle: `${playableList.filter(m => m.category === 'late_night' || m.category === 'sad_hours' || m.category === 'bollywood_english').length} mashups • Late Night`,
        description: 'Atmospheric late night chill mashup session.',
        artwork: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
        category: 'late_night',
        mashups: playableList.filter(m => m.category === 'late_night' || m.category === 'sad_hours' || m.category === 'bollywood_english'),
        totalDuration: 2880,
        updatedAt: 'Updated 25 min ago',
      },
    ];
  }
}

export const mashupService = new MashupService();
