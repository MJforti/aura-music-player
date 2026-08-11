import React from 'react';
import { useUser } from '../../context/UserContext';
import { X, Sliders, ShieldCheck, RefreshCw, Zap, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshCatalog?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onRefreshCatalog,
}) => {
  const { audioQuality, setAudioQuality, equalizer, setEqualizer, clearHistory } = useUser();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-md bg-aura-surface/95 border border-white/15 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl text-white space-y-6 max-h-[90vh] overflow-y-auto no-scrollbar"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="text-xl font-bold">AURA Settings</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Audio Quality Section */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-purple-400" /> Audio Streaming Quality
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Normal', 'High', 'Lossless'] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => setAudioQuality(q)}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition-all border cursor-pointer ${
                    audioQuality === q
                      ? 'bg-white text-black border-white shadow-lg'
                      : 'bg-white/5 hover:bg-white/10 text-white/70 border-white/10'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Equalizer Section */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-cyan-400" /> Sound Equalizer Profile
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['Flat', 'Aura Clarity', 'Bass Boost', 'Vocal Glow'] as const).map((eq) => (
                <button
                  key={eq}
                  onClick={() => setEqualizer(eq)}
                  className={`py-3 px-4 rounded-2xl text-xs font-semibold text-left transition-all border cursor-pointer ${
                    equalizer === eq
                      ? 'bg-gradient-to-r from-purple-500/30 to-cyan-500/30 border-purple-400 text-white shadow-lg'
                      : 'bg-white/5 hover:bg-white/10 text-white/70 border-white/10'
                  }`}
                >
                  {eq}
                </button>
              ))}
            </div>
          </div>

          {/* Catalog & Cache Controls */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Music Engine & Data
            </label>

            {onRefreshCatalog && (
              <button
                onClick={() => {
                  onRefreshCatalog();
                  onClose();
                }}
                className="w-full p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-sm font-semibold transition-all cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <RefreshCw className="w-4 h-4 text-purple-400" /> Refresh Music Catalog
                </span>
                <span className="text-xs text-white/40 font-mono">Live Sync</span>
              </button>
            )}

            <button
              onClick={() => {
                clearHistory();
                alert('Listening history cleared.');
              }}
              className="w-full p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-sm font-semibold text-rose-300 transition-all cursor-pointer"
            >
              Clear Listening History
            </button>
          </div>

          {/* Legal / Music Provider Info */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-white/40 space-y-1">
            <div className="flex items-center gap-1.5 text-white/70 font-semibold mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Legal & Music Provider Standard
            </div>
            <p>
              AURA uses an abstracted provider layer. Development tracks use royalty-free & open license audio samples.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
