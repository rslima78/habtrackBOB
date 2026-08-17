import React, { useState } from 'react';
import { MonkAvatar } from '../character/MonkAvatar';
import { Sparkles, Shield, Trophy, Check, ArrowRight, RotateCcw } from 'lucide-react';
import { soundEngine } from '../../services/audioService';

interface NewHeroModalProps {
  initialName?: string;
  onConfirmNewHero: (name: string, goals: { workoutGoal: number; readingGoal: number; budgetLimit: number }) => void;
  onLoadDemoSeed: () => void;
  canCancel?: boolean;
  onCancel?: () => void;
}

export const NewHeroModal: React.FC<NewHeroModalProps> = ({
  initialName = '',
  onConfirmNewHero,
  onLoadDemoSeed,
  canCancel = false,
  onCancel
}) => {
  const [heroName, setHeroName] = useState(initialName || '');
  const [workoutGoal, setWorkoutGoal] = useState('4');
  const [readingGoal, setReadingGoal] = useState('20');
  const [budgetLimit, setBudgetLimit] = useState('80');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = heroName.trim() || 'Guerreiro';
    soundEngine.playLevelUp();
    onConfirmNewHero(finalName, {
      workoutGoal: parseInt(workoutGoal) || 4,
      readingGoal: parseInt(readingGoal) || 20,
      budgetLimit: parseFloat(budgetLimit) || 80.0
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#1E1B4B] via-[#161829] to-[#0F111A] border-3 border-amber-400/80 rounded-3xl p-6 sm:p-8 text-center shadow-2xl shadow-purple-900/60 animate-pop my-8">
        
        {/* Glow effect */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/25 rounded-full blur-3xl pointer-events-none" />

        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider mb-3">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
          Novo Herói — Modo Monge
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-purple-300 tracking-tight mb-2">
          CRIE SEU PERSONAGEM
        </h2>

        <p className="text-slate-300 text-xs sm:text-sm font-medium mb-6">
          Você começará do <strong>Nível 1 (🥚 Novato)</strong> com <strong>0 XP</strong> e evoluirá seu personagem conforme cumprir seus hábitos diários!
        </p>

        {/* Starter Avatar */}
        <div className="flex justify-center mb-6">
          <div className="relative p-2 bg-gradient-to-b from-purple-500/30 to-amber-500/20 rounded-3xl border-2 border-amber-400/60 shadow-glow-gold animate-bounce-soft">
            <MonkAvatar level={1} size="xl" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          
          {/* Hero Name */}
          <div>
            <label className="block text-xs font-black text-slate-200 mb-1.5 uppercase tracking-wide">
              Nome do seu Herói
            </label>
            <input
              type="text"
              required
              value={heroName}
              onChange={e => setHeroName(e.target.value)}
              placeholder="Digite seu nome ou apelido (Ex: Robson, Sam, Sensei...)"
              className="w-full bg-[#121422] border-2 border-purple-500/40 focus:border-amber-400 rounded-2xl px-4 py-3 text-base text-white font-black placeholder:text-slate-500 placeholder:font-normal focus:outline-none transition-all"
            />
          </div>

          {/* Quick Starting Goals */}
          <div className="bg-[#121422] p-4 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-[11px] font-black text-purple-300 uppercase tracking-wider block">
              Suas Metas Iniciais:
            </span>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">🏃 Treinos/sem</label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={workoutGoal}
                  onChange={e => setWorkoutGoal(e.target.value)}
                  className="w-full bg-[#181B2A] border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white font-black text-center focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">📚 Págs/dia</label>
                <input
                  type="number"
                  min="1"
                  value={readingGoal}
                  onChange={e => setReadingGoal(e.target.value)}
                  className="w-full bg-[#181B2A] border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white font-black text-center focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">💰 Limite/dia (R$)</label>
                <input
                  type="number"
                  min="1"
                  value={budgetLimit}
                  onChange={e => setBudgetLimit(e.target.value)}
                  className="w-full bg-[#181B2A] border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white font-black text-center focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2.5">
            <button
              type="submit"
              className="w-full btn-game-gold text-slate-950 font-black text-base py-3.5 rounded-2xl shadow-game-gold cursor-pointer flex items-center justify-center gap-2"
            >
              <span>INICIAR JORNADA DO ZERO</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Optional Demo Data Button */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playLevelUp();
                onLoadDemoSeed();
              }}
              className="w-full py-2.5 rounded-2xl border border-slate-700 hover:border-slate-600 bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Ou carregar dados de demonstração (Robson Nível 4)</span>
            </button>

            {canCancel && onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="w-full text-xs font-bold text-slate-400 hover:text-slate-300 py-1"
              >
                Voltar
              </button>
            )}
          </div>

        </form>

      </div>
    </div>
  );
};
