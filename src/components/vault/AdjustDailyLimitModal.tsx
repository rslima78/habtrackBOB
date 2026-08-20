import React, { useState } from 'react';
import { X, DollarSign, Sparkles, Check } from 'lucide-react';
import { soundEngine } from '../../services/audioService';

interface AdjustDailyLimitModalProps {
  currentLimit: number;
  currency: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newLimit: number) => void;
}

export const AdjustDailyLimitModal: React.FC<AdjustDailyLimitModalProps> = ({
  currentLimit,
  currency,
  isOpen,
  onClose,
  onSave,
}) => {
  const [value, setValue] = useState(currentLimit.toString());

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(value);
    if (!isNaN(num) && num > 0) {
      soundEngine.playPop();
      onSave(num);
      onClose();
    }
  };

  const presets = [30, 50, 80, 100, 150];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#171A29] w-full max-w-md rounded-3xl border-2 border-[#282E47] shadow-2xl p-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Ajustar Limite Diário</h3>
              <p className="text-xs text-slate-400">Quanto você planeja gastar no máximo por dia</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Meta Diária de Gastos ({currency})
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                {currency}
              </span>
              <input
                type="number"
                step="0.50"
                min="1"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#0F111E] border-2 border-[#232840] focus:border-purple-500 rounded-2xl text-white font-black text-xl focus:outline-none transition-colors"
                autoFocus
              />
            </div>
          </div>

          {/* Quick presets */}
          <div>
            <span className="block text-[11px] font-bold text-slate-400 mb-2">
              Valores sugeridos:
            </span>
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setValue(p.toString());
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    parseFloat(value) === p
                      ? 'bg-purple-600 text-white border-purple-400 shadow-glow-purple'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {currency} {p}
                </button>
              ))}
            </div>
          </div>

          {/* Hint */}
          <div className="bg-purple-950/30 border border-purple-500/30 rounded-2xl p-3 text-xs text-purple-300 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <span>
              Se você gastar menos que esse valor em um dia, a sobra vai direto para carregar sua bateria do cofre!
            </span>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold rounded-2xl shadow-game-purple transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-5 h-5" />
              Salvar Limite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
