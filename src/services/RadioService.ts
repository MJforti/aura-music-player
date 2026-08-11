import { RadioStation } from '../types/radio';

export class RadioService {
  private stations: RadioStation[] = [
    {
      id: 'hop-main',
      name: 'HORN OK RADIO',
      frequency: '98.4 FM',
      tagline: 'Bollywood × Global Chartbusters',
      badge: 'TOP STATION',
      color: '#FACC15', // Yellow
      gradient: 'from-amber-500 to-yellow-400',
      currentTrack: {
        id: 'track-husn-let-her-go',
        title: 'Husn × Let Her Go',
        artist: 'Anuv Jain × Passenger',
        sourceTracks: ['Husn (Anuv Jain)', 'Let Her Go (Passenger)'],
        artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
        streamUrl: 'https://itunes.apple.com/search?term=Husn+Anuv+Jain&entity=song',
        duration: 222,
      },
      playlist: [
        {
          id: 'track-husn-let-her-go',
          title: 'Husn × Let Her Go',
          artist: 'Anuv Jain × Passenger',
          sourceTracks: ['Husn', 'Let Her Go'],
          artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
          streamUrl: 'https://itunes.apple.com/search?term=Husn+Anuv+Jain&entity=song',
          duration: 222,
        },
        {
          id: 'track-chaleya-until-i-found-you',
          title: 'Chaleya × Until I Found You',
          artist: 'Arijit Singh × Stephen Sanchez',
          sourceTracks: ['Chaleya', 'Until I Found You'],
          artwork: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
          streamUrl: 'https://itunes.apple.com/search?term=Chaleya+Arijit&entity=song',
          duration: 205,
        },
      ],
    },
    {
      id: 'desi-dancehall',
      name: 'DESI DANCEHALL',
      frequency: '104.2 FM',
      tagline: 'High Energy Party & Festival Beats',
      badge: 'PARTY ZONE',
      color: '#EF4444', // Red
      gradient: 'from-rose-600 to-red-500',
      currentTrack: {
        id: 'track-aankh-marey-shape-of-you',
        title: 'Aankh Marey × Shape of You',
        artist: 'Neha Kakkar × Ed Sheeran',
        sourceTracks: ['Aankh Marey', 'Shape of You'],
        artwork: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
        streamUrl: 'https://itunes.apple.com/search?term=Aankh+Marey&entity=song',
        duration: 200,
      },
      playlist: [
        {
          id: 'track-aankh-marey-shape-of-you',
          title: 'Aankh Marey × Shape of You',
          artist: 'Neha Kakkar × Ed Sheeran',
          sourceTracks: ['Aankh Marey', 'Shape of You'],
          artwork: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
          streamUrl: 'https://itunes.apple.com/search?term=Aankh+Marey&entity=song',
          duration: 200,
        },
      ],
    },
    {
      id: 'auto-chill',
      name: 'AUTO CHILL',
      frequency: '92.1 FM',
      tagline: 'Late Night Lofi & Auto Rides',
      badge: 'NIGHT LOFI',
      color: '#06B6D4', // Teal
      gradient: 'from-cyan-600 to-teal-500',
      currentTrack: {
        id: 'track-o-maahi-someone-you-loved',
        title: 'O Maahi × Someone You Loved',
        artist: 'Arijit Singh × Lewis Capaldi',
        sourceTracks: ['O Maahi', 'Someone You Loved'],
        artwork: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop&q=80',
        streamUrl: 'https://itunes.apple.com/search?term=O+Maahi+Arijit&entity=song',
        duration: 210,
      },
      playlist: [],
    },
    {
      id: 'punjabi-speed',
      name: 'PUNJABI SPEED',
      frequency: '108.0 FM',
      tagline: 'Bhangra Trap × Hip-Hop Crossovers',
      badge: 'BHANGRA TRAP',
      color: '#EC4899', // Pink
      gradient: 'from-pink-600 to-rose-500',
      currentTrack: {
        id: 'track-pasoori-levitating',
        title: 'Pasoori × Levitating',
        artist: 'Ali Sethi × Dua Lipa',
        sourceTracks: ['Pasoori', 'Levitating'],
        artwork: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&auto=format&fit=crop&q=80',
        streamUrl: 'https://itunes.apple.com/search?term=Pasoori&entity=song',
        duration: 212,
      },
      playlist: [],
    },
    {
      id: '90s-truck-disco',
      name: '90s TRUCK DISCO',
      frequency: '89.5 FM',
      tagline: 'Golden Era Remixes & Highway Beats',
      badge: 'RETRO CLASSIC',
      color: '#F97316', // Orange
      gradient: 'from-orange-600 to-amber-500',
      currentTrack: {
        id: 'track-chaiyya-smooth-criminal',
        title: 'Chaiyya Chaiyya × Smooth Criminal',
        artist: 'AR Rahman × Michael Jackson',
        sourceTracks: ['Chaiyya Chaiyya', 'Smooth Criminal'],
        artwork: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
        streamUrl: 'https://itunes.apple.com/search?term=Chaiyya+Chaiyya&entity=song',
        duration: 235,
      },
      playlist: [],
    },
  ];

  public getStations(): RadioStation[] {
    return this.stations;
  }

  public getStation(id: string): RadioStation | undefined {
    return this.stations.find((s) => s.id === id);
  }
}

export const radioService = new RadioService();
