import React, { useEffect, useId, useState } from "react";
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

function lockBodyScroll() {
  const body = document.body;
  const docEl = document.documentElement;

  const prevOverflow = body.style.overflow;
  const prevPaddingRight = body.style.paddingRight;

  const scrollbarWidth = window.innerWidth - docEl.clientWidth;

  body.style.overflow = "hidden";
  if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

  return () => {
    body.style.overflow = prevOverflow;
    body.style.paddingRight = prevPaddingRight;
  };
}

export const ConfirmModal: React.FC<Props> = ({
  open,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
}) => {
  const titleId = useId();
  const descId = useId();

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
    const unlock = lockBodyScroll();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      unlock();
    };
  }, [open, onCancel]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descId}>
      <button
        type="button"
        aria-label="Fechar"
        onClick={onCancel}
        className={[
          "absolute inset-0 transition-opacity backdrop-blur-sm",
          "bg-[color:var(--modal-overlay-strong)]",
          visible ? "opacity-100" : "opacity-0",
        ].join(" ")}
        style={{ transitionDuration: `${ANIMATION_MS}ms` }}
      />

      <div className={[
          "relative w-full max-w-lg rounded-[2rem] overflow-hidden",
          "border shadow-2xl transition-all",
          "bg-[color:var(--modal-bg)] border-[color:var(--modal-border)] text-[color:var(--modal-text)]",
          visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-[0.98]",
        ].join(" ")}
        style={{ transitionDuration: `${ANIMATION_MS}ms` }}
      >
        <div className="relative px-6 py-5 border-b border-[color:var(--modal-border)] bg-[image:var(--modal-header-bg)]">
          <button
            type="button"
            onClick={onCancel}
            className="absolute top-5 right-5 rounded-xl p-2 hover:bg-[color:var(--modal-ghost-hover-bg)]
             transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X size={20} strokeWidth={1.5} className="text-[color:var(--modal-muted-2)]" />
          </button>

          <h3 id={titleId} className="text-xl font-black tracking-tight text-[color:var(--modal-text)]">
            {title}
          </h3>

          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[color:var(--modal-muted-2)] mt-1">
            Confirmação
          </p>
        </div>

        <div className="p-6">
          <p id={descId} className="font-semibold leading-relaxed whitespace-normal break-words text-[color:var(--modal-muted)]">
            {description}
          </p>
        </div>

        <div className="p-6 pt-0 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-[0.3em]
                       bg-[color:var(--modal-bg)] border-[color:var(--modal-border)] text-[color:var(--modal-muted)]
                       hover:text-[color:var(--modal-text)] hover:bg-[color:var(--modal-ghost-hover-bg)]
                       transition active:scale-95 cursor-pointer"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-4 rounded-2xl bg-red-600 text-white text-[10px] cursor-pointer
                       font-black uppercase tracking-[0.3em] hover:bg-red-700 transition active:scale-95"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
