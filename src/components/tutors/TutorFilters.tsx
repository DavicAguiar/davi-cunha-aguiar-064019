import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import type { TutorState } from '../../models/tutor.model';
import { tutorFacade } from '../../facades/tutor.facade';

interface TutorFiltersProps {
  filters: TutorState['filters'];
}

export const TutorFilters: React.FC<TutorFiltersProps> = ({ filters }) => {
  const [localNome, setLocalNome] = useState(filters.nome);

  useEffect(() => {
    setLocalNome(filters.nome);
  }, [filters.nome]);

  const handleSearch = () => tutorFacade.setFilters(localNome);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-10 p-6 bg-slate-50
     rounded-[2rem] border border-slate-100 items-end">
      <div className="md:col-span-10 flex flex-col gap-1.5">
        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-tighter">Nome do Tutor</label>
        <input
          type="text"
          placeholder="Ex: Maria..."
          className="px-5 py-3.5 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          value={localNome}
          onChange={(e) => setLocalNome(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="md:col-span-2">
        <button
          onClick={handleSearch}
          className="w-full h-[54px] bg-slate-900 text-white rounded-2xl
           flex items-center justify-center gap-2 hover:bg-emerald-600
            transition-all active:scale-95 shadow-lg cursor-pointer"
        >
          <Search className="w-5 h-5 stroke-[2.5px]" />
          <span className="text-[10px] font-black uppercase tracking-widest">Filtrar</span>
        </button>
      </div>
    </section>
  );
};
