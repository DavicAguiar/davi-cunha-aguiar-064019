import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ANIMATION_MS = 160;

export const ConfirmModal: React.FC<Props> = ({
    open,
    title,
    description,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    onConfirm,
    onCancel,
    }) => {
    const [mounted, setMounted] = useState(open);
    const [visible, setVisible] = useState(open);

    useEffect(() => {
        if (open) {
            setMounted(true);
            requestAnimationFrame(() => setVisible(true));

            return;
        }
        setVisible(false);
        const t = window.setTimeout(() => setMounted(false), ANIMATION_MS);

        return () => window.clearTimeout(t);
    }, [open]);

    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onCancel();
        };

        document.addEventListener("keydown", onKeyDown);
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = originalOverflow;
        };
    }, [open, onCancel]);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <button
                type="button"
                aria-label="Fechar"
                onClick={onCancel}
                className={[
                "absolute inset-0 transition-opacity backdrop-blur-sm",
                "bg-slate-900/70",
                visible ? "opacity-100" : "opacity-0",
                ].join(" ")}
            />

            <div
                className={[
                "relative bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden",
                "transition-all",
                visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-[0.98]",
                ].join(" ")}
                style={{ transitionDuration: `${ANIMATION_MS}ms` }}
            >
                <div className="relative px-6 py-5 border-b border-slate-100">
                <button
                    onClick={onCancel}
                    className="absolute top-5 right-5 text-slate-300 hover:text-red-500 transition-colors"
                    aria-label="Fechar"
                >
                    <X size={22} strokeWidth={1.5} />
                </button>

                <h3 className="text-xl font-black text-slate-800 tracking-tight">{title}</h3>
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mt-1">Confirmação</p>
                </div>

                <div className="p-6">
                    <p className="text-slate-700 font-semibold leading-relaxed whitespace-normal break-words">{description}</p>
                </div>

                <div className="p-6 pt-0 flex gap-3">
                    <button type="button"
                            onClick={onCancel}
                            className="flex-1 py-4 rounded-2xl bg-white border border-slate-200 text-[10px]
                            font-black uppercase tracking-[0.3em] text-slate-600 hover:border-slate-300 transition active:scale-95"
                    >
                        {cancelText}
                    </button>

                    <button type="button"
                            onClick={onConfirm}
                            className="flex-1 py-4 rounded-2xl bg-red-600 text-white text-[10px]
                            font-black uppercase tracking-[0.3em] hover:bg-red-700 transition active:scale-95"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};
