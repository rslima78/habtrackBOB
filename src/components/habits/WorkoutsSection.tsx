import React, { useState } from 'react';
import { WorkoutLog, SubGoal, AppSettings } from '../../types';
import { Plus, Trash2, Trophy, Flame, Timer, Footprints, Calendar as CalendarIcon, CheckCircle2, Circle, Pencil } from 'lucide-react';
import { soundEngine } from '../../services/audioService';
import { EditTarget, LogEditModal } from '../common/LogEditModal';
import { SubGoalCard } from '../subgoals/SubGoalCard';

interface WorkoutsSectionProps {
  workouts: WorkoutLog[];
  subGoals: SubGoal[];
  settings: AppSettings;
  onAddWorkout: (workout: Omit<WorkoutLog, 'id' | 'createdAt' | 'xpEarned'>) => void;
  onDeleteWorkout: (id: string) => void;
  onUpdateLog: (updated: EditTarget) => void;
  onToggleSubGoal: (subGoalId: string, delta?: 1 | -1) => void;
}

export const WorkoutsSection: React.FC<WorkoutsSectionProps> = ({
  workouts,
  subGoals,
  settings,
  onAddWorkout,
  onDeleteWorkout,
  onUpdateLog,
  onToggleSubGoal
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutLog | null>(null);
  const [type, setType] = useState<'walk' | 'run'>('run');
  const [distanceKm, setDistanceKm] = useState('5.0');
  const [durationMin, setDurationMin] = useState('30');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Weekly calculations
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startOfWeek = new Date();
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  startOfWeek.setDate(today.getDate() - diffToMonday);
  const startOfWeekStr = startOfWeek.toISOString().split('T')[0];

  const workoutsThisWeek = workouts.filter(w => w.date >= startOfWeekStr);
  const weeklyGoal = settings.workoutWeeklyGoal || 4;
  const weeklyPercent = Math.min(100, Math.round((workoutsThisWeek.length / weeklyGoal) * 100));

  // Totals
  const totalKm = workouts.reduce((sum, w) => sum + w.distanceKm, 0);
  const totalMin = workouts.reduce((sum, w) => sum + w.durationMin, 0);

  // Subgoals for workouts
  const workoutSubGoals = subGoals.filter(sg => sg.habitCategory === 'workout');
  const todayStr = new Date().toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!distanceKm || isNaN(Number(distanceKm)) || Number(distanceKm) <= 0) return;

    onAddWorkout({
      date,
      type,
      distanceKm: parseFloat(distanceKm),
      durationMin: parseInt(durationMin) || 0,
      notes: notes.trim() ? notes : undefined
    });

    setIsModalOpen(false);
    setNotes('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Weekly Goal Progress */}
      <div className="game-card bg-gradient-to-r from-[#17233E] to-[#121422] border-blue-500/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border-2 border-blue-400/40 text-blue-400 flex items-center justify-center text-2xl shadow-game-blue">
              🏃
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Treinos & Corridas</h2>
              <p className="text-xs text-blue-300">Construindo resistência física e mental</p>
            </div>
          </div>

          <button
            onClick={() => { soundEngine.playClick(); setIsModalOpen(true); }}
            className="btn-game-blue text-sm font-black py-2.5 px-5 cursor-pointer self-stretch sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Novo Treino
          </button>
        </div>

        {/* Weekly Progress Meter */}
        <div className="bg-[#121422] p-4 rounded-2xl border border-slate-800 mb-4">
          <div className="flex items-center justify-between text-xs font-black mb-2">
            <span className="text-slate-200">
              Meta Semanal: <span className="text-blue-400">{workoutsThisWeek.length}</span> / {weeklyGoal} treinos realizados
            </span>
            <span className="text-amber-400 font-extrabold flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" />
              {workoutsThisWeek.length >= weeklyGoal ? 'Meta Concluída! (+100 XP)' : `Falta ${weeklyGoal - workoutsThisWeek.length} treino(s)`}
            </span>
          </div>

          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${weeklyPercent}%` }}
            />
          </div>
        </div>

        {/* Aggregate Stats Badges */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
          <div className="bg-[#121422] p-3 rounded-2xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 block">Total de Treinos</span>
            <span className="text-lg sm:text-xl font-black text-white">{workouts.length}</span>
          </div>
          <div className="bg-[#121422] p-3 rounded-2xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 block">Distância Total</span>
            <span className="text-lg sm:text-xl font-black text-blue-400">{totalKm.toFixed(1)} km</span>
          </div>
          <div className="bg-[#121422] p-3 rounded-2xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 block">Tempo em Movimento</span>
            <span className="text-lg sm:text-xl font-black text-emerald-400">{Math.floor(totalMin / 60)}h {totalMin % 60}m</span>
          </div>
        </div>
      </div>

      {/* Sub-goals for Workouts */}
      <div className="game-card border-blue-500/20">
        <h3 className="text-sm font-black text-white uppercase tracking-wider mb-3 flex items-center gap-2">
          <span>🎯</span> Subobjetivos de Treino
        </h3>
        {workoutSubGoals.length === 0 ? (
          <p className="text-xs text-slate-400 py-2">Nenhum subobjetivo vinculado a treinos.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {workoutSubGoals.map(sg => (
              <SubGoalCard
                key={sg.id}
                subGoal={sg}
                onProgress={(id, delta) => onToggleSubGoal(id, delta)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Workout History List */}
      <div className="game-card">
        <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <span>📋</span> Histórico de Treinos
        </h3>

        {workouts.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">
            Nenhum treino registrado ainda. Clique em "Novo Treino" para começar a somar XP!
          </p>
        ) : (
          <div className="space-y-2.5">
            {[...workouts].reverse().map(workout => (
              <div
                key={workout.id}
                className="bg-[#121422] border border-slate-800 hover:border-blue-500/40 p-3.5 rounded-2xl flex items-center justify-between gap-3 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-lg shrink-0">
                    {workout.type === 'run' ? '🏃' : '🚶'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-white">
                        {workout.type === 'run' ? 'Corrida' : 'Caminhada'}
                      </span>
                      <span className="text-xs font-extrabold text-blue-400">
                        {workout.distanceKm} km
                      </span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.2 rounded-md">
                        +{workout.xpEarned} XP
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> {workout.date}</span>
                      {workout.durationMin > 0 && (
                        <span className="flex items-center gap-1"><Timer className="w-3 h-3" /> {workout.durationMin} min</span>
                      )}
                      {workout.notes && <span className="truncate max-w-[200px] text-slate-400 italic">"{workout.notes}"</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center shrink-0">
                  <button
                    onClick={() => { soundEngine.playClick(); setEditingWorkout(workout); }}
                    className="text-slate-500 hover:text-blue-400 p-2 rounded-xl transition-colors cursor-pointer"
                    title="Editar treino"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { soundEngine.playClick(); onDeleteWorkout(workout.id); }}
                    className="text-slate-500 hover:text-rose-400 p-2 rounded-xl transition-colors cursor-pointer"
                    title="Excluir treino"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Editar Treino de um dia passado */}
      {editingWorkout && (
        <LogEditModal
          target={{ kind: 'workout', log: editingWorkout }}
          settings={settings}
          onSave={onUpdateLog}
          onDelete={t => onDeleteWorkout(t.log.id)}
          onClose={() => setEditingWorkout(null)}
        />
      )}

      {/* Modal: Novo Treino */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#181B2A] border-2 border-blue-500/50 rounded-3xl p-6 shadow-2xl animate-pop">
            <h3 className="text-xl font-black text-white mb-1 flex items-center gap-2">
              <span>🏃</span> Registrar Novo Treino
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Cada treino cumprido fortalece seu personagem e concede XP!
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Tipo de Atividade</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('run')}
                    className={`py-2.5 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      type === 'run'
                        ? 'bg-blue-600 text-white border-blue-400 shadow-game-blue'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <span>🏃</span> Corrida (+40 XP)
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('walk')}
                    className={`py-2.5 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      type === 'walk'
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-game-green'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <span>🚶</span> Caminhada (+20 XP)
                  </button>
                </div>
              </div>

              {/* Distance and Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Distância (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={distanceKm}
                    onChange={e => setDistanceKm(e.target.value)}
                    className="w-full bg-[#121422] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:border-blue-500 focus:outline-none"
                    placeholder="Ex: 5.0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Tempo (minutos)</label>
                  <input
                    type="number"
                    min="1"
                    value={durationMin}
                    onChange={e => setDurationMin(e.target.value)}
                    className="w-full bg-[#121422] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:border-blue-500 focus:outline-none"
                    placeholder="Ex: 30"
                  />
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Data</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full bg-[#121422] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Observações (opcional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Ex: Ritmo leve, corrida no parque..."
                  className="w-full bg-[#121422] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 btn-game-ghost text-xs font-bold py-2.5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-game-blue text-xs font-black py-2.5"
                >
                  Salvar Treino (+{type === 'run' ? 40 : 20} XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
