export type MashupCategory =
  | 'bollywood_english'
  | 'bollywood'
  | 'english'
  | 'hindi_english'
  | 'desi_party'
  | 'romantic'
  | 'late_night'
  | 'sad_hours'
  | 'road_trip'
  | 'punjabi_english'
  | 'indie_bollywood'
  | 'old_new';

export interface MashupCategoryMeta {
  id: MashupCategory;
  name: string;
  subtitle: string;
  iconName: string;
}

export interface SourceTrack {
  title: string;
  artist: string;
  album?: string;
  providerId?: string;
}

export interface Creator {
  id: string;
  name: string;
  image?: string;
  externalUrl?: string;
}

export interface Mashup {
  id: string;
  title: string; // e.g. "Husn × Let Her Go"
  slug: string;
  description?: string;
  artwork: string;
  creator: Creator;
  sourceTracks: SourceTrack[];
  duration: number; // in seconds
  category: MashupCategory;
  categoryName: string;
  language: string[];
  tags: string[];
  releaseDate?: string;
  trendingScore?: number;
  popularity?: number;
  previewUrl?: string;
  externalUrl?: string;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MashupMix {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  artwork: string;
  category: MashupCategory;
  mashups: Mashup[];
  totalDuration: number;
  updatedAt: string;
}

export const MASHUP_CATEGORIES: MashupCategoryMeta[] = [
  { id: 'bollywood_english', name: 'Bollywood × English', subtitle: 'The ultimate Hindi & Global crossovers', iconName: 'Flame' },
  { id: 'hindi_english', name: 'Hindi × English', subtitle: 'Melodic Hindi lyrics with English hooks', iconName: 'Compass' },
  { id: 'punjabi_english', name: 'Punjabi × English', subtitle: 'High energy Punjabi beats x Western pop', iconName: 'Zap' },
  { id: 'desi_party', name: 'Desi Party', subtitle: 'Upbeat club and festival mashups', iconName: 'Music' },
  { id: 'romantic', name: 'Romantic Beats', subtitle: 'Love songs fused across borders', iconName: 'Heart' },
  { id: 'late_night', name: 'Late Night', subtitle: 'Atmospheric and chill mashups', iconName: 'Moon' },
  { id: 'sad_hours', name: 'Sad Hours', subtitle: 'Emotional melodies and deep feels', iconName: 'Radio' },
  { id: 'indie_bollywood', name: 'Indie × Bollywood', subtitle: 'Indian indie gems mixed with Bollywood classics', iconName: 'Sparkles' },
  { id: 'old_new', name: 'Old × New', subtitle: 'Golden era Bollywood meets modern hits', iconName: 'Disc' },
  { id: 'road_trip', name: 'Road Trip', subtitle: 'Driving anthems and traveling beats', iconName: 'Globe' },
  { id: 'bollywood', name: 'Bollywood Pure', subtitle: 'Classic & modern Bollywood combinations', iconName: 'Layers' },
  { id: 'english', name: 'English Pure', subtitle: 'Western pop and hip-hop mashups', iconName: 'Headphones' },
];
