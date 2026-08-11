import React from 'react';
import { Flame, Disc, Layers, Search, User } from 'lucide-react';
import { motion } from 'framer-motion';

export type ActiveTab = 'discover' | 'mashups' | 'mixes' | 'search' | 'me';

interface BottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    { id: 'discover' as ActiveTab, label: 'Discover', icon: Flame },
    { id: 'mashups' as ActiveTab, label: 'Mashups', icon: Disc },
    { id: 'mixes' as ActiveTab, label: 'Mixes', icon: Layers },
    { id: 'search' as ActiveTab, label: 'Search', icon: Search },
    { id: 'me' as ActiveTab, label: 'Me', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-3 pb- safe pointer-events-auto">
      <div className="max-w-md mx-auto mb-3">
        <div className="rounded-2xl p-1.5 flex items-center justify-around shadow-2xl backdrop-blur-2xl border border-zinc-800 bg-zinc-950/90">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                className={`relative flex flex-col items-center justify-center py-2 px-3 sm:px-4 rounded-xl transition-all duration-200 ${
                  isActive ? 'text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-zinc-800/90 rounded-xl border border-zinc-700"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 relative z-10 ${isActive ? 'scale-105 text-white' : ''} transition-transform`} />
                <span className="text-[10px] font-mono tracking-wide mt-1 relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
