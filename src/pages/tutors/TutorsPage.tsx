import React, { useEffect, useState } from 'react';
import type { Tutor, TutorState } from '../../models/tutor.model';
import { tutorFacade } from '../../facades/tutor.facade';

import { TutorFilters } from '../../components/tutors/TutorFilters';
import { TutorCard } from '../../components/tutors/TutorCard';
import { TutorFormModal } from '../../components/tutors/TutorFormModal';
import { DeleteTutorModal } from '../../components/tutors/DeleteTutorModal';
import { Pagination } from '../../components/home/Pagination';

export const TutorsPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);

  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState<TutorState['pagination']>({
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
  });

  const [filters, setFilters] = useState<TutorState['filters']>({ nome: '', page: 0 });

  const handleEdit = (tutor: Tutor) => {
    setSelectedTutor(tutor);
    setIsFormOpen(true);
  };

  const handleDeleteTrigger = (tutor: Tutor) => {
    setSelectedTutor(tutor);
    setIsDeleteOpen(true);
  };

  useEffect(() => {
    tutorFacade.initialize();

    const subs = [
      tutorFacade.tutores$.subscribe(setTutores),
      tutorFacade.loading$.subscribe(setLoading),
      tutorFacade.pagination$.subscribe(setPagination),
      tutorFacade.filters$.subscribe(setFilters),
    ];

    tutorFacade.loadTutores();

    return () => subs.forEach(s => s.unsubscribe());
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-8 pt-10">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter">Tutores</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-2">
            Secretaria de Estado de Planejamento e Gestão (SEPLAG)
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-2"
        >
          <span className="text-xl leading-none">+</span> Novo Registro
        </button>
      </header>

      <TutorFilters filters={filters} />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <div className="w-12 h-12 border-4 border-slate-100 border-t-emerald-600 rounded-full animate-spin"></div>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sincronizando...</span>
        </div>
      ) : (
        <>
          {tutores.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {tutores.map(tutor => (
                <TutorCard
                  key={tutor.id}
                  tutor={tutor}
                  onEdit={() => handleEdit(tutor)}
                  onDelete={() => handleDeleteTrigger(tutor)}
                />
              ))}
            </div>
          ) : (
            <div className="py-40 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
              <p className="text-slate-300 font-bold uppercase text-xs tracking-widest">
                Nenhum tutor encontrado com esses filtros
              </p>
            </div>
          )}

          <Pagination
            pagination={{ currentPage: pagination.currentPage, totalPages: pagination.totalPages }}
            onChangePage={(p) => tutorFacade.changePage(p)}
          />
        </>
      )}

      <TutorFormModal
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setSelectedTutor(null); }}
        tutorToEdit={selectedTutor}
      />

      <DeleteTutorModal
        isOpen={isDeleteOpen}
        onClose={() => { setIsDeleteOpen(false); setSelectedTutor(null); }}
        tutorToDelete={selectedTutor}
      />
    </div>
  );
};