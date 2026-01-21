import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { notification$, uiActions } from '../../state/ui.state';
import type { Notification } from '../../state/ui.state';

const TOAST_VARIANTS = {
  success: {
    container: 'bg-white border-l-4 border-emerald-600 text-slate-700',
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
    label: 'Sucesso'
  },
  error: {
    container: 'bg-white border-l-4 border-red-500 text-slate-700',
    icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
    label: 'Erro'
  },
  info: {
    container: 'bg-white border-l-4 border-violet-600 text-slate-700',
    icon: <Info className="w-5 h-5 text-violet-600" />,
    label: 'Aviso'
  }
};

export const Toast: React.FC = () => {
  const [data, setData] = useState<Notification>(notification$.getValue());

  useEffect(() => {
    const subscription = notification$.subscribe(setData);
    return () => subscription.unsubscribe();
  }, []);

  if (!data.visible) return null;

  const variant = TOAST_VARIANTS[data.type];

  return (
    <div 
      role="alert" 
      className="fixed top-10 left-1/2 -translate-x-1/2 z-[300] w-full max-w-md px-6 animate-in fade-in slide-in-from-top-4 duration-500"
    >
      <div className={`
        ${variant.container}
        flex items-center gap-5 p-5 rounded-2xl shadow-2xl shadow-slate-200/50 
        backdrop-blur-sm bg-white/95
      `}>
        <div className="flex-shrink-0 w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
          {variant.icon}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-0.5 opacity-40">
            {variant.label}
          </p>
          <p className="text-sm font-bold leading-tight truncate">
            {data.message}
          </p>
        </div>

        <button 
          onClick={() => uiActions.hide()} 
          className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-300 hover:text-slate-600"
          aria-label="Fechar notificação"
        >
          <X className="w-5 h-5 stroke-[1.5]" />
        </button>
      </div>
    </div>
  );
};