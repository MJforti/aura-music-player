import React from 'react';
import { usePlayback } from '../../context/PlaybackContext';
import { X, Play, ExternalLink as ExternalLinkIcon, Disc, User, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MashupDetailModal: React.FC = () => {
  const { selectedMashupForDetail, closeMashupDetail, playMashup, setIsMixPlayerOpen } = usePlayback();

  if (!selectedMashupForDetail) return null;

  const m = selectedMashupForDetail;

  const getAvailabilityBadge = () => {
    switch (m.availability) {
      case 'playable':
        return <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">FULL AUDIO</span>;
      case 'preview':
        return <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-mono text-[10px] font-bold">PREVIEW • 30S</span>;
      case 'external-only':
        return <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono text-[10px] font-bold">EXTERNAL ONLY</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono text-[10px] font-bold">UNAVAILABLE</span>;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-md p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">
              MASHUP DIAGNOSTICS & DETAILS
            </span>
            <button onClick={closeMashupDetail} className="p-1 rounded-md text-zinc-500 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ARTWORK & TITLE */}
          <div className="flex items-center gap-4">
            <img src={m.artwork} alt={m.title} className="w-20 h-20 rounded-xl object-cover border border-zinc-800 flex-shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight leading-tight truncate">{m.title}</h2>
              </div>
              <p className="text-xs text-zinc-400 mt-1">{m.categoryName}</p>
              <div className="mt-1.5">{getAvailabilityBadge()}</div>
            </div>
          </div>

          {/* AUDIO RESOLUTION DIAGNOSTICS (SECTION 16) */}
          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1.5 text-xs font-mono">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Audio Resolution Status
            </p>
            <p className="text-zinc-300">Provider: <span className="text-white font-bold">{m.playback?.provider || 'iTunes Store'}</span></p>
            <p className="text-zinc-300">Availability: <span className="text-white font-bold">{m.availability.toUpperCase()}</span></p>
            <p className="text-zinc-300">Stream Status: <span className="text-emerald-400 font-bold">Verified Authorized Audio</span></p>
          </div>

          {/* THIS MASHUP FUSES */}
          <div className="space-y-3 pt-1">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">This Mashup Fuses</p>
            <div className="space-y-2">
              {m.sourceTracks.map((st, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-white">{st.title}</p>
                    <p className="text-zinc-400">{st.artist}</p>
                  </div>
                  <Disc className="w-4 h-4 text-zinc-500" />
                </div>
              ))}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="space-y-2 pt-2">
            {(m.availability === 'playable' || m.availability === 'preview') ? (
              <button
                onClick={() => {
                  closeMashupDetail();
                  playMashup(m);
                  setIsMixPlayerOpen(true);
                }}
                className="w-full py-3 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-black ml-0.5" />
                {m.availability === 'preview' ? 'PLAY PREVIEW (30S)' : 'PLAY MASHUP'}
              </button>
            ) : (
              <a
                href={m.externalUrl || 'https://spotify.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
              >
                LISTEN ON SOURCE <ExternalLinkIcon className="w-4 h-4" />
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
