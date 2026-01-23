import React, { useEffect, useId } from "react";
import { X } from "lucide-react";

type LegalModalProps = {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const LegalModal: React.FC<LegalModalProps> = ({ title, open, onClose, children }) => {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        aria-label="Fechar modal"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
      />

      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-br from-white to-emerald-50/40">
          <div>
            <h2 id={titleId} className="text-sm font-black text-slate-900 uppercase tracking-wider">
              {title}
            </h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.25em]">
              Pet • SEPLAG
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 active:scale-95 transition cursor-pointer"
            aria-label="Fechar"
          >
            <X size={18} className="text-slate-600" />
          </button>
        </div>

        <div className="px-6 py-5 max-h-[70vh] overflow-auto">{children}</div>

        <div className="px-6 py-4 border-t border-slate-200 bg-white flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]
                text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition active:scale-95 cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
