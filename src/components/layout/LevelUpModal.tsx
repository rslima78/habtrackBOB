import React from 'react';
import { MonkAvatar } from '../character/MonkAvatar';
import { LEVELS, getLevelUpCelebrationMessage } from '../../services/levelConfig';
import { soundEngine } from '../../services/audioService';
import { Sparkles, Trophy, CheckCircle2 } from 'lucide-react';

interface LevelUpModalProps {
  level: number;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ level, onClose }) => {
  const levelData = LEVELS.find(l => l.level === level) || LEVELS[0];
  const celebrationText = getLevelUpCelebrationMessage(level);

  const handleClose = () => {
    soundEngine.playClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#1E1B4B] via-[#181B2A] to-[#0F111A] border-4 border-amber-400 rounded-3xl p-6 sm:p-8 text-center shadow-2xl shadow-purple-900/50 animate-pop">
        
        {/* Glow behind modal */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider mb-4 animate-pulse">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Subida de Nível Épica!
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-purple-400 tracking-tight mb-1">
          🎉 VOCÊ SUBIU DE NÍVEL!
        </h2>

        <p className="text-slate-300 text-sm font-semibold mb-6">
          Sua disciplina e autocontrole atingiram um novo patamar.
        </p>

        {/* Big Avatar Display */}
        <div className="flex justify-center mb-6">
          <div className="relative p-2 bg-gradient-to-b from-purple-500/30 to-transparent rounded-full border-2 border-purple-400/50 shadow-glow-purple">
            <MonkAvatar level={level} size="2xl" />
          </div>
        </div>

        {/* New Rank Details */}
        <div className="bg-[#21263F] border border-purple-500/30 rounded-2xl p-4 mb-6 text-left">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-purple-300 uppercase tracking-wide">Novo Título</span>
            <span className="text-xs font-extrabold text-amber-400 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" /> Nível {level}
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>{levelData.emoji}</span>
            <span>{levelData.title.toUpperCase()}</span>
          </div>
          <p className="text-xs text-slate-300 mt-2 italic">
            "{celebrationText}"
          </p>
        </div>

        {/* Benefits list */}
        <div className="space-y-2 text-xs text-slate-300 mb-6 text-left">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Novo avatar desbloqueado para o seu perfil</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Mais respeito e poder de foco nas suas missões</span>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={handleClose}
          className="w-full btn-game-gold text-slate-950 text-base font-black py-3.5 shadow-game-gold rounded-2xl cursor-pointer"
        >
          CONTINUAR A JORNADA ⚔️
        </button>
      </div>
    </div>
  );
};
