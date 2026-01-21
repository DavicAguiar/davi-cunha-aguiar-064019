import { BehaviorSubject } from 'rxjs';
import type { PetState } from '../models/pet.model';

const initialState: PetState = {
  pets: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 0,
    totalPages: 0,
    totalItems: 0
  },
  filters: { 
    nome: '', 
    raca: '',
    page: 0 
  }
};

export const petState$ = new BehaviorSubject<PetState>(initialState);

export const petStateActions = {
  updateState: (update: Partial<PetState>) => {
    const current = petState$.getValue();
    petState$.next({ ...current, ...update });
  }
};