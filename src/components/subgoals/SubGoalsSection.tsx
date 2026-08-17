import React, { useState } from 'react';
import { SubGoal, HabitCategory } from '../../types';
import { Plus, Trash2, CheckCircle2, Circle, Target, Sparkles, Filter } from 'lucide-react';
import { soundEngine } from '../../services/audioService';

interface SubGoalsSectionProps {
  subGoals: SubGoal[];
  onAddSubGoal: (subGoal: Omit<SubGoal, 'id' | 'completedDates' | 'createdAt'>) => void;
  onDeleteSubGoal: (id: string) => void;
  onToggleSubGoal: (id: string) => void;
}

export const SubGoalsSection: React.FC<SubGoalsSectionProps> = ({
  subGoals,
  onAddSubGoal,
  onDeleteSubGoal,
  onToggleSubGoal
}) => {
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [habitCategory, setHabitCategory] = useState<HabitCategory>('workout');
  const [periodicity, setPeriodicity] = useState<'daily' | 'weekly' | 'one-time'>('daily');
  const [xpValue, setXpValue] = useState('10');

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredSubGoals = selectedCategory === 'all'
    ? subGoals
    : subGoals.filter(sg => sg.habitCategory === selectedCategory);

  const completedTodayCount = subGoals.filter(sg => sg.completedDates.includes(todayStr)).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddSubGoal({
      title: title.trim(),
      habitCategory,
      periodicity,
      xpValue: parseInt(xpValue) || 10
    });

    setIsModalOpen(false);
    setTitle('');
  };

  const getCategoryBadge = (cat: HabitCategory) => {
    switch (cat) {
      case 'workout': return { emoji: '🏃', label: 'Treino', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
      case 'reading': return { emoji: '📚', label: 'Leitura', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'budget': return { emoji: '💰', label: 'Orçamento', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'food': return { emoji: '🍔', label: 'Alimentação', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' };
      default: return { emoji: '🎯', label: 'Geral', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="game-card bg-gradient-to-r from-[#28183B] to-[#121422] border-purple-500/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border-2 border-purple-400/40 text-purple-400 flex items-center justify-center text-2xl shadow-game-purple">
              🎯
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Subobjetivos & Micro-Missões</h2>
              <p className="text-xs text-purple-300">Pequenas vitórias diárias geram grandes transformações</p>
            </div>
          </div>

          <button
            onClick={() => { soundEngine.playClick(); setIsModalOpen(true); }}
            className="btn-game-purple text-sm font-black py-2.5 px-5 cursor-pointer self-stretch sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Nova Micro-Missão
          </button>
        </div>

        {/* Status Bar */}
        <div className="bg-[#121422] p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-xs text-slate-400 font-bold block">Missões Concluídas Hoje</span>
              <span className="text-base sm:text-lg font-black text-amber-300">
                {completedTodayCount} de {subGoals.length} micro-missões
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 font-bold block">Total de Subobjetivos</span>
            <span className="text-base sm:text-lg font-black text-white">{subGoals.length} cadastrados</span>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer whitespace-nowrap ${
            selectedCategory === 'all'
              ? 'bg-purple-600 text-white border-purple-400 shadow-game-purple'
              : 'bg-[#121422] text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          🎯 Todos ({subGoals.length})
        </button>
        <button
          onClick={() => setSelectedCategory('workout')}
          className={`px-4 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer whitespace-nowrap ${
            selectedCategory === 'workout'
              ? 'bg-blue-600 text-white border-blue-400 shadow-game-blue'
              : 'bg-[#121422] text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          🏃 Treinos
        </button>
        <button
          onClick={() => setSelectedCategory('reading')}
          className={`px-4 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer whitespace-nowrap ${
            selectedCategory === 'reading'
              ? 'bg-amber-600 text-white border-amber-400 shadow-game-gold'
              : 'bg-[#121422] text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          📚 Leitura
        </button>
        <button
          onClick={() => setSelectedCategory('budget')}
          className={`px-4 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer whitespace-nowrap ${
            selectedCategory === 'budget'
              ? 'bg-emerald-600 text-white border-emerald-400 shadow-game-green'
              : 'bg-[#121422] text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          💰 Orçamento
        </button>
        <button
          onClick={() => setSelectedCategory('food')}
          className={`px-4 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer whitespace-nowrap ${
            selectedCategory === 'food'
              ? 'bg-orange-600 text-white border-orange-400 shadow-game-orange'
              : 'bg-[#121422] text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          🍔 Alimentação
        </button>
      </div>

      {/* Sub-goals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredSubGoals.map(sg => {
          const isDone = sg.completedDates.includes(todayStr);
          const badge = getCategoryBadge(sg.habitCategory);

          return (
            <div
              key={sg.id}
              className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                isDone
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100 shadow-sm'
                  : 'bg-[#171A29] border-slate-800 hover:border-purple-500/40 text-slate-200'
              }`}
            >
              <div
                onClick={() => onToggleSubGoal(sg.id)}
                className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
              >
                {isDone ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-6 h-6 text-slate-500 hover:text-purple-400 shrink-0 transition-colors" />
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-black px-2 py-0.2 rounded-md border ${badge.color}`}>
                      {badge.emoji} {badge.label}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {sg.periodicity === 'daily' ? 'Diário' : sg.periodicity === 'weekly' ? 'Semanal' : 'Pontual'}
                    </span>
                  </div>
                  <h4 className={`text-sm font-bold truncate ${isDone ? 'line-through opacity-75' : ''}`}>
                    {sg.title}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs font-black px-2.5 py-1 rounded-xl ${
                  isDone
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  +{sg.xpValue} XP
                </span>

                <button
                  onClick={() => { soundEngine.playClick(); onDeleteSubGoal(sg.id); }}
                  className="text-slate-600 hover:text-rose-400 p-1.5 rounded-xl transition-colors cursor-pointer"
                  title="Excluir subobjetivo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Criar Subobjetivo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#181B2A] border-2 border-purple-500/50 rounded-3xl p-6 shadow-2xl animate-pop">
            <h3 className="text-xl font-black text-white mb-1 flex items-center gap-2">
              <span>🎯</span> Nova Micro-Missão / Subobjetivo
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Crie subobjetivos específicos para impulsionar seus hábitos com XP extra!
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Título do Subobjetivo</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Ex: Alongar 10 min, Ler antes de dormir, Beber 2L..."
                  className="w-full bg-[#121422] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* Habit Category */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Hábito Vinculado</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'workout' as HabitCategory, label: '🏃 Treinos' },
                    { id: 'reading' as HabitCategory, label: '📚 Leitura' },
                    { id: 'budget' as HabitCategory, label: '💰 Orçamento' },
                    { id: 'food' as HabitCategory, label: '🍔 Alimentação' },
                  ].map(cat => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setHabitCategory(cat.id)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        habitCategory === cat.id
                          ? 'bg-purple-600 text-white border-purple-400 shadow-game-purple'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Periodicity & XP Value */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Periodicidade</label>
                  <select
                    value={periodicity}
                    onChange={e => setPeriodicity(e.target.value as 'daily' | 'weekly' | 'one-time')}
                    className="w-full bg-[#121422] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:border-purple-500 focus:outline-none"
                  >
                    <option value="daily">Diário (Todo dia)</option>
                    <option value="weekly">Semanal</option>
                    <option value="one-time">Único (Pontual)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Recompensa (XP)</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    required
                    value={xpValue}
                    onChange={e => setXpValue(e.target.value)}
                    className="w-full bg-[#121422] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:border-purple-500 focus:outline-none"
                  />
                </div>
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
                  className="flex-1 btn-game-purple text-white text-xs font-black py-2.5"
                >
                  Criar Missão (+{xpValue} XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
