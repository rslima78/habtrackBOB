import React, { useState } from 'react';
import { Book, ReadingLog, SubGoal, AppSettings } from '../../types';
import { Plus, BookOpen, Sparkles, Trophy, Trash2, Calendar as CalendarIcon, Timer, CheckCircle2, Circle, Bookmark } from 'lucide-react';
import { soundEngine } from '../../services/audioService';

interface ReadingSectionProps {
  books: Book[];
  readingLogs: ReadingLog[];
  subGoals: SubGoal[];
  settings: AppSettings;
  onAddReadingLog: (log: Omit<ReadingLog, 'id' | 'createdAt' | 'xpEarned'>) => void;
  onAddBook: (book: Omit<Book, 'id'>) => void;
  onDeleteReadingLog: (id: string) => void;
  onToggleSubGoal: (subGoalId: string) => void;
}

export const ReadingSection: React.FC<ReadingSectionProps> = ({
  books,
  readingLogs,
  subGoals,
  settings,
  onAddReadingLog,
  onAddBook,
  onDeleteReadingLog,
  onToggleSubGoal
}) => {
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  // Form states for reading log
  const [selectedBookId, setSelectedBookId] = useState(books[0]?.id || '');
  const [pagesRead, setPagesRead] = useState('20');
  const [durationMin, setDurationMin] = useState('30');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Form states for new book
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [newBookTotalPages, setNewBookTotalPages] = useState('300');
  const [newBookColor, setNewBookColor] = useState('#F59E0B');

  const todayStr = new Date().toISOString().split('T')[0];

  // Today's reading totals
  const todayLogs = readingLogs.filter(r => r.date === todayStr);
  const todayPages = todayLogs.reduce((sum, r) => sum + r.pagesRead, 0);
  const dailyGoal = settings.readingDailyPagesGoal || 20;
  const isGoalExceeded = todayPages >= dailyGoal;

  // All-time totals
  const totalPagesRead = readingLogs.reduce((sum, r) => sum + r.pagesRead, 0);
  const completedBooks = books.filter(b => b.status === 'completed').length;

  // Reading subgoals
  const readingSubGoals = subGoals.filter(sg => sg.habitCategory === 'reading');

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pages = parseInt(pagesRead);
    if (isNaN(pages) || pages <= 0) return;

    const book = books.find(b => b.id === selectedBookId);

    onAddReadingLog({
      date,
      bookId: selectedBookId || undefined,
      bookTitle: book ? book.title : 'Leitura Geral',
      pagesRead: pages,
      durationMin: parseInt(durationMin) || 0,
      notes: notes.trim() ? notes : undefined
    });

    setIsSessionModalOpen(false);
    setNotes('');
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookTitle.trim()) return;

    onAddBook({
      title: newBookTitle.trim(),
      author: newBookAuthor.trim() || 'Autor Desconhecido',
      totalPages: parseInt(newBookTotalPages) || 100,
      currentPage: 0,
      status: 'reading',
      color: newBookColor,
      startedAt: todayStr
    });

    setIsBookModalOpen(false);
    setNewBookTitle('');
    setNewBookAuthor('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Today's Reading Goal */}
      <div className="game-card bg-gradient-to-r from-[#2A1F18] to-[#121422] border-amber-500/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border-2 border-amber-400/40 text-amber-400 flex items-center justify-center text-2xl shadow-game-gold">
              📚
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">Leitura & Conhecimento</h2>
                {isGoalExceeded && (
                  <span className="bg-amber-500/20 text-amber-300 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-400/40 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Meta Superada!
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-300">Expandindo a mente página por página</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              onClick={() => { soundEngine.playClick(); setIsBookModalOpen(true); }}
              className="btn-game-ghost text-xs font-bold py-2.5 px-3 cursor-pointer"
            >
              + Novo Livro
            </button>
            <button
              onClick={() => { soundEngine.playClick(); setIsSessionModalOpen(true); }}
              className="btn-game-gold text-slate-950 text-xs font-black py-2.5 px-4 cursor-pointer flex-1 sm:flex-none"
            >
              <Plus className="w-4 h-4" />
              Registrar Páginas
            </button>
          </div>
        </div>

        {/* Today's Reading Progress Meter */}
        <div className="bg-[#121422] p-4 rounded-2xl border border-slate-800 mb-4">
          <div className="flex items-center justify-between text-xs font-black mb-2">
            <span className="text-slate-200">
              Hoje: <span className="text-amber-400 text-sm font-black">{todayPages}</span> / {dailyGoal} páginas
            </span>
            <span className="text-amber-400 font-extrabold flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" />
              {todayPages >= dailyGoal ? `+${todayPages - dailyGoal} páginas extras! (+20 XP)` : `Faltam ${dailyGoal - todayPages} páginas`}
            </span>
          </div>

          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-300 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round((todayPages / dailyGoal) * 100))}%` }}
            />
          </div>
        </div>

        {/* Reading Metrics */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
          <div className="bg-[#121422] p-3 rounded-2xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 block">Total Lido</span>
            <span className="text-lg sm:text-xl font-black text-amber-400">{totalPagesRead} págs</span>
          </div>
          <div className="bg-[#121422] p-3 rounded-2xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 block">Livros Concluídos</span>
            <span className="text-lg sm:text-xl font-black text-emerald-400">{completedBooks}</span>
          </div>
          <div className="bg-[#121422] p-3 rounded-2xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 block">Livros na Fila</span>
            <span className="text-lg sm:text-xl font-black text-white">{books.length}</span>
          </div>
        </div>
      </div>

      {/* Book Library Shelf */}
      <div className="game-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <span>📖</span> Sua Estante de Livros
          </h3>
          <button
            onClick={() => setIsBookModalOpen(true)}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 cursor-pointer"
          >
            + Adicionar à Estante
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {books.map(book => {
            const bookPercent = Math.min(100, Math.round((book.currentPage / book.totalPages) * 100));
            return (
              <div
                key={book.id}
                className="bg-[#121422] border-2 border-slate-800 hover:border-amber-500/50 p-3.5 rounded-2xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div
                      className="w-3 h-8 rounded-full shrink-0"
                      style={{ backgroundColor: book.color }}
                    />
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      book.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : book.status === 'reading'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {book.status === 'completed' ? 'Lido ✅' : book.status === 'reading' ? 'Lendo 📖' : 'Desejado ⏳'}
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-white truncate" title={book.title}>
                    {book.title}
                  </h4>
                  <p className="text-xs text-slate-400 truncate mb-3">
                    {book.author}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 mb-1">
                    <span>{book.currentPage} / {book.totalPages} págs</span>
                    <span className="text-amber-400">{bookPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${bookPercent}%`,
                        backgroundColor: book.color || '#F59E0B'
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sub-goals for Reading */}
      <div className="game-card border-amber-500/20">
        <h3 className="text-sm font-black text-white uppercase tracking-wider mb-3 flex items-center gap-2">
          <span>🎯</span> Subobjetivos de Leitura
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {readingSubGoals.map(sg => {
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

      {/* Reading Logs History */}
      <div className="game-card">
        <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <span>📋</span> Sessões de Leitura Recentes
        </h3>

        <div className="space-y-2.5">
          {[...readingLogs].reverse().slice(0, 10).map(log => (
            <div
              key={log.id}
              className="bg-[#121422] border border-slate-800 hover:border-amber-500/40 p-3.5 rounded-2xl flex items-center justify-between gap-3 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-lg shrink-0">
                  📖
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white">
                      {log.bookTitle || 'Leitura Geral'}
                    </span>
                    <span className="text-xs font-black text-amber-400">
                      +{log.pagesRead} págs
                    </span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.2 rounded-md">
                      +{log.xpEarned} XP
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> {log.date}</span>
                    {log.durationMin > 0 && (
                      <span className="flex items-center gap-1"><Timer className="w-3 h-3" /> {log.durationMin} min</span>
                    )}
                    {log.notes && <span className="truncate max-w-[200px] text-slate-400 italic">"{log.notes}"</span>}
                  </div>
                </div>
              </div>

              <button
                onClick={() => { soundEngine.playClick(); onDeleteReadingLog(log.id); }}
                className="text-slate-500 hover:text-rose-400 p-2 rounded-xl transition-colors cursor-pointer"
                title="Excluir registro"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Registrar Sessão de Leitura */}
      {isSessionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#181B2A] border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl animate-pop">
            <h3 className="text-xl font-black text-white mb-1 flex items-center gap-2">
              <span>📖</span> Registrar Páginas Lidas
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Cada página lida exercita seu intelecto e concede XP ao seu herói!
            </p>

            <form onSubmit={handleLogSubmit} className="space-y-4">
              {/* Select Book */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Livro</label>
                <select
                  value={selectedBookId}
                  onChange={e => setSelectedBookId(e.target.value)}
                  className="w-full bg-[#121422] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:border-amber-500 focus:outline-none"
                >
                  {books.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.title} ({b.currentPage}/{b.totalPages} págs)
                    </option>
                  ))}
                  <option value="">Outro / Leitura Livre</option>
                </select>
              </div>

              {/* Pages and Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Páginas Lidas</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={pagesRead}
                    onChange={e => setPagesRead(e.target.value)}
                    className="w-full bg-[#121422] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:border-amber-500 focus:outline-none"
                    placeholder="Ex: 20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Tempo (minutos)</label>
                  <input
                    type="number"
                    min="1"
                    value={durationMin}
                    onChange={e => setDurationMin(e.target.value)}
                    className="w-full bg-[#121422] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:border-amber-500 focus:outline-none"
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
                  className="w-full bg-[#121422] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Anotações do Capítulo (opcional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Ex: Capítulo sobre foco sem distrações..."
                  className="w-full bg-[#121422] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSessionModalOpen(false)}
                  className="flex-1 btn-game-ghost text-xs font-bold py-2.5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-game-gold text-slate-950 text-xs font-black py-2.5"
                >
                  Salvar Leitura (+20 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Adicionar Livro à Estante */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#181B2A] border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl animate-pop">
            <h3 className="text-xl font-black text-white mb-1 flex items-center gap-2">
              <span>📚</span> Adicionar Novo Livro
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Organize seus livros para acompanhar o progresso de leitura!
            </p>

            <form onSubmit={handleBookSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Título do Livro</label>
                <input
                  type="text"
                  required
                  value={newBookTitle}
                  onChange={e => setNewBookTitle(e.target.value)}
                  placeholder="Ex: Mindset: A Nova Psicologia do Sucesso"
                  className="w-full bg-[#121422] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Autor</label>
                <input
                  type="text"
                  value={newBookAuthor}
                  onChange={e => setNewBookAuthor(e.target.value)}
                  placeholder="Ex: Carol Dweck"
                  className="w-full bg-[#121422] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Total de Páginas</label>
                  <input
                    type="number"
                    min="10"
                    required
                    value={newBookTotalPages}
                    onChange={e => setNewBookTotalPages(e.target.value)}
                    className="w-full bg-[#121422] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Cor do Marcador</label>
                  <div className="flex items-center gap-2 mt-1">
                    {['#F59E0B', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899'].map(c => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setNewBookColor(c)}
                        className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                          newBookColor === c ? 'scale-125 border-white' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="flex-1 btn-game-ghost text-xs font-bold py-2.5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-game-gold text-slate-950 text-xs font-black py-2.5"
                >
                  Cadastrar Livro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
