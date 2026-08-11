import React from 'react';
import { usePlayback } from '../../context/PlaybackContext';
import { X, Play, ExternalLink as ExternalLinkIcon, Disc, User, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MashupDetailModal: React.FC = () => {
  const { selectedMashupForDetail, closeMashupDetail, playMashup, setIsMixPlayerOpen } = usePlayback();

  if (!selectedMashupForDetail) return null;

  const m = selectedMashupForDetail;

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
              MASHUP DETAILS
            </span>
            <button onClick={closeMashupDetail} className="p-1 rounded-md text-zinc-500 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ARTWORK & TITLE */}
          <div className="flex items-center gap-4">
            <img src={m.artwork} alt={m.title} className="w-20 h-20 rounded-xl object-cover border border-zinc-800 flex-shrink-0" />
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-white tracking-tight leading-tight">{m.title}</h2>
              <p className="text-xs text-zinc-400 mt-1">{m.categoryName}</p>
              <p className="text-[10px] font-mono text-zinc-500 mt-0.5">Duration: {Math.floor(m.duration / 60)}:{(m.duration % 60).toString().padStart(2, '0')}</p>
            </div>
          </div>

          {/* THIS MASHUP USES SECTION */}
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

          {/* CREATED BY */}
          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                <User className="w-4 h-4 text-zinc-300" />
              </div>
              <div>
                <p className="text-[10px] font-mono text-zinc-500 uppercase">Created By</p>
                <p className="font-bold text-white">{m.creator.name}</p>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                closeMashupDetail();
                playMashup(m);
                setIsMixPlayerOpen(true);
              }}
              className="w-full py-3 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-black ml-0.5" /> Play Mashup
            </button>

            {m.externalUrl && (
              <a
                href={m.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-xs hover:text-white transition-all flex items-center justify-center gap-1.5"
              >
                Listen on source <ExternalLinkIcon className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
