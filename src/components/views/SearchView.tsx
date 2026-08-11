import React, { useState, useEffect } from 'react';
import { SearchResult, Track, Album, Artist, Playlist } from '../../types/music';
import { musicProvider } from '../../services/MockMusicProvider';
import { usePlayback } from '../../context/PlaybackContext';
import { Search, X, History, Sparkles, Play, Disc, User, Music, Compass } from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { motion } from 'framer-motion';

interface SearchViewProps {
  onOpenDetail: (type: 'album' | 'artist' | 'playlist', item: Album | Artist | Playlist, tracks: Track[]) => void;
}

const GENRE_CARDS = [
  { name: 'Synthwave', color: 'from-purple-600 to-pink-600', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80' },
  { name: 'Chillout', color: 'from-cyan-600 to-blue-600', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80' },
  { name: 'Ambient Lo-Fi', color: 'from-rose-600 to-amber-600', img: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80' },
  { name: 'Electronic', color: 'from-emerald-600 to-teal-600', img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&auto=format&fit=crop&q=80' },
  { name: 'Minimalist', color: 'from-amber-600 to-orange-600', img: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80' },
  { name: 'Classical', color: 'from-indigo-600 to-purple-600', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80' },
  { name: 'Indie Folk', color: 'from-red-600 to-rose-600', img: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80' },
  { name: 'Techno Ambient', color: 'from-blue-600 to-indigo-600', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80' },
];

export const SearchView: React.FC<SearchViewProps> = ({ onOpenDetail }) => {
  const { playTrack, currentTrack } = usePlayback();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Songs' | 'Artists' | 'Albums' | 'Playlists'>('All');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [searching, setSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(['Kora', 'Ambient', 'Synthwave']);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      setSearching(false);
      return;
    }

    setSearching(true);
    const timer = setTimeout(async () => {
      const res = await musicProvider.search(query);
      setResults(res);
      setSearching(false);
    }, 180);

    return () => clearTimeout(timer);
  }, [query, activeCategory]);

  const handleSearchSubmit = (text: string) => {
    setQuery(text);
    if (text && !recentSearches.includes(text)) {
      setRecentSearches((prev) => [text, ...prev].slice(0, 8));
    }
  };

  const hasResults =
    results &&
    (results.tracks.length > 0 ||
      results.artists.length > 0 ||
      results.albums.length > 0 ||
      results.playlists.length > 0);

  return (
    <div className="pb-36 pt-safe px-4 space-y-6 no-scrollbar">
      {/* Search Input Bar */}
      <div className="pt-2 sticky top-0 z-20 pb-2 bg-aura-bg/80 backdrop-blur-xl">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-white/40" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search songs, artists, albums, genres..."
            className="w-full bg-white/10 border border-white/15 focus:border-white/40 rounded-2xl pl-11 pr-10 py-3.5 text-sm text-white placeholder-white/40 focus:outline-none transition-all shadow-xl backdrop-blur-xl font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 p-1.5 text-white/50 hover:text-white rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        {query && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar pt-3">
            {(['All', 'Songs', 'Artists', 'Albums', 'Playlists'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-white text-black border-white shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Default View when query is empty: Recent Searches + Genre Bento Grid */}
      {!query && (
        <div className="space-y-6">
          {/* Recent Searches Tags */}
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                  <History className="w-4 h-4 text-purple-400" /> Recent Searches
                </span>
                <button
                  onClick={() => setRecentSearches([])}
                  className="text-xs text-white/40 hover:text-white cursor-pointer"
                >
                  Clear History
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSearchSubmit(term)}
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/80 font-medium transition-all cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Genre Bento Grid */}
          <div>
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Compass className="w-5 h-5 text-purple-400" /> Explore Music Genres
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {GENRE_CARDS.map((g) => (
                <GlassPanel
                  key={g.name}
                  onClick={() => handleSearchSubmit(g.name)}
                  className="p-4 h-28 relative overflow-hidden group cursor-pointer border-white/10 hover:border-white/20"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${g.color} opacity-40 group-hover:opacity-60 transition-opacity`}
                  />
                  <img
                    src={g.img}
                    alt={g.name}
                    className="absolute right-0 bottom-0 w-20 h-20 object-cover rounded-tl-2xl opacity-60 group-hover:scale-110 transition-transform duration-500 shadow-lg"
                  />
                  <span className="relative z-10 text-base font-extrabold text-white tracking-tight">
                    {g.name}
                  </span>
                </GlassPanel>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {searching && (
        <div className="py-12 text-center text-white/40 space-y-2">
          <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs">Searching AURA catalog...</p>
        </div>
      )}

      {/* Empty State */}
      {query && !searching && !hasResults && (
        <div className="py-16 text-center text-white/40 space-y-3">
          <Search className="w-12 h-12 mx-auto text-white/20" />
          <h3 className="text-base font-bold text-white/70">No results found</h3>
          <p className="text-xs max-w-xs mx-auto">
            We couldn't find anything matching "{query}". Try checking your spelling or search another keyword.
          </p>
        </div>
      )}

      {/* Search Results Display */}
      {query && !searching && hasResults && (
        <div className="space-y-6">
          {/* Tracks Section */}
          {(activeCategory === 'All' || activeCategory === 'Songs') && results.tracks.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-white/50 px-1">
                Songs ({results.tracks.length})
              </p>
              {results.tracks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => playTrack(t, results.tracks)}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/10 border border-white/10 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={t.artworkUrl}
                      alt={t.title}
                      className="w-11 h-11 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate group-hover:text-purple-300">
                        {t.title}
                      </p>
                      <p className="text-xs text-white/50 truncate">{t.artistName}</p>
                    </div>
                  </div>
                  <Play className="w-4 h-4 fill-white text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          )}

          {/* Artists Section */}
          {(activeCategory === 'All' || activeCategory === 'Artists') && results.artists.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-white/50 px-1">
                Artists ({results.artists.length})
              </p>
              <div className="grid grid-cols-2 gap-2">
                {results.artists.map((artist) => (
                  <div
                    key={artist.id}
                    onClick={async () => {
                      const res = await musicProvider.getArtist(artist.id);
                      if (res) onOpenDetail('artist', res.artist, res.tracks);
                    }}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.04] hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
                  >
                    <img
                      src={artist.avatarUrl}
                      alt={artist.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{artist.name}</p>
                      <p className="text-xs text-white/50">Artist</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Albums Section */}
          {(activeCategory === 'All' || activeCategory === 'Albums') && results.albums.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-white/50 px-1">
                Albums ({results.albums.length})
              </p>
              <div className="grid grid-cols-2 gap-2">
                {results.albums.map((album) => (
                  <div
                    key={album.id}
                    onClick={async () => {
                      const res = await musicProvider.getAlbum(album.id);
                      if (res) onOpenDetail('album', res.album, res.tracks);
                    }}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.04] hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
                  >
                    <img
                      src={album.artworkUrl}
                      alt={album.title}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{album.title}</p>
                      <p className="text-xs text-white/50 truncate">{album.artistName}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Playlists Section */}
          {(activeCategory === 'All' || activeCategory === 'Playlists') && results.playlists.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-white/50 px-1">
                Playlists ({results.playlists.length})
              </p>
              <div className="space-y-2">
                {results.playlists.map((playlist) => (
                  <div
                    key={playlist.id}
                    onClick={async () => {
                      const res = await musicProvider.getPlaylist(playlist.id);
                      if (res) onOpenDetail('playlist', res.playlist, res.tracks);
                    }}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={playlist.coverUrl}
                        alt={playlist.title}
                        className="w-11 h-11 rounded-xl object-cover"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">{playlist.title}</p>
                        <p className="text-xs text-white/50 truncate">{playlist.description}</p>
                      </div>
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
