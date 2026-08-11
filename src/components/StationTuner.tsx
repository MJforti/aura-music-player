import React from 'react';
import { useRadio } from '../context/RadioContext';
import { radioService } from '../services/RadioService';
import { Radio as RadioIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export const StationTuner: React.FC = () => {
  const { currentStation, tuneToStation } = useRadio();
  const stations = radioService.getStations();

  return (
    <div className="px-4 py-2">
      <div className="rounded-2xl p-4 bg-zinc-950 border border-zinc-800 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RadioIcon className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
              Station Frequency Tuner
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
            TUNED TO: {currentStation.frequency}
          </span>
        </div>

        {/* FREQUENCY SCALE */}
        <div className="relative py-2 px-1 bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
          {/* TUNER DIAL GRADUATIONS */}
          <div className="flex justify-between items-end h-8 px-2">
            {['88.0', '92.0', '96.0', '100.0', '104.0', '108.0'].map((freq, idx) => (
              <div key={freq} className="flex flex-col items-center gap-1">
                <div className="w-0.5 h-3 bg-zinc-600" />
                <span className="text-[9px] font-mono text-zinc-500">{freq}</span>
              </div>
            ))}
          </div>

          {/* ACTIVE TUNER NEEDLE */}
          <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none flex items-center justify-around px-2">
            {stations.map((s) => {
              const isSelected = s.id === currentStation.id;
              return (
                <div key={s.id} className="relative flex flex-col items-center">
                  {isSelected && (
                    <motion.div
                      layoutId="tunerNeedle"
                      className="w-1 h-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)] z-10"
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* QUICK FREQUENCY STATION PRESETS */}
        <div className="grid grid-cols-5 gap-1.5 pt-1">
          {stations.map((s) => {
            const isSelected = s.id === currentStation.id;
            return (
              <button
                key={s.id}
                onClick={() => tuneToStation(s.id)}
                className={`py-2 px-1 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-amber-400 text-black border-amber-300 font-black shadow-md scale-105'
                    : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 font-bold hover:text-white hover:bg-zinc-800'
                }`}
              >
                <p className="text-[10px] font-mono leading-none">{s.frequency}</p>
                <p className="text-[9px] truncate font-sans mt-1 opacity-80">{s.name.split(' ')[0]}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
