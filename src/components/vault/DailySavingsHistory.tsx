import React from 'react';
import { DaySavingsRecord } from '../../services/savingsCalculator';
import { Calendar, ArrowUpRight, ArrowDownRight, CheckCircle2, AlertTriangle, Shield } from 'lucide-react';

interface DailySavingsHistoryProps {
  history: DaySavingsRecord[];
  currency: string;
}

export const DailySavingsHistory: React.FC<DailySavingsHistoryProps> = ({
  history,
  currency,
}) => {
  const formatDateLabel = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (dateStr === today) return 'Hoje';
    if (dateStr === yesterday) return 'Ontem';

    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  return (
    <div className="bg-[#171A29]/90 rounded-3xl p-5 md:p-6 border-2 border-[#282E47] shadow-game">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-white">Histórico de Economia Diária</h3>
        </div>
        <span className="text-xs font-bold text-slate-400">
          {history.length} {history.length === 1 ? 'dia registrado' : 'dias registrados'}
        </span>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-sm">
          Nenhum registro encontrado ainda. Registre suas despesas diárias para acompanhar o cofre!
        </div>
      ) : (
        <div className="space-y-2.5">
          {history.map((record) => {
            const isPositive = record.saved >= 0;
            const formattedDate = formatDateLabel(record.date);

            return (
              <div
                key={record.date}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  isPositive
                    ? 'bg-[#0F111E]/80 border-emerald-500/20 hover:border-emerald-500/40'
                    : 'bg-red-950/20 border-red-500/30 hover:border-red-500/50'
                }`}
              >
                {/* Left: Date & Limit breakdown */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black ${
                      isPositive
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-red-500/20 text-red-400 border border-red-500/40'
                    }`}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="w-5 h-5" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-white">{formattedDate}</span>
                      <span className="text-[10px] text-slate-500 font-bold">
                        ({record.date})
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-2">
                      <span>
                        Gasto: <strong className="text-slate-200">{currency} {record.spent.toFixed(2)}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Meta: <strong className="text-slate-300">{currency} {record.limit.toFixed(2)}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Saved / Deficit Badge */}
                <div className="text-right">
                  <div
                    className={`text-sm font-black flex items-center justify-end gap-1 ${
                      isPositive ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {isPositive ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>+{currency} {record.saved.toFixed(2)}</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>-{currency} {Math.abs(record.saved).toFixed(2)}</span>
                      </>
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider ${
                      isPositive ? 'text-emerald-500/80' : 'text-red-500/80'
                    }`}
                  >
                    {isPositive ? 'Guardado no Cofre' : 'Estourou Meta'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
