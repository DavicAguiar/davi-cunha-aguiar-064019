import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import type { TutorState } from "../../models/tutor.model";
import { tutorFacade } from "../../facades/tutor.facade";

interface TutorFiltersProps {
  filters: TutorState["filters"];
}

export const TutorFilters: React.FC<TutorFiltersProps> = ({ filters }) => {
  const [localNome, setLocalNome] = useState(filters.nome);

  useEffect(() => setLocalNome(filters.nome), [filters.nome]);

  const handleSearch = () => tutorFacade.setFilters(localNome);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const labelCls =
    "text-[10px] font-black uppercase ml-2 tracking-tighter text-[color:var(--nav-muted-2)]";

  const inputCls =
    "px-5 py-3.5 rounded-2xl outline-none transition-all font-semibold " +
    "bg-[color:var(--nav-bg)] border border-[color:var(--nav-border)] " +
    "text-[color:var(--nav-text)] placeholder:text-[color:var(--nav-muted-2)] " +
    "focus:ring-2 focus:ring-[color:var(--primary)]";

  return (
    <section
      className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-10 p-6 rounded-[2rem] items-end
                 bg-[color:var(--nav-bg)] border border-[color:var(--nav-border)]"
    >
      <div className="md:col-span-10 flex flex-col gap-1.5">
        <label className={labelCls}>Nome do Tutor</label>
        <input
          type="text"
          placeholder="Ex: Maria..."
          className={inputCls}
          value={localNome}
          onChange={(e) => setLocalNome(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="md:col-span-2">
        <button
          type="button"
          onClick={handleSearch}
          className="w-full h-[54px] rounded-2xl flex items-center justify-center gap-2
                     bg-[color:var(--primary)] text-white hover:bg-[color:var(--primary-hover)]
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
