import React, { useState } from 'react';
import { ExpenseLog, SubGoal, AppSettings } from '../../types';
import { EXPENSE_CATEGORIES } from '../../services/storageService';
import { Plus, Trash2, Trophy, DollarSign, Calendar as CalendarIcon, CreditCard, TrendingUp, AlertCircle, CheckCircle2, Circle, Pencil } from 'lucide-react';
import { soundEngine } from '../../services/audioService';
import { EditTarget, LogEditModal } from '../common/LogEditModal';
import { SubGoalCard } from '../subgoals/SubGoalCard';

interface BudgetSectionProps {
  expenses: ExpenseLog[];
  subGoals: SubGoal[];
  settings: AppSettings;
  onAddExpense: (expense: Omit<ExpenseLog, 'id' | 'createdAt'>) => void;
  onDeleteExpense: (id: string) => void;
  onUpdateLog: (updated: EditTarget) => void;
  onToggleSubGoal: (subGoalId: string, delta?: 1 | -1) => void;
}

export const BudgetSection: React.FC<BudgetSectionProps> = ({
  expenses,
  subGoals,
  settings,
  onAddExpense,
  onDeleteExpense,
  onUpdateLog,
  onToggleSubGoal
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseLog | null>(null);
  const [amount, setAmount] = useState('25.00');
  const [categoryId, setCategoryId] = useState('food');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao' | 'dinheiro' | 'outro'>('pix');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const todayStr = new Date().toISOString().split('T')[0];

  // Today calculations
  const todayExpenses = expenses.filter(e => e.date === todayStr);
  const totalSpentToday = todayExpenses.reduce((sum, e) => sum + e.amount, 0);
  const budgetLimit = settings.budgetDailyLimit || 80.0;
  const remainingBudget = budgetLimit - totalSpentToday;
  const budgetPercent = Math.min(100, Math.round((totalSpentToday / budgetLimit) * 100));

  // Week and Month calculations
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startOfWeek = new Date();
  startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  const startOfWeekStr = startOfWeek.toISOString().split('T')[0];

  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];

  const totalSpentWeek = expenses
    .filter(e => e.date >= startOfWeekStr)
    .reduce((sum, e) => sum + e.amount, 0);

  const totalSpentMonth = expenses
    .filter(e => e.date >= firstDayOfMonth)
    .reduce((sum, e) => sum + e.amount, 0);

  // Days within budget (in past 30 days)
  const uniqueDates = Array.from(new Set(expenses.map(e => e.date)));
  const daysUnderBudget = uniqueDates.filter(d => {
    const dayTotal = expenses.filter(e => e.date === d).reduce((s, e) => s + e.amount, 0);
    return dayTotal <= budgetLimit;
  }).length;

  const averageDailySpend = uniqueDates.length > 0
    ? expenses.reduce((s, e) => s + e.amount, 0) / uniqueDates.length
    : 0;

  // Situational state
  let situationTitle = '💪 Mandou bem!';
  let situationMsg = `Você ainda tem ${settings.currency} ${remainingBudget.toFixed(2)} disponíveis hoje. Mantenha a guarda alta!`;
  let situationBg = 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300';
  let barGradient = 'from-emerald-500 to-teal-400';

  if (totalSpentToday > budgetLimit) {
    situationTitle = '💀 O orçamento foi derrotado hoje!';
    situationMsg = `Você ultrapassou o limite em ${settings.currency} ${Math.abs(remainingBudget).toFixed(2)}. O importante é não desistir e retomar o controle amanhã!`;
    situationBg = 'bg-rose-950/40 border-rose-500/40 text-rose-300';
    barGradient = 'from-rose-500 to-red-600';
  } else if (totalSpentToday >= budgetLimit * 0.8) {
    situationTitle = '⚠️ Cuidado, Ninja!';
    situationMsg = `Restam apenas ${settings.currency} ${remainingBudget.toFixed(2)} para o resto do dia. Pense duas vezes antes de novos gastos.`;
    situationBg = 'bg-amber-950/40 border-amber-500/40 text-amber-300';
    barGradient = 'from-amber-500 to-orange-400';
  }

  // Budget subgoals
  const budgetSubGoals = subGoals.filter(sg => sg.habitCategory === 'budget');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;

    onAddExpense({
      date,
      amount: val,
      categoryId,
      description: description.trim() || 'Gasto sem descrição',
      paymentMethod
    });

    setIsModalOpen(false);
    setDescription('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Daily Budget Meter */}
      <div className="game-card bg-gradient-to-r from-[#172E24] to-[#121422] border-emerald-500/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400/40 text-emerald-400 flex items-center justify-center text-2xl shadow-game-green">
              💰
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Orçamento & Autocontrole Financeiro</h2>
              <p className="text-xs text-emerald-300">Cada real poupado é poder de fogo para o seu futuro</p>
            </div>
          </div>

          <button
            onClick={() => { soundEngine.playClick(); setIsModalOpen(true); }}
            className="btn-game-green text-sm font-black py-2.5 px-5 cursor-pointer self-stretch sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Adicionar Gasto
          </button>
        </div>

        {/* Daily Progress Meter */}
        <div className="bg-[#121422] p-4 rounded-2xl border border-slate-800 mb-4">
          <div className="flex items-center justify-between text-xs font-black mb-2">
            <span className="text-slate-200">
              Gasto Hoje: <span className="text-white text-sm font-black">{settings.currency} {totalSpentToday.toFixed(2)}</span> / {settings.currency} {budgetLimit.toFixed(2)}
            </span>
            <span className={`font-black ${totalSpentToday <= budgetLimit ? 'text-emerald-400' : 'text-rose-400'}`}>
              {remainingBudget >= 0 ? `Restam ${settings.currency} ${remainingBudget.toFixed(2)}` : `Estouro: ${settings.currency} ${Math.abs(remainingBudget).toFixed(2)}`}
            </span>
          </div>

          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full bg-gradient-to-r ${barGradient} rounded-full transition-all duration-500`}
              style={{ width: `${budgetPercent}%` }}
            />
          </div>
        </div>

        {/* Situational Message Banner */}
        <div className={`p-3.5 rounded-2xl border ${situationBg} mb-4`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base font-black">{situationTitle}</span>
            {totalSpentToday <= budgetLimit && (
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-2 py-0.2 rounded-md border border-emerald-500/30">
                +30 XP no final do dia
              </span>
            )}
          </div>
          <p className="text-xs font-medium opacity-90">
            {situationMsg}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-center">
          <div className="bg-[#121422] p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 block">Total na Semana</span>
            <span className="text-base sm:text-lg font-black text-white">{settings.currency} {totalSpentWeek.toFixed(2)}</span>
          </div>
          <div className="bg-[#121422] p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 block">Total no Mês</span>
            <span className="text-base sm:text-lg font-black text-amber-400">{settings.currency} {totalSpentMonth.toFixed(2)}</span>
          </div>
          <div className="bg-[#121422] p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 block">Média Diária</span>
            <span className="text-base sm:text-lg font-black text-emerald-400">{settings.currency} {averageDailySpend.toFixed(2)}</span>
          </div>
          <div className="bg-[#121422] p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 block">Dias no Limite</span>
            <span className="text-base sm:text-lg font-black text-cyan-400">{daysUnderBudget} dias</span>
          </div>
        </div>
      </div>

      {/* Sub-goals for Budget */}
      <div className="game-card border-emerald-500/20">
        <h3 className="text-sm font-black text-white uppercase tracking-wider mb-3 flex items-center gap-2">
          <span>🎯</span> Subobjetivos Financeiros
        </h3>
        {budgetSubGoals.length === 0 ? (
          <p className="text-xs text-slate-400 py-2">Nenhum subobjetivo financeiro cadastrado.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {budgetSubGoals.map(sg => (
              <SubGoalCard
                key={sg.id}
                subGoal={sg}
                onProgress={(id, delta) => onToggleSubGoal(id, delta)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Expenses History List */}
      <div className="game-card">
        <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <span>📋</span> Registro de Gastos Recentes
        </h3>

        <div className="space-y-2.5">
          {[...expenses].reverse().slice(0, 12).map(exp => {
            const category = EXPENSE_CATEGORIES.find(c => c.id === exp.categoryId) || EXPENSE_CATEGORIES[0];
            return (
              <div
                key={exp.id}
                className="bg-[#121422] border border-slate-800 hover:border-emerald-500/40 p-3.5 rounded-2xl flex items-center justify-between gap-3 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg shrink-0">
                    {category.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-white">
                        {exp.description}
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.2 rounded-md bg-slate-800 text-slate-300">
                        {category.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> {exp.date}</span>
                      {exp.paymentMethod && (
                        <span className="flex items-center gap-1 uppercase font-bold text-[10px] text-slate-400">
                          <CreditCard className="w-3 h-3" /> {exp.paymentMethod}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-rose-400">
                    - {settings.currency} {exp.amount.toFixed(2)}
                  </span>
                  <button
                    onClick={() => { soundEngine.playClick(); setEditingExpense(exp); }}
                    className="text-slate-500 hover:text-emerald-400 p-2 rounded-xl transition-colors cursor-pointer"
                    title="Editar gasto"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { soundEngine.playClick(); onDeleteExpense(exp.id); }}
                    className="text-slate-500 hover:text-rose-400 p-2 rounded-xl transition-colors cursor-pointer"
                    title="Excluir gasto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Editar Gasto de um dia passado */}
      {editingExpense && (
        <LogEditModal
          target={{ kind: 'expense', log: editingExpense }}
          settings={settings}
          onSave={onUpdateLog}
          onDelete={t => onDeleteExpense(t.log.id)}
          onClose={() => setEditingExpense(null)}
        />
      )}

      {/* Modal: Adicionar Gasto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#181B2A] border-2 border-emerald-500/50 rounded-3xl p-6 shadow-2xl animate-pop">
            <h3 className="text-xl font-black text-white mb-1 flex items-center gap-2">
              <span>💰</span> Registrar Novo Gasto
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Mantenha o registro de todos os gastos para proteger seu orçamento diário.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Amount */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Valor ({settings.currency})</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full bg-[#121422] border border-slate-700 rounded-xl px-3 py-2.5 text-base text-white font-black focus:border-emerald-500 focus:outline-none"
                  placeholder="0.00"
                />
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Categoria</label>
                <div className="grid grid-cols-3 gap-2">
                  {EXPENSE_CATEGORIES.map(c => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setCategoryId(c.id)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        categoryId === c.id
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-game-green'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      <span>{c.icon}</span>
                      <span className="truncate">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Descrição</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Ex: Almoço executivo, Supermercado..."
                  className="w-full bg-[#121422] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Payment Method and Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Pagamento</label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value as unknown as 'pix' | 'cartao' | 'dinheiro' | 'outro')}
                    className="w-full bg-[#121422] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="pix">Pix</option>
                    <option value="cartao">Cartão</option>
                    <option value="dinheiro">Dinheiro</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Data</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-[#121422] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:border-emerald-500 focus:outline-none"
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
                  className="flex-1 btn-game-green text-white text-xs font-black py-2.5"
                >
                  Salvar Despesa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
