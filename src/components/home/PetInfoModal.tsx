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
    <div className="fixed inset-0 z-[120] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-[2rem] shadow-2xl overflow-hidden">
        <div className="relative px-6 py-5 border-b border-slate-100">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-300 hover:text-red-500 transition-colors"
            aria-label="Fechar"
          >
            <X size={22} strokeWidth={1.5} />
          </button>

          <h3 className="text-2xl font-black text-slate-800 tracking-tight">
            Detalhes do <span className="text-emerald-600">Pet</span>
          </h3>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mt-1">
            Visualização somente leitura
          </p>
        </div>

        <div className="p-6 space-y-4">
          <InfoRow label="Nome" value={pet.nome} />
          <InfoRow label="Raça" value={pet.raca || "S.R.D"} />
          <InfoRow label="Idade" value={`${pet.idade} anos`} />

          {pet.foto?.url ? (
            <div className="pt-2">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Foto</div>
              <div className="rounded-2xl overflow-hidden border border-slate-100">
                <img src={pet.foto.url} alt={`Foto do pet ${pet.nome}`} className="w-full h-56 object-cover" />
              </div>
            </div>
          ) : null}
        </div>

        <div className="p-6 pt-0">
          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:opacity-95"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</div>
    <div className="text-slate-800 font-semibold whitespace-normal break-words">{value}</div>
  </div>
);
