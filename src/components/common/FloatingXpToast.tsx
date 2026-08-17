import React, { useEffect, useState } from 'react';

export interface XpToastItem {
  id: string;
  amount: number;
  message: string;
  emoji: string;
}

interface FloatingXpToastProps {
  toasts: XpToastItem[];
  onRemove: (id: string) => void;
}

export const FloatingXpToast: React.FC<FloatingXpToastProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-20 right-4 sm:right-8 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => onRemove(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: XpToastItem; onRemove: () => void }> = ({ toast, onRemove }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onRemove, 300);
    }, 2200);

    return () => clearTimeout(timer);
  }, [onRemove]);

  return (
    <div
      className={`transition-all duration-300 transform ${
        visible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-4 opacity-0 scale-95'
      } bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 text-white font-black px-4 py-2.5 rounded-2xl shadow-game-gold border-2 border-yellow-300/60 flex items-center gap-3 backdrop-blur-md`}
    >
      <span className="text-xl animate-bounce">{toast.emoji}</span>
      <div className="flex flex-col">
        <span className="text-sm tracking-wide font-extrabold drop-shadow">
          +{toast.amount} XP!
        </span>
        <span className="text-[11px] font-medium text-amber-100">
          {toast.message}
        </span>
      </div>
    </div>
  );
};
