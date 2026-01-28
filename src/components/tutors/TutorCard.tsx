import React from "react";
import type { Tutor } from "../../models/tutor.model";
import { Trash2, Eye, User } from "lucide-react";
import { formatCpf } from "../../utils/format";

export const TutorCard: React.FC<{
  tutor: Tutor;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ tutor, onEdit, onDelete }) => {
  return (
    <article className="group relative rounded-[2.5rem] border p-4 transition-all duration-500 hover:-translate-y-1
      bg-[color:var(--nav-bg)] border-[color:var(--nav-border)]">
      <button
        type="button"
        onClick={onDelete}
        className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full
          bg-[color:var(--nav-bg)]/90 backdrop-blur
          border border-[color:var(--nav-border)]
          text-[color:var(--nav-muted)] hover:text-red-500
          opacity-0 group-hover:opacity-100 transition-all flex
          items-center justify-center hover:scale-110 cursor-pointer"
        aria-label="Excluir tutor"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <div className="aspect-square rounded-[2rem] overflow-hidden mb-5 relative flex items-center justify-center
        border border-[color:var(--nav-border)] bg-[color:var(--nav-bg)]">
        {tutor.foto?.url ? (
          <img
            src={tutor.foto.url}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            alt={tutor.nome}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-emerald-500/10 text-emerald-400">
            <User className="w-16 h-16 stroke-[1.5]" />
          </div>
        )}

        <div className="absolute bottom-3 left-3 max-w-[75%] px-3 py-1 rounded-full truncate
            text-[10px] font-black uppercase
            border border-[color:var(--nav-border)]
            bg-[color:var(--nav-bg)]/90 backdrop-blur
            text-emerald-600"
          title={`CPF: ${formatCpf(tutor.cpf)}`}
        >
          CPF: {formatCpf(tutor.cpf)}
        </div>
      </div>

      <div className="px-2">
        <h3 className="text-2xl font-black mb-1 leading-none tracking-tight truncate text-[color:var(--nav-text)]"
          title={tutor.nome}
          >
          {tutor.nome}
        </h3>

        <p className="text-xs font-bold uppercase mb-1 tracking-widest truncate text-[color:var(--nav-muted)]"
          title={tutor.email || "—"}
          >
          {tutor.email || "—"}
        </p>

        <p className="text-[10px] font-bold uppercase mb-6 tracking-widest truncate text-[color:var(--nav-muted)]"
          title={tutor.telefone || "—"}
        >
          Tel: {tutor.telefone || "—"}
        </p>

        <button
          type="button"
          onClick={onEdit}
          className="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em]
            bg-[color:var(--primary)] text-white hover:bg-[color:var(--primary-hover)]
            transition-all flex items-center justify-center gap-2
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]
            active:scale-95 cursor-pointer"
        >
          <Eye className="w-4 h-4" />
          Detalhes do Tutor
        </button>
      </div>
    </article>
  );
};
