import React, { useEffect, useState } from "react";
import { Eye, PawPrint, Trash2, Loader2 } from "lucide-react";
import type { Pet } from "../../models/pet.model";
import { tutorFacade } from "../../facades/tutor.facade";
import { ConfirmModal } from "../global/modals/ConfirmModal";

type Props = {
  tutorId?: number;
  onManageClick: () => void;
  onViewPet: (pet: Pet) => void;
};

export const TutorLinkedPetsPreview: React.FC<Props> = ({ tutorId, onManageClick, onViewPet }) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmPet, setConfirmPet] = useState<Pet | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const confirmRemove = (pet: Pet) => setConfirmPet(pet);

  const removeLink = async () => {
    if (!tutorId || !confirmPet) return;
    setBusyId(confirmPet.id);
    try {
      await tutorFacade.desvincularPet(tutorId, confirmPet.id);
      const linked = await tutorFacade.getLinkedPets(tutorId);
      setPets(linked);
    } finally {
      setBusyId(null);
      setConfirmPet(null);
    }
  };

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
    <div className="rounded-3xl border border-[color:var(--nav-border)] bg-[color:var(--nav-bg)] p-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <PawPrint className="w-4 h-4 text-emerald-600" />
            <h4 className="text-sm font-black uppercase tracking-widest text-[color:var(--nav-text)]">
              Pets vinculados
            </h4>
          </div>

          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[color:var(--nav-muted-2)] mt-1">
            {loading ? "Carregando..." : pets.length ? `${pets.length} vínculo(s)` : "Nenhum pet vinculado"}
          </p>
        </div>

        <button
          type="button"
          onClick={onManageClick}
          disabled={!tutorId}
          className="px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition
            bg-[color:var(--nav-bg)] border-[color:var(--nav-border)]
            text-[color:var(--nav-muted)]
            hover:bg-[color:var(--modal-ghost-hover-bg)] hover:text-[color:var(--nav-text)]
            disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          title={!tutorId ? "Salve o tutor primeiro para gerenciar vínculos" : undefined}
        >
          Gerenciar
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {pets.slice(0, 3).map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 overflow-hidden
              border-[color:var(--nav-border)] bg-[color:var(--nav-bg)]"
          >
            <div className="min-w-0">
              <p className="font-black truncate text-[color:var(--nav-text)]">{p.nome}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest truncate text-[color:var(--nav-muted-2)]">
                {p.raca || "S.R.D"} • {p.idade} anos
              </p>
            </div>

            <div className="ml-4 flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onViewPet(p)}
                className="px-3 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition
                  bg-[color:var(--nav-bg)] border-[color:var(--nav-border)]
                  text-[color:var(--nav-muted)]
                  hover:border-violet-300 hover:text-violet-600 flex items-center gap-2 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                Ver
              </button>

              <button
                type="button"
                onClick={() => confirmRemove(p)}
                className="w-10 h-10 rounded-xl border transition flex items-center justify-center
                  bg-[color:var(--nav-bg)] border-[color:var(--nav-border)]
                  text-[color:var(--nav-muted)]
                  hover:border-red-200 hover:text-red-600 cursor-pointer"
                aria-label={`Desvincular ${p.nome}`}
                title="Desvincular"
              >
                {busyId === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}

        {pets.length > 3 ? (
          <div className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--nav-muted-2)] pt-2">
            + {pets.length - 3} outro(s). Clique em <span className="text-emerald-600">Gerenciar</span>.
          </div>
        ) : null}
      </div>

      <ConfirmModal
        open={!!confirmPet}
        title="Remover vínculo"
        description={`Deseja desvincular o pet "${confirmPet?.nome}" deste tutor?`}
        confirmText="Desvincular"
        onCancel={() => setConfirmPet(null)}
        onConfirm={removeLink}
      />
    </div>
  );
};
