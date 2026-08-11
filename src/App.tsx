import React from 'react';
import { RadioProvider } from './context/RadioContext';
import { Header } from './components/Header';
import { StationTuner } from './components/StationTuner';
import { CassettePlayerCard } from './components/CassettePlayerCard';
import { StationGrid } from './components/StationGrid';

export function AppContent() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-amber-400 selection:text-black font-sans antialiased overflow-x-hidden">
      {/* Background Truck Art Grid Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0 bg-[radial-gradient(#FACC15_1px,transparent_1px)] [background-size:24px_24px]" />

      <main className="relative z-10 max-w-md mx-auto min-h-screen space-y-2">
        <Header />
        <StationTuner />
        <CassettePlayerCard />
        <StationGrid />
      </main>
    </div>
  );
}

export function App() {
  return (
    <RadioProvider>
      <AppContent />
    </RadioProvider>
  );
}

export default App;