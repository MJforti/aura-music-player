import React, { useState, useEffect } from 'react';
import { usePlayback } from '../../context/PlaybackContext';
import { mashupService } from '../../services/MashupService';
import { Mashup, MASHUP_CATEGORIES, MashupCategory } from '../../types/mashup';
import { Play, Disc, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export const MashupsView: React.FC = () => {
  const { playMashup, currentMashup, isPlaying, setIsMixPlayerOpen, openMashupDetail } = usePlayback();
  const [selectedCategory, setSelectedCategory] = useState<MashupCategory | 'all'>('all');
  const [mashups, setMashups] = useState<Mashup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMashups = async () => {
      setLoading(true);
      try {
        if (selectedCategory === 'all') {
          const res = await mashupService.getTrendingMashups();
          setMashups(res);
        } else {
          const res = await mashupService.getCategoryMashups(selectedCategory);
          setMashups(res);
        }
      } catch (e) {
        console.error('Failed to load mashups category:', e);
      } finally {
        setLoading(false);
      }
    };

    loadMashups();
  }, [selectedCategory]);

  return (
    <div className="pb-36 pt- safe px-4 space-y-6 no-scrollbar">
      <div className="pt-3">
        <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-400">MASHUP CATALOG</p>
        <h1 className="text-2xl font-bold text-white tracking-tight">Browse Mashups</h1>
        <p className="text-xs font-mono text-zinc-400 mt-0.5">Explore Bollywood, English & Crossover Combinations</p>
      </div>

      {/* CATEGORY FILTER PILLS */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 rounded-lg border text-xs font-mono font-bold whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-white text-black border-white'
              : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
          }`}
        >
          All Mashups
        </button>
        {MASHUP_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-lg border text-xs font-mono font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-white text-black border-white'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* MASHUP CARDS GRID */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-zinc-900 rounded-xl border border-zinc-800" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {mashups.map((m, idx) => {
            const isCurrentPlaying = currentMashup?.id === m.id && isPlaying;
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="p-3.5 rounded-2xl bg-zinc-900/70 hover:bg-zinc-900 border border-zinc-800 transition-all flex items-center justify-between group"
              >
                <div
                  onClick={() => {
                    playMashup(m);
                    setIsMixPlayerOpen(true);
                  }}
                  className="flex items-center gap-3.5 min-w-0 flex-1 cursor-pointer"
                >
                  <img src={m.artwork} alt={m.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-zinc-800" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white group-hover:text-zinc-200 truncate">{m.title}</p>
                    <p className="text-xs text-zinc-400 truncate mt-0.5">{m.sourceTracks.map(t => `${t.title} (${t.artist})`).join(' × ')}</p>
                    <p className="text-[10px] font-mono text-zinc-500 mt-1">{m.creator.name} • {m.categoryName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <button
                    onClick={() => openMashupDetail(m)}
                    className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                    title="Mashup Info"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      playMashup(m);
                      setIsMixPlayerOpen(true);
                    }}
                    className="p-2.5 rounded-xl bg-zinc-800 text-white border border-zinc-700 group-hover:bg-white group-hover:text-black transition-all"
                  >
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
