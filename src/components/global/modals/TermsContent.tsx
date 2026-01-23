import React from "react";

export const TermsOfUseContent: React.FC = () => {
  return (
    <div className="space-y-4">
      <p className="text-sm font-bold text-slate-800">
        Informações do sistema.
      </p>

      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-emerald-50/30 p-4">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
          1. Objetivo do sistema
        </h3>
        <p className="mt-2 text-sm text-slate-700 leading-relaxed">
          O sistema Pet tem como finalidade o gerenciamento de pets, permitindo cadastro, consulta,
          atualização e remoção de registros.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
          2. Uso adequado
        </h3>
        <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
          <li>Não inserir dados maliciosos ou conteúdo indevido.</li>
          <li>Respeitar políticas internas e boas práticas de segurança.</li>
          <li>Manter as credenciais sob responsabilidade do usuário.</li>
        </ul>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
          3. Privacidade
        </h3>
        <p className="mt-2 text-sm text-slate-700 leading-relaxed">
          Os dados exibidos neste projeto são apenas para demonstração. Em produção, aplique LGPD e
          normas aplicáveis.
        </p>
        <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
          Última atualização: 01/2026
        </p>
      </div>
    </div>
  );
};
