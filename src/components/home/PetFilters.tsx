import React, { useState } from 'react';
import { petFacade } from '../../facades/pet.facade';
import type { PetState } from '../../models/pet.model';
import { Search } from 'lucide-react';

interface PetFiltersProps {
  filters: PetState['filters'];
}

export const PetFilters: React.FC<PetFiltersProps> = ({ filters }) => {
  const [localNome, setLocalNome] = useState(filters.nome);
  const [localRaca, setLocalRaca] = useState(filters.raca);

  const handleSearch = () => {
    petFacade.setFilters(localNome, localRaca);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-10 p-6 bg-slate-50
     rounded-[2rem] border border-slate-100 items-end">
      <div className="md:col-span-5 flex flex-col gap-1.5">
        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-tighter">Nome do Pet</label>
        <input 
          type="text" 
          placeholder="Ex: Luna..." 
          className="px-5 py-3.5 bg-white border-none rounded-2xl shadow-sm focus:ring-2
           focus:ring-emerald-500 outline-none transition-all"
          value={localNome}
          onChange={(e) => setLocalNome(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="md:col-span-5 flex flex-col gap-1.5">
        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-tighter">Raça</label>
        <input 
          type="text" 
          placeholder="Ex: Poodle..." 
          className="px-5 py-3.5 bg-white border-none rounded-2xl 
          shadow-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all"
          value={localRaca}
          onChange={(e) => setLocalRaca(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="md:col-span-2">
        <button 
          onClick={handleSearch}
          className="w-full h-[54px] bg-slate-900 text-white
           rounded-2xl flex items-center justify-center gap-2 
           hover:bg-emerald-600 transition-all active:scale-95
            shadow-lg cursor-pointer"
        >
          <Search className="w-5 h-5 stroke-[2.5px]" /> 
          <span className="text-[10px] font-black uppercase tracking-widest">Filtrar</span>
        </button>
      </div>
    </section>
  );
};