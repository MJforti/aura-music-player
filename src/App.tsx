import React, { useState } from 'react';
import { UserProvider } from './context/UserContext';
import { PlaybackProvider } from './context/PlaybackContext';
import { BottomNav, ActiveTab } from './components/navigation/BottomNav';
import { DiscoverView } from './components/views/DiscoverView';
import { MashupsView } from './components/views/MashupsView';
import { MixesView } from './components/views/MixesView';
import { SearchView } from './components/views/SearchView';
import { MeView } from './components/views/MeView';
import { MiniPlayer } from './components/player/MiniPlayer';
import { MixPlayerModal } from './components/player/MixPlayerModal';
import { MashupDetailModal } from './components/modals/MashupDetailModal';

export function AppContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('discover');

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans antialiased overflow-x-hidden">
      {/* Main View Shell */}
      <main className="relative z-10 max-w-md mx-auto min-h-screen">
        {activeTab === 'discover' && <DiscoverView />}
        {activeTab === 'mashups' && <MashupsView />}
        {activeTab === 'mixes' && <MixesView />}
        {activeTab === 'search' && <SearchView />}
        {activeTab === 'me' && <MeView />}
      </main>

      {/* Persistent Players & Navigation Dock */}
      <MiniPlayer />
      <MixPlayerModal />
      <MashupDetailModal />
      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
    </div>
  );
}

export function App() {
  return (
    <UserProvider>
      <PlaybackProvider>
        <AppContent />
      </PlaybackProvider>
    </UserProvider>
  );
}

export default App;
