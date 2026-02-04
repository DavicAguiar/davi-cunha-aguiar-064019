import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Tutor, TutorState } from "../../models/tutor.model";
import { tutorFacade } from "../../facades/tutor.facade";
import { TutorFilters } from "../../components/tutors/TutorFilters";
import { TutorCard } from "../../components/tutors/TutorCard";
import { TutorFormModal } from "../../components/tutors/TutorFormModal";
import { DeleteTutorModal } from "../../components/tutors/DeleteTutorModal";
import { Pagination } from "../../components/global/Pagination";
import { Plus } from "lucide-react";

export const TutorsPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);

  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState<TutorState["pagination"]>({
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
  });

  const [filters, setFilters] = useState<TutorState["filters"]>({ nome: "", page: 0 });

  const listTopRef = useRef<HTMLDivElement | null>(null);
  const contentBoxRef = useRef<HTMLDivElement | null>(null);
  const [minHeight, setMinHeight] = useState<number | undefined>(undefined);

  const prefersReducedMotion = useMemo(() => {
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  const scrollToListTop = () => {
    const el = listTopRef.current;
    if (!el) return;
    el.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
  };

  const handleChangePage = (p: number) => {
    scrollToListTop();
    tutorFacade.changePage(p);
  };

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

    return () => subs.forEach((s) => s.unsubscribe());
  }, []);

  useEffect(() => {
    if (loading) {
      const h = contentBoxRef.current?.getBoundingClientRect().height;
      if (h && h > 0) setMinHeight(h);
      return;
    }
    setMinHeight(undefined);
  }, [loading]);

  return (
    <div className="max-w-7xl mx-auto px-8 pt-10">
      <div ref={listTopRef} />
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-[color:var(--nav-text)]">
            Tutores
          </h2>

          <p className="text-xs font-bold uppercase tracking-[0.2em] mt-2 text-[color:var(--nav-muted)]">
            Secretaria de Estado de Planejamento e Gestão (SEPLAG)
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest
            bg-[color:var(--primary)] text-white
            hover:bg-[color:var(--primary-hover)]
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]
            active:scale-95 transition flex items-center gap-2 cursor-pointer"
        >
          <Plus size={18} strokeWidth={3} />
          Novo Registro
        </button>
      </header>

      <TutorFilters filters={filters} />

      <div ref={contentBoxRef} className="relative" style={minHeight ? { minHeight } : undefined}>
        {loading ? (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center py-40 gap-4 rounded-[3rem] backdrop-blur-[2px]">
            <div className="w-12 h-12 border-4 rounded-full animate-spin"
              style={{
                borderColor: "color-mix(in srgb, var(--nav-border) 55%, transparent)",
                borderTopColor: "var(--primary)",
              }}
              aria-label="Carregando"
            />
            <span className="text-[10px] font-black uppercase tracking-widest text-[color:var(--nav-muted-2)]">
              Sincronizando...
            </span>
          </div>
        ) : null}

        <div className={loading ? "opacity-50 pointer-events-none select-none" : ""}>
          {tutores.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {tutores.map((tutor) => (
                <TutorCard
                  key={tutor.id}
                  tutor={tutor}
                  onEdit={() => handleEdit(tutor)}
                  onDelete={() => handleDeleteTrigger(tutor)}
                />
              ))}
            </div>
          ) : (
            <div className="py-40 text-center border-2 border-dashed rounded-[3rem]
              border-[color:var(--nav-border)] bg-[color:var(--nav-bg)]"
            >
              <p className="font-bold uppercase text-xs tracking-widest text-[color:var(--nav-muted-2)]">
                Nenhum tutor encontrado com esses filtros
              </p>
            </div>
          )}

          <Pagination
            pagination={{ currentPage: pagination.currentPage, totalPages: pagination.totalPages }}
            onChangePage={handleChangePage}
          />
        </div>
      </div>

      <TutorFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedTutor(null);
        }}
        tutorToEdit={selectedTutor}
      />

      <DeleteTutorModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedTutor(null);
        }}
        tutorToDelete={selectedTutor}
      />
    </div>
  );
};
