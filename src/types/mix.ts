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
  startTime?: number; // segment offset in seconds
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
  updatedAt: string; // e.g. "Updated 4 min ago"
  isHero?: boolean;
  accentColor?: string;
  isCustom?: boolean;
}

export const MIX_CATEGORIES: MixCategoryMeta[] = [
  { id: 'trending', name: '🔥 Trending Now', subtitle: 'The hottest tracks right now', gradient: 'from-orange-500 to-rose-600', iconName: 'Flame' },
  { id: 'india', name: '🇮🇳 India Heat', subtitle: 'Trending Indian music', gradient: 'from-amber-500 to-red-600', iconName: 'Compass' },
  { id: 'global', name: '🌎 Global Heat', subtitle: 'Worldwide trending tracks', gradient: 'from-blue-500 to-indigo-600', iconName: 'Globe' },
  { id: 'viral', name: '📱 Viral Right Now', subtitle: 'Music currently exploding', gradient: 'from-pink-500 to-purple-600', iconName: 'Zap' },
  { id: 'new_hot', name: '🆕 New & Hot', subtitle: 'Fresh releases gaining attention', gradient: 'from-cyan-500 to-emerald-600', iconName: 'Sparkles' },
  { id: 'party', name: '💃 Party Mix', subtitle: 'High energy continuous beats', gradient: 'from-purple-600 to-pink-500', iconName: 'Music' },
  { id: 'midnight', name: '🌙 Midnight Vibes', subtitle: 'Chill & late-night atmosphere', gradient: 'from-indigo-900 to-slate-800', iconName: 'Moon' },
  { id: 'love', name: '❤️ Love & Romantic', subtitle: 'Emotional trending melodies', gradient: 'from-rose-500 to-pink-600', iconName: 'Heart' },
  { id: 'hiphop', name: '🎤 Hip-Hop Heat', subtitle: 'Trending rap & hip-hop', gradient: 'from-yellow-500 to-amber-700', iconName: 'Mic' },
  { id: 'indie', name: '🎸 Indie Hits', subtitle: 'Emerging & independent sounds', gradient: 'from-emerald-600 to-teal-800', iconName: 'Radio' },
];
