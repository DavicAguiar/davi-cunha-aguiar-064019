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
      <footer className="bg-white border-t border-slate-200 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-xs font-black text-slate-800 uppercase tracking-tighter">
              Secretaria de Estado de Planejamento e Gestão
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              © 2026 Governo de Mato Grosso
            </p>
          </div>

          <div className="flex gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <button
              type="button"
              onClick={() => setOpen("terms")}
              className="hover:text-emerald-600 transition-colors focus:outline-none 
              focus-visible:ring-2 focus-visible:ring-emerald-600/40 rounded-lg px-1  cursor-pointer"
            >
              Termos de Uso
            </button>

            <button
              type="button"
              onClick={() => setOpen("support")}
              className="hover:text-emerald-600 transition-colors focus:outline-none 
              focus-visible:ring-2 focus-visible:ring-emerald-600/40 rounded-lg px-1 cursor-pointer"
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
