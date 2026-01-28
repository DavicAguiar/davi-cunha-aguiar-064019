import React, { useEffect, useMemo, useRef, useState } from "react";
import { petFacade } from "../../facades/pet.facade";
import { PetFilters } from "../../components/home/PetFilters";
import { PetCard } from "../../components/home/PetCard";
import { PetFormModal } from "../../components/home/PetFormModal";
import { Pagination } from "../../components/global/Pagination";
import type { Pet, PetState } from "../../models/pet.model";
import { DeletePetModal } from "../../components/home/DeletePetModal";
import { Plus } from "lucide-react";

export const HomePage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);
  const listTopRef = useRef<HTMLDivElement | null>(null);
  const contentBoxRef = useRef<HTMLDivElement | null>(null);
  const [minHeight, setMinHeight] = useState<number | undefined>(undefined);
  const [pagination, setPagination] = useState<PetState["pagination"]>({
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
  });
  const [filters, setFilters] = useState<PetState["filters"]>({ nome: "", raca: "", page: 0 });

  const prefersReducedMotion = useMemo(() => {
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  const scrollToListTop = () => {
    const el = listTopRef.current;
    if (!el) return;

    el.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const handleEdit = (pet: Pet) => {
    setSelectedPet(pet);
    setIsFormOpen(true);
  };

  const handleDeleteTrigger = (pet: Pet) => {
    setSelectedPet(pet);
    setIsDeleteOpen(true);
  };

  const handleChangePage = (p: number) => {
    scrollToListTop();

    petFacade.changePage(p);
  };

  useEffect(() => {
    petFacade.initialize();

    const subs = [
      petFacade.pets$.subscribe(setPets),
      petFacade.loading$.subscribe(setLoading),
      petFacade.filters$.subscribe(setFilters),
      petFacade.pagination$.subscribe(setPagination),
    ];

    petFacade.loadPets();
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
            Painel de Pets
          </h2>

          <p className="text-xs font-bold uppercase tracking-[0.2em] mt-2 text-[color:var(--nav-muted)]">
            Secretaria de Estado de Planejamento e Gestão (SEPLAG)
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase
                     tracking-widest hover:bg-emerald-700
                     active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus size={18} strokeWidth={3} />
          Novo Registro
        </button>
      </header>

      <PetFilters filters={filters} />
      
      <div ref={contentBoxRef} className="relative" style={minHeight ? { minHeight } : undefined}>
        {loading ? (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-[3rem] backdrop-blur-[2px]">
            <div
              className="w-12 h-12 border-4 rounded-full animate-spin"
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
          {pets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {pets.map((pet) => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  onEdit={() => handleEdit(pet)}
                  onDelete={() => handleDeleteTrigger(pet)}
                />
              ))}
            </div>
          ) : (
            <div className="py-40 text-center border-2 border-dashed rounded-[3rem]
              border-[color:var(--nav-border)] bg-[color:var(--nav-bg)]"
            >
              <p className="font-bold uppercase text-xs tracking-widest text-[color:var(--nav-muted-2)]">
                Nenhum pet encontrado com esses filtros
              </p>
            </div>
          )}

          <Pagination pagination={pagination} onChangePage={handleChangePage} />
        </div>
      </div>

      <PetFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedPet(null);
        }}
        petToEdit={selectedPet}
      />

      <DeletePetModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedPet(null);
        }}
        petToDelete={selectedPet}
      />
    </div>
  );
};
