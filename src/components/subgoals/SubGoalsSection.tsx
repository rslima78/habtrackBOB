import React, { useState } from 'react';
import { SubGoal, HabitCategory, SubGoalType } from '../../types';
import { Plus, Sparkles, Layers, CheckSquare } from 'lucide-react';
import { soundEngine } from '../../services/audioService';
import { SubGoalCard } from './SubGoalCard';

interface SubGoalsSectionProps {
  subGoals: SubGoal[];
  onAddSubGoal: (subGoal: Omit<SubGoal, 'id' | 'completedDates' | 'createdAt'>) => void;
  onDeleteSubGoal: (id: string) => void;
  onProgressSubGoal: (id: string, delta: 1 | -1) => void;
}

export const SubGoalsSection: React.FC<SubGoalsSectionProps> = ({
  subGoals,
  onAddSubGoal,
  onDeleteSubGoal,
  onProgressSubGoal
}) => {
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [habitCategory, setHabitCategory] = useState<HabitCategory>('workout');
  const [goalType, setGoalType] = useState<SubGoalType>('segmented');
  const [targetParts, setTargetParts] = useState<number>(3);
  const [periodicity, setPeriodicity] = useState<'daily' | 'weekly' | 'one-time'>('daily');
  const [xpValue, setXpValue] = useState('20');

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredSubGoals = selectedCategory === 'all'
    ? subGoals
    : subGoals.filter(sg => sg.habitCategory === selectedCategory);

  const completedTodayCount = subGoals.filter(sg => {
    if (sg.type === 'segmented') {
      return (sg.totalCompletions || 0) > 0 || (sg.completedDates || []).includes(todayStr);
    }
    return (sg.completedDates || []).includes(todayStr);
  }).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddSubGoal({
      title: title.trim(),
      habitCategory,
      type: goalType,
      targetParts: goalType === 'segmented' ? targetParts : undefined,
      currentParts: 0,
      totalCompletions: 0,
      periodicity: goalType === 'segmented' ? 'daily' : periodicity,
      xpValue: parseInt(xpValue) || (goalType === 'segmented' ? 20 : 10)
    });

    setIsModalOpen(false);
    setTitle('');
    setXpValue(goalType === 'segmented' ? '20' : '10');
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
              <p className="text-xs text-purple-300">Pequenas vitórias em etapas geram grandes transformações</p>
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
              <span className="text-xs text-slate-400 font-bold block">Missões Ativas/Concluídas</span>
              <span className="text-base sm:text-lg font-black text-amber-300">
                {completedTodayCount} de {subGoals.length} micro-missões
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 font-bold block">Total Cadastrado</span>
            <span className="text-base sm:text-lg font-black text-white">{subGoals.length} missões</span>
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
      {filteredSubGoals.length === 0 ? (
        <div className="game-card text-center py-10">
          <p className="text-sm font-bold text-slate-400">Nenhum subobjetivo encontrado nesta categoria.</p>
          <button
            onClick={() => { soundEngine.playClick(); setIsModalOpen(true); }}
            className="mt-3 text-xs text-purple-400 font-bold hover:underline cursor-pointer"
          >
            + Criar primeiro subobjetivo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredSubGoals.map(sg => (
            <SubGoalCard
              key={sg.id}
              subGoal={sg}
              onProgress={onProgressSubGoal}
              onDelete={onDeleteSubGoal}
            />
          ))}
        </div>
      )}

      {/* Modal: Criar Subobjetivo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#181B2A] border-2 border-purple-500/50 rounded-3xl p-6 shadow-2xl animate-pop">
            <h3 className="text-xl font-black text-white mb-1 flex items-center gap-2">
              <span>🎯</span> Nova Micro-Missão / Subobjetivo
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Crie subobjetivos em etapas ou com check diário para ganhar XP extra!
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type Selection: Segmented vs Checkbox */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Tipo de Subobjetivo</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setGoalType('segmented');
                      setXpValue('20');
                    }}
                    className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      goalType === 'segmented'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-game-green'
                        : 'bg-[#121422] text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>Em Etapas (2 a 6)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setGoalType('checkbox');
                      setXpValue('10');
                    }}
                    className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      goalType === 'checkbox'
                        ? 'bg-purple-600 text-white border-purple-400 shadow-game-purple'
                        : 'bg-[#121422] text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    <CheckSquare className="w-4 h-4" />
                    <span>Check Simples</span>
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Título do Subobjetivo</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder={
                    goalType === 'segmented'
                      ? 'Ex: 3 dias sem refrigerante, 4 treinos de perna...'
                      : 'Ex: Alongar 10 min, Ler antes de dormir...'
                  }
                  className="w-full bg-[#121422] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* Segmented Parts Selector (if goalType === 'segmented') */}
              {goalType === 'segmented' && (
                <div className="bg-[#121422] p-3 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300">Quantidade de Partes / Barras</label>
                    <span className="text-xs font-black text-emerald-400">{targetParts} partes</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[2, 3, 4, 5, 6].map(num => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setTargetParts(num)}
                        className={`py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                          targetParts === num
                            ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                            : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold">
                    💡 Ao completar as {targetParts} barras, você ganha o XP e o ciclo zera para recomeçar.
                  </p>
                </div>
              )}

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

              {/* Periodicity (if checkbox) & XP Value */}
              <div className="grid grid-cols-2 gap-3">
                {goalType === 'checkbox' ? (
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
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Ciclo</label>
                    <div className="w-full bg-[#121422] border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-300 font-bold">
                      🔄 Recorrente ({targetParts} etapas)
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Recompensa (XP)</label>
                  <input
                    type="number"
                    min="5"
                    max="200"
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
