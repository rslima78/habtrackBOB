import React from 'react';
import { EnergyCell } from '../../services/savingsCalculator';
import { Zap, BatteryCharging, BatteryWarning, ShieldCheck, Sparkles } from 'lucide-react';

interface EnergyBatteryBarProps {
  cells: EnergyCell[];
  batteryLevel: number;
  levelProgress: number;
  levelMax: number;
  isNegative: boolean;
  currency: string;
}

export const EnergyBatteryBar: React.FC<EnergyBatteryBarProps> = ({
  cells,
  batteryLevel,
  levelProgress,
  levelMax,
  isNegative,
  currency,
}) => {
  const fullCellsCount = cells.filter(c => c.isFull).length;
  const overallPercent = isNegative ? 0 : Math.round((levelProgress / levelMax) * 100);

  return (
    <div className="bg-[#171A29]/90 rounded-3xl p-5 md:p-6 border-2 border-[#282E47] shadow-game relative overflow-hidden backdrop-blur-sm">
      {/* Ambient background glow */}
      <div
        className={`absolute -right-16 -top-16 w-52 h-52 rounded-full blur-3xl pointer-events-none opacity-20 ${
          isNegative ? 'bg-red-600' : 'bg-emerald-500'
        }`}
      />

      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 relative z-10">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 shadow-lg transition-transform hover:scale-105 ${
              isNegative
                ? 'bg-red-500/20 border-red-500/50 text-red-400 shadow-red-500/20'
                : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-emerald-500/20'
            }`}
          >
            {isNegative ? (
              <BatteryWarning className="w-6 h-6 animate-pulse" />
            ) : (
              <BatteryCharging className="w-6 h-6 animate-bounce" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                Reserva de Energia
              </span>
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                  isNegative
                    ? 'bg-red-950 text-red-400 border-red-800'
                    : 'bg-emerald-950 text-emerald-400 border-emerald-800 flex items-center gap-1'
                }`}
              >
                {!isNegative && <Zap className="w-2.5 h-2.5 fill-current" />}
                Nível {batteryLevel}
              </span>
            </div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              {isNegative ? (
                <span className="text-red-400">Bateria Esgotada</span>
              ) : (
                <span>
                  Bateria Nível {batteryLevel}{' '}
                  <span className="text-sm font-semibold text-slate-400">
                    ({fullCellsCount}/10 células)
                  </span>
                </span>
              )}
            </h3>
          </div>
        </div>

        {/* Level Progress Stats */}
        <div className="text-right">
          <div className="text-xs font-bold text-slate-400">
            Progresso da Bateria
          </div>
          <div className="text-base font-black text-emerald-400">
            {currency} {isNegative ? '0.00' : levelProgress.toFixed(2)}{' '}
            <span className="text-xs text-slate-500">/ {currency} {levelMax.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* The 10-Cell Energy Battery Box */}
      <div className="relative z-10 bg-[#0F111E] p-3 md:p-4 rounded-2xl border-2 border-[#232840] shadow-inner">
        {/* Top Mini Marks */}
        <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 mb-2">
          <span>0%</span>
          <span className="flex items-center gap-1 text-emerald-400/80">
            <Sparkles className="w-3 h-3" />
            10 Células de {currency} 100
          </span>
          <span>100% ({currency} 1.000)</span>
        </div>

        {/* The Grid of 10 Cells */}
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {cells.map((cell) => {
            return (
              <div
                key={cell.index}
                className="group relative flex flex-col items-center"
              >
                {/* Cell Container */}
                <div
                  className={`w-full h-14 md:h-16 rounded-xl relative overflow-hidden transition-all duration-300 border-2 ${
                    isNegative
                      ? 'bg-red-950/20 border-red-900/40'
                      : cell.isFull
                      ? 'bg-emerald-950/40 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                      : cell.isPartial
                      ? 'bg-emerald-950/20 border-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  {/* Energy Fill */}
                  {!isNegative && cell.percent > 0 && (
                    <div
                      className={`absolute bottom-0 left-0 right-0 transition-all duration-500 ${
                        cell.isFull
                          ? 'bg-gradient-to-t from-emerald-600 via-emerald-500 to-teal-300 shadow-glow-emerald'
                          : 'bg-gradient-to-t from-emerald-700 to-emerald-400 animate-pulse'
                      }`}
                      style={{ height: `${cell.percent}%` }}
                    />
                  )}

                  {/* Cell Lightning / Spark icon inside */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    {isNegative ? (
                      <span className="text-[10px] font-black text-red-500/40">✕</span>
                    ) : cell.isFull ? (
                      <Zap className="w-4 h-4 text-white drop-shadow-[0_0_4px_rgba(0,0,0,0.8)] fill-white/80" />
                    ) : cell.isPartial ? (
                      <Zap className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                    ) : (
                      <span className="text-[10px] font-bold text-slate-600">
                        {cell.index + 1}
                      </span>
                    )}
                  </div>
                </div>

                {/* Subtitle / Amount label */}
                <div className="mt-1 text-center">
                  <span
                    className={`text-[10px] font-black ${
                      isNegative
                        ? 'text-slate-600'
                        : cell.isFull
                        ? 'text-emerald-400 font-extrabold'
                        : cell.isPartial
                        ? 'text-emerald-300'
                        : 'text-slate-500'
                    }`}
                  >
                    {isNegative
                      ? `${currency}0`
                      : cell.isFull
                      ? `${currency}100`
                      : cell.isPartial
                      ? `${currency}${cell.amountInCell.toFixed(0)}`
                      : `${currency}0`}
                  </span>
                </div>

                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 z-30 pointer-events-none bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg border border-slate-700 whitespace-nowrap">
                  Célula #{cell.index + 1}: {currency}{cell.amountInCell.toFixed(2)} / {currency}100
                </div>
              </div>
            );
          })}
        </div>

        {/* Battery Terminal Pin Graphic */}
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 font-bold border-t border-slate-800/80 pt-2 px-1">
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Capacidade total do ciclo: {currency} {levelMax.toFixed(2)}</span>
          </div>
          <div className="text-emerald-400 font-extrabold">
            {overallPercent}% Carregada
          </div>
        </div>
      </div>
    </div>
  );
};
