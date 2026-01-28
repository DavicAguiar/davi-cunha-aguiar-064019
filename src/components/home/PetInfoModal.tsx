import React from "react";
import { X } from "lucide-react";
import type { Pet } from "../../models/pet.model";

type Props = {
  isOpen: boolean;
  pet: Pet | null;
  onClose: () => void;
};

export const PetInfoModal: React.FC<Props> = ({ isOpen, pet, onClose }) => {
  if (!isOpen || !pet) return null;

  return (
    <div
      className="fixed inset-0 z-[120] backdrop-blur-sm flex items-center justify-center p-4
                 bg-[color:var(--modal-overlay)]"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-xl rounded-[2rem] overflow-hidden border shadow-2xl
                   bg-[color:var(--modal-bg)] border-[color:var(--modal-border)]
                   text-[color:var(--modal-text)]"
      >
        <div className="relative px-6 py-5 border-b border-[color:var(--modal-border)] bg-[image:var(--modal-header-bg)]">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 rounded-xl p-2 transition-colors
                       text-[color:var(--modal-muted-2)]
                       hover:bg-[color:var(--modal-ghost-hover-bg)]"
            aria-label="Fechar"
            type="button"
          >
            <X size={22} strokeWidth={1.5} />
          </button>

          <h3 className="text-2xl font-black tracking-tight">
            Detalhes do <span className="text-emerald-600">Pet</span>
          </h3>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] mt-1 text-[color:var(--modal-muted-2)]">
            Visualização somente leitura
          </p>
        </div>

        <div className="p-6 space-y-4">
          <InfoRow label="Nome" value={pet.nome} />
          <InfoRow label="Raça" value={pet.raca || "S.R.D"} />
          <InfoRow label="Idade" value={`${pet.idade} anos`} />

          {pet.foto?.url ? (
            <div className="pt-2">
              <div className="text-[10px] font-black uppercase tracking-widest mb-2 text-[color:var(--modal-muted-2)]">
                Foto
              </div>
              <div className="rounded-2xl overflow-hidden border border-[color:var(--modal-border)]">
                <img
                  src={pet.foto.url}
                  alt={`Foto do pet ${pet.nome}`}
                  className="w-full h-56 object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          ) : null}
        </div>

        <div className="p-6 pt-0">
          <button
            onClick={onClose}
            type="button"
            className="w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em]
                       bg-[color:var(--primary)] text-white hover:bg-[color:var(--primary-hover)]
                       transition active:scale-95
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div
    className="rounded-2xl border px-4 py-3
               border-[color:var(--modal-border)]
               bg-[color:var(--modal-bg)]"
  >
    <div className="text-[10px] font-black uppercase tracking-widest text-[color:var(--modal-muted-2)]">
      {label}
    </div>
    <div className="font-semibold whitespace-normal break-words text-[color:var(--modal-text)]">{value}</div>
  </div>
);
