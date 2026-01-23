import React, { useEffect, useState } from "react";
import { Eye, PawPrint } from "lucide-react";
import type { Pet } from "../../models/pet.model";
import { tutorFacade } from "../../facades/tutor.facade";

type Props = {
  tutorId?: number;
  onManageClick: () => void;
  onViewPet: (pet: Pet) => void;
};

export const TutorLinkedPetsPreview: React.FC<Props> = ({ tutorId, onManageClick, onViewPet }) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!tutorId) return;

    const load = async () => {
      setLoading(true);
      try {
        const linked = await tutorFacade.getLinkedPets(tutorId);
        setPets(linked);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [tutorId]);

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <PawPrint className="w-4 h-4 text-emerald-600" />
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Pets vinculados</h4>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mt-1">
            {loading ? "Carregando..." : pets.length ? `${pets.length} vínculo(s)` : "Nenhum pet vinculado"}
          </p>
        </div>

        <button
          type="button"
          onClick={onManageClick}
          disabled={!tutorId}
          className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-emerald-500 hover:text-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed"
          title={!tutorId ? "Salve o tutor primeiro para gerenciar vínculos" : undefined}
        >
          Gerenciar
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {pets.slice(0, 3).map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
            <div className="min-w-0">
              <p className="font-black text-slate-800 truncate">{p.nome}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {p.raca || "S.R.D"} • {p.idade} anos
              </p>
            </div>

            <button
              type="button"
              onClick={() => onViewPet(p)}
              className="ml-4 px-3 py-2 rounded-xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-violet-300 hover:text-violet-600 flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Ver
            </button>
          </div>
        ))}

        {pets.length > 3 ? (
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 pt-2">
            + {pets.length - 3} outro(s). Clique em <span className="text-emerald-600">Gerenciar</span>.
          </div>
        ) : null}
      </div>
    </div>
  );
};
