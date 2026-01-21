import React from 'react';
import { petFacade } from '../../facades/pet.facade';
import type { PetState } from '../../models/pet.model';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  pagination: PetState['pagination'];
}

export const Pagination: React.FC<PaginationProps> = ({ pagination }) => {
  const { currentPage, totalPages } = pagination;

  const pages = Array.from({ length: totalPages }, (_, i) => i);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-12 pb-10">
      <button
        disabled={currentPage === 0}
        onClick={() => petFacade.changePage(currentPage - 1)}
        className="w-12 h-12 flex items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 hover:text-emerald-600 hover:border-emerald-200 disabled:opacity-30 disabled:hover:text-slate-400 transition-all shadow-sm"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex gap-1 bg-slate-100 p-1.5 rounded-[2rem] border border-slate-200">
        {pages.map(page => (
          <button
            key={page}
            onClick={() => petFacade.changePage(page)}
            className={`w-11 h-11 rounded-full text-xs font-black transition-all ${
              currentPage === page 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 scale-110' 
                : 'text-slate-400 hover:text-slate-800 hover:bg-white'
            }`}
          >
            {page + 1}
          </button>
        ))}
      </div>

      <button
        disabled={currentPage === totalPages - 1}
        onClick={() => petFacade.changePage(currentPage + 1)}
        className="w-12 h-12 flex items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 hover:text-emerald-600 hover:border-emerald-200 disabled:opacity-30 disabled:hover:text-slate-400 transition-all shadow-sm"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};