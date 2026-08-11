import React, { useState, useEffect } from 'react';
import { catalogManager } from '../../services/CatalogManager';
import { SearchResults, Track } from '../../types/catalog';
import { useMixPlayback } from '../../context/MixPlaybackContext';
import { mixGenerator } from '../../services/MixGenerator';
import { useUser } from '../../context/UserContext';
import { Search, X, Play, Plus, Check, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const SearchView: React.FC = () => {
  const { playMix, setIsMixPlayerOpen } = useMixPlayback();
  const { customPlaylists, addTrackToPlaylist, createPlaylist } = useUser();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [searching, setSearching] = useState(false);
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});
  const [recentQueries] = useState<string[]>(['Arijit Singh', 'Taylor Swift', 'Diljit Dosanjh', 'The Weeknd']);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      setSearching(false);
      return;
    }

    setSearching(true);
    const timer = setTimeout(async () => {
      const res = await catalogManager.search(query, { limit: 30 });
      setResults(res);
      setSearching(false);
    }, 180);

    return () => clearTimeout(timer);
  }, [query]);

  const handlePlayTrackClip = (track: Track) => {
    const singleMix = mixGenerator.createMix(
      `mix-single-${track.id}`,
      track.title,
      track.artistName,
      `Discovery Clip for ${track.title}`,
      'trending',
      'Track Discovery',
      [track]
    );
    playMix(singleMix);
    setIsMixPlayerOpen(true);
  };

  const handleAddToMyMix = (track: Track) => {
    let myMix = customPlaylists.find(p => p.title.toLowerCase() === 'my mix');
    if (!myMix) {
      myMix = createPlaylist('My Mix', 'My personal custom continuous mix');
    }
    addTrackToPlaylist(myMix.id, track);
    setAddedMap(prev => ({ ...prev, [track.id]: true }));
    setTimeout(() => {
      setAddedMap(prev => ({ ...prev, [track.id]: false }));
    }, 2000);
  };

  return (
    <div className="pb-36 pt- safe px-4 space-y-6 no-scrollbar">
      <div className="pt-3">
        <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-400">SEARCH & DISCOVER</p>
        <h1 className="text-2xl font-bold text-white tracking-tight">Find Music Clips</h1>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search songs, artists, albums..."
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

      {/* Recent Queries */}
      {!query && (
        <div className="space-y-3">
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 px-1">Popular Searches</p>
          <div className="flex flex-wrap gap-2">
            {recentQueries.map((q) => (
              <button
                key={q}
                onClick={() => setQuery(q)}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-300 transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Searching State */}
      {searching && (
        <div className="py-12 text-center space-y-3">
          <Loader2 className="w-6 h-6 text-zinc-400 animate-spin mx-auto" />
          <p className="text-xs font-mono text-zinc-400">Searching catalog...</p>
        </div>
      )}

      {/* Search Results List */}
      {query && !searching && results && (
        <div className="space-y-6">
          {/* Songs List */}
          {results.tracks.items.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 px-1">
                Songs ({results.tracks.items.length})
              </p>
              <div className="space-y-2">
                {results.tracks.items.map((t) => {
                  const isAdded = addedMap[t.id];
                  return (
                    <div
                      key={t.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 transition-all group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={t.artworkUrl}
                          alt={t.title}
                          className="w-11 h-11 rounded-lg object-cover flex-shrink-0 border border-zinc-800"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate">{t.title}</p>
                          <p className="text-xs text-zinc-400 truncate">{t.artistName}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handlePlayTrackClip(t)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-800 text-white border border-zinc-700 text-xs font-bold hover:bg-white hover:text-black transition-all flex items-center gap-1"
                        >
                          <Play className="w-3 h-3 fill-current ml-0.5" /> Clip
                        </button>
                        <button
                          onClick={() => handleAddToMyMix(t)}
                          className={`p-2 rounded-lg border text-xs font-bold transition-all ${
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
            </div>
          )}

          {/* Artists List */}
          {results.artists.items.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 px-1">
                Artists ({results.artists.items.length})
              </p>
              <div className="grid grid-cols-2 gap-2">
                {results.artists.items.map((artist) => (
                  <div
                    key={artist.id}
                    onClick={() => setQuery(artist.name)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 transition-all cursor-pointer"
                  >
                    <img src={artist.avatarUrl} alt={artist.name} className="w-10 h-10 rounded-full object-cover border border-zinc-800" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{artist.name}</p>
                      <p className="text-[10px] font-mono text-zinc-500">Artist</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
