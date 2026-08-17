import React from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { UserProfile } from '../../types';
import { getLevelProgress } from '../../services/levelConfig';
import { soundEngine } from '../../services/audioService';

interface HeaderProps {
  user: UserProfile;
  onToggleSound: () => void;
  onQuickXp?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onToggleSound }) => {
  const progress = getLevelProgress(user.totalXp);

  return (
    <header className="sticky top-0 z-40 bg-[#121422]/90 backdrop-blur-md border-b-2 border-[#232840] px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Logo & Game Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 flex items-center justify-center text-xl shadow-game-purple border border-purple-400/40">
            🧘
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg sm:text-xl tracking-tight text-white uppercase drop-shadow">
                Modo Monge
              </span>
              <span className="bg-purple-600/30 text-purple-300 text-[10px] font-black px-1.5 py-0.5 rounded-md border border-purple-500/40 uppercase">
                RPG
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Gamificação do Autocontrole & Hábitos
            </p>
          </div>
        </div>

        {/* Compact XP / Level Bar in Header */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3 bg-[#1A1E31] px-3.5 py-1.5 rounded-2xl border border-[#2D3452]">
            <span className="text-base">{progress.currentLevel.emoji}</span>
            <div className="flex flex-col text-left">
              <div className="flex items-center justify-between gap-4 text-[11px] font-bold">
                <span className="text-purple-300 font-extrabold">Lv.{progress.currentLevel.level} {progress.currentLevel.title}</span>
                <span className="text-amber-400">{user.totalXp} XP</span>
              </div>
              <div className="w-32 bg-slate-800 rounded-full h-2 mt-1 overflow-hidden border border-slate-700">
                <div
                  className="bg-gradient-to-r from-purple-500 to-amber-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Sound FX Toggle Button */}
          <button
            onClick={() => {
              onToggleSound();
              soundEngine.playClick();
            }}
            title={user.soundEnabled ? 'Desativar Sons' : 'Ativar Sons'}
            className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
              user.soundEnabled
                ? 'bg-purple-950/60 border-purple-500/50 text-purple-300 hover:bg-purple-900/60 shadow-game-purple'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-700/60'
            }`}
          >
            {user.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* User Badge / Name */}
          <div className="flex items-center gap-2 bg-[#1A1E31] px-3 py-1.5 rounded-2xl border border-[#2D3452]">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xs font-black text-slate-950">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="font-extrabold text-sm text-slate-200 hidden sm:inline">
              {user.name}
            </span>
          </div>

        </div>
      </div>
    </header>
  );
};
