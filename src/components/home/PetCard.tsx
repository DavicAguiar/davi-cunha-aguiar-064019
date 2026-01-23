import React from 'react';
import type { Pet } from '../../models/pet.model';
import { Trash2, Eye, Dog } from 'lucide-react';

export const PetCard: React.FC<{ pet: Pet; onEdit: () => void; onDelete: () => void }> = ({ pet, onEdit, onDelete }) => {
  return (
    <article className="group bg-white rounded-[2.5rem] border border-slate-100 p-4 hover:shadow-2xl hover:shadow-emerald-600/10 transition-all duration-500 hover:-translate-y-1">
      <button 
        onClick={onDelete}
        className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/90 backdrop-blur rounded-full shadow-sm text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center border border-slate-100 hover:scale-110"
        aria-label="Excluir pet"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <div className="aspect-square rounded-[2rem] bg-slate-100 overflow-hidden mb-5 relative shadow-inner">
        {pet.foto?.url ? (
          <img src={pet.foto.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={pet.nome} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-200">
            <Dog className="w-16 h-16 stroke-[1.5]" />
          </div>
        )}
        <div className="absolute bottom-3 left-3 max-w-[75%] bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase text-emerald-600 shadow-sm truncate"
          title={pet.raca || 'S.R.D'}
        >
          {pet.raca || 'S.R.D'}
        </div>
      </div>
      
      <div className="px-2">
        <h3 className="text-2xl font-black text-slate-800 mb-1 leading-none tracking-tight truncate" title={pet.nome}>
          {pet.nome}
        </h3>

        <p className="text-xs font-bold text-slate-400 uppercase mb-6 tracking-widest">
          {pet.idade} Anos
        </p>
        
        <button 
          onClick={onEdit}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-violet-600 transition-all shadow-lg flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          Detalhes do Perfil
        </button>
      </div>
    </article>
  );
};