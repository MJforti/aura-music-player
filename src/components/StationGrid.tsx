import React from 'react';
import { useRadio } from '../context/RadioContext';
import { radioService } from '../services/RadioService';
import { Radio as RadioIcon, Play, Flame, Disc } from 'lucide-react';
import { motion } from 'framer-motion';

export const StationGrid: React.FC = () => {
  const { currentStation, tuneToStation, isPlaying } = useRadio();
  const stations = radioService.getStations();

  return (
    <div className="px-4 py-4 space-y-3 pb-24">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-zinc-300 flex items-center gap-2">
          <RadioIcon className="w-4 h-4 text-amber-400" /> Desi Radio Stations
        </h2>
        <span className="text-xs font-mono text-zinc-500">5 Active FM Channels</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {stations.map((st, idx) => {
          const isSelected = st.id === currentStation.id;

          return (
            <motion.div
              key={st.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              onClick={() => tuneToStation(st.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer group shadow-lg ${
                isSelected
                  ? 'bg-zinc-900 border-amber-400/80 shadow-amber-400/10'
                  : 'bg-zinc-950/80 border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-black text-amber-400 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/30">
                      {st.frequency}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">{st.badge}</span>
                  </div>

                  <h3 className="text-lg font-black text-white tracking-tight leading-snug group-hover:text-amber-300 transition-colors">
                    {st.name}
                  </h3>
                  <p className="text-xs font-semibold text-zinc-400 line-clamp-1">{st.tagline}</p>
                  <p className="text-[11px] font-mono text-cyan-400 pt-1 truncate">
                    NOW: {st.currentTrack.title}
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between h-full gap-3">
                  <img
                    src={st.currentTrack.artwork}
                    alt={st.name}
                    className="w-12 h-12 rounded-xl object-cover border border-zinc-800 flex-shrink-0"
                  />
                  <button className="p-2.5 rounded-xl bg-amber-400 text-black font-black hover:bg-amber-300 transition-transform group-hover:scale-105 shadow-md">
                    <Play className="w-4 h-4 fill-black ml-0.5" />
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
