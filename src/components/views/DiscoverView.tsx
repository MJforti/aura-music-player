import React, { useState, useEffect } from 'react';
import { usePlayback } from '../../context/PlaybackContext';
import { mashupService } from '../../services/MashupService';
import { Mashup } from '../../types/mashup';
import { Play, Flame, ExternalLink, Sparkles, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export const DiscoverView: React.FC = () => {
  const { playMashup, currentMashup, isPlaying, setIsMixPlayerOpen, openMashupDetail } = usePlayback();
  const [featuredMashup, setFeaturedMashup] = useState<Mashup | null>(null);
  const [trendingMashups, setTrendingMashups] = useState<Mashup[]>([]);
  const [newMashups, setNewMashups] = useState<Mashup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDiscoverData = async () => {
      try {
        const feat = await mashupService.getFeaturedMashup();
        const trend = await mashupService.getTrendingMashups();
        const fresh = await mashupService.getNewMashups();

        setFeaturedMashup(feat);
        setTrendingMashups(trend);
        setNewMashups(fresh);
      } catch (e) {
        console.error('Failed to load discovery mashups:', e);
      } finally {
        setLoading(false);
      }
    };

    loadDiscoverData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading || !featuredMashup) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-6 bg-zinc-800 rounded-xl w-32" />
        <div className="h-64 bg-zinc-900 rounded-2xl border border-zinc-800" />
        <div className="h-32 bg-zinc-900 rounded-2xl border border-zinc-800" />
      </div>
    );
  }

  const isHeroPlaying = currentMashup?.id === featuredMashup.id && isPlaying;

  const renderActionButton = (m: Mashup, isPlayingItem: boolean) => {
    if (m.availability === 'external-only' || m.availability === 'unavailable') {
      return (
        <a
          href={m.externalUrl || 'https://spotify.com'}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="w-full py-3.5 px-6 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-bold text-xs tracking-wider uppercase hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
        >
          LISTEN ON SOURCE <ExternalLink className="w-4 h-4" />
        </a>
      );
    }

    return (
      <button
        onClick={() => {
          if (isPlayingItem) {
            setIsMixPlayerOpen(true);
          } else {
            playMashup(m);
            setIsMixPlayerOpen(true);
          }
        }}
        className="w-full py-3.5 px-6 rounded-xl bg-white text-black font-bold text-xs tracking-wider uppercase hover:bg-zinc-200 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm"
      >
        <Play className="w-4 h-4 fill-black" />
        {isPlayingItem ? 'OPEN PLAYER' : m.availability === 'preview' ? 'PLAY PREVIEW (30S)' : 'PLAY MASHUP'}
      </button>
    );
  };

  return (
    <div className="pb-36 pt- safe px-4 space-y-8 no-scrollbar">
      {/* Header Bar */}
      <div className="pt-3">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-400">AURA</p>
          <span className="text-[10px] font-mono text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded-full">BOLLYWOOD × GLOBAL</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">{getGreeting()}</h1>
        <p className="text-xs text-zinc-400 mt-0.5">Discover the mashups you didn't know you needed.</p>
      </div>

      {/* HERO FEATURED MASHUP WITH AMBIENT VIDEO BACKDROP */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl group"
      >
        {/* AMBIENT BACKGROUND VIDEO STREAM */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-105 blur-sm hidden sm:block"
          >
            <source src="/videos/desktop_format.mp4" type="video/mp4" />
          </video>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-105 blur-sm sm:hidden"
          >
            <source src="/videos/mobile_format.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
        </div>

        <div className="relative z-10 space-y-5">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-md bg-zinc-800/90 text-zinc-200 border border-zinc-700 text-[10px] font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1.5 backdrop-blur-md">
              <Flame className="w-3 h-3 text-orange-400 fill-current" /> TRENDING NOW
            </span>
            <button
              onClick={() => openMashupDetail(featuredMashup)}
              className="p-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white"
              title="View Diagnostics"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-end justify-between gap-4 pt-1">
            <div className="space-y-1 min-w-0">
              <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">{featuredMashup.title}</h2>
              <p className="text-xs font-semibold text-zinc-300">
                {featuredMashup.sourceTracks.map(t => `${t.title} (${t.artist})`).join(' × ')}
              </p>
              <p className="text-xs text-zinc-400 line-clamp-2 pt-1">{featuredMashup.description}</p>
            </div>
            <img
              src={featuredMashup.artwork}
              alt={featuredMashup.title}
              className="w-20 h-20 rounded-xl object-cover border border-zinc-800 shadow-md flex-shrink-0"
            />
          </div>

          <div className="pt-2">
            {renderActionButton(featuredMashup, isHeroPlaying)}
          </div>
        </div>
      </motion.div>

      {/* SECTION: TRENDING MASHUPS CAROUSEL */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-zinc-300 flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" /> Trending Mashups
          </h3>
          <span className="text-xs font-mono text-zinc-500">Top Rated</span>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 pt-1">
          {trendingMashups.map((m) => (
            <div
              key={m.id}
              onClick={() => {
                if (m.availability === 'external-only' || m.availability === 'unavailable') {
                  openMashupDetail(m);
                } else {
                  playMashup(m);
                  setIsMixPlayerOpen(true);
                }
              }}
              className="flex-shrink-0 w-44 space-y-2 cursor-pointer group"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
                <img src={m.artwork} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="p-3 rounded-full bg-white text-black">
                    <Play className="w-4 h-4 fill-black ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[9px] font-mono text-zinc-300 border border-zinc-800">
                  {m.availability === 'preview' ? '30s Preview' : 'External'}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-zinc-300 truncate">{m.title}</p>
                <p className="text-[11px] text-zinc-500 truncate">{m.sourceTracks.map(t => t.artist).join(' × ')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION: NEW MASHUPS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-zinc-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" /> New Mashups
          </h3>
          <span className="text-xs font-mono text-zinc-500">Fresh Crossovers</span>
        </div>

        <div className="space-y-2">
          {newMashups.slice(0, 4).map((m) => (
            <div
              key={m.id}
              onClick={() => {
                if (m.availability === 'external-only' || m.availability === 'unavailable') {
                  openMashupDetail(m);
                } else {
                  playMashup(m);
                  setIsMixPlayerOpen(true);
                }
              }}
              className="p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <img src={m.artwork} alt={m.title} className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-zinc-800" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white group-hover:text-zinc-200 truncate">{m.title}</p>
                  <p className="text-xs text-zinc-400 truncate">{m.sourceTracks.map(t => `${t.title} (${t.artist})`).join(' × ')}</p>
                </div>
              </div>
              {m.availability === 'external-only' ? (
                <span className="text-[10px] font-mono text-zinc-400 border border-zinc-800 px-2 py-1 rounded-lg">External</span>
              ) : (
                <button className="p-2.5 rounded-xl bg-zinc-800 text-white border border-zinc-700 group-hover:bg-white group-hover:text-black transition-all flex-shrink-0">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
