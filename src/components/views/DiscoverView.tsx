import React, { useState, useEffect } from 'react';
import { useMixPlayback } from '../../context/MixPlaybackContext';
import { trendingService } from '../../services/TrendingService';
import { mixGenerator } from '../../services/MixGenerator';
import { Mix } from '../../types/mix';
import { Play, Flame, RefreshCw, Sparkles, Zap, Globe, Compass, Radio, Disc } from 'lucide-react';
import { motion } from 'framer-motion';

export const DiscoverView: React.FC = () => {
  const { playMix, currentMix, isPlaying, setIsMixPlayerOpen } = useMixPlayback();
  const [heroMix, setHeroMix] = useState<Mix | null>(null);
  const [indiaMix, setIndiaMix] = useState<Mix | null>(null);
  const [viralMix, setViralMix] = useState<Mix | null>(null);
  const [newHotMix, setNewHotMix] = useState<Mix | null>(null);
  const [partyMix, setPartyMix] = useState<Mix | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadMixes = async (forceRefresh: boolean = false) => {
    if (forceRefresh) setRefreshing(true);
    try {
      const [globalTracks, indiaTracks, viralTracks, newHotTracks, partyTracks] = await Promise.all([
        trendingService.getTrendingGlobal(),
        trendingService.getTrendingIndia(),
        trendingService.getTrendingViral(),
        trendingService.getNewAndHot(),
        trendingService.getCategoryTracks('party'),
      ]);

      const globalHero = mixGenerator.createMix(
        'mix-global-heat',
        'GLOBAL HEAT',
        'Top 25 Trending Songs Mixed',
        'The ultimate continuous mix of current worldwide chart toppers.',
        'global',
        'Worldwide Hits',
        globalTracks,
        true
      );

      const indiaHeat = mixGenerator.createMix(
        'mix-india-heat',
        'INDIA HEAT',
        'Trending Indian Music',
        'Bollywood, Punjabi, and Indian indie chart busters.',
        'india',
        'Indian Charts',
        indiaTracks
      );

      const viralHeat = mixGenerator.createMix(
        'mix-viral',
        'VIRAL RIGHT NOW',
        'What Exploding Right Now',
        'Music currently dominating social feeds and viral trends.',
        'viral',
        'Viral Trends',
        viralTracks
      );

      const newHot = mixGenerator.createMix(
        'mix-new-hot',
        'NEW & HOT',
        'Fresh Releases Gaining Attention',
        'Brand new songs mixed seamlessly for instant discovery.',
        'new_hot',
        'Fresh Music',
        newHotTracks
      );

      const party = mixGenerator.createMix(
        'mix-party',
        'PARTY MIX',
        'High Energy Beats',
        'Upbeat continuous dance, club, and pop mix.',
        'party',
        'Party Energy',
        partyTracks
      );

      setHeroMix(globalHero);
      setIndiaMix(indiaHeat);
      setViralMix(viralHeat);
      setNewHotMix(newHot);
      setPartyMix(party);
    } catch (e) {
      console.error('Failed to load discovery mixes:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMixes();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading || !heroMix) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-8 bg-white/10 rounded-2xl w-40" />
        <div className="h-64 bg-white/10 rounded-3xl" />
        <div className="h-36 bg-white/10 rounded-3xl" />
      </div>
    );
  }

  const isHeroPlaying = currentMix?.id === heroMix.id && isPlaying;

  return (
    <div className="pb-36 pt- safe px-4 space-y-7 no-scrollbar">
      {/* Header Bar */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-orange-400">AURA MIX</p>
          <h1 className="text-2xl font-black text-white tracking-tight">{getGreeting()}</h1>
        </div>
        <button
          onClick={() => loadMixes(true)}
          disabled={refreshing}
          className="p-2.5 rounded-full bg-white/10 border border-white/15 text-white hover:bg-white/20 transition-all active:scale-95"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* HERO SECTION: 🔥 GLOBAL HEAT */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-b from-orange-600/30 via-rose-950/40 to-black/80 p-6 shadow-2xl backdrop-blur-2xl"
      >
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-orange-500/30 text-orange-300 border border-orange-500/40 text-[11px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 fill-current animate-pulse" /> Global Heat
            </span>
            <span className="text-xs text-white/50 font-medium">{heroMix.updatedAt}</span>
          </div>

          <div className="flex items-end justify-between gap-4 pt-2">
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">{heroMix.title}</h2>
              <p className="text-sm text-white/70 font-medium mt-1">
                {heroMix.trackCount} TRACKS • {mixGenerator.formatDuration(heroMix.duration)}
              </p>
              <p className="text-xs text-white/50 line-clamp-2 mt-2">{heroMix.description}</p>
            </div>
            <img
              src={heroMix.artworkUrl}
              alt={heroMix.title}
              className="w-20 h-20 rounded-2xl object-cover border border-white/20 shadow-xl flex-shrink-0"
            />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => {
                if (isHeroPlaying) {
                  setIsMixPlayerOpen(true);
                } else {
                  playMix(heroMix);
                  setIsMixPlayerOpen(true);
                }
              }}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              {isHeroPlaying ? 'OPEN MIX PLAYER' : 'PLAY MIX'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* SECTION: 🇮🇳 INDIA HEAT */}
      {indiaMix && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" /> 🇮🇳 INDIA HEAT
            </h3>
            <span className="text-xs text-white/40">{indiaMix.updatedAt}</span>
          </div>
          <div
            onClick={() => {
              playMix(indiaMix);
              setIsMixPlayerOpen(true);
            }}
            className="p-4 rounded-3xl bg-white/[0.05] hover:bg-white/10 border border-white/10 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <img src={indiaMix.artworkUrl} alt={indiaMix.title} className="w-14 h-14 rounded-2xl object-cover flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-base font-bold text-white group-hover:text-amber-300 truncate">{indiaMix.title}</p>
                <p className="text-xs text-white/50">{indiaMix.trackCount} Tracks • {mixGenerator.formatDuration(indiaMix.duration)}</p>
                <p className="text-xs text-white/40 truncate mt-0.5">{indiaMix.subtitle}</p>
              </div>
            </div>
            <button className="p-3 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 group-hover:scale-110 transition-transform">
              <Play className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>
      )}

      {/* SECTION: 📱 VIRAL RIGHT NOW */}
      {viralMix && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              <Zap className="w-4 h-4 text-pink-400" /> 📱 VIRAL RIGHT NOW
            </h3>
            <span className="text-xs text-white/40">{viralMix.updatedAt}</span>
          </div>
          <div
            onClick={() => {
              playMix(viralMix);
              setIsMixPlayerOpen(true);
            }}
            className="p-4 rounded-3xl bg-white/[0.05] hover:bg-white/10 border border-white/10 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <img src={viralMix.artworkUrl} alt={viralMix.title} className="w-14 h-14 rounded-2xl object-cover flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-base font-bold text-white group-hover:text-pink-300 truncate">{viralMix.title}</p>
                <p className="text-xs text-white/50">{viralMix.trackCount} Tracks • {mixGenerator.formatDuration(viralMix.duration)}</p>
                <p className="text-xs text-white/40 truncate mt-0.5">{viralMix.subtitle}</p>
              </div>
            </div>
            <button className="p-3 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 group-hover:scale-110 transition-transform">
              <Play className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>
      )}

      {/* SECTION: 🆕 NEW & HOT */}
      {newHotMix && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> 🆕 NEW & HOT
            </h3>
            <span className="text-xs text-white/40">{newHotMix.updatedAt}</span>
          </div>
          <div
            onClick={() => {
              playMix(newHotMix);
              setIsMixPlayerOpen(true);
            }}
            className="p-4 rounded-3xl bg-white/[0.05] hover:bg-white/10 border border-white/10 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <img src={newHotMix.artworkUrl} alt={newHotMix.title} className="w-14 h-14 rounded-2xl object-cover flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-base font-bold text-white group-hover:text-cyan-300 truncate">{newHotMix.title}</p>
                <p className="text-xs text-white/50">{newHotMix.trackCount} Tracks • {mixGenerator.formatDuration(newHotMix.duration)}</p>
                <p className="text-xs text-white/40 truncate mt-0.5">{newHotMix.subtitle}</p>
              </div>
            </div>
            <button className="p-3 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 group-hover:scale-110 transition-transform">
              <Play className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>
      )}

      {/* SECTION: 💃 PARTY MIX */}
      {partyMix && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              <Disc className="w-4 h-4 text-purple-400" /> 💃 PARTY MIX
            </h3>
            <span className="text-xs text-white/40">{partyMix.updatedAt}</span>
          </div>
          <div
            onClick={() => {
              playMix(partyMix);
              setIsMixPlayerOpen(true);
            }}
            className="p-4 rounded-3xl bg-white/[0.05] hover:bg-white/10 border border-white/10 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <img src={partyMix.artworkUrl} alt={partyMix.title} className="w-14 h-14 rounded-2xl object-cover flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-base font-bold text-white group-hover:text-purple-300 truncate">{partyMix.title}</p>
                <p className="text-xs text-white/50">{partyMix.trackCount} Tracks • {mixGenerator.formatDuration(partyMix.duration)}</p>
                <p className="text-xs text-white/40 truncate mt-0.5">{partyMix.subtitle}</p>
              </div>
            </div>
            <button className="p-3 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 group-hover:scale-110 transition-transform">
              <Play className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
