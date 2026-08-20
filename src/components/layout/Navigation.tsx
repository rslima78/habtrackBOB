import React from 'react';
import { Home, Target, Calendar, BarChart3, Trophy, Settings, Zap } from 'lucide-react';
import { soundEngine } from '../../services/audioService';

export type TabType = 'home' | 'habits' | 'vault' | 'calendar' | 'stats' | 'achievements' | 'settings';

interface NavigationProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  unlockedAchievementsCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  unlockedAchievementsCount = 0
}) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Início', icon: Home, emoji: '🏠' },
    { id: 'habits' as TabType, label: 'Hábitos', icon: Target, emoji: '🎯' },
    { id: 'vault' as TabType, label: 'Cofre', icon: Zap, emoji: '⚡' },
    { id: 'calendar' as TabType, label: 'Calendário', icon: Calendar, emoji: '📅' },
    { id: 'stats' as TabType, label: 'Estatísticas', icon: BarChart3, emoji: '📊' },
    { id: 'achievements' as TabType, label: 'Conquistas', icon: Trophy, emoji: '🏆', badge: unlockedAchievementsCount },
    { id: 'settings' as TabType, label: 'Ajustes', icon: Settings, emoji: '⚙️' },
  ];

  const handleTabClick = (tabId: TabType) => {
    if (activeTab !== tabId) {
      soundEngine.playClick();
      onSelectTab(tabId);
    }
  };

  return (
    <>
      {/* Desktop Navigation Top Bar */}
      <nav className="hidden md:flex items-center justify-center gap-2 py-4 px-4 bg-[#121422]/60 border-b border-[#232840]">
        <div className="flex items-center gap-1.5 bg-[#171A29] p-1.5 rounded-2xl border-2 border-[#282E47] shadow-game">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`relative px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-game-purple'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : ''}`} />
                <span>{tab.label}</span>
                {tab.badge && tab.badge > 0 ? (
                  <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar (Fixed) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#121422]/95 backdrop-blur-lg border-t-2 border-[#232840] px-2 py-2 safe-area-pb">
        <div className="flex items-center justify-around">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all cursor-pointer ${
                  isActive
                    ? 'text-amber-400 font-extrabold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-purple-600/30 text-amber-300 scale-110 shadow-glow-purple border border-purple-500/40'
                      : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] mt-0.5 font-bold tracking-tight">
                  {tab.label}
                </span>

                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute top-0 right-1 w-4 h-4 bg-amber-500 text-slate-950 text-[9px] font-black rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
