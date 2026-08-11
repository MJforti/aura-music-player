import React from 'react';
import { useRadio } from '../context/RadioContext';
import { Play, Pause, Disc, Volume2, Radio as RadioIcon, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const CassettePlayerCard: React.FC = () => {
  const {
    currentStation,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    seek,
    volume,
    setVolume,
    spectrumBars,
  } = useRadio();

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="px-4 py-2">
      <div className="relative overflow-hidden rounded-3xl border-2 border-amber-400/40 bg-zinc-950 p-6 shadow-2xl space-y-5">
        {/* RETRO TRUCK ART HEADER STRIP */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" />
            <span className="text-xs font-mono font-black uppercase text-amber-400 tracking-wider">
              {currentStation.name} • {currentStation.frequency}
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
            {currentStation.badge}
          </span>
        </div>

        {/* CASSETTE TAPE DECK GRAPHIC & REELS */}
        <div className="relative p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-around py-2">
            {/* LEFT CASSETTE REEL */}
            <div className="relative w-16 h-16 rounded-full border-4 border-amber-400 flex items-center justify-center bg-zinc-950 shadow-inner">
              <Disc className={`w-12 h-12 text-amber-400 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
            </div>

            {/* LIVE TAPE TICKER SCREEN */}
            <div className="flex-1 mx-4 p-3 rounded-xl bg-black border border-zinc-800 overflow-hidden text-center">
              <p className="text-[10px] font-mono font-bold text-amber-400/80 uppercase">STATION BROADCAST</p>
              <p className="text-sm font-black text-white truncate mt-0.5">{currentTrack.title}</p>
              <p className="text-xs font-semibold text-cyan-400 truncate mt-0.5">{currentTrack.artist}</p>
            </div>

            {/* RIGHT CASSETTE REEL */}
            <div className="relative w-16 h-16 rounded-full border-4 border-amber-400 flex items-center justify-center bg-zinc-950 shadow-inner">
              <Disc className={`w-12 h-12 text-amber-400 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
            </div>
          </div>

          {/* AUDIO SPECTRUM VISUALIZER */}
          <div className="flex items-end justify-between h-10 px-2 pt-1 border-t border-zinc-800/80">
            {spectrumBars.map((height, idx) => (
              <div
                key={idx}
                className="w-1.5 rounded-t bg-gradient-to-t from-amber-400 to-red-500 transition-all duration-150"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>

        {/* PLAYBACK SCRUBBER */}
        <div className="space-y-1.5">
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = clickX / rect.width;
              seek(ratio * duration);
            }}
            className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden cursor-pointer relative border border-zinc-700"
          >
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-full transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs font-mono font-bold text-zinc-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* PLAYER CONTROLS BAR */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-zinc-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 accent-amber-400 bg-zinc-800 h-1 rounded-lg cursor-pointer"
            />
          </div>

          <button
            onClick={togglePlay}
            className="px-6 py-3 rounded-2xl bg-amber-400 text-black font-black text-xs uppercase tracking-wider shadow-xl hover:bg-amber-300 active:scale-95 transition-all flex items-center gap-2"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black ml-0.5" />}
            {isPlaying ? 'PAUSE RADIO' : 'PLAY RADIO'}
          </button>

          <span className="text-[10px] font-mono text-zinc-400 uppercase border border-zinc-800 px-2 py-1 rounded-md">
            24/7 STEREO
          </span>
        </div>
      </div>
    </div>
  );
};
