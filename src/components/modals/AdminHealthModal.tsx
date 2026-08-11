import React, { useState } from 'react';
import { sourceHealthManager } from '../../services/engine/SourceHealthManager';
import { SourceHealthStatus } from '../../types/discovery';
import { X, Activity, RefreshCw, CheckCircle, AlertTriangle, XCircle, Database, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminHealthModal: React.FC<AdminHealthModalProps> = ({ isOpen, onClose }) => {
  const [sources, setSources] = useState<SourceHealthStatus[]>(sourceHealthManager.getHealthSummary());
  const [refreshing, setRefreshing] = useState(false);

  if (!isOpen) return null;

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setSources(sourceHealthManager.getHealthSummary());
      setRefreshing(false);
    }, 800);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return (
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-400" /> Healthy
          </span>
        );
      case 'degraded':
        return (
          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-400" /> Degraded
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
            <XCircle className="w-3 h-3 text-rose-400" /> Failed
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-6 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Source Health & Aggregator Stats</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-zinc-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* METRICS METERS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
            <p className="text-[10px] font-mono text-zinc-500 uppercase">Discovered</p>
            <p className="text-base font-extrabold text-white font-mono">125,420</p>
          </div>
          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
            <p className="text-[10px] font-mono text-zinc-500 uppercase">Canonical</p>
            <p className="text-base font-extrabold text-white font-mono">98,210</p>
          </div>
          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
            <p className="text-[10px] font-mono text-zinc-500 uppercase">Trends</p>
            <p className="text-base font-extrabold text-white font-mono">1,250</p>
          </div>
          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
            <p className="text-[10px] font-mono text-zinc-500 uppercase">Active Mixes</p>
            <p className="text-base font-extrabold text-white font-mono">32</p>
          </div>
        </div>

        {/* SOURCE HEALTH LIST */}
        <div className="space-y-2">
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">Active Source Adapters</p>
          <div className="space-y-2">
            {sources.map((src) => (
              <div
                key={src.sourceId}
                className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <p className="font-bold text-white">{src.sourceName}</p>
                  <p className="text-[10px] font-mono text-zinc-500">Latency: {src.latencyMs}ms • Errors: {src.errorCount}</p>
                </div>
                {getStatusBadge(src.status)}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-zinc-800 text-xs">
          <span className="font-mono text-zinc-500">Last Ingestion: {new Date().toLocaleTimeString()}</span>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition-all flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} /> Refresh Pipeline
          </button>
        </div>
      </motion.div>
    </div>
  );
};
