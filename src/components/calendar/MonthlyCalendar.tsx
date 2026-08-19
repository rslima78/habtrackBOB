import React, { useState } from 'react';
import { AppState, formatDate } from '../../services/storageService';
import { calculateDailyScore } from '../../services/scoreCalculator';
import { ChevronLeft, ChevronRight, Sparkles, X, Check, AlertTriangle, Pencil } from 'lucide-react';
import { soundEngine } from '../../services/audioService';
import { EditTarget, LogEditModal } from '../common/LogEditModal';
import { FoodControlStatus } from '../../types';

interface MonthlyCalendarProps {
  state: AppState;
  onUpdateLog: (updated: EditTarget) => void;
  onDeleteLog: (target: EditTarget) => void;
  onLogFood: (status: FoodControlStatus, notes?: string, dateStr?: string) => void;
}

export const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({
  state,
  onUpdateLog,
  onDeleteLog,
  onLogFood
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 is Sunday
  const daysInMonth = lastDayOfMonth.getDate();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const handlePrevMonth = () => {
    soundEngine.playClick();
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    soundEngine.playClick();
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    soundEngine.playClick();
    setCurrentDate(new Date());
  };

  // Calendar cells
  const calendarCells = [];
  // Empty leading days
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarCells.push(null);
  }
  // Days of month
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(d);
  }

  const todayStr = formatDate(new Date());

  // Selected Day Details Data
  const selectedDayScore = selectedDateStr ? calculateDailyScore(state, selectedDateStr) : null;
  const selectedDayWorkouts = selectedDateStr ? state.workouts.filter(w => w.date === selectedDateStr) : [];
  const selectedDayReadings = selectedDateStr ? state.readingLogs.filter(r => r.date === selectedDateStr) : [];
  const selectedDayExpenses = selectedDateStr ? state.expenses.filter(e => e.date === selectedDateStr) : [];
  const selectedDayFood = selectedDateStr ? state.foodLogs.find(f => f.date === selectedDateStr) : null;
  const selectedDaySubGoals = selectedDateStr ? state.subGoals.filter(sg => sg.completedDates.includes(selectedDateStr)) : [];
  const selectedDayXpTxs = selectedDateStr ? state.xpTransactions.filter(x => x.date === selectedDateStr) : [];

  const totalSpentSelected = selectedDayExpenses.reduce((s, e) => s + e.amount, 0);
  const totalPagesSelected = selectedDayReadings.reduce((s, r) => s + r.pagesRead, 0);

  const renderEditButton = (target: EditTarget, label: string) => (
    <button
      onClick={() => { soundEngine.playClick(); setEditTarget(target); }}
      className="text-slate-500 hover:text-purple-300 p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
      title={label}
    >
      <Pencil className="w-3.5 h-3.5" />
    </button>
  );

  return (
    <div className="space-y-6">
      
      {/* Calendar Header Card */}
      <div className="game-card bg-gradient-to-r from-[#1E1738] to-[#121422] border-purple-500/40">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border-2 border-purple-400/40 text-purple-300 flex items-center justify-center text-2xl shadow-game-purple">
              📅
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Calendário de Batalhas</h2>
              <p className="text-xs text-purple-300">Mapa de calor da sua disciplina ao longo dos dias</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToday}
              className="btn-game-ghost text-xs font-bold py-2 px-3 cursor-pointer"
            >
              Hoje
            </button>
            <div className="flex items-center bg-[#121422] rounded-2xl border border-slate-800 p-1">
              <button
                onClick={handlePrevMonth}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-black text-white px-3 min-w-[130px] text-center">
                {monthNames[month]} {year}
              </span>
              <button
                onClick={handleNextMonth}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-3 border-t border-slate-800 text-[11px] font-bold text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
            <span>🟢 Excelente (≥80%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm" />
            <span>🟡 Parcial (50-79%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm" />
            <span>🔴 Desafio (&lt;50%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-700 shadow-sm" />
            <span>⚪ Sem dados</span>
          </div>
        </div>
      </div>

      {/* Monthly Grid Card */}
      <div className="game-card">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-extrabold text-slate-400 mb-2">
          <span>Dom</span>
          <span>Seg</span>
          <span>Ter</span>
          <span>Qua</span>
          <span>Qui</span>
          <span>Sex</span>
          <span>Sáb</span>
        </div>

        {/* Cells */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
          {calendarCells.map((dayNum, idx) => {
            if (!dayNum) {
              return <div key={`empty-${idx}`} className="h-16 sm:h-24 bg-slate-900/20 rounded-2xl border border-transparent" />;
            }

            const dayDate = new Date(year, month, dayNum);
            const dateStr = formatDate(dayDate);
            const isToday = dateStr === todayStr;
            const isFuture = dayDate > new Date();

            // Calculate day score
            const score = isFuture ? null : calculateDailyScore(state, dateStr);
            const hasActivity = !isFuture && (
              state.workouts.some(w => w.date === dateStr) ||
              state.readingLogs.some(r => r.date === dateStr) ||
              state.expenses.some(e => e.date === dateStr) ||
              state.foodLogs.some(f => f.date === dateStr)
            );

            let statusColor = 'bg-slate-800/40 text-slate-500 border-slate-800';
            let dotColor = 'bg-slate-700';

            if (!isFuture && hasActivity && score) {
              if (score.percent >= 80) {
                statusColor = 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200 hover:border-emerald-400';
                dotColor = 'bg-emerald-400 shadow-glow-green';
              } else if (score.percent >= 50) {
                statusColor = 'bg-amber-950/40 border-amber-500/40 text-amber-200 hover:border-amber-400';
                dotColor = 'bg-amber-400 shadow-glow-gold';
              } else {
                statusColor = 'bg-rose-950/40 border-rose-500/40 text-rose-200 hover:border-rose-400';
                dotColor = 'bg-rose-500';
              }
            }

            return (
              <div
                key={`day-${dayNum}`}
                onClick={() => {
                  if (!isFuture) {
                    soundEngine.playClick();
                    setSelectedDateStr(dateStr);
                  }
                }}
                className={`h-16 sm:h-24 p-1.5 sm:p-2 rounded-2xl border-2 transition-all flex flex-col justify-between cursor-pointer ${statusColor} ${
                  isToday ? 'ring-2 ring-purple-400 scale-[1.03] shadow-glow-purple' : ''
                } ${isFuture ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105'}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-black ${isToday ? 'text-amber-400' : 'text-white'}`}>
                    {dayNum}
                  </span>
                  <div className="flex items-center gap-1">
                    {!isFuture && hasActivity && (
                      <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                    )}
                    {!isFuture && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          soundEngine.playClick();
                          setSelectedDateStr(dateStr);
                        }}
                        className="text-slate-500 hover:text-purple-300 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                        title={`Editar registros de ${dateStr}`}
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {!isFuture && hasActivity && score && (
                  <div className="text-left hidden sm:block">
                    <span className="text-[10px] font-black text-amber-300 block">
                      {score.percent}%
                    </span>
                    <div className="flex items-center gap-0.5 text-[9px] text-slate-400">
                      {state.workouts.some(w => w.date === dateStr) && <span>🏃</span>}
                      {state.readingLogs.some(r => r.date === dateStr) && <span>📚</span>}
                      {state.expenses.some(e => e.date === dateStr) && <span>💰</span>}
                      {state.foodLogs.some(f => f.date === dateStr && f.status === 'controlled') && <span>🔥</span>}
                    </div>
                  </div>
                )}

                {isToday && (
                  <span className="text-[8px] font-black text-purple-300 uppercase tracking-tighter self-end sm:self-auto">
                    Hoje
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Detalhes do Dia Selecionado */}
      {selectedDateStr && selectedDayScore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#181B2A] border-2 border-purple-500/50 rounded-3xl p-6 shadow-2xl animate-pop max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/30 inline-block mb-1">
                  Relatório Diário de Batalha
                </span>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <span>📅</span> {selectedDateStr}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDateStr(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Day Score Header */}
            <div className="bg-[#121422] p-4 rounded-2xl border border-slate-800 mb-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-bold block">Nível de Autocontrole</span>
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                  {selectedDayScore.percent}% — {selectedDayScore.label}
                </span>
              </div>
              {selectedDayScore.xpEarnedToday > 0 && (
                <div className="bg-amber-500/20 text-amber-300 text-xs font-black px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  +{selectedDayScore.xpEarnedToday} XP
                </div>
              )}
            </div>

            {/* Habits Breakdown */}
            <div className="space-y-3">
              
              {/* Treinos */}
              <div className="bg-[#121422] p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5 text-blue-400 font-black">🏃 Treinos</span>
                  <span>{selectedDayWorkouts.length > 0 ? 'Concluído' : 'Sem treino'}</span>
                </div>
                {selectedDayWorkouts.map(w => (
                  <div key={w.id} className="flex items-center justify-between gap-2">
                    <p className="text-xs text-slate-300">
                      • {w.type === 'run' ? 'Corrida' : 'Caminhada'} de {w.distanceKm} km ({w.durationMin} min) {w.notes && `— "${w.notes}"`}
                    </p>
                    {renderEditButton({ kind: 'workout', log: w }, 'Editar treino')}
                  </div>
                ))}
              </div>

              {/* Leitura */}
              <div className="bg-[#121422] p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5 text-amber-400 font-black">📚 Leitura</span>
                  <span>{totalPagesSelected} páginas</span>
                </div>
                {selectedDayReadings.map(r => (
                  <div key={r.id} className="flex items-center justify-between gap-2">
                    <p className="text-xs text-slate-300">
                      • {r.bookTitle}: {r.pagesRead} páginas ({r.durationMin} min)
                    </p>
                    {renderEditButton({ kind: 'reading', log: r }, 'Editar sessão de leitura')}
                  </div>
                ))}
              </div>

              {/* Orçamento */}
              <div className="bg-[#121422] p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-black">💰 Orçamento</span>
                  <span>Total: {state.settings.currency} {totalSpentSelected.toFixed(2)} / {state.settings.currency} {state.settings.budgetDailyLimit.toFixed(2)}</span>
                </div>
                {selectedDayExpenses.map(e => (
                  <div key={e.id} className="flex items-center justify-between gap-2">
                    <p className="text-xs text-slate-300">
                      • {e.description}: {state.settings.currency} {e.amount.toFixed(2)} ({e.paymentMethod || 'pix'})
                    </p>
                    {renderEditButton({ kind: 'expense', log: e }, 'Editar gasto')}
                  </div>
                ))}
              </div>

              {/* Alimentação */}
              <div className="bg-[#121422] p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5 text-orange-400 font-black">🍔 Alimentação</span>
                  <span className="flex items-center gap-1">
                    {selectedDayFood ? (selectedDayFood.status === 'controlled' ? '😎 Controlado' : selectedDayFood.status === 'partial' ? '😐 Parcial' : '💥 Deslize') : 'Não registrado'}
                    {selectedDayFood && renderEditButton({ kind: 'food', log: selectedDayFood }, 'Editar alimentação')}
                  </span>
                </div>
                {selectedDayFood?.notes && (
                  <p className="text-xs text-slate-400 italic">"{selectedDayFood.notes}"</p>
                )}
                {!selectedDayFood && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {([
                      { status: 'controlled' as const, emoji: '😎', label: 'Controlado' },
                      { status: 'partial' as const, emoji: '😐', label: 'Parcial' },
                      { status: 'uncontrolled' as const, emoji: '💥', label: 'Deslize' }
                    ]).map(opt => (
                      <button
                        key={opt.status}
                        onClick={() => onLogFood(opt.status, undefined, selectedDateStr)}
                        className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl py-1.5 text-[11px] font-bold text-slate-200 transition-colors cursor-pointer"
                      >
                        {opt.emoji} {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Subobjetivos */}
              {selectedDaySubGoals.length > 0 && (
                <div className="bg-[#121422] p-3 rounded-2xl border border-slate-800">
                  <span className="flex items-center gap-1.5 text-purple-400 font-black text-xs mb-1">🎯 Micro-Missões Cumpridas</span>
                  {selectedDaySubGoals.map(sg => (
                    <p key={sg.id} className="text-xs text-slate-300 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> {sg.title} (+{sg.xpValue} XP)
                    </p>
                  ))}
                </div>
              )}

            </div>

            <button
              onClick={() => setSelectedDateStr(null)}
              className="w-full btn-game-ghost text-xs font-bold py-2.5 mt-5"
            >
              Fechar Detalhes
            </button>
          </div>
        </div>
      )}

      {/* Modal: Editar um registro do dia selecionado */}
      {editTarget && (
        <LogEditModal
          target={editTarget}
          settings={state.settings}
          books={state.books}
          onSave={onUpdateLog}
          onDelete={onDeleteLog}
          onClose={() => setEditTarget(null)}
        />
      )}

    </div>
  );
};
