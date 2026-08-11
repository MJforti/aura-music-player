import React, { useState, useEffect } from 'react';
import { useMixPlayback } from '../../context/MixPlaybackContext';
import { trendingService } from '../../services/TrendingService';
import { mixGenerator } from '../../services/MixGenerator';
import { Mix } from '../../types/mix';
import { Play, RotateCw, Globe, Compass, Zap, Disc, Music } from 'lucide-react';
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
        'Continuous short-form listening session of worldwide chart-toppers.',
        'global',
        'Worldwide Charts',
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
        'VIRAL TRENDS',
        'Exploding Tracks',
        'Music currently dominating social feeds and viral charts.',
        'viral',
        'Viral Trends',
        viralTracks
      );

      const newHot = mixGenerator.createMix(
        'mix-new-hot',
        'NEW RELEASES',
        'Fresh Releases Mixed',
        'Brand new songs mixed seamlessly for instant discovery.',
        'new_hot',
        'Fresh Music',
        newHotTracks
      );

      const party = mixGenerator.createMix(
        'mix-party',
        'PARTY BEATS',
        'High Energy Beats',
        'Upbeat continuous dance and pop set.',
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
        <div className="h-6 bg-zinc-800 rounded-xl w-32" />
        <div className="h-64 bg-zinc-900 rounded-2xl border border-zinc-800" />
        <div className="h-32 bg-zinc-900 rounded-2xl border border-zinc-800" />
      </div>
    );
  }

  const isHeroPlaying = currentMix?.id === heroMix.id && isPlaying;

  return (
    <div className="pb-36 pt- safe px-4 space-y-8 no-scrollbar">
      {/* Header Bar */}
      <div className="flex items-center justify-between pt-3">
        <div>
          <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-400">AURA MIX</p>
          <h1 className="text-2xl font-bold text-white tracking-tight">{getGreeting()}</h1>
        </div>
        <button
          onClick={() => loadMixes(true)}
          disabled={refreshing}
          className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-all active:scale-95"
          title="Refresh mixes"
        >
          <RotateCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* HERO SECTION: GLOBAL HEAT */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl"
      >
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-200 border border-zinc-700 text-[10px] font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-zinc-300" /> GLOBAL HEAT
            </span>
            <span className="text-xs font-mono text-zinc-500">{heroMix.updatedAt}</span>
          </div>

          <div className="flex items-end justify-between gap-4 pt-1">
            <div className="space-y-1 min-w-0">
              <h2 className="text-3xl font-extrabold text-white tracking-tight leading-none">{heroMix.title}</h2>
              <p className="text-xs font-mono text-zinc-400 pt-1">
                {heroMix.trackCount} TRACKS • {mixGenerator.formatDuration(heroMix.duration)}
              </p>
              <p className="text-xs text-zinc-400 line-clamp-2 pt-1">{heroMix.description}</p>
            </div>
            <img
              src={heroMix.artworkUrl}
              alt={heroMix.title}
              className="w-20 h-20 rounded-xl object-cover border border-zinc-800 shadow-md flex-shrink-0"
            />
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                if (isHeroPlaying) {
                  setIsMixPlayerOpen(true);
                } else {
                  playMix(heroMix);
                  setIsMixPlayerOpen(true);
                }
              }}
              className="w-full py-3.5 px-6 rounded-xl bg-white text-black font-bold text-xs tracking-wider uppercase hover:bg-zinc-200 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Play className="w-4 h-4 fill-black" />
              {isHeroPlaying ? 'OPEN MIX PLAYER' : 'PLAY MIX'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* CATEGORY MIX CARDS */}
      <div className="space-y-4">
        <p className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 px-1">Curated Mixes</p>

        {/* INDIA HEAT */}
        {indiaMix && (
          <div
            onClick={() => {
              playMix(indiaMix);
              setIsMixPlayerOpen(true);
            }}
            className="p-4 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <img src={indiaMix.artworkUrl} alt={indiaMix.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-zinc-800" />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white group-hover:text-zinc-200 truncate">{indiaMix.title}</span>
                  <span className="text-[10px] font-mono text-zinc-500">{indiaMix.updatedAt}</span>
                </div>
                <p className="text-xs font-mono text-zinc-400 mt-0.5">{indiaMix.trackCount} Tracks • {mixGenerator.formatDuration(indiaMix.duration)}</p>
                <p className="text-xs text-zinc-500 truncate mt-0.5">{indiaMix.subtitle}</p>
              </div>
            </div>
            <button className="p-3 rounded-xl bg-zinc-800 text-white border border-zinc-700 group-hover:bg-white group-hover:text-black transition-all flex-shrink-0">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </button>
          </div>
        )}

        {/* VIRAL TRENDS */}
        {viralMix && (
          <div
            onClick={() => {
              playMix(viralMix);
              setIsMixPlayerOpen(true);
            }}
            className="p-4 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <img src={viralMix.artworkUrl} alt={viralMix.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-zinc-800" />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white group-hover:text-zinc-200 truncate">{viralMix.title}</span>
                  <span className="text-[10px] font-mono text-zinc-500">{viralMix.updatedAt}</span>
                </div>
                <p className="text-xs font-mono text-zinc-400 mt-0.5">{viralMix.trackCount} Tracks • {mixGenerator.formatDuration(viralMix.duration)}</p>
                <p className="text-xs text-zinc-500 truncate mt-0.5">{viralMix.subtitle}</p>
              </div>
            </div>
            <button className="p-3 rounded-xl bg-zinc-800 text-white border border-zinc-700 group-hover:bg-white group-hover:text-black transition-all flex-shrink-0">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </button>
          </div>
        )}

        {/* NEW RELEASES */}
        {newHotMix && (
          <div
            onClick={() => {
              playMix(newHotMix);
              setIsMixPlayerOpen(true);
            }}
            className="p-4 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <img src={newHotMix.artworkUrl} alt={newHotMix.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-zinc-800" />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white group-hover:text-zinc-200 truncate">{newHotMix.title}</span>
                  <span className="text-[10px] font-mono text-zinc-500">{newHotMix.updatedAt}</span>
                </div>
                <p className="text-xs font-mono text-zinc-400 mt-0.5">{newHotMix.trackCount} Tracks • {mixGenerator.formatDuration(newHotMix.duration)}</p>
                <p className="text-xs text-zinc-500 truncate mt-0.5">{newHotMix.subtitle}</p>
              </div>
            </div>
            <button className="p-3 rounded-xl bg-zinc-800 text-white border border-zinc-700 group-hover:bg-white group-hover:text-black transition-all flex-shrink-0">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </button>
          </div>
        )}

        {/* PARTY BEATS */}
        {partyMix && (
          <div
            onClick={() => {
              playMix(partyMix);
              setIsMixPlayerOpen(true);
            }}
            className="p-4 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <img src={partyMix.artworkUrl} alt={partyMix.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-zinc-800" />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white group-hover:text-zinc-200 truncate">{partyMix.title}</span>
                  <span className="text-[10px] font-mono text-zinc-500">{partyMix.updatedAt}</span>
                </div>
                <p className="text-xs font-mono text-zinc-400 mt-0.5">{partyMix.trackCount} Tracks • {mixGenerator.formatDuration(partyMix.duration)}</p>
                <p className="text-xs text-zinc-500 truncate mt-0.5">{partyMix.subtitle}</p>
              </div>
            </div>
            <button className="p-3 rounded-xl bg-zinc-800 text-white border border-zinc-700 group-hover:bg-white group-hover:text-black transition-all flex-shrink-0">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
