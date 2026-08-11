import React, { useState, useEffect } from 'react';
import { mashupService } from '../../services/MashupService';
import { Mashup } from '../../types/mashup';
import { usePlayback } from '../../context/PlaybackContext';
import { useUser } from '../../context/UserContext';
import { Search, X, Play, Plus, Check, Loader2, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export const SearchView: React.FC = () => {
  const { playMashup, setIsMixPlayerOpen, openMashupDetail } = usePlayback();
  const { customPlaylists, addTrackToPlaylist, createPlaylist } = useUser();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Mashup[]>([]);
  const [searching, setSearching] = useState(false);
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

  const combinations = [
    'Husn + Let Her Go',
    'Arijit + The Weeknd',
    'Anuv Jain + Passenger',
    'Bollywood + English',
    'Heeriye + Perfect',
  ];

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    const timer = setTimeout(async () => {
      const res = await mashupService.searchMashups(query);
      setResults(res);
      setSearching(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  const handleAddToMyMix = (mashup: Mashup) => {
    let myMix = customPlaylists.find(p => p.title.toLowerCase() === 'my night drive' || p.title.toLowerCase() === 'my mix');
    if (!myMix) {
      myMix = createPlaylist('My Night Drive', 'My custom mashup discovery mix');
    }
    addTrackToPlaylist(myMix.id, mashup);
    setAddedMap(prev => ({ ...prev, [mashup.id]: true }));
    setTimeout(() => {
      setAddedMap(prev => ({ ...prev, [mashup.id]: false }));
    }, 2000);
  };

  return (
    <div className="pb-36 pt- safe px-4 space-y-6 no-scrollbar">
      <div className="pt-3">
        <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-400">COMBINATION SEARCH</p>
        <h1 className="text-2xl font-bold text-white tracking-tight">Search Mashups</h1>
        <p className="text-xs font-mono text-zinc-400 mt-0.5">Try searching combinations like "Arijit + The Weeknd"</p>
      </div>

      {/* SEARCH BAR */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search mashups, artists, or combinations..."
          className="w-full pl-11 pr-10 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-all text-sm font-medium"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-zinc-500 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* COMBINATION SUGGESTIONS */}
      {!query && (
        <div className="space-y-3">
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 px-1">Try Combinations</p>
          <div className="flex flex-wrap gap-2">
            {combinations.map((c) => (
              <button
                key={c}
                onClick={() => setQuery(c)}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 transition-all"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SEARCHING LOADER */}
      {searching && (
        <div className="py-12 text-center space-y-3">
          <Loader2 className="w-6 h-6 text-zinc-400 animate-spin mx-auto" />
          <p className="text-xs font-mono text-zinc-400">Searching mashups...</p>
        </div>
      )}

      {/* SEARCH RESULTS */}
      {query && !searching && (
        <div className="space-y-3">
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 px-1">
            Mashup Results ({results.length})
          </p>

          {results.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
              <p className="text-sm font-bold text-zinc-300">No Mashups Found</p>
              <p className="text-xs text-zinc-500">Try searching for artists like "Arijit", "Ed Sheeran", or "Anuv Jain".</p>
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((m) => {
                const isAdded = addedMap[m.id];
                return (
                  <div
                    key={m.id}
                    className="p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 transition-all flex items-center justify-between group"
                  >
                    <div
                      onClick={() => {
                        playMashup(m);
                        setIsMixPlayerOpen(true);
                      }}
                      className="flex items-center gap-3.5 min-w-0 flex-1 cursor-pointer"
                    >
                      <img src={m.artwork} alt={m.title} className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-zinc-800" />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white group-hover:text-zinc-200 truncate">{m.title}</p>
                        <p className="text-xs text-zinc-400 truncate">{m.sourceTracks.map(t => `${t.title} (${t.artist})`).join(' × ')}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <button
                        onClick={() => openMashupDetail(m)}
                        className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                        title="Info"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          playMashup(m);
                          setIsMixPlayerOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-zinc-800 text-white border border-zinc-700 text-xs font-bold hover:bg-white hover:text-black transition-all flex items-center gap-1"
                      >
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" /> Play
                      </button>
                      <button
                        onClick={() => handleAddToMyMix(m)}
                        className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                          isAdded
                            ? 'bg-zinc-700 text-white border-zinc-600'
                            : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
                        }`}
                        title="Add to My Mix"
                      >
                        {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
