import React, { useState } from 'react';
import { UserProvider } from './context/UserContext';
import { PlaybackProvider, usePlayback } from './context/PlaybackContext';
import { BottomNav, NavTab } from './components/navigation/BottomNav';
import { MiniPlayer } from './components/player/MiniPlayer';
import { NowPlayingModal } from './components/player/NowPlayingModal';
import { HomeView } from './components/views/HomeView';
import { SearchView } from './components/views/SearchView';
import { LibraryView } from './components/views/LibraryView';
import { DetailModal } from './components/views/DetailModal';
import { Track, Album, Artist, Playlist } from './types/music';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const { playTrack } = usePlayback();

  // Detail Modal state
  const [detailModal, setDetailModal] = useState<{
    isOpen: boolean;
    type: 'album' | 'artist' | 'playlist' | null;
    data: { item: Album | Artist | Playlist; tracks: Track[] } | null;
  }>({
    isOpen: false,
    type: null,
    data: null,
  });

  const handleOpenDetail = (
    type: 'album' | 'artist' | 'playlist',
    item: Album | Artist | Playlist,
    tracks: Track[]
  ) => {
    setDetailModal({
      isOpen: true,
      type,
      data: { item, tracks },
    });
  };

  const handleCloseDetail = () => {
    setDetailModal((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center selection:bg-purple-500/30">
      {/* Mobile Shell Container (Target width 390px, scalable on desktop) */}
      <div className="w-full max-w-md h-[100vh] sm:h-[844px] bg-aura-bg border-0 sm:border border-white/10 sm:rounded-[44px] shadow-[0_0_100px_rgba(0,0,0,0.9)] relative flex flex-col overflow-hidden">
        {/* Dynamic Background Noise & Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-80 bg-purple-600/10 blur-[100px] pointer-events-none rounded-full" />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto relative z-10 no-scrollbar">
          {activeTab === 'home' && <HomeView onOpenDetail={handleOpenDetail} />}
          {activeTab === 'search' && <SearchView onOpenDetail={handleOpenDetail} />}
          {activeTab === 'library' && <LibraryView onOpenDetail={handleOpenDetail} />}
        </main>

        {/* Persistent Floating MiniPlayer */}
        <MiniPlayer />

        {/* Persistent Bottom Navigation Dock */}
        <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Full-Screen Now Playing Modal Sheet */}
        <NowPlayingModal />

        {/* Album / Artist / Playlist Detail Modal */}
        <DetailModal
          isOpen={detailModal.isOpen}
          type={detailModal.type}
          data={detailModal.data}
          onClose={handleCloseDetail}
          onSelectTrack={(track, queue) => {
            playTrack(track, queue);
            handleCloseDetail();
          }}
        />
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <UserProvider>
      <PlaybackProvider>
        <AppContent />
      </PlaybackProvider>
    </UserProvider>
  );
};

export default App;
