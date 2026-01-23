import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { notification$, uiActions } from "../../state/ui.state";
import type { Notification } from "../../state/ui.state";

type VariantKey = "success" | "error" | "info";

const VARIANTS: Record< VariantKey,
  { leftBorder: string; icon: React.ReactNode; label: string }
  > = {
  success: {
    leftBorder: "border-l-emerald-600",
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
    label: "Sucesso",
  },
  error: {
    leftBorder: "border-l-red-500",
    icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
    label: "Erro",
  },
  info: {
    leftBorder: "border-l-violet-600",
    icon: <Info className="w-5 h-5 text-violet-600" />,
    label: "Aviso",
  },
};

export const Toast: React.FC = () => {
  const [data, setData] = useState<Notification>(notification$.getValue());

  useEffect(() => {
    const subscription = notification$.subscribe(setData);
    return () => subscription.unsubscribe();
  }, []);

  const variant = useMemo(() => VARIANTS[data.type as VariantKey], [data.type]);

  if (!data.visible) return null;

  return (
    <div role="alert" className="fixed top-10 left-1/2 -translate-x-1/2 z-[300] w-full max-w-md px-6
      animate-in fade-in slide-in-from-top-4 duration-500"
    >
      <div
        className={[
          "flex items-center gap-5 p-5 rounded-2xl",
          "bg-[var(--nav-bg)] border border-[var(--nav-border)] border-l-4",
          "text-[var(--nav-text)] backdrop-blur-[2px] dark:backdrop-blur-md",
          "shadow-2xl shadow-slate-200/50 dark:shadow-none",
          variant.leftBorder,
        ].join(" ")}
      >
        <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-black/5 dark:bg-white/10">
          {variant.icon}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-0.5 text-[var(--nav-muted-2)]">
            {variant.label}
          </p>

          <p className="text-sm font-bold leading-tight whitespace-normal break-words">
            {data.message}
          </p>
        </div>

        <button
          onClick={() => uiActions.hide()}
          className="p-2 rounded-lg transition-colors
            text-[var(--nav-muted-2)]
            hover:bg-black/5 hover:text-[var(--nav-text)]
            dark:hover:bg-white/10
            enabled:cursor-pointer disabled:cursor-not-allowed"
          aria-label="Fechar notificação"
        >
          <X className="w-5 h-5 stroke-[1.5]" />
        </button>
      </div>
    </div>
  );
};
