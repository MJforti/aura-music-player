import React from 'react';
import { Flame, Layers, Search, User } from 'lucide-react';
import { motion } from 'framer-motion';

export type ActiveTab = 'discover' | 'mixes' | 'search' | 'me';

interface BottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    { id: 'discover' as ActiveTab, label: 'Discover', icon: Flame },
    { id: 'mixes' as ActiveTab, label: 'Mixes', icon: Layers },
    { id: 'search' as ActiveTab, label: 'Search', icon: Search },
    { id: 'me' as ActiveTab, label: 'Me', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb- safe pointer-events-auto">
      <div className="max-w-md mx-auto mb-2">
        <div className="glass-dock rounded-3xl p-1.5 flex items-center justify-around shadow-2xl backdrop-blur-2xl border border-white/10 bg-black/60">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                className={`relative flex flex-col items-center justify-center py-2 px-4 rounded-2xl transition-all duration-300 ${
                  isActive ? 'text-white font-bold' : 'text-white/40 hover:text-white/70'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-white/15 rounded-2xl border border-white/20"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'scale-110 text-orange-400' : ''} transition-transform`} />
                <span className="text-[10px] tracking-wide mt-1 relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
