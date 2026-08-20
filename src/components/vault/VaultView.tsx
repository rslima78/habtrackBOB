import React, { useState } from 'react';
import { ExpenseLog, AppSettings } from '../../types';
import { calculateSavingsSummary } from '../../services/savingsCalculator';
import { EnergyBatteryBar } from './EnergyBatteryBar';
import { DailySavingsHistory } from './DailySavingsHistory';
import { AdjustDailyLimitModal } from './AdjustDailyLimitModal';
import {
  Zap,
  TrendingUp,
  AlertOctagon,
  Sparkles,
  Sliders,
  Wallet,
  ArrowRight,
  ShieldAlert,
  Flame,
  Award
} from 'lucide-react';
import { soundEngine } from '../../services/audioService';

interface VaultViewProps {
  expenses: ExpenseLog[];
  settings: AppSettings;
  userCreatedAt?: string;
  onUpdateDailyLimit: (newLimit: number) => void;
  onNavigateToHabits?: () => void;
}

export const VaultView: React.FC<VaultViewProps> = ({
  expenses,
  settings,
  userCreatedAt,
  onUpdateDailyLimit,
  onNavigateToHabits,
}) => {
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

  const summary = calculateSavingsSummary(
    expenses,
    settings.budgetDailyLimit || 80,
    userCreatedAt
  );

  const {
    totalSavings,
    isNegative,
    debtAmount,
    batteryLevel,
    levelProgress,
    levelMax,
    cells,
    todayRecord,
    history
  } = summary;

  const currency = settings.currency || 'R$';

  return (
    <div className="space-y-6 animate-fade-in pb-20 md:pb-8">
      {/* Top Banner: Total Savings or Debt Warning */}
      {isNegative ? (
        /* Debt / Negative State */
        <div className="bg-gradient-to-r from-red-950/80 via-red-900/60 to-rose-950/80 border-2 border-red-500/60 rounded-3xl p-6 shadow-[0_0_30px_rgba(239,68,68,0.25)] relative overflow-hidden backdrop-blur-md animate-pulse">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <AlertOctagon className="w-44 h-44 text-red-400" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-900/80 border border-red-500/50 text-red-300 text-xs font-black uppercase tracking-wider">
                <ShieldAlert className="w-3.5 h-3.5" />
                Alerta de Orçamento Estourado
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
                <span>⚠️ Você está devendo</span>{' '}
                <span className="text-red-400 font-extrabold underline decoration-red-500/60">
                  {currency} {debtAmount.toFixed(2)}
                </span>
                !
              </h2>
              <p className="text-sm text-red-200/90 max-w-xl">
                Seus gastos acumulados ultrapassaram o limite diário planejado. Mantenha os próximos dias dentro do limite para recuperar a sua bateria de energia!
              </p>
            </div>

            <button
              onClick={() => setIsAdjustModalOpen(true)}
              className="px-4 py-2.5 bg-red-900/60 hover:bg-red-800/80 border border-red-500/40 text-white text-xs font-black rounded-2xl transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Sliders className="w-4 h-4 text-red-300" />
              Reajustar Meta Diária
            </button>
          </div>
        </div>
      ) : (
        /* Positive Total Savings State */
        <div className="bg-gradient-to-r from-[#171A29] via-[#1E2337] to-[#151D2E] border-2 border-emerald-500/40 rounded-3xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.15)] relative overflow-hidden backdrop-blur-md">
          {/* Subtle Ambient lights */}
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Zap className="w-44 h-44 text-emerald-400" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Cofre de Economias Diárias
              </div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Total Economizado Acumulado
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
                {currency} {totalSavings.toFixed(2)}
              </h2>
              <p className="text-xs text-slate-400 max-w-xl">
                Cada real não gasto abaixo da sua meta diária alimenta automaticamente a sua barra de energia.
              </p>
            </div>

            {/* Quick Badges */}
            <div className="flex items-center gap-3">
              <div className="bg-[#0F111E]/80 border border-[#282E47] p-3 rounded-2xl text-center min-w-[110px]">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
                  <Award className="w-3 h-3 text-amber-400" />
                  Bateria
                </div>
                <div className="text-lg font-black text-amber-400">
                  Nível {batteryLevel}
                </div>
              </div>

              <div className="bg-[#0F111E]/80 border border-[#282E47] p-3 rounded-2xl text-center min-w-[110px]">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
                  <Flame className="w-3 h-3 text-emerald-400" />
                  Células
                </div>
                <div className="text-lg font-black text-emerald-400">
                  {cells.filter(c => c.isFull).length}/10
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* The 10-Part Energy Battery */}
      <EnergyBatteryBar
        cells={cells}
        batteryLevel={batteryLevel}
        levelProgress={levelProgress}
        levelMax={levelMax}
        isNegative={isNegative}
        currency={currency}
      />

      {/* Today's Economy Summary Card & Quick Limit Adjustment */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Today's Stats Card */}
        <div className="md:col-span-2 bg-[#171A29]/90 rounded-3xl p-5 border-2 border-[#282E47] shadow-game flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-black text-white">Desempenho de Hoje</h4>
            </div>

            <span
              className={`text-xs font-black px-2.5 py-1 rounded-full border ${
                todayRecord.saved >= 0
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                  : 'bg-red-950 text-red-300 border-red-700'
              }`}
            >
              {todayRecord.saved >= 0
                ? `+${currency} ${todayRecord.saved.toFixed(2)} Hoje`
                : `-${currency} ${Math.abs(todayRecord.saved).toFixed(2)} Hoje`}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-[#0F111E] p-3 rounded-2xl border border-[#232840] mb-3">
            <div className="text-center">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Limite Hoje</div>
              <div className="text-sm font-black text-slate-200">
                {currency} {todayRecord.limit.toFixed(2)}
              </div>
            </div>
            <div className="text-center border-x border-slate-800">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Gasto Hoje</div>
              <div className="text-sm font-black text-slate-300">
                {currency} {todayRecord.spent.toFixed(2)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Sobra / Economia</div>
              <div
                className={`text-sm font-black ${
                  todayRecord.saved >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {todayRecord.saved >= 0 ? '+' : '-'}{currency} {Math.abs(todayRecord.saved).toFixed(2)}
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            {todayRecord.saved >= 0
              ? `🔥 Excelente! Mantendo assim até o fim do dia você adiciona ${currency} ${todayRecord.saved.toFixed(2)} à sua bateria.`
              : `⚠️ Atenção: você já gastou ${currency} ${Math.abs(todayRecord.saved).toFixed(2)} acima da sua meta hoje.`}
          </p>
        </div>

        {/* Quick Limit Settings Action Card */}
        <div className="bg-[#171A29]/90 rounded-3xl p-5 border-2 border-[#282E47] shadow-game flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-black text-white">Meta Diária</h4>
            </div>
            <div className="text-2xl font-black text-amber-400 mb-1">
              {currency} {(settings.budgetDailyLimit || 80).toFixed(2)}{' '}
              <span className="text-xs text-slate-500 font-semibold">/ dia</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Defina o valor máximo que você quer gastar diariamente.
            </p>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick();
              setIsAdjustModalOpen(true);
            }}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black rounded-2xl shadow-game-purple transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
            Alterar Limite Diário
          </button>
        </div>
      </div>

      {/* Day by Day History */}
      <DailySavingsHistory history={history} currency={currency} />

      {/* Adjust Daily Limit Modal */}
      <AdjustDailyLimitModal
        currentLimit={settings.budgetDailyLimit || 80}
        currency={currency}
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        onSave={onUpdateDailyLimit}
      />
    </div>
  );
};
