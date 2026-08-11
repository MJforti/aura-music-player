import React, { useState, useEffect } from 'react';
import { useMixPlayback } from '../../context/MixPlaybackContext';
import { trendingService } from '../../services/TrendingService';
import { mixGenerator } from '../../services/MixGenerator';
import { Mix, MIX_CATEGORIES, MixCategoryMeta } from '../../types/mix';
import { Play, Sparkles, Flame, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export const MixesView: React.FC = () => {
  const { playMix, currentMix, isPlaying, setIsMixPlayerOpen } = useMixPlayback();
  const [categoryMixes, setCategoryMixes] = useState<Record<string, Mix>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategoryMixes = async () => {
      try {
        const mixesMap: Record<string, Mix> = {};

        await Promise.all(
          MIX_CATEGORIES.map(async (cat) => {
            let tracks;
            if (cat.id === 'global') tracks = await trendingService.getTrendingGlobal();
            else if (cat.id === 'india') tracks = await trendingService.getTrendingIndia();
            else if (cat.id === 'viral') tracks = await trendingService.getTrendingViral();
            else if (cat.id === 'new_hot') tracks = await trendingService.getNewAndHot();
            else tracks = await trendingService.getCategoryTracks(cat.id);

            mixesMap[cat.id] = mixGenerator.createMix(
              `mix-cat-${cat.id}`,
              cat.name,
              cat.subtitle,
              `Continuous short-form discovery mix for ${cat.name}.`,
              cat.id,
              cat.name,
              tracks
            );
          })
        );

        setCategoryMixes(mixesMap);
      } catch (e) {
        console.error('Failed to load category mixes:', e);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryMixes();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-8 bg-white/10 rounded-2xl w-32" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-36 bg-white/10 rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-36 pt- safe px-4 space-y-6 no-scrollbar">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-purple-400">MIX CATALOG</p>
        <h1 className="text-2xl font-black text-white tracking-tight">Explore All Mixes</h1>
        <p className="text-xs text-white/50 mt-1">Tap any mix category to hear continuous short-form music</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {MIX_CATEGORIES.map((cat, idx) => {
          const mix = categoryMixes[cat.id];
          if (!mix) return null;

          const isCurrentPlaying = currentMix?.id === mix.id && isPlaying;

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              onClick={() => {
                playMix(mix);
                setIsMixPlayerOpen(true);
              }}
              className={`relative overflow-hidden rounded-3xl p-5 border border-white/15 bg-gradient-to-br ${cat.gradient} bg-opacity-30 shadow-xl cursor-pointer group hover:scale-[1.02] transition-all`}
            >
              <div className="relative z-10 flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/70">
                    {mix.updatedAt}
                  </span>
                  <h3 className="text-xl font-black text-white tracking-tight leading-snug">{cat.name}</h3>
                  <p className="text-xs text-white/80 line-clamp-1">{cat.subtitle}</p>
                  <p className="text-[11px] font-medium text-white/60 pt-1">
                    {mix.trackCount} Tracks • {mixGenerator.formatDuration(mix.duration)}
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between h-full gap-4">
                  <img
                    src={mix.artworkUrl}
                    alt={mix.title}
                    className="w-14 h-14 rounded-2xl object-cover border border-white/20 shadow-md flex-shrink-0"
                  />
                  <button className="p-3 rounded-full bg-white/20 text-white backdrop-blur-md border border-white/30 group-hover:scale-110 transition-transform shadow-lg">
                    <Play className="w-4 h-4 fill-white" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
