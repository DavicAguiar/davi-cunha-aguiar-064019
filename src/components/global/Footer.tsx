import React, { useMemo, useState } from "react";
import { LegalModal } from "./modals/LegalModal";
import { TermsOfUseContent } from "./modals/TermsContent";
import { SupportContent } from "./modals/SupportContent";

type ModalKey = "terms" | "support" | null;

export const Footer: React.FC = () => {
  const [open, setOpen] = useState<ModalKey>(null);

  const title = useMemo(() => {
    if (open === "terms") return "Termos de Uso";
    if (open === "support") return "Suporte";
    return "";
  }, [open]);

  return (
    <>
      <footer className="mt-auto py-10
        bg-[var(--nav-bg)] border-t border-[var(--nav-border)]
        text-[var(--nav-text)]
        backdrop-blur-[2px] dark:backdrop-blur-md
        shadow-[0_-1px_0_rgba(15,23,42,0.04)] dark:shadow-none"
      >
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-xs font-black uppercase tracking-tighter">
              Secretaria de Estado de Planejamento e Gestão
            </p>

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--nav-muted-2)]">
              © 2026 Governo de Mato Grosso
            </p>
          </div>

          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-[var(--nav-muted)]">
            <button
              type="button"
              onClick={() => setOpen("terms")}
              className="px-2 py-2 rounded-xl transition-all
                         hover:text-emerald-700 hover:bg-emerald-50
                         dark:hover:text-emerald-200 dark:hover:bg-emerald-900/20
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40
                         enabled:cursor-pointer disabled:cursor-not-allowed"
            >
              Termos de Uso
            </button>

            <button
              type="button"
              onClick={() => setOpen("support")}
              className="px-2 py-2 rounded-xl transition-all
                         hover:text-emerald-700 hover:bg-emerald-50
                         dark:hover:text-emerald-200 dark:hover:bg-emerald-900/20
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40
                         enabled:cursor-pointer disabled:cursor-not-allowed"
            >
              Suporte
            </button>
          </div>
        </div>
      </footer>

      <LegalModal title={title} open={open !== null} onClose={() => setOpen(null)}>
        {open === "terms" ? <TermsOfUseContent /> : null}
        {open === "support" ? <SupportContent /> : null}
      </LegalModal>
    </>
  );
};
