import React, { useEffect, useId, useState } from "react";
import { X } from "lucide-react";

type LegalModalProps = {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const ANIMATION_MS = 180;

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

export const LegalModal: React.FC<LegalModalProps> = ({ title, open, onClose, children }) => {
  const titleId = useId();
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
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    const unlock = lockBodyScroll();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      unlock();
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button
        type="button"
        aria-label="Fechar modal"
        onClick={onClose}
        className={[
          "absolute inset-0 backdrop-blur-sm transition-opacity",
          "bg-[color:var(--modal-overlay)] cursor-pointer",
          visible ? "opacity-100" : "opacity-0",
        ].join(" ")}
        style={{ transitionDuration: `${ANIMATION_MS}ms` }}
      />

      <div className={[
          "relative w-full max-w-2xl rounded-2xl overflow-hidden",
          "border shadow-2xl transition-all",
          "bg-[color:var(--modal-bg)] border-[color:var(--modal-border)]",
          "text-[color:var(--modal-text)]",
          visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-[0.98]",
        ].join(" ")}
        style={{ transitionDuration: `${ANIMATION_MS}ms` }}
      >
        <div className={[
            "flex items-center justify-between px-6 py-4 border-b",
            "border-[color:var(--modal-border)]",
            "bg-[image:var(--modal-header-bg)]",
          ].join(" ")}
        >
          <div>
            <h2 id={titleId} className="text-sm font-black uppercase tracking-wider text-[color:var(--modal-text)]">
              {title}
            </h2>

            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[color:var(--modal-muted-2)]">
              Pet • SEPLAG
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl active:scale-95 transition cursor-pointer"
            style={{ backgroundColor: "transparent" }}
            aria-label="Fechar"
          >
            <span className="inline-flex rounded-xl p-2 hover:bg-[color:var(--modal-ghost-hover-bg)] transition">
              <X size={18} className="text-[color:var(--modal-muted)]" />
            </span>
          </button>
        </div>

        <div className="px-6 py-5 max-h-[70vh] overflow-auto">{children}</div>

        <div className="px-6 py-4 border-t border-[color:var(--modal-border)] bg-[color:var(--modal-bg)] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition active:scale-95
                       text-[color:var(--modal-muted)] hover:text-[color:var(--modal-text)] 
                       hover:bg-[color:var(--modal-ghost-hover-bg)] cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
