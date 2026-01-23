import React from "react";

const Motion: React.FC<{ delay?: number; children: React.ReactNode }> = ({ delay = 0, children }) => (
  <div
    className="opacity-0 translate-y-2 animate-[legal-in_220ms_ease-out_forwards]"
    style={{ animationDelay: `${delay}ms` }}
  >
    {children}
  </div>
);

export const TermsOfUseContent: React.FC = () => {
  return (
    <div className="space-y-4">
      <Motion delay={0}>
        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
          Informações do sistema.
        </p>
      </Motion>

      <Motion delay={40}>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800
                        bg-gradient-to-br from-white to-emerald-50/30
                        dark:from-slate-900 dark:to-emerald-900/10 p-4">
          <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">
            1. Objetivo do sistema
          </h3>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
            O sistema Pet tem como finalidade o gerenciamento de pets, permitindo cadastro, consulta,
            atualização e remoção de registros.
          </p>
        </div>
      </Motion>

      <Motion delay={80}>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">
            2. Uso adequado
          </h3>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 dark:text-slate-200 space-y-1">
            <li>Não inserir dados maliciosos ou conteúdo indevido.</li>
            <li>Respeitar políticas internas e boas práticas de segurança.</li>
            <li>Manter as credenciais sob responsabilidade do usuário.</li>
          </ul>
        </div>
      </Motion>

      <Motion delay={120}>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">
            3. Privacidade
          </h3>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
            Os dados exibidos neste projeto são apenas para demonstração. Em produção, aplique LGPD e
            normas aplicáveis.
          </p>
          <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
            Última atualização: 01/2026
          </p>
        </div>
      </Motion>
    </div>
  );
};
