import React, { useState } from 'react';
import { Achievement, HabitCategory } from '../../types';
import { Trophy, Sparkles, Lock, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../../services/audioService';

interface AchievementsViewProps {
  achievements: Achievement[];
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ achievements }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const progressPercent = Math.round((unlockedCount / achievements.length) * 100);

  const filteredAchievements = selectedFilter === 'all'
    ? achievements
    : selectedFilter === 'unlocked'
    ? achievements.filter(a => a.unlocked)
    : selectedFilter === 'locked'
    ? achievements.filter(a => !a.unlocked)
    : achievements.filter(a => a.category === selectedFilter);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="game-card bg-gradient-to-r from-[#2B2113] via-[#1B1E33] to-[#121422] border-amber-500/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border-2 border-amber-400/40 text-amber-400 flex items-center justify-center text-2xl shadow-game-gold animate-bounce-soft">
              🏆
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Galeria de Conquistas</h2>
              <p className="text-xs text-amber-300">Medalhas de honra que comprovam seu domínio mental</p>
            </div>
          </div>

          <div className="bg-[#121422] px-4 py-2 rounded-2xl border border-slate-800 self-stretch sm:self-auto text-center">
            <span className="text-xs text-slate-400 font-bold block">Progresso Geral</span>
            <span className="text-lg font-black text-amber-400">
              {unlockedCount} / {achievements.length} Medalhas ({progressPercent}%)
            </span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-purple-500 rounded-full transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { id: 'all', label: `🏆 Todas (${achievements.length})` },
          { id: 'unlocked', label: `✨ Desbloqueadas (${unlockedCount})` },
          { id: 'locked', label: `🔒 Bloqueadas (${achievements.length - unlockedCount})` },
          { id: 'streak', label: '🔥 Sequências' },
          { id: 'workout', label: '🏃 Treinos' },
          { id: 'reading', label: '📚 Leitura' },
          { id: 'budget', label: '💰 Orçamento' },
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => { soundEngine.playClick(); setSelectedFilter(filter.id); }}
            className={`px-4 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer whitespace-nowrap ${
              selectedFilter === filter.id
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-game-gold'
                : 'bg-[#121422] text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredAchievements.map(ach => {
          const achPercent = Math.min(100, Math.round((ach.currentValue / ach.requirement) * 100));

          return (
            <div
              key={ach.id}
              className={`p-5 rounded-3xl border-2 transition-all flex flex-col justify-between ${
                ach.unlocked
                  ? 'bg-gradient-to-b from-[#241F3D] to-[#171A29] border-amber-400/60 shadow-game-gold hover:scale-102'
                  : 'bg-[#141624] border-slate-800/80 opacity-75 grayscale-20 hover:opacity-100 hover:grayscale-0'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border-2 ${
                    ach.unlocked
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-glow-gold'
                      : 'bg-slate-800 border-slate-700 text-slate-500'
                  }`}>
                    {ach.icon}
                  </div>

                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 ${
                    ach.unlocked
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {ach.unlocked ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Conquistada
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3 text-slate-400" />
                        Bloqueada
                      </>
                    )}
                  </span>
                </div>

                <h3 className="text-base font-black text-white mb-1">
                  {ach.title}
                </h3>
                <p className="text-xs text-slate-300 mb-4">
                  {ach.description}
                </p>
              </div>

              <div>
                {ach.unlocked ? (
                  <div className="bg-[#121422] p-2.5 rounded-xl border border-slate-800 text-[10px] text-emerald-400 font-bold flex items-center justify-between">
                    <span>Desbloqueada em {ach.unlockedAt || '2026-08'}</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                ) : (
                  <div className="bg-[#121422] p-2.5 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                      <span>Progresso</span>
                      <span className="text-amber-400 font-black">{ach.currentValue} / {ach.requirement}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full"
                        style={{ width: `${achPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
