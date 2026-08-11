import React, { useState, useEffect } from 'react';
import { HomeFeed, Track, Album, Artist } from '../../types/music';
import { musicProvider } from '../../services/MockMusicProvider';
import { usePlayback } from '../../context/PlaybackContext';
import { SectionHeader } from '../ui/SectionHeader';
import { GlassPanel } from '../ui/GlassPanel';
import { SettingsModal } from '../modals/SettingsModal';
import { Play, Sparkles, RefreshCw, SlidersHorizontal, Flame, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import { catalogManager } from '../../services/CatalogManager';

interface HomeViewProps {
  onOpenDetail: (type: 'album' | 'artist' | 'playlist', item: any, tracks: Track[]) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onOpenDetail }) => {
  const { playTrack, currentTrack, isPlaying } = usePlayback();
  const [feed, setFeed] = useState<HomeFeed | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const loadFeed = async (forceRefresh: boolean = false) => {
    if (forceRefresh) setRefreshing(true);
    try {
      const [trendingRes, newReleasesRes, recsRes] = await Promise.all([
        catalogManager.getTrending({ limit: 15 }),
        catalogManager.getNewReleases({ limit: 15 }),
        catalogManager.getRecommendations({ limit: 15 }),
      ]);

      const trendingTracks = (trendingRes.items as any[]).map(t => ({ ...t, audioUrl: t.previewStreamUrl || t.audioUrl || '' }));
      const newReleaseAlbums = (newReleasesRes.items as any[]).map(alb => ({ ...alb, genre: alb.genres?.[0] || 'Music', trackIds: [] }));
      const recommendationTracks = (recsRes.items as any[]).map(t => ({ ...t, audioUrl: t.previewStreamUrl || t.audioUrl || '' }));

      const popularArtists: Artist[] = [
        { id: 'art-arijit', name: 'Arijit Singh', avatarUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80', bio: 'King of Indian Playback Singing.', genres: ['Bollywood', 'Romantic'], monthlyListeners: 48000000, providerId: 'itunes' },
        { id: 'art-taylor', name: 'Taylor Swift', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80', bio: 'Global Pop Icon & Songwriter.', genres: ['Pop', 'Indie Folk'], monthlyListeners: 99000000, providerId: 'itunes' },
        { id: 'art-diljit', name: 'Diljit Dosanjh', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80', bio: 'Global Punjabi Music Superstar.', genres: ['Punjabi', 'Bhangra'], monthlyListeners: 24000000, providerId: 'itunes' },
        { id: 'art-weeknd', name: 'The Weeknd', avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80', bio: 'R&B & Synth-Pop Megastar.', genres: ['R&B', 'Synth-Pop'], monthlyListeners: 88000000, providerId: 'itunes' },
        { id: 'art-rahman', name: 'A.R. Rahman', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80', bio: 'Oscar Winning Indian Music Maestro.', genres: ['Classical', 'Bollywood'], monthlyListeners: 32000000, providerId: 'itunes' },
        { id: 'art-drake', name: 'Drake', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80', bio: 'Hip-Hop & Rap Icon.', genres: ['Hip-Hop', 'Rap'], monthlyListeners: 80000000, providerId: 'itunes' },
      ];

      setFeed({
        recentlyPlayed: trendingTracks.slice(0, 4),
        newReleases: trendingTracks.slice(0, 10),
        trending: trendingTracks,
        recommendations: recommendationTracks,
        popularAlbums: newReleaseAlbums as any[],
        popularArtists: popularArtists as any[],
        recentlyAdded: recommendationTracks,
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } catch (e) {
      console.error('Failed to load home feed', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading || !feed) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-10 bg-white/10 rounded-2xl w-48" />
        <div className="h-44 bg-white/10 rounded-3xl" />
        <div className="h-32 bg-white/10 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="pb-36 pt- safe px-4 space-y-8 no-scrollbar">
      {/* Header Bar */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="text-xs font-semibold text-purple-400 tracking-wider uppercase flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AURA PREMIUM
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{getGreeting()}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Catalog Refresh Button */}
          <button
            onClick={() => loadFeed(true)}
            disabled={refreshing}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 transition-all cursor-pointer disabled:opacity-50"
            title="Refresh Catalog Data"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin text-purple-400' : ''}`} />
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(true)}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 transition-all cursor-pointer"
            title="Settings"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Featured Liquid Glass Banner */}
      {feed.trending.length > 0 && (
        <GlassPanel glow intensity="heavy" className="p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1">
                <Flame className="w-3 h-3 fill-current" /> Live Featured Track
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight">{feed.trending[0].title}</h2>
              <p className="text-sm text-white/60 font-medium">{feed.trending[0].artistName}</p>
            </div>

            <button
              onClick={() => playTrack(feed.trending[0], feed.trending)}
              className="px-6 py-3 rounded-full bg-white text-black font-bold text-sm shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-black" /> Listen Now
            </button>
          </div>
        </GlassPanel>
      )}

      {/* Recently Played Horizontal Carousel */}
      <div>
        <SectionHeader title="Recently Played" subtitle="Pick up right where you left off" />
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
          {feed.recentlyPlayed.map((track) => (
            <motion.div
              key={track.id}
              whileHover={{ y: -4 }}
              onClick={() => playTrack(track, feed.recentlyPlayed)}
              className="flex-shrink-0 w-36 group cursor-pointer"
            >
              <div className="relative w-36 h-36 rounded-2xl overflow-hidden shadow-lg border border-white/10 mb-2">
                <img src={track.artworkUrl} alt={track.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center shadow-xl">
                    <Play className="w-5 h-5 fill-black ml-0.5" />
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-white truncate">{track.title}</h3>
              <p className="text-xs text-white/50 truncate">{track.artistName}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* New Releases Carousel */}
      <div>
        <SectionHeader title="New Releases" subtitle="Fresh music hot off the press" />
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
          {feed.newReleases.map((track) => (
            <motion.div
              key={track.id}
              whileHover={{ y: -4 }}
              onClick={() => playTrack(track, feed.newReleases)}
              className="flex-shrink-0 w-36 group cursor-pointer"
            >
              <div className="relative w-36 h-36 rounded-2xl overflow-hidden shadow-lg border border-white/10 mb-2">
                <img src={track.artworkUrl} alt={track.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur-md rounded-md text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
                  NEW
                </span>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center shadow-xl">
                    <Play className="w-5 h-5 fill-black ml-0.5" />
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-white truncate">{track.title}</h3>
              <p className="text-xs text-white/50 truncate">{track.artistName}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Popular Albums Horizontal Carousel */}
      <div>
        <SectionHeader title="Popular Albums" subtitle="Top charting record collections" />
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
          {feed.popularAlbums.map((album) => (
            <motion.div
              key={album.id}
              whileHover={{ y: -4 }}
              onClick={async () => {
                const res = await musicProvider.getAlbum(album.id);
                if (res) onOpenDetail('album', res.album, res.tracks);
              }}
              className="flex-shrink-0 w-40 group cursor-pointer"
            >
              <div className="relative w-40 h-40 rounded-2xl overflow-hidden shadow-lg border border-white/10 mb-2">
                <img src={album.artworkUrl} alt={album.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/30">
                    View Album
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-white truncate">{album.title}</h3>
              <p className="text-xs text-white/50 truncate">{album.artistName}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Popular Artists Carousel */}
      <div>
        <SectionHeader title="Featured Artists" subtitle="Explore popular music creators" />
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
          {feed.popularArtists.map((artist) => (
            <motion.div
              key={artist.id}
              whileHover={{ y: -4 }}
              onClick={async () => {
                const res = await musicProvider.getArtist(artist.id);
                if (res) onOpenDetail('artist', res.artist, res.tracks);
              }}
              className="flex-shrink-0 w-32 flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg border-2 border-white/10 mb-2 group-hover:border-purple-400 transition-colors">
                <img src={artist.avatarUrl} alt={artist.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-sm font-semibold text-white truncate max-w-full">{artist.name}</h3>
              <p className="text-[11px] text-white/50">{artist.genres[0]}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Settings Modal Component */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onRefreshCatalog={() => loadFeed(true)}
      />
    </div>
  );
};
