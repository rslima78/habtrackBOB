import React from 'react';
import { DayScoreInfo } from '../../types';
import { Sparkles, Check, AlertCircle } from 'lucide-react';

interface DailyScoreCardProps {
  scoreInfo: DayScoreInfo;
  onOpenCalendar?: () => void;
}

export const DailyScoreCard: React.FC<DailyScoreCardProps> = ({ scoreInfo, onOpenCalendar }) => {
  const getGradient = (percent: number) => {
    if (percent >= 80) return 'from-emerald-500 via-teal-500 to-cyan-500';
    if (percent >= 50) return 'from-amber-500 via-orange-500 to-yellow-500';
    return 'from-rose-500 via-red-500 to-orange-600';
  };

  return (
    <div className="game-card bg-gradient-to-br from-[#1A1D2F] to-[#141624] border-[#2C334E] relative overflow-hidden">
      
      {/* Glow on right */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <h2 className="text-lg font-black text-white tracking-tight uppercase">
              Nível de Controle de Hoje
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Desempenho consolidado das suas missões diárias
          </p>
        </div>

        {/* Score Badge */}
        <div className="flex items-center gap-2 bg-[#121422] px-3.5 py-1.5 rounded-2xl border border-[#2B3250]">
          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
            {scoreInfo.percent}%
          </span>
          <span className="text-xs font-bold text-slate-300">
            — {scoreInfo.label}
          </span>
        </div>
      </div>

      {/* Main Score Bar */}
      <div className="mb-4">
        <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className={`h-full bg-gradient-to-r ${getGradient(scoreInfo.percent)} rounded-full transition-all duration-700`}
            style={{ width: `${scoreInfo.percent}%` }}
          />
        </div>
      </div>

      {/* Motivational Message Bubble */}
      <div className="bg-[#121422]/90 border border-purple-500/30 rounded-2xl p-3.5 flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{scoreInfo.emoji}</span>
          <p className="text-xs sm:text-sm font-bold text-slate-200">
            "{scoreInfo.message}"
          </p>
        </div>
        {scoreInfo.xpEarnedToday > 0 && (
          <div className="shrink-0 bg-amber-500/20 text-amber-300 text-xs font-black px-2.5 py-1 rounded-xl border border-amber-400/30 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            +{scoreInfo.xpEarnedToday} XP Hoje
          </div>
        )}
      </div>

      {/* 4 Pillars Mini Status Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
        
        {/* Treino */}
        <div className={`p-2 rounded-xl border flex items-center justify-between ${
          scoreInfo.workoutScore > 0
            ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
            : 'bg-slate-900/50 border-slate-800 text-slate-400'
        }`}>
          <span className="flex items-center gap-1">🏃 Treino</span>
          {scoreInfo.workoutScore > 0 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <span className="text-[10px] opacity-70">Pendente</span>}
        </div>

        {/* Leitura */}
        <div className={`p-2 rounded-xl border flex items-center justify-between ${
          scoreInfo.readingScore >= 25
            ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
            : scoreInfo.readingScore > 0
            ? 'bg-amber-950/30 border-amber-500/30 text-amber-300'
            : 'bg-slate-900/50 border-slate-800 text-slate-400'
        }`}>
          <span className="flex items-center gap-1">📚 Leitura</span>
          {scoreInfo.readingScore >= 25 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <span className="text-[10px]">{scoreInfo.readingScore > 0 ? 'Parcial' : 'Pendente'}</span>}
        </div>

        {/* Orçamento */}
        <div className={`p-2 rounded-xl border flex items-center justify-between ${
          scoreInfo.budgetScore >= 20
            ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
            : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
        }`}>
          <span className="flex items-center gap-1">💰 Orçamento</span>
          {scoreInfo.budgetScore >= 20 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <AlertCircle className="w-3.5 h-3.5 text-rose-400" />}
        </div>

        {/* Alimentação */}
        <div className={`p-2 rounded-xl border flex items-center justify-between ${
          scoreInfo.foodScore >= 20
            ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
            : scoreInfo.foodScore > 0
            ? 'bg-amber-950/30 border-amber-500/30 text-amber-300'
            : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
        }`}>
          <span className="flex items-center gap-1">🍔 Dieta</span>
          {scoreInfo.foodScore >= 20 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <span className="text-[10px]">{scoreInfo.foodScore > 0 ? 'Parcial' : 'Desvio'}</span>}
        </div>

      </div>

    </div>
  );
};
