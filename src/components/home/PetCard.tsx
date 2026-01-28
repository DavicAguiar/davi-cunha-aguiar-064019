import React from "react";
import type { Pet } from "../../models/pet.model";
import { Trash2, Eye, Dog } from "lucide-react";

export const PetCard: React.FC<{ pet: Pet; onEdit: () => void; onDelete: () => void }> = ({
  pet,
  onEdit,
  onDelete,
}) => {
  return (
    <article
      className={[
        "group relative rounded-[2.5rem] border p-4 transition-all duration-500 hover:-translate-y-1",
        "bg-[color:var(--nav-bg)] border-[color:var(--nav-border)]",
      ].join(" ")}
    >
      <button
        onClick={onDelete}
        className={[
          "absolute top-6 right-6 z-10 w-10 h-10 rounded-full",
          "backdrop-blur flex items-center justify-center",
          "transition-all opacity-0 group-hover:opacity-100 hover:scale-110",
          "border border-[color:var(--nav-border)]",
          "bg-[color:var(--nav-bg)]/90",
          "text-[color:var(--nav-muted)] hover:text-red-500",
          "cursor-pointer",
        ].join(" ")}
        aria-label="Excluir pet"
        type="button"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <div
        className={[
          "aspect-square rounded-[2rem] overflow-hidden mb-5 relative",
          "border border-[color:var(--nav-border)]",
          "bg-[color:var(--nav-bg)]",
        ].join(" ")}
      >
        {pet.foto?.url ? (
          <img
            src={pet.foto.url}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            alt={pet.nome}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-emerald-500/10 text-emerald-400">
            <Dog className="w-16 h-16 stroke-[1.5]" />
          </div>
        )}

        <div
          className={[
            "absolute bottom-3 left-3 max-w-[75%] px-3 py-1 rounded-full truncate",
            "text-[10px] font-black uppercase",
            "border border-[color:var(--nav-border)]",
            "bg-[color:var(--nav-bg)]/90 backdrop-blur",
            "text-emerald-600",
          ].join(" ")}
          title={pet.raca || "S.R.D"}
        >
          {pet.raca || "S.R.D"}
        </div>
      </div>

      <div className="px-2">
        <h3
          className="text-2xl font-black mb-1 leading-none tracking-tight truncate text-[color:var(--nav-text)]"
          title={pet.nome}
        >
          {pet.nome}
        </h3>

        <p className="text-xs font-bold uppercase mb-6 tracking-widest text-[color:var(--nav-muted)]">
          {pet.idade} Anos
        </p>

        <button
          onClick={onEdit}
          type="button"
          className={[
            "w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em]",
            "transition-all flex items-center justify-center gap-2 cursor-pointer",
            "bg-[color:var(--primary)] text-white",
            "hover:bg-[color:var(--primary-hover)]",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]",
            "active:scale-95",
          ].join(" ")}
        >
          <Eye className="w-4 h-4" />
          Detalhes do Perfil
        </button>
      </div>
    </article>
  );
};
