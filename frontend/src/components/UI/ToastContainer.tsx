import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`pointer-events-auto p-4 rounded-xl shadow-xl border flex items-start justify-between gap-3 text-xs transition-all animate-bounce-short ${
            t.type === 'success' ? 'bg-slate-900 text-white border-emerald-500/50 shadow-emerald-950/20' :
            t.type === 'warning' ? 'bg-slate-900 text-amber-200 border-amber-500/50' :
            t.type === 'error' ? 'bg-slate-900 text-rose-200 border-rose-500/50' :
            'bg-slate-900 text-indigo-200 border-indigo-500/50'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {t.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
            {t.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
            {t.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
            {t.type === 'info' && <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />}

            <div>
              <h4 className="font-bold text-white">{t.title}</h4>
              {t.desc && <p className="text-[11px] text-slate-300 mt-0.5">{t.desc}</p>}
            </div>
          </div>

          <button
            onClick={() => removeToast(t.id)}
            className="text-slate-400 hover:text-white p-0.5 rounded transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
