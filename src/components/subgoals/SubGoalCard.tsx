import React, { useRef, useState, useEffect } from 'react';
import { SubGoal, HabitCategory } from '../../types';
import { CheckCircle2, Circle, Trash2, Sparkles, Trophy } from 'lucide-react';
import { soundEngine } from '../../services/audioService';

interface SubGoalCardProps {
  subGoal: SubGoal;
  onProgress: (id: string, delta: 1 | -1) => void;
  onDelete?: (id: string) => void;
  compact?: boolean;
}

export const SubGoalCard: React.FC<SubGoalCardProps> = ({
  subGoal,
  onProgress,
  onDelete,
  compact = false
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const isSegmented = subGoal.type === 'segmented';
  const targetParts = subGoal.targetParts || 3;
  const currentParts = subGoal.currentParts || 0;
  const isDoneCheckbox = !isSegmented && subGoal.completedDates?.includes(todayStr);

  const [isPressed, setIsPressed] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPressRef = useRef(false);

  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  const handlePointerDown = () => {
    if (!isSegmented) return;
    isLongPressRef.current = false;
    setIsPressed(true);

    longPressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      setIsPressed(false);
      // Decrement on long press if currentParts > 0
      if (currentParts > 0) {
        if ('vibrate' in navigator) navigator.vibrate(40);
        onProgress(subGoal.id, -1);
      }
    }, 500);
  };

  const handlePointerUp = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    setIsPressed(false);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Avoid triggering if click was on delete button
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }

    if (isLongPressRef.current) {
      isLongPressRef.current = false;
      return;
    }

    if (isSegmented) {
      if (currentParts + 1 >= targetParts) {
        setJustCompleted(true);
        setTimeout(() => setJustCompleted(false), 900);
      }
      onProgress(subGoal.id, 1);
    } else {
      onProgress(subGoal.id, 1);
    }
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

  const badge = getCategoryBadge(subGoal.habitCategory);

  // Segmented Multi-Part Goal Card
  if (isSegmented) {
    return (
      <div
        onMouseDown={handlePointerDown}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchEnd={handlePointerUp}
        onTouchCancel={handlePointerUp}
        onClick={handleCardClick}
        title="Clique para adicionar +1 parte. Pressione e segure (500ms) para diminuir."
        className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all select-none cursor-pointer flex flex-col justify-between gap-2.5 relative overflow-hidden group ${
          justCompleted
            ? 'bg-emerald-950/60 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-[1.02]'
            : isPressed
            ? 'bg-[#1e2235] border-purple-400/80 scale-[0.98]'
            : 'bg-[#171A29] border-slate-800 hover:border-purple-500/50 hover:bg-[#1a1e30]'
        }`}
      >
        {/* Ambient glow on complete */}
        {justCompleted && (
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 animate-pulse pointer-events-none" />
        )}

        {/* Card Header: Category Badge + Title + XP / Delete */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span className={`text-[10px] font-black px-2 py-0.2 rounded-md border ${badge.color}`}>
                {badge.emoji} {badge.label}
              </span>
              <span className="text-[10px] font-bold text-teal-400 bg-teal-400/10 px-2 py-0.2 rounded-md border border-teal-400/20 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                {targetParts} Partes
              </span>
              {(subGoal.totalCompletions || 0) > 0 && (
                <span className="text-[10px] font-black text-amber-400 bg-amber-400/15 px-1.5 py-0.2 rounded-md border border-amber-400/30 flex items-center gap-0.5" title={`${subGoal.totalCompletions} ciclos completados`}>
                  <Trophy className="w-2.5 h-2.5" />
                  x{subGoal.totalCompletions}
                </span>
              )}
            </div>
            <h4 className="text-sm font-bold text-slate-100 truncate group-hover:text-white">
              {subGoal.title}
            </h4>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              +{subGoal.xpValue} XP
            </span>

            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  soundEngine.playClick();
                  onDelete(subGoal.id);
                }}
                className="text-slate-500 hover:text-rose-400 p-1.5 rounded-xl transition-colors cursor-pointer"
                title="Excluir subobjetivo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Energy Segment Bars Grid */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-400">
            <span className="flex items-center gap-1 text-slate-300">
              Progresso do Ciclo
            </span>
            <span className={currentParts > 0 ? 'text-emerald-400 font-black' : 'text-slate-500'}>
              {currentParts} de {targetParts}
            </span>
          </div>

          <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${targetParts}, minmax(0, 1fr))` }}>
            {Array.from({ length: targetParts }).map((_, idx) => {
              const isFilled = idx < currentParts;
              return (
                <div
                  key={idx}
                  className={`h-3.5 sm:h-4 rounded-lg transition-all duration-300 relative overflow-hidden ${
                    isFilled
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 border border-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.5)] scale-[1.02]'
                      : 'bg-slate-800/80 border border-slate-700/60 opacity-60'
                  }`}
                >
                  {/* Subtle shine on filled bars */}
                  {isFilled && (
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent pointer-events-none" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold px-0.5">
            <span>Toque: +1 barra</span>
            <span>Segurar: -1 barra</span>
          </div>
        </div>
      </div>
    );
  }

  // Standard Checkbox SubGoal Card
  return (
    <div
      onClick={handleCardClick}
      className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all select-none cursor-pointer flex items-center justify-between gap-3 ${
        isDoneCheckbox
          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100 shadow-sm'
          : 'bg-[#171A29] border-slate-800 hover:border-purple-500/40 text-slate-200'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {isDoneCheckbox ? (
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
              {subGoal.periodicity === 'daily' ? 'Diário' : subGoal.periodicity === 'weekly' ? 'Semanal' : 'Pontual'}
            </span>
          </div>
          <h4 className={`text-sm font-bold truncate ${isDoneCheckbox ? 'line-through opacity-75' : ''}`}>
            {subGoal.title}
          </h4>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-xs font-black px-2.5 py-1 rounded-xl ${
          isDoneCheckbox
            ? 'bg-emerald-500/20 text-emerald-300'
            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
        }`}>
          +{subGoal.xpValue} XP
        </span>

        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playClick();
              onDelete(subGoal.id);
            }}
            className="text-slate-600 hover:text-rose-400 p-1.5 rounded-xl transition-colors cursor-pointer"
            title="Excluir subobjetivo"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
