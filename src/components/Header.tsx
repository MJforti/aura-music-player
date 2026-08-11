import React from 'react';
import { useRadio } from '../context/RadioContext';
import { Volume2, Radio, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  const { honkHorn, isHonking, isPlaying } = useRadio();

  return (
    <header className="pt- safe px-4 space-y-3 pb-2">
      {/* TOP DESI BADGE BAR */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-md bg-amber-400 text-black font-black text-xs uppercase tracking-widest border border-amber-300 shadow-md">
            HORN OK PLEASE
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] font-mono font-bold text-zinc-300">
            <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500 animate-ping' : 'bg-zinc-600'}`} />
            {isPlaying ? 'LIVE ON AIR' : 'STATION STANDBY'}
          </span>
        </div>

        <button
          onClick={honkHorn}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all shadow-lg flex items-center gap-1.5 active:scale-95 ${
            isHonking
              ? 'bg-red-600 text-white border border-red-400 scale-105'
              : 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:bg-amber-300 border border-yellow-300'
          }`}
        >
          <Volume2 className={`w-4 h-4 ${isHonking ? 'animate-bounce' : ''}`} />
          {isHonking ? 'HONKING! 📢' : 'HONK HORN 📢'}
        </button>
      </div>

      {/* BRANDING TITLE & TAGLINE */}
      <div>
        <div className="flex items-baseline gap-2">
          <h1 className="text-3xl font-black text-amber-400 tracking-tight leading-none uppercase font-serif">
            HOP RADIO
          </h1>
          <span className="text-xs font-mono font-bold text-cyan-400">DESI BOLLYWOOD × GLOBAL</span>
        </div>
        <p className="text-xs font-semibold text-zinc-400 mt-1">
          Bura Mat Mano, Music Hai! • Discover the mashups you didn't know you needed.
        </p>
      </div>
    </header>
  );
};
