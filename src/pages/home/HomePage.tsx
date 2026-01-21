import React, { useEffect, useState } from 'react';
import { petFacade } from '../../facades/pet.facade';
import { PetFilters } from '../../components/home/PetFilters';
import { PetCard } from '../../components/home/PetCard';
import { PetFormModal } from '../../components/home/PetFormModal';
import { Pagination } from '../../components/home/Pagination';
import type { Pet, PetState } from '../../models/pet.model';
import { DeletePetModal } from '../../components/home/DeletePetModal';

export const HomePage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PetState['pagination']>({
    currentPage: 0, totalPages: 0, totalItems: 0
  });
  const [filters, setFilters] = useState<PetState['filters']>({ nome: '', raca: '', page: 0 });

  const handleEdit = (pet: Pet) => {
    setSelectedPet(pet);
    setIsFormOpen(true);
  };

  const handleDeleteTrigger = (pet: Pet) => {
    setSelectedPet(pet);
    setIsDeleteOpen(true);
  };

  useEffect(() => {
    petFacade.initialize();

    const subs = [
      petFacade.pets$.subscribe(setPets),
      petFacade.loading$.subscribe(setLoading),
      petFacade.filters$.subscribe(setFilters),
      petFacade.pagination$.subscribe(setPagination)
    ];

    petFacade.loadPets();

    return () => subs.forEach(s => s.unsubscribe());
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-8 pt-10">
     <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter">Painel de Pets</h2>
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

      <PetFilters filters={filters} />
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <div className="w-12 h-12 border-4 border-slate-100 border-t-emerald-600 rounded-full animate-spin"></div>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sincronizando...</span>
        </div>
      ) : (
        <>
          {pets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {pets.map(pet => (
                <PetCard 
                  key={pet.id} 
                  pet={pet} 
                  onEdit={() => handleEdit(pet)} 
                  onDelete={() => handleDeleteTrigger(pet)} 
                />
              ))}
            </div>
          ) : (
            <div className="py-40 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
              <p className="text-slate-300 font-bold uppercase text-xs tracking-widest">Nenhum pet encontrado com esses filtros</p>
            </div>
          )}
          
          <Pagination pagination={pagination} />
        </>
      )}

      <PetFormModal 
        isOpen={isFormOpen} 
        onClose={() => { setIsFormOpen(false); setSelectedPet(null); }} 
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