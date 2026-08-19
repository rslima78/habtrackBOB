import React, { useState } from 'react';
import { AppSettings, Book, ExpenseLog, FoodLog, ReadingLog, WorkoutLog } from '../../types';
import { EXPENSE_CATEGORIES } from '../../services/storageService';
import { X, Trash2, Save } from 'lucide-react';
import { soundEngine } from '../../services/audioService';

// A single editable entry, tagged by habit so the parent can dispatch on save.
export type EditTarget =
  | { kind: 'workout'; log: WorkoutLog }
  | { kind: 'reading'; log: ReadingLog }
  | { kind: 'expense'; log: ExpenseLog }
  | { kind: 'food'; log: FoodLog };

interface LogEditModalProps {
  target: EditTarget;
  settings: AppSettings;
  books?: Book[];
  onSave: (updated: EditTarget) => void;
  onDelete?: (target: EditTarget) => void;
  onClose: () => void;
}

const KIND_META: Record<EditTarget['kind'], { emoji: string; title: string; accent: string; button: string }> = {
  workout: { emoji: '🏃', title: 'Editar Treino', accent: 'border-blue-500/50', button: 'btn-game-blue text-white' },
  reading: { emoji: '📖', title: 'Editar Sessão de Leitura', accent: 'border-amber-500/50', button: 'btn-game-gold text-slate-950' },
  expense: { emoji: '💰', title: 'Editar Gasto', accent: 'border-emerald-500/50', button: 'btn-game-green text-white' },
  food: { emoji: '🍽️', title: 'Editar Alimentação', accent: 'border-orange-500/50', button: 'btn-game-orange text-white' }
};

const inputClass =
  'w-full bg-[#121422] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:border-purple-500 focus:outline-none';
const labelClass = 'block text-xs font-bold text-slate-300 mb-1.5';

