import { Track } from './catalog';

export type MixCategory =
  | 'trending'
  | 'india'
  | 'global'
  | 'viral'
  | 'new_hot'
  | 'party'
  | 'midnight'
  | 'love'
  | 'hiphop'
  | 'indie';

export interface MixCategoryMeta {
  id: MixCategory;
  name: string;
  subtitle: string;
  gradient: string;
  iconName: string;
}

export interface MixTrack {
  track: Track;
  startTime?: number;
  duration: number; // segment length in seconds (e.g. 30s)
  order: number;
}

export interface Mix {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  artworkUrl: string;
  category: MixCategory;
  categoryName: string;
  tracks: MixTrack[];
  duration: number; // total mix length in seconds (e.g. 278s)
  trackCount: number;
  updatedAt: string;
  isHero?: boolean;
  accentColor?: string;
  isCustom?: boolean;
}

export const MIX_CATEGORIES: MixCategoryMeta[] = [
  { id: 'global', name: 'Global Heat', subtitle: 'Top worldwide chart mixes', gradient: 'from-zinc-900 to-zinc-950', iconName: 'Globe' },
  { id: 'india', name: 'India Heat', subtitle: 'Top Indian playback and indie mixes', gradient: 'from-zinc-900 to-zinc-950', iconName: 'Compass' },
  { id: 'trending', name: 'Trending Now', subtitle: 'Hottest songs mixed continuously', gradient: 'from-zinc-900 to-zinc-950', iconName: 'Flame' },
  { id: 'viral', name: 'Viral Trends', subtitle: 'Exploding tracks across social platforms', gradient: 'from-zinc-900 to-zinc-950', iconName: 'Zap' },
  { id: 'new_hot', name: 'New Releases', subtitle: 'Fresh singles and album cuts mixed', gradient: 'from-zinc-900 to-zinc-950', iconName: 'Disc' },
  { id: 'party', name: 'Party Beats', subtitle: 'High energy dance and club sets', gradient: 'from-zinc-900 to-zinc-950', iconName: 'Music' },
  { id: 'midnight', name: 'Midnight Chill', subtitle: 'Late-night ambient and lo-fi mixes', gradient: 'from-zinc-900 to-zinc-950', iconName: 'Moon' },
  { id: 'love', name: 'Romantic Beats', subtitle: 'Melodic and emotional song sequences', gradient: 'from-zinc-900 to-zinc-950', iconName: 'Heart' },
  { id: 'hiphop', name: 'Hip-Hop Vault', subtitle: 'Rap and hip-hop chart mixes', gradient: 'from-zinc-900 to-zinc-950', iconName: 'Mic' },
  { id: 'indie', name: 'Indie Discovery', subtitle: 'Emerging independent artist mixes', gradient: 'from-zinc-900 to-zinc-950', iconName: 'Radio' },
];
