import React from 'react';
import { MonkAvatar } from '../character/MonkAvatar';
import { LEVELS } from '../../services/levelConfig';
import { Trophy, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../../services/audioService';

interface LevelJourneyModalProps {
  currentXp: number;
  onClose: () => void;
}

export const LevelJourneyModal: React.FC<LevelJourneyModalProps> = ({ currentXp, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#181B2A] border-2 border-purple-500/50 rounded-3xl p-6 shadow-2xl animate-pop max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/40 text-purple-300 flex items-center justify-center text-xl shadow-game-purple">
              🥋
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Trilha de Evolução do Monge</h2>
              <p className="text-xs text-slate-400">10 níveis de transformação e autocontrole</p>
            </div>
          </div>

          <button
            onClick={() => { soundEngine.playClick(); onClose(); }}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Levels List */}
        <div className="overflow-y-auto py-4 space-y-3 flex-1 pr-1">
          {LEVELS.map(lvl => {
            const isUnlocked = currentXp >= lvl.minXp;
            const isCurrent = currentXp >= lvl.minXp && currentXp < lvl.maxXp;

            return (
              <div
                key={lvl.level}
                className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                  isCurrent
                    ? 'bg-gradient-to-r from-purple-950/60 to-[#1F243E] border-amber-400 shadow-glow-purple scale-[1.01]'
                    : isUnlocked
                    ? 'bg-[#141624] border-slate-700/80 text-slate-200'
                    : 'bg-[#10121C] border-slate-800/60 opacity-60 text-slate-400'
                }`}
              >
                {/* Avatar */}
                <div className="shrink-0">
                  <MonkAvatar level={lvl.level} size="lg" isAnimated={isCurrent} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black px-2 py-0.5 rounded-md bg-slate-800 text-amber-400">
                      Nível {lvl.level}
                    </span>
                    <h3 className="text-base font-black text-white truncate">
                      {lvl.title}
                    </h3>
                    {isCurrent && (
                      <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.2 rounded-full uppercase animate-pulse">
                        Seu Nível Atual
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 italic mb-2">
                    "{lvl.description}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span>Requerimento: <strong className="text-amber-300">{lvl.minXp.toLocaleString()} XP</strong></span>
                    {isUnlocked ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Desbloqueado
                      </span>
                    ) : (
                      <span className="text-slate-500">
                        Faltam {(lvl.minXp - currentXp).toLocaleString()} XP
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Close Button */}
        <div className="pt-3 border-t border-slate-800 shrink-0">
          <button
            onClick={() => { soundEngine.playClick(); onClose(); }}
            className="w-full btn-game-ghost text-xs font-bold py-2.5 cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
