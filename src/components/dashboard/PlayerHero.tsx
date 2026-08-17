import React from 'react';
import { MonkAvatar } from '../character/MonkAvatar';
import { UserProfile } from '../../types';
import { getLevelProgress } from '../../services/levelConfig';
import { Sparkles, Flame, Award, ChevronRight } from 'lucide-react';
import { soundEngine } from '../../services/audioService';

interface PlayerHeroProps {
  user: UserProfile;
  onOpenLevelInfo?: () => void;
}

export const PlayerHero: React.FC<PlayerHeroProps> = ({ user, onOpenLevelInfo }) => {
  const progress = getLevelProgress(user.totalXp);
  const currentLvl = progress.currentLevel;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#1C1F33] via-[#161829] to-[#121422] border-3 border-[#2A3150] rounded-3xl p-5 sm:p-7 shadow-game">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-5 sm:gap-7">
        
        {/* Character Avatar with Rank Ring */}
        <div className="relative group cursor-pointer" onClick={() => { soundEngine.playPop(); onOpenLevelInfo?.(); }}>
          <div className="p-1 rounded-3xl bg-gradient-to-b from-purple-500 via-indigo-500 to-amber-400 shadow-glow-purple group-hover:scale-105 transition-transform">
            <MonkAvatar level={currentLvl.level} size="xl" />
          </div>
          <div className="absolute -bottom-2 -left-2 bg-slate-900/90 border border-slate-700 text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Evolução
          </div>
        </div>

        {/* Player Profile & XP Bar */}
        <div className="flex-1 w-full text-center md:text-left">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {user.name}
                </h1>
                <span className="text-xl">{currentLvl.emoji}</span>
              </div>
              <p className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">
                Nível {currentLvl.level} — {currentLvl.title.toUpperCase()}
              </p>
            </div>

            {/* View Levels Journey Button */}
            {onOpenLevelInfo && (
              <button
                onClick={() => { soundEngine.playClick(); onOpenLevelInfo(); }}
                className="self-center sm:self-auto inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 bg-amber-500/15 hover:bg-amber-500/25 px-3 py-1.5 rounded-xl border border-amber-500/30 transition-all cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Trilha de Níveis</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <p className="text-xs text-slate-400 italic mb-4 max-w-xl mx-auto md:mx-0">
            "{currentLvl.description}"
          </p>

          {/* XP Progress Bar */}
          <div className="bg-[#121422] p-3.5 rounded-2xl border border-[#262D47] shadow-inner">
            <div className="flex items-center justify-between text-xs font-black mb-1.5">
              <span className="text-slate-300 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                Progresso de XP
              </span>
              <span className="text-amber-300 font-extrabold tracking-wide">
                {user.totalXp.toLocaleString()} / {currentLvl.maxXp.toLocaleString()} XP
              </span>
            </div>

            {/* Filled Bar */}
            <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-amber-400 rounded-full transition-all duration-700 relative shadow-sm"
                style={{ width: `${progress.percentage}%` }}
              >
                {/* Shine highlight */}
                <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse-subtle" />
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 text-[11px] font-bold text-slate-400">
              <span className="text-purple-300">{progress.percentage}% concluído</span>
              {progress.nextLevel ? (
                <span className="text-amber-400/90">
                  Faltam <span className="font-extrabold text-amber-300">{progress.xpLeft} XP</span> para Nível {progress.nextLevel.level} ({progress.nextLevel.title})!
                </span>
              ) : (
                <span className="text-emerald-400 font-extrabold">Nível Máximo Atingido! ✨</span>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
