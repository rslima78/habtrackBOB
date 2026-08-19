import React, { useState } from 'react';
import { AppSettings, FoodLog, SubGoal } from '../../types';
import { Flame, Trophy, Calendar as CalendarIcon, CheckCircle2, Circle, HeartHandshake, Sparkles, Pencil, Trash2 } from 'lucide-react';
import { soundEngine } from '../../services/audioService';
import { calculateBestConsecutiveDays, calculateCurrentActiveStreak } from '../../services/scoreCalculator';
import { EditTarget, LogEditModal } from '../common/LogEditModal';

interface FoodSectionProps {
  foodLogs: FoodLog[];
  subGoals: SubGoal[];
  settings: AppSettings;
  onLogFood: (status: 'controlled' | 'partial' | 'uncontrolled', notes?: string, dateStr?: string) => void;
  onUpdateLog: (updated: EditTarget) => void;
  onDeleteFoodLog: (id: string) => void;
  onToggleSubGoal: (subGoalId: string) => void;
}

export const FoodSection: React.FC<FoodSectionProps> = ({
  foodLogs,
  subGoals,
  settings,
  onLogFood,
  onUpdateLog,
  onDeleteFoodLog,
  onToggleSubGoal
}) => {
  const [editingLog, setEditingLog] = useState<FoodLog | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<'controlled' | 'partial' | 'uncontrolled'>('controlled');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayFood = foodLogs.find(f => f.date === todayStr);

  const sortedLogs = [...foodLogs].sort((a, b) => b.date.localeCompare(a.date));

  // Streak calculations
  const controlledDates: string[] = [];
  const foodLogMap = new Map<string, string>();
  for (const log of foodLogs) {
    foodLogMap.set(log.date, log.status);
    if (log.status === 'controlled' || log.status === 'partial') {
      controlledDates.push(log.date);
    }
  }

  const currentStreak = calculateCurrentActiveStreak(
    dStr => {
      const status = foodLogMap.get(dStr);
      return status === 'controlled' || status === 'partial';
    },
    dStr => {
      const status = foodLogMap.get(dStr);
      return status === 'uncontrolled';
    }
  );
  const maxStreak = Math.max(currentStreak, calculateBestConsecutiveDays(controlledDates));

  // Nutrition subgoals
  const foodSubGoals = subGoals.filter(sg => sg.habitCategory === 'food');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogFood(selectedStatus, notes.trim() ? notes : undefined, date);
    setNotes('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Food Streak */}
      <div className="game-card bg-gradient-to-r from-[#2F1C18] to-[#121422] border-orange-500/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border-2 border-orange-400/40 text-orange-400 flex items-center justify-center text-2xl shadow-game-orange animate-bounce-soft">
              🔥
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">Alimentação & Autocontrole</h2>
                <span className="bg-orange-500/20 text-orange-300 text-xs font-black px-2.5 py-0.5 rounded-full border border-orange-400/40">
                  🔥 {currentStreak} Dias no Controle!
                </span>
              </div>
              <p className="text-xs text-orange-300">Você está há {currentStreak} dias dominando seus impulsos alimentares!</p>
            </div>
          </div>
        </div>

        {/* Big Streak Display */}
        <div className="bg-[#121422] p-4 rounded-2xl border border-slate-800 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs text-slate-400 font-bold block">Sequência Atual</span>
              <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">
                🔥 {currentStreak} Dias Consecutivos
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 font-bold block">Maior Sequência</span>
              <span className="text-lg font-black text-amber-400 flex items-center gap-1 justify-end">
                <Trophy className="w-4 h-4" /> {maxStreak} Dias
              </span>
            </div>
          </div>

          {/* Visual Trail of Last 15 Days */}
          <div className="pt-2 border-t border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 block mb-2">Trilha de Consistência Recente:</span>
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {sortedLogs.slice(0, 14).reverse().map((log, i) => (
                <div key={i} className="flex flex-col items-center gap-1 shrink-0">
                  <span className="text-xl sm:text-2xl hover:scale-125 transition-transform" title={`${log.date}: ${log.status}`}>
                    {log.status === 'controlled' ? '🔥' : log.status === 'partial' ? '⚡' : '💥'}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">{log.date.slice(8)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Positive Psychology Notice */}
        <div className="bg-purple-950/30 border border-purple-500/30 rounded-2xl p-3.5 flex items-center gap-3">
          <HeartHandshake className="w-5 h-5 text-purple-400 shrink-0" />
          <p className="text-xs text-purple-200">
            <strong>Filosofia do Monge:</strong> Se houver um dia de deslize, não desanime! Um dia ruim não apaga sua evolução. Acolha, aprenda e retome a missão imediatamente no dia seguinte.
          </p>
        </div>
      </div>

      {/* Register Today's Control Card */}
      <div className="game-card border-orange-500/30">
        <h3 className="text-base font-black text-white mb-1 flex items-center gap-2">
          <span>🍽️</span> Registrar Disciplina Alimentar
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Como foi seu autocontrole com refeições, lanches e doces hoje?
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Controlled */}
            <div
              onClick={() => setSelectedStatus('controlled')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-2 ${
                selectedStatus === 'controlled'
                  ? 'bg-emerald-950/60 border-emerald-400 shadow-game-green scale-[1.02]'
                  : 'bg-[#121422] border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="text-3xl">😎</span>
              <div>
                <span className="text-sm font-black text-white block">Dia 100% Controlado</span>
                <span className="text-[11px] text-emerald-400 font-bold">+30 XP & Mantém Sequência</span>
              </div>
              <p className="text-[10px] text-slate-400">Sem deslizes, escolhas saudáveis e dentro do planejado.</p>
            </div>

            {/* Partial */}
            <div
              onClick={() => setSelectedStatus('partial')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-2 ${
                selectedStatus === 'partial'
                  ? 'bg-amber-950/60 border-amber-400 shadow-game-gold scale-[1.02]'
                  : 'bg-[#121422] border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="text-3xl">😐</span>
              <div>
                <span className="text-sm font-black text-white block">Parcialmente Controlado</span>
                <span className="text-[11px] text-amber-400 font-bold">+10 XP & Mantém Sequência</span>
              </div>
              <p className="text-[10px] text-slate-400">Pequeno escape consciente, mas sem perder o controle.</p>
            </div>

            {/* Uncontrolled */}
            <div
              onClick={() => setSelectedStatus('uncontrolled')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-2 ${
                selectedStatus === 'uncontrolled'
                  ? 'bg-rose-950/60 border-rose-400 scale-[1.02]'
                  : 'bg-[#121422] border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="text-3xl">💥</span>
              <div>
                <span className="text-sm font-black text-white block">Dia de Deslize</span>
                <span className="text-[11px] text-rose-400 font-bold">0 XP (Sem culpa!)</span>
              </div>
              <p className="text-[10px] text-slate-400">Exagero ou tentação vencida. Amanhã é novo dia.</p>
            </div>

          </div>

          {/* Notes and Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Reflexão / O que ajudou ou atrapalhou? (opcional)</label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Ex: Bebi água antes do almoço e resisti ao refrigerante..."
                className="w-full bg-[#121422] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Data</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-[#121422] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn-game-orange text-sm font-black py-3 rounded-2xl cursor-pointer"
          >
            Confirmar Registro de Alimentação (+{selectedStatus === 'controlled' ? 30 : selectedStatus === 'partial' ? 10 : 0} XP)
          </button>
        </form>
      </div>

      {/* Sub-goals for Food */}
      <div className="game-card border-orange-500/20">
        <h3 className="text-sm font-black text-white uppercase tracking-wider mb-3 flex items-center gap-2">
          <span>🎯</span> Subobjetivos de Alimentação
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {foodSubGoals.map(sg => {
            const isDone = sg.completedDates.includes(todayStr);
            return (
              <div
                key={sg.id}
                onClick={() => onToggleSubGoal(sg.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  isDone
                    ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                    : 'bg-[#121422] border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isDone ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> : <Circle className="w-5 h-5 text-slate-500 shrink-0" />}
                  <span className={`text-xs font-bold ${isDone ? 'line-through opacity-75' : ''}`}>{sg.title}</span>
                </div>
                <span className="text-[10px] font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-lg shrink-0">
                  +{sg.xpValue} XP
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Food Logs History */}
      <div className="game-card">
        <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <span>📋</span> Histórico de Dias
        </h3>

        <div className="space-y-2.5">
          {sortedLogs.slice(0, 10).map(log => (
            <div
              key={log.id}
              className="bg-[#121422] border border-slate-800 hover:border-orange-500/40 p-3.5 rounded-2xl flex items-center justify-between gap-3 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl shrink-0">
                  {log.status === 'controlled' ? '😎' : log.status === 'partial' ? '😐' : '💥'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white">
                      {log.status === 'controlled' ? 'Dia Controlado' : log.status === 'partial' ? 'Parcialmente Controlado' : 'Deslize'}
                    </span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.2 rounded-md">
                      +{log.xpEarned} XP
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> {log.date}</span>
                    {log.notes && <span className="italic truncate max-w-[240px]">"{log.notes}"</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center shrink-0">
                <button
                  onClick={() => { soundEngine.playClick(); setEditingLog(log); }}
                  className="text-slate-500 hover:text-orange-400 p-2 rounded-xl transition-colors cursor-pointer"
                  title="Editar registro"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { soundEngine.playClick(); onDeleteFoodLog(log.id); }}
                  className="text-slate-500 hover:text-rose-400 p-2 rounded-xl transition-colors cursor-pointer"
                  title="Excluir registro"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Editar Registro de um dia passado */}
      {editingLog && (
        <LogEditModal
          target={{ kind: 'food', log: editingLog }}
          settings={settings}
          onSave={onUpdateLog}
          onDelete={t => onDeleteFoodLog(t.log.id)}
          onClose={() => setEditingLog(null)}
        />
      )}

    </div>
  );
};
