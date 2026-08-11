import React from 'react';
import { Home, Search, Library } from 'lucide-react';
import { clsx } from 'clsx';

export type NavTab = 'home' | 'search' | 'library';

interface BottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'search' as NavTab, label: 'Search', icon: Search },
    { id: 'library' as NavTab, label: 'Library', icon: Library },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto px-4 pb-safe pt-2 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-auto"
      aria-label="Main Navigation"
    >
      <div className="glass-dock rounded-full px-6 py-2.5 flex items-center justify-around shadow-2xl shadow-black/80 border border-white/10 backdrop-blur-2xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={clsx(
                'flex flex-col items-center gap-1 transition-all duration-300 relative py-1 px-4 rounded-full cursor-pointer',
                isActive ? 'text-white scale-105 font-semibold' : 'text-white/45 hover:text-white/80'
              )}
            >
              <Icon className={clsx('w-5 h-5 transition-transform duration-300', isActive && 'scale-110')} />
              <span className="text-[11px] tracking-wide">{tab.label}</span>
              {isActive && (
                <div className="absolute -bottom-1 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
