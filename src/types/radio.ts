export interface StationTrack {
  id: string;
  title: string;
  artist: string;
  sourceTracks: string[];
  artwork: string;
  streamUrl: string;
  duration: number; // in seconds
}

export interface RadioStation {
  id: string;
  name: string;
  frequency: string; // e.g. "98.4 FM"
  tagline: string;
  badge: string;
  color: string;
  gradient: string;
  currentTrack: StationTrack;
  playlist: StationTrack[];
}
