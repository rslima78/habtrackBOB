import React, { useState } from 'react';
import { AppState, formatDate } from '../../services/storageService';
import { calculateStreaks } from '../../services/scoreCalculator';
import { Flame, Trophy, TrendingUp, Zap, Calendar, Award, Footprints, BookOpen, DollarSign } from 'lucide-react';
import { soundEngine } from '../../services/audioService';

interface StatsViewProps {
  state: AppState;
}

export const StatsView: React.FC<StatsViewProps> = ({ state }) => {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const streaks = calculateStreaks(state);

  const handlePeriodChange = (p: 'week' | 'month' | 'year') => {
    soundEngine.playClick();
    setPeriod(p);
  };

  // Filter XP data based on period
  const today = new Date();
  let daysToInspect = period === 'week' ? 7 : period === 'month' ? 30 : 365;

  // Generate daily bars for XP chart
  const xpChartData = [];
  for (let i = daysToInspect - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dStr = formatDate(d);

    const dayXp = state.xpTransactions
      .filter(tx => tx.date === dStr)
      .reduce((sum, tx) => sum + tx.amount, 0);

    const daySpent = state.expenses
      .filter(e => e.date === dStr)
      .reduce((sum, e) => sum + e.amount, 0);

    const dayPages = state.readingLogs
      .filter(r => r.date === dStr)
      .reduce((sum, r) => sum + r.pagesRead, 0);

    const dayKm = state.workouts
      .filter(w => w.date === dStr)
      .reduce((sum, w) => sum + w.distanceKm, 0);

    xpChartData.push({
      date: dStr,
      label: period === 'week' ? ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][d.getDay()] : dStr.slice(8),
      xp: dayXp,
      spent: daySpent,
      pages: dayPages,
      km: dayKm
    });
  }

  const maxXp = Math.max(100, ...xpChartData.map(d => d.xp));
  const maxPages = Math.max(30, ...xpChartData.map(d => d.pages));
  const totalXpInPeriod = xpChartData.reduce((sum, d) => sum + d.xp, 0);
  const totalPagesInPeriod = xpChartData.reduce((sum, d) => sum + d.pages, 0);
  const totalKmInPeriod = xpChartData.reduce((sum, d) => sum + d.km, 0);
  const totalSpentInPeriod = xpChartData.reduce((sum, d) => sum + d.spent, 0);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="game-card bg-gradient-to-r from-[#191D38] to-[#121422] border-cyan-500/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border-2 border-cyan-400/40 text-cyan-300 flex items-center justify-center text-2xl shadow-game-blue">
              📊
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Estatísticas & Evolução</h2>
              <p className="text-xs text-cyan-300">Análise detalhada de performance e sequências de hábitos</p>
            </div>
          </div>

          {/* Period Filter Buttons */}
          <div className="flex items-center bg-[#121422] p-1 rounded-2xl border border-slate-800 self-stretch sm:self-auto justify-center">
            {(['week', 'month', 'year'] as const).map(p => (
              <button
                key={p}
                onClick={() => handlePeriodChange(p)}
                className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  period === p
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {p === 'week' ? 'Semana' : p === 'month' ? 'Mês' : 'Ano'}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-center">
          <div className="bg-[#121422] p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 block">XP no Período</span>
            <span className="text-base sm:text-xl font-black text-amber-400">+{totalXpInPeriod} XP</span>
          </div>
          <div className="bg-[#121422] p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 block">Páginas Lidas</span>
            <span className="text-base sm:text-xl font-black text-white">{totalPagesInPeriod} págs</span>
          </div>
          <div className="bg-[#121422] p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 block">Distância de Treinos</span>
            <span className="text-base sm:text-xl font-black text-blue-400">{totalKmInPeriod.toFixed(1)} km</span>
          </div>
          <div className="bg-[#121422] p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 block">Total de Gastos</span>
            <span className="text-base sm:text-xl font-black text-emerald-400">{state.settings.currency} {totalSpentInPeriod.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* 4 Pillars Streaks Records Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Treinos Streak */}
        <div className="game-card border-blue-500/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🏃</span>
            <span className="text-xs font-black text-white">Treinos</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-black text-blue-400">
              🔥 {streaks.workoutStreak.current} dias
            </span>
            <span className="text-[10px] text-slate-400 font-bold">
              Recorde: {streaks.workoutStreak.best}d
            </span>
          </div>
        </div>

        {/* Leitura Streak */}
        <div className="game-card border-amber-500/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">📚</span>
            <span className="text-xs font-black text-white">Leitura</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-black text-amber-400">
              🔥 {streaks.readingStreak.current} dias
            </span>
            <span className="text-[10px] text-slate-400 font-bold">
              Recorde: {streaks.readingStreak.best}d
            </span>
          </div>
        </div>

        {/* Orçamento Streak */}
        <div className="game-card border-emerald-500/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">💰</span>
            <span className="text-xs font-black text-white">Orçamento</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-black text-emerald-400">
              🔥 {streaks.budgetStreak.current} dias
            </span>
            <span className="text-[10px] text-slate-400 font-bold">
              Recorde: {streaks.budgetStreak.best}d
            </span>
          </div>
        </div>

        {/* Alimentação Streak */}
        <div className="game-card border-orange-500/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🍔</span>
            <span className="text-xs font-black text-white">Alimentação</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-black text-orange-400">
              🔥 {streaks.foodStreak.current} dias
            </span>
            <span className="text-[10px] text-slate-400 font-bold">
              Recorde: {streaks.foodStreak.best}d
            </span>
          </div>
        </div>

      </div>

      {/* Interactive Bar Chart: XP Over Time */}
      <div className="game-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <span>⚡</span> Ganho de XP Diário ({period === 'week' ? 'Últimos 7 dias' : 'Últimos 30 dias'})
          </h3>
          <span className="text-xs font-black text-amber-400">
            Total: +{totalXpInPeriod} XP
          </span>
        </div>

        <div className="h-48 flex items-end gap-1 sm:gap-2 pt-6 pb-2 px-1 bg-[#121422] rounded-2xl border border-slate-800 overflow-x-auto">
          {xpChartData.map((item, idx) => {
            const heightPercent = Math.max(6, Math.min(100, Math.round((item.xp / maxXp) * 100)));
            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center justify-end h-full group relative min-w-[14px]"
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-700 text-white text-[10px] font-black px-2 py-1 rounded-lg pointer-events-none whitespace-nowrap z-20 shadow-lg">
                  {item.date}: +{item.xp} XP
                </div>

                <div
                  className="w-full bg-gradient-to-t from-purple-600 via-indigo-500 to-amber-400 rounded-t-lg transition-all duration-300 group-hover:brightness-125"
                  style={{ height: `${heightPercent}%` }}
                />

                <span className="text-[9px] font-bold text-slate-400 mt-1 truncate">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Secondary Chart: Páginas Lidas & Quilometragem */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Páginas Lidas */}
        <div className="game-card border-amber-500/20">
          <h3 className="text-xs font-black text-white uppercase tracking-wider mb-3 flex items-center gap-2">
            <span>📚</span> Páginas Lidas por Dia
          </h3>
          <div className="h-36 flex items-end gap-1 pt-4 pb-2 bg-[#121422] rounded-2xl border border-slate-800 px-2 overflow-x-auto">
            {xpChartData.slice(period === 'week' ? -7 : -15).map((item, idx) => {
              const h = Math.max(5, Math.min(100, Math.round((item.pages / maxPages) * 100)));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full min-w-[12px]">
                  <div
                    className="w-full bg-gradient-to-t from-amber-600 to-yellow-300 rounded-t-md"
                    style={{ height: `${h}%` }}
                    title={`${item.date}: ${item.pages} páginas`}
                  />
                  <span className="text-[8px] text-slate-500 mt-1">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Treinos / Km */}
        <div className="game-card border-blue-500/20">
          <h3 className="text-xs font-black text-white uppercase tracking-wider mb-3 flex items-center gap-2">
            <span>🏃</span> Quilometragem Percorrida
          </h3>
          <div className="h-36 flex items-end gap-1 pt-4 pb-2 bg-[#121422] rounded-2xl border border-slate-800 px-2 overflow-x-auto">
            {xpChartData.slice(period === 'week' ? -7 : -15).map((item, idx) => {
              const h = Math.max(5, Math.min(100, Math.round((item.km / 10) * 100)));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full min-w-[12px]">
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-cyan-300 rounded-t-md"
                    style={{ height: `${h}%` }}
                    title={`${item.date}: ${item.km} km`}
                  />
                  <span className="text-[8px] text-slate-500 mt-1">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
