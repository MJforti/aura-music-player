import React, { useState, useEffect } from 'react';
import { usePlayback } from '../../context/PlaybackContext';
import { mashupService } from '../../services/MashupService';
import { MashupMix } from '../../types/mashup';
import { Play, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export const MixesView: React.FC = () => {
  const { playMix, currentMix, isPlaying, setIsMixPlayerOpen } = usePlayback();
  const [mixes, setMixes] = useState<MashupMix[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMixes = async () => {
      try {
        const res = await mashupService.getMixes();
        setMixes(res);
      } catch (e) {
        console.error('Failed to load mashup mixes:', e);
      } finally {
        setLoading(false);
      }
    };

    loadMixes();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-6 bg-zinc-800 rounded-xl w-32" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-zinc-900 rounded-2xl border border-zinc-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-36 pt- safe px-4 space-y-6 no-scrollbar">
      <div className="pt-3">
        <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-400">CURATED SESSIONS</p>
        <h1 className="text-2xl font-bold text-white tracking-tight">Continuous Mixes</h1>
        <p className="text-xs font-mono text-zinc-400 mt-0.5">Non-stop curated Bollywood & Global mashup sets</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mixes.map((mix, idx) => {
          const isCurrentPlaying = currentMix?.id === mix.id && isPlaying;

          return (
            <motion.div
              key={mix.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              onClick={() => {
                playMix(mix);
                setIsMixPlayerOpen(true);
              }}
              className="relative overflow-hidden rounded-2xl p-5 border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-900 transition-all cursor-pointer group shadow-sm hover:border-zinc-700"
            >
              <div className="relative z-10 flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0 flex-1">
                  <span className="text-[10px] font-mono font-bold text-zinc-500">{mix.updatedAt}</span>
                  <h3 className="text-lg font-bold text-white tracking-tight leading-snug">{mix.title}</h3>
                  <p className="text-xs text-zinc-400 line-clamp-1">{mix.description}</p>
                  <p className="text-[11px] font-mono text-zinc-400 pt-2">{mix.subtitle}</p>
                </div>

                <div className="flex flex-col items-end justify-between h-full gap-4">
                  <img
                    src={mix.artwork}
                    alt={mix.title}
                    className="w-14 h-14 rounded-xl object-cover border border-zinc-800 flex-shrink-0"
                  />
                  <button className="p-2.5 rounded-xl bg-zinc-800 text-white border border-zinc-700 group-hover:bg-white group-hover:text-black transition-all">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
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
