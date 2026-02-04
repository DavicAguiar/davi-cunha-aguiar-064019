import React from "react";

const Motion: React.FC<{ delay?: number; children: React.ReactNode }> = ({ delay = 0, children }) => (
  <div className="opacity-0 translate-y-2 animate-[legal-in_220ms_ease-out_forwards]" style={{ animationDelay: `${delay}ms` }}>
    {children}
  </div>
);

export const TermsOfUseContent: React.FC = () => {
  return (
    <div className="space-y-4 text-[color:var(--modal-text)]">
      <Motion delay={0}>
        <p className="text-sm font-bold text-[color:var(--modal-text)]">Informações do sistema.</p>
      </Motion>

      <Motion delay={40}>
        <div className="rounded-2xl border p-4
          border-[color:var(--modal-border)]"
        >
          <h3 className="text-xs font-black uppercase tracking-widest text-[color:var(--modal-text)]">
            1. Objetivo do sistema
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-[color:var(--modal-muted)]">
            O sistema Pet tem como finalidade o gerenciamento de pets, permitindo cadastro, consulta, atualização e remoção de registros.
          </p>
        </div>
      </Motion>

      <Motion delay={80}>
        <div className="rounded-2xl border p-4 border-[color:var(--modal-border)] bg-[color:var(--modal-bg)]">
          <h3 className="text-xs font-black uppercase tracking-widest text-[color:var(--modal-text)]">
            2. Uso adequado
          </h3>

          <ul className="mt-2 list-disc pl-5 text-sm space-y-1 text-[color:var(--modal-muted)]">
            <li>Não inserir dados maliciosos ou conteúdo indevido.</li>
            <li>Respeitar políticas internas e boas práticas de segurança.</li>
            <li>Manter as credenciais sob responsabilidade do usuário.</li>
          </ul>
        </div>
      </Motion>

      <Motion delay={120}>
        <div className="rounded-2xl border p-4 border-[color:var(--modal-border)] bg-[color:var(--modal-bg)]">
          <h3 className="text-xs font-black uppercase tracking-widest text-[color:var(--modal-text)]">
            3. Privacidade
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-[color:var(--modal-muted)]">
            Os dados exibidos neste projeto são apenas para demonstração. Em produção, aplique LGPD e normas aplicáveis.
          </p>

          <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[color:var(--modal-muted-2)]">
            Última atualização: 01/2026
          </p>
        </div>
      </Motion>
    </div>
  );
};
