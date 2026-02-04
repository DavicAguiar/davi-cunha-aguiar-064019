import React from "react";
import { Mail, Phone } from "lucide-react";

const Motion: React.FC<{ delay?: number; children: React.ReactNode }> = ({ delay = 0, children }) => (
  <div
    className="opacity-0 translate-y-2 animate-[legal-in_220ms_ease-out_forwards]"
    style={{ animationDelay: `${delay}ms` }}
  >
    {children}
  </div>
);

export const SupportContent: React.FC = () => {
  return (
    <div className="space-y-4 text-[color:var(--nav-text)]">
      <Motion delay={0}>
        <p className="text-sm font-bold text-[color:var(--nav-text)]">
          Informações de contatos.
        </p>
      </Motion>

      <Motion delay={40}>
        <div className={[
            "rounded-2xl border p-4",
            "border-[color:var(--nav-border)]",
            "bg-[color:var(--nav-bg)]",
            "backdrop-blur-[2px]",
            "shadow-[0_1px_0_rgba(15,23,42,0.04)] dark:shadow-none",
          ].join(" ")}
        >
          <h3 className="text-xs font-black uppercase tracking-widest text-[color:var(--nav-text)]">
            Canais de atendimento
          </h3>

          <div className="mt-3 space-y-3">
            <Motion delay={80}>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center ring-1 ring-black/5">
                  <Mail size={18} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-black text-[color:var(--nav-text)]">E-mail</p>

                  <p className="text-sm text-[color:var(--nav-muted)] break-words">
                    davicunhap2@gmail.com
                  </p>

                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[color:var(--nav-muted-2)]">
                    Resposta em até 1 dia útil
                  </p>
                </div>
              </div>
            </Motion>

            <Motion delay={120}>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-2xl bg-violet-600 text-white flex items-center justify-center ring-1 ring-black/5">
                  <Phone size={18} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-black text-[color:var(--nav-text)]">Telefone</p>

                  <p className="text-sm text-[color:var(--nav-muted)]">
                    (65) 0000-0000
                  </p>

                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[color:var(--nav-muted-2)]">
                    Seg–Sex • 08:00–18:00
                  </p>
                </div>
              </div>
            </Motion>
          </div>
        </div>
      </Motion>
    </div>
  );
};
