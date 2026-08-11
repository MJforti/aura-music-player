import React, { useState, useEffect } from 'react';
import { catalogManager } from '../../services/CatalogManager';
import { SearchResults, Track } from '../../types/catalog';
import { useMixPlayback } from '../../context/MixPlaybackContext';
import { mixGenerator } from '../../services/MixGenerator';
import { useUser } from '../../context/UserContext';
import { Search, X, Play, Plus, Check, Sparkles, Music, User as UserIcon, Disc } from 'lucide-react';
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
    // Find or create "My Mix"
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
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">SEARCH & DISCOVER</p>
        <h1 className="text-2xl font-black text-white tracking-tight">Find Music Clips</h1>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search songs, artists, Indian & global hits..."
          className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white/10 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 focus:bg-white/15 transition-all text-sm font-medium"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-white/50 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Recent Queries */}
      {!query && (
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-white/50 px-1">Popular Searches</p>
          <div className="flex flex-wrap gap-2">
            {recentQueries.map((q) => (
              <button
                key={q}
                onClick={() => setQuery(q)}
                className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-medium text-white/80 transition-all"
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
          <Sparkles className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
          <p className="text-sm font-medium text-white/60">Searching catalog...</p>
        </div>
      )}

      {/* Search Results List */}
      {query && !searching && results && (
        <div className="space-y-6">
          {/* Songs List */}
          {results.tracks.items.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-white/50 px-1">
                Songs ({results.tracks.items.length})
              </p>
              <div className="space-y-2">
                {results.tracks.items.map((t) => {
                  const isAdded = addedMap[t.id];
                  return (
                    <div
                      key={t.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.05] hover:bg-white/10 border border-white/10 transition-all group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={t.artworkUrl}
                          alt={t.title}
                          className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate">{t.title}</p>
                          <p className="text-xs text-white/50 truncate">{t.artistName}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handlePlayTrackClip(t)}
                          className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold hover:bg-cyan-500/30 transition-all flex items-center gap-1"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" /> Clip
                        </button>
                        <button
                          onClick={() => handleAddToMyMix(t)}
                          className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                            isAdded
                              ? 'bg-emerald-500/30 text-emerald-300 border-emerald-500/40'
                              : 'bg-white/10 text-white/80 border-white/15 hover:bg-white/20'
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
              <p className="text-xs font-bold uppercase tracking-wider text-white/50 px-1">
                Artists ({results.artists.items.length})
              </p>
              <div className="grid grid-cols-2 gap-2">
                {results.artists.items.map((artist) => (
                  <div
                    key={artist.id}
                    onClick={() => setQuery(artist.name)}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.05] hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
                  >
                    <img src={artist.avatarUrl} alt={artist.name} className="w-10 h-10 rounded-full object-cover" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{artist.name}</p>
                      <p className="text-[11px] text-white/40">Artist</p>
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
