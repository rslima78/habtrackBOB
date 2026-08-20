import React from 'react';
import { Trophy, Target, CheckCircle2, Circle, Sparkles, ChevronRight } from 'lucide-react';
import { AppState, formatDate } from '../../services/storageService';
import { soundEngine } from '../../services/audioService';
import { SubGoalCard } from '../subgoals/SubGoalCard';

interface NextMilestoneCardProps {
  state: AppState;
  onToggleSubGoal: (subGoalId: string, delta?: 1 | -1) => void;
  onNavigateToTab: (tab: 'achievements' | 'habits') => void;
}

export const NextMilestoneCard: React.FC<NextMilestoneCardProps> = ({
  state,
  onToggleSubGoal,
  onNavigateToTab
}) => {
  const todayStr = formatDate(new Date());

  // Find next locked achievement closest to completion (highest percentage)
  const lockedAchievements = [...state.achievements]
    .filter(a => !a.unlocked)
    .sort((a, b) => (b.currentValue / b.requirement) - (a.currentValue / a.requirement));

  const nextAchievement = lockedAchievements[0] || {
    id: 'all_completed',
    title: 'Todas as Medalhas Conquistadas!',
    description: 'Parabéns, Guerreiro! Você alcançou a maestria em todos os hábitos.',
    icon: '👑',
    category: 'general' as const,
    requirement: 100,
    currentValue: 100,
    unlocked: true
  };

  // Subgoals for today
  const dailySubGoals = state.subGoals.filter(sg => sg.periodicity === 'daily');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      
      {/* 🏆 NEXT ACHIEVEMENT BANNER */}
      <div className="game-card bg-gradient-to-r from-[#211838] to-[#171A29] border-purple-500/40 relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border-2 border-amber-400/50 flex items-center justify-center text-2xl shadow-game-gold animate-bounce-soft">
              {nextAchievement.icon}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/30 inline-block mb-1">
                Próxima Conquista
              </span>
              <h3 className="text-base font-black text-white">
                {nextAchievement.title}
              </h3>
            </div>
          </div>

          <button
            onClick={() => { soundEngine.playClick(); onNavigateToTab('achievements'); }}
            className="text-xs font-bold text-purple-300 hover:text-white flex items-center gap-0.5 cursor-pointer"
          >
            <span>Ver todas</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 mb-3">
          {nextAchievement.description}
        </p>

        {/* Progress bar to unlock */}
        <div className="bg-[#121422] p-3 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs font-extrabold text-slate-300 mb-1.5">
            <span>Progresso da Medalha</span>
            <span className="text-amber-300 font-black">
              {nextAchievement.currentValue} / {nextAchievement.requirement}
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.round((nextAchievement.currentValue / nextAchievement.requirement) * 100))}%`
              }}
            />
          </div>
          <p className="text-[10px] text-amber-400 mt-1.5 font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Faltam apenas {Math.max(1, nextAchievement.requirement - nextAchievement.currentValue)} passos para conquistar!
          </p>
        </div>
      </div>

      {/* 🎯 TODAY'S MISSIONS / SUB-GOALS */}
      <div className="game-card bg-gradient-to-r from-[#171A29] to-[#1C1F33] border-cyan-500/30 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center text-base">
              🎯
            </div>
            <div>
              <h3 className="text-base font-black text-white">Missões do Dia</h3>
              <p className="text-[11px] text-slate-400">Subobjetivos para turbinar seu XP diário</p>
            </div>
          </div>

          <button
            onClick={() => { soundEngine.playClick(); onNavigateToTab('habits'); }}
            className="text-xs font-bold text-cyan-300 hover:text-white flex items-center gap-0.5 cursor-pointer"
          >
            <span>Gerenciar</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Sub-goals list */}
        <div className="space-y-2 mb-2">
          {dailySubGoals.length === 0 ? (
            <p className="text-xs text-slate-400 py-3 text-center">Nenhum subobjetivo cadastrado ainda.</p>
          ) : (
            dailySubGoals.slice(0, 3).map(sg => (
              <SubGoalCard
                key={sg.id}
                subGoal={sg}
                onProgress={(id, delta) => onToggleSubGoal(id, delta)}
              />
            ))
          )}
        </div>

        <p className="text-[10px] text-slate-400 text-center">
          Clique no card para avançar a missão ou segure para diminuir.
        </p>
      </div>

    </div>
  );
};
