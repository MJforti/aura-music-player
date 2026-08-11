import React, { useState } from 'react';
import { UserProvider } from './context/UserContext';
import { MixPlaybackProvider } from './context/MixPlaybackContext';
import { BottomNav, ActiveTab } from './components/navigation/BottomNav';
import { DiscoverView } from './components/views/DiscoverView';
import { MixesView } from './components/views/MixesView';
import { SearchView } from './components/views/SearchView';
import { MeView } from './components/views/MeView';
import { MiniPlayer } from './components/player/MiniPlayer';
import { MixPlayerModal } from './components/player/MixPlayerModal';

export function AppContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('discover');

  return (
    <div className="min-h-screen bg-black text-white selection:bg-orange-500 selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Dynamic Ambient Blur Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-600/15 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-rose-600/15 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px]" />
      </div>

      {/* Main View Shell */}
      <main className="relative z-10 max-w-md mx-auto min-h-screen">
        {activeTab === 'discover' && <DiscoverView />}
        {activeTab === 'mixes' && <MixesView />}
        {activeTab === 'search' && <SearchView />}
        {activeTab === 'me' && <MeView />}
      </main>

      {/* Persistent Mix Players & Dock */}
      <MiniPlayer />
      <MixPlayerModal />
      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
    </div>
  );
}

export function App() {
  return (
    <UserProvider>
      <MixPlaybackProvider>
        <AppContent />
      </MixPlaybackProvider>
    </UserProvider>
  );
}

export default App;
