import { Subject } from 'rxjs';
import { map, distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';
import { petState$, petStateActions } from '../state/pet.state';
import { petService } from '../services/pet.service';
import type { Pet } from '../models/pet.model';
import { uiActions } from '../state/ui.state';

const searchTrigger$ = new Subject<void>();

export const petFacade = {
  pets$: petState$.pipe(map(state => state.pets), distinctUntilChanged()),
  loading$: petState$.pipe(map(state => state.loading), distinctUntilChanged()),
  pagination$: petState$.pipe(map(state => state.pagination), distinctUntilChanged()),
  filters$: petState$.pipe(map(state => state.filters), distinctUntilChanged()),

  initialize() {
    searchTrigger$.pipe(
      debounceTime(300),
      switchMap(() => {
        const { filters } = petState$.getValue();
        petStateActions.updateState({ loading: true });
        return petService.getPets(filters.page, filters.nome, filters.raca);
      })
    ).subscribe({
      next: (data) => {
        petStateActions.updateState({
          pets: data.content,
          pagination: {
            currentPage: data.page,
            totalPages: data.pageCount,
            totalItems: data.total
          },
          loading: false
        });
      },
      error: () => petStateActions.updateState({ loading: false })
    });
  },

  loadPets() {
    searchTrigger$.next();
  },

  setFilters(nome: string, raca: string) {
    const current = petState$.getValue().filters;
    petStateActions.updateState({ 
      filters: { ...current, nome, raca, page: 0 } 
    });
    this.loadPets();
  },

  changePage(page: number) {
    const current = petState$.getValue().filters;
    petStateActions.updateState({ 
      filters: { ...current, page } 
    });
    this.loadPets();
  },

  async savePet(petData: any, file?: File | null, petId?: number) {
    petStateActions.updateState({ loading: true, error: null });
    
    try {
      let savedPet: Pet;
      
      const { id, foto, ...payload } = petData;

      if (petId) {
        savedPet = await petService.updatePet(petId, payload);
      } else {
        savedPet = await petService.createPet(payload);
      }
      
      if (file && savedPet.id) {
        await petService.uploadFoto(savedPet.id, file);
      }
      
      uiActions.notify('Registro processado com sucesso!', 'success');
      this.loadPets();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Falha ao sincronizar com o servidor.';
      petStateActions.updateState({ loading: false, error: errorMsg });
      
      uiActions.notify(errorMsg, 'error');
      throw err;
    }
  },

  async deletePet(id: number) {
    petStateActions.updateState({ loading: true });
    try {
      await petService.deletePet(id);
      this.loadPets();
    } catch (err) {
      petStateActions.updateState({ loading: false, error: 'Erro ao excluir' });
    }
  }
};