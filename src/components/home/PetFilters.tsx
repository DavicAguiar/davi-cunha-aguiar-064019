import React, { useState } from "react";
import { petFacade } from "../../facades/pet.facade";
import type { PetState } from "../../models/pet.model";
import { Search } from "lucide-react";

interface PetFiltersProps {
  filters: PetState["filters"];
}

export const PetFilters: React.FC<PetFiltersProps> = ({ filters }) => {
  const [localNome, setLocalNome] = useState(filters.nome);
  const [localRaca, setLocalRaca] = useState(filters.raca);

  const handleSearch = () => {
    petFacade.setFilters(localNome, localRaca);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const labelCls =
    "text-[10px] font-black uppercase ml-2 tracking-tighter text-[color:var(--nav-muted-2)]";

  const inputBase =
    "w-full px-5 py-3.5 rounded-2xl outline-none transition-all " +
    "bg-[color:var(--nav-bg)] border border-[color:var(--nav-border)] " +
    "text-[color:var(--nav-text)] placeholder:text-[color:var(--nav-muted-2)] " +
    "focus:ring-2";

  return (
    <section
      className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-10 p-6 rounded-[2rem] items-end
                 bg-[color:var(--nav-bg)] border border-[color:var(--nav-border)]"
    >
      <div className="md:col-span-5 flex flex-col gap-1.5">
        <label className={labelCls}>Nome do Pet</label>
        <input
          type="text"
          placeholder="Ex: Luna..."
          className={`${inputBase} focus:ring-[color:var(--primary)]`}
          value={localNome}
          onChange={(e) => setLocalNome(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="md:col-span-5 flex flex-col gap-1.5">
        <label className={labelCls}>Raça</label>
        <input
          type="text"
          placeholder="Ex: Poodle..."
          className={`${inputBase} focus:ring-[color:var(--accent)]`}
          value={localRaca}
          onChange={(e) => setLocalRaca(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="md:col-span-2">
        <button
          type="button"
          onClick={handleSearch}
          className="w-full h-[54px] rounded-2xl flex items-center justify-center gap-2
                     bg-[color:var(--primary)] text-white
                     hover:bg-[color:var(--primary-hover)]
                     transition-all active:scale-95 cursor-pointer
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]"
        >
          <Search className="w-5 h-5 stroke-[2.5px]" />
          <span className="text-[10px] font-black uppercase tracking-widest">Filtrar</span>
        </button>
      </div>
    </section>
  );
};