export const LogEditModal: React.FC<LogEditModalProps> = ({
  target,
  settings,
  books = [],
  onSave,
  onDelete,
  onClose
}) => {
  const meta = KIND_META[target.kind];

  // Shared field
  const [date, setDate] = useState(target.log.date);

  // Workout fields
  const workout = target.kind === 'workout' ? target.log : null;
  const [workoutType, setWorkoutType] = useState<WorkoutLog['type']>(workout?.type ?? 'run');
  const [distanceKm, setDistanceKm] = useState(String(workout?.distanceKm ?? ''));

  // Reading fields
  const reading = target.kind === 'reading' ? target.log : null;
  const [bookId, setBookId] = useState(reading?.bookId ?? '');
  const [pagesRead, setPagesRead] = useState(String(reading?.pagesRead ?? ''));

  // Duration is shared by workout & reading
  const [durationMin, setDurationMin] = useState(
    String(workout?.durationMin ?? reading?.durationMin ?? '')
  );

  // Expense fields
  const expense = target.kind === 'expense' ? target.log : null;
  const [amount, setAmount] = useState(expense ? expense.amount.toFixed(2) : '');
  const [categoryId, setCategoryId] = useState(expense?.categoryId ?? 'food');
  const [description, setDescription] = useState(expense?.description ?? '');
  const [paymentMethod, setPaymentMethod] = useState<NonNullable<ExpenseLog['paymentMethod']>>(
    expense?.paymentMethod ?? 'pix'
  );

  // Food fields
  const food = target.kind === 'food' ? target.log : null;
  const [foodStatus, setFoodStatus] = useState<FoodLog['status']>(food?.status ?? 'controlled');

  // Notes is shared by workout / reading / food
  const [notes, setNotes] = useState(
    workout?.notes ?? reading?.notes ?? food?.notes ?? ''
  );

  const trimmedNotes = notes.trim() ? notes.trim() : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClick();

    switch (target.kind) {
      case 'workout': {
        const km = parseFloat(distanceKm);
        if (isNaN(km) || km <= 0) return;
        onSave({
          kind: 'workout',
          log: {
            ...target.log,
            date,
            type: workoutType,
            distanceKm: km,
            durationMin: parseInt(durationMin) || 0,
            notes: trimmedNotes
          }
        });
        break;
      }
      case 'reading': {
        const pages = parseInt(pagesRead);
        if (isNaN(pages) || pages <= 0) return;
        const book = books.find(b => b.id === bookId);
        onSave({
          kind: 'reading',
          log: {
            ...target.log,
            date,
            bookId: bookId || undefined,
            bookTitle: book ? book.title : 'Leitura Geral',
            pagesRead: pages,
            durationMin: parseInt(durationMin) || 0,
            notes: trimmedNotes
          }
        });
        break;
      }
      case 'expense': {
        const val = parseFloat(amount);
        if (isNaN(val) || val <= 0) return;
        onSave({
          kind: 'expense',
          log: {
            ...target.log,
            date,
            amount: val,
            categoryId,
            description: description.trim() || 'Gasto sem descrição',
            paymentMethod
          }
        });
        break;
      }
      case 'food': {
        onSave({
          kind: 'food',
          log: {
            ...target.log,
            date,
            status: foodStatus,
            notes: trimmedNotes
          }
        });
        break;
      }
    }

    onClose();
  };

  const handleDelete = () => {
    if (!onDelete) return;
    soundEngine.playClick();
    onDelete(target);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className={`w-full max-w-md bg-[#181B2A] border-2 ${meta.accent} rounded-3xl p-6 shadow-2xl animate-pop max-h-[90vh] overflow-y-auto`}>

        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <span className="text-[10px] font-black uppercase text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/30 inline-block mb-1">
              Modo Edição
            </span>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <span>{meta.emoji}</span> {meta.title}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Corrija ou complete registros de dias anteriores.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* --- Treino --- */}
          {target.kind === 'workout' && (
            <>
              <div>
                <label className={labelClass}>Tipo de Atividade</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setWorkoutType('run')}
                    className={`py-2.5 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      workoutType === 'run'
                        ? 'bg-blue-600 text-white border-blue-400 shadow-game-blue'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <span>🏃</span> Corrida (+{settings.xpValues.run} XP)
                  </button>
                  <button
                    type="button"
                    onClick={() => setWorkoutType('walk')}
                    className={`py-2.5 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      workoutType === 'walk'
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-game-green'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <span>🚶</span> Caminhada (+{settings.xpValues.walk} XP)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Distância (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={distanceKm}
                    onChange={e => setDistanceKm(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Tempo (minutos)</label>
                  <input
                    type="number"
                    min="0"
                    value={durationMin}
                    onChange={e => setDurationMin(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </>
          )}

          {/* --- Leitura --- */}
          {target.kind === 'reading' && (
            <>
              <div>
                <label className={labelClass}>Livro</label>
                <select
                  value={bookId}
                  onChange={e => setBookId(e.target.value)}
                  className={inputClass}
                >
                  {books.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.title} ({b.currentPage}/{b.totalPages} págs)
                    </option>
                  ))}
                  <option value="">Outro / Leitura Livre</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Páginas Lidas</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={pagesRead}
                    onChange={e => setPagesRead(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Tempo (minutos)</label>
                  <input
                    type="number"
                    min="0"
                    value={durationMin}
                    onChange={e => setDurationMin(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-400 bg-[#121422] border border-slate-800 rounded-xl px-3 py-2">
                O progresso do livro é recalculado automaticamente ao salvar.
              </p>
            </>
          )}

          {/* --- Gasto --- */}
          {target.kind === 'expense' && (
            <>
              <div>
                <label className={labelClass}>Valor ({settings.currency})</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Categoria</label>
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

              <div>
                <label className={labelClass}>Descrição</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Pagamento</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as NonNullable<ExpenseLog['paymentMethod']>)}
                  className={inputClass}
                >
                  <option value="pix">Pix</option>
                  <option value="cartao">Cartão</option>
                  <option value="dinheiro">Dinheiro</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
            </>
          )}

          {/* --- Alimentação --- */}
          {target.kind === 'food' && (
            <div>
              <label className={labelClass}>Nível de Autocontrole do Dia</label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { id: 'controlled' as const, emoji: '😎', label: 'Controlado', xp: settings.xpValues.foodControlled, active: 'bg-emerald-950/60 border-emerald-400 shadow-game-green' },
                  { id: 'partial' as const, emoji: '😐', label: 'Parcial', xp: settings.xpValues.foodPartial, active: 'bg-amber-950/60 border-amber-400 shadow-game-gold' },
                  { id: 'uncontrolled' as const, emoji: '💥', label: 'Deslize', xp: 0, active: 'bg-rose-950/60 border-rose-400' }
                ]).map(opt => (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setFoodStatus(opt.id)}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-1 ${
                      foodStatus === opt.id ? opt.active : 'bg-[#121422] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-2xl">{opt.emoji}</span>
                    <span className="text-[11px] font-black text-white leading-tight">{opt.label}</span>
                    <span className="text-[10px] font-bold text-amber-400">+{opt.xp} XP</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Data (comum a todos) */}
          <div>
            <label className={labelClass}>Data</label>
            <input
              type="date"
              required
              value={date}
              onChange={e => setDate(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Observações (não se aplica a gastos, que usam Descrição) */}
          {target.kind !== 'expense' && (
            <div>
              <label className={labelClass}>Observações (opcional)</label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Ex: ritmo leve, capítulo sobre foco..."
                className="w-full bg-[#121422] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
          )}

          <div className="flex gap-2 pt-2">
            {onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="btn-game-ghost text-xs font-bold py-2.5 px-3 text-rose-400 hover:text-rose-300 cursor-pointer"
                title="Excluir registro"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-game-ghost text-xs font-bold py-2.5"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`flex-1 ${meta.button} text-xs font-black py-2.5 flex items-center justify-center gap-1.5`}
            >
              <Save className="w-4 h-4" />
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
