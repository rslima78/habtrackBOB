import React from 'react';
import { Plus, Check, ChevronRight, AlertTriangle, Sparkles } from 'lucide-react';
import { AppState, formatDate } from '../../services/storageService';
import { calculateStreaks } from '../../services/scoreCalculator';
import { soundEngine } from '../../services/audioService';

interface QuickHabitGridProps {
  state: AppState;
  onOpenWorkoutModal: () => void;
  onOpenReadingModal: () => void;
  onOpenExpenseModal: () => void;
  onQuickFoodLog: (status: 'controlled' | 'partial' | 'uncontrolled') => void;
  onNavigateToHabit: (habitKey: string) => void;
}

export const QuickHabitGrid: React.FC<QuickHabitGridProps> = ({
  state,
  onOpenWorkoutModal,
  onOpenReadingModal,
  onOpenExpenseModal,
  onQuickFoodLog,
  onNavigateToHabit,
}) => {
  const todayStr = formatDate(new Date());
  const streaks = calculateStreaks(state);
  const { settings } = state;

  // 1. Workouts
  const workoutsThisWeek = streaks.workoutStreak.countThisWeek;
  const workoutWeeklyGoal = settings.workoutWeeklyGoal || 4;
  const workoutPercent = Math.min(100, Math.round((workoutsThisWeek / workoutWeeklyGoal) * 100));
  const todayWorkout = state.workouts.find(w => w.date === todayStr);

  // 2. Reading
  const todayReadings = state.readingLogs.filter(r => r.date === todayStr);
  const totalPagesToday = todayReadings.reduce((sum, r) => sum + r.pagesRead, 0);
  const readingGoal = settings.readingDailyPagesGoal || 20;
  const readingPercent = Math.min(100, Math.round((totalPagesToday / readingGoal) * 100));
  const isReadingGoalExceeded = totalPagesToday >= readingGoal;

  // 3. Budget
  const todayExpenses = state.expenses.filter(e => e.date === todayStr);
  const totalSpentToday = todayExpenses.reduce((sum, e) => sum + e.amount, 0);
  const budgetLimit = settings.budgetDailyLimit || 80.0;
  const remainingBudget = budgetLimit - totalSpentToday;
  const budgetPercent = Math.min(100, Math.round((totalSpentToday / budgetLimit) * 100));

  let budgetStatusMsg = '';
  let budgetColorClass = 'text-emerald-400';
  let budgetBarGrad = 'from-emerald-500 to-teal-400';

  if (totalSpentToday <= budgetLimit * 0.75) {
    budgetStatusMsg = `💪 Mandou bem! Você ainda tem ${settings.currency} ${remainingBudget.toFixed(2)} disponíveis hoje.`;
    budgetColorClass = 'text-emerald-400';
    budgetBarGrad = 'from-emerald-500 to-teal-400';
  } else if (totalSpentToday <= budgetLimit) {
    budgetStatusMsg = `⚠️ Cuidado, Ninja! Restam apenas ${settings.currency} ${remainingBudget.toFixed(2)}.`;
    budgetColorClass = 'text-amber-400';
    budgetBarGrad = 'from-amber-500 to-orange-400';
  } else {
    budgetStatusMsg = `💀 O orçamento foi derrotado hoje! Foque em retomar amanhã.`;
    budgetColorClass = 'text-rose-400';
    budgetBarGrad = 'from-rose-500 to-red-600';
  }

  // 4. Food
  const todayFood = state.foodLogs.find(f => f.date === todayStr);
  const lastDaysFood = [...state.foodLogs]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 9)
    .reverse();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      
      {/* 🏃 CARD 1: TREINOS */}
      <div className="game-card game-card-hover border-blue-500/30 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center text-xl shadow-game-blue">
                🏃
              </div>
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-1.5">
                  Treinos & Corrida
                </h3>
                <span className="text-[11px] font-bold text-blue-300">
                  Meta semanal: {workoutWeeklyGoal} treinos
                </span>
              </div>
            </div>
            <button
              onClick={() => { soundEngine.playClick(); onNavigateToHabit('workout'); }}
              className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-0.5 cursor-pointer"
            >
              <span>Detalhes</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Weekly Status Progress */}
          <div className="bg-[#121422] p-3 rounded-2xl border border-slate-800 mb-3">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-300 font-extrabold">
                {workoutsThisWeek} / {workoutWeeklyGoal} treinos realizados
              </span>
              <span className="text-blue-400 font-black">{workoutPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${workoutPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
              <span>{todayWorkout ? `✅ Hoje: ${todayWorkout.type === 'run' ? 'Corrida' : 'Caminhada'} (${todayWorkout.distanceKm} km)` : 'Pendente para hoje'}</span>
              <span className="text-amber-400 font-bold">+100 XP bônus meta</span>
            </div>
          </div>
        </div>

        {/* Quick Action Button */}
        <button
          onClick={() => { soundEngine.playClick(); onOpenWorkoutModal(); }}
          className="w-full btn-game-blue text-xs font-black py-2.5 rounded-xl cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Registrar Caminhada ou Corrida
        </button>
      </div>

      {/* 📚 CARD 2: LEITURA */}
      <div className="game-card game-card-hover border-amber-500/30 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center text-xl shadow-game-gold">
                📚
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-white">Leitura Diária</h3>
                  {isReadingGoalExceeded && (
                    <span className="bg-amber-500/20 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-400/40 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" /> Superada!
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-bold text-amber-300">
                  Meta diária: {readingGoal} páginas
                </span>
              </div>
            </div>
            <button
              onClick={() => { soundEngine.playClick(); onNavigateToHabit('reading'); }}
              className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-0.5 cursor-pointer"
            >
              <span>Biblioteca</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reading Status Progress */}
          <div className="bg-[#121422] p-3 rounded-2xl border border-slate-800 mb-3">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-300 font-extrabold">
                Hoje: <span className="text-amber-300 font-black">{totalPagesToday}</span> / {readingGoal} páginas
              </span>
              <span className="text-amber-400 font-black">
                {totalPagesToday >= readingGoal ? `+${totalPagesToday - readingGoal} extras` : `${readingPercent}%`}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-300 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (totalPagesToday / readingGoal) * 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
              <span>📖 Lendo: Hábitos Atômicos (pág. 184)</span>
              <span className="text-amber-300 font-bold">🔥 {streaks.readingStreak.current} dias lendo</span>
            </div>
          </div>
        </div>

        {/* Quick Action Button */}
        <button
          onClick={() => { soundEngine.playClick(); onOpenReadingModal(); }}
          className="w-full btn-game-gold text-slate-950 text-xs font-black py-2.5 rounded-xl cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Registrar Páginas Lidas
        </button>
      </div>

      {/* 💰 CARD 3: ORÇAMENTO */}
      <div className="game-card game-card-hover border-emerald-500/30 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-xl shadow-game-green">
                💰
              </div>
              <div>
                <h3 className="text-base font-black text-white">Orçamento Diário</h3>
                <span className="text-[11px] font-bold text-emerald-300">
                  Limite hoje: {settings.currency} {budgetLimit.toFixed(2)}
                </span>
              </div>
            </div>
            <button
              onClick={() => { soundEngine.playClick(); onNavigateToHabit('budget'); }}
              className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-0.5 cursor-pointer"
            >
              <span>Histórico</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Budget Progress & Situational Message */}
          <div className="bg-[#121422] p-3 rounded-2xl border border-slate-800 mb-3">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-300">
                Gasto hoje: <span className="text-white font-black">{settings.currency} {totalSpentToday.toFixed(2)}</span>
              </span>
              <span className={`font-black ${budgetColorClass}`}>
                {remainingBudget >= 0 ? `Restam ${settings.currency} ${remainingBudget.toFixed(2)}` : `Estouro: ${settings.currency} ${Math.abs(remainingBudget).toFixed(2)}`}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className={`h-full bg-gradient-to-r ${budgetBarGrad} rounded-full transition-all duration-500`}
                style={{ width: `${budgetPercent}%` }}
              />
            </div>
            <p className="text-[11px] font-semibold text-slate-300 mt-2 italic">
              {budgetStatusMsg}
            </p>
          </div>
        </div>

        {/* Quick Action Button */}
        <button
          onClick={() => { soundEngine.playClick(); onOpenExpenseModal(); }}
          className="w-full btn-game-green text-xs font-black py-2.5 rounded-xl cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Adicionar Gasto de Hoje
        </button>
      </div>

      {/* 🍔 CARD 4: ALIMENTAÇÃO / AUTOCONTROLE */}
      <div className="game-card game-card-hover border-orange-500/30 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center text-xl shadow-game-orange">
                🍔
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-black text-white">Alimentação Consciente</h3>
                  <span className="text-xs">🔥</span>
                </div>
                <span className="text-[11px] font-bold text-orange-300">
                  {streaks.foodStreak.current} dias sem descontrole!
                </span>
              </div>
            </div>
            <button
              onClick={() => { soundEngine.playClick(); onNavigateToHabit('food'); }}
              className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-0.5 cursor-pointer"
            >
              <span>Sequência</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Streak Visual Trail */}
          <div className="bg-[#121422] p-3 rounded-2xl border border-slate-800 mb-3">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-slate-300">Últimos dias:</span>
              <span className="text-[10px] text-amber-400">Recorde: {streaks.foodStreak.best} dias</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {lastDaysFood.map((log, i) => (
                <span
                  key={i}
                  title={`${log.date}: ${log.status}`}
                  className="text-base sm:text-lg animate-fade-in hover:scale-125 transition-transform"
                >
                  {log.status === 'controlled' ? '🔥' : log.status === 'partial' ? '⚡' : '💥'}
                </span>
              ))}
              {todayFood && (
                <span className="text-base sm:text-lg animate-pulse" title="Hoje registrado">
                  {todayFood.status === 'controlled' ? '🔥' : todayFood.status === 'partial' ? '⚡' : '💥'}
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5">
              {todayFood ? `Hoje marcado como: ${todayFood.status === 'controlled' ? '😎 100% Controlado (+30 XP)' : todayFood.status === 'partial' ? '😐 Parcial (+10 XP)' : '💥 Descontrole'}` : 'Como foi sua disciplina alimentar hoje?'}
            </p>
          </div>
        </div>

        {/* 3 Status Buttons */}
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => { soundEngine.playClick(); onQuickFoodLog('controlled'); }}
            className={`py-2 px-1 rounded-xl text-[11px] font-black border transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
              todayFood?.status === 'controlled'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-game-green'
                : 'bg-slate-800/80 text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <span>😎</span>
            <span>Controlado</span>
          </button>

          <button
            onClick={() => { soundEngine.playClick(); onQuickFoodLog('partial'); }}
            className={`py-2 px-1 rounded-xl text-[11px] font-black border transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
              todayFood?.status === 'partial'
                ? 'bg-amber-600 text-white border-amber-400 shadow-game-gold'
                : 'bg-slate-800/80 text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <span>😐</span>
            <span>Parcial</span>
          </button>

          <button
            onClick={() => { soundEngine.playClick(); onQuickFoodLog('uncontrolled'); }}
            className={`py-2 px-1 rounded-xl text-[11px] font-black border transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
              todayFood?.status === 'uncontrolled'
                ? 'bg-rose-600 text-white border-rose-400'
                : 'bg-slate-800/80 text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <span>💥</span>
            <span>Deslize</span>
          </button>
        </div>
      </div>

    </div>
  );
};
