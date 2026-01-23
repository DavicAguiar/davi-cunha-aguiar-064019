import { BehaviorSubject } from "rxjs";
import type { TutorState } from "../models/tutor.model";

const initialState: TutorState = {
  tutores: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 0,
    totalPages: 0,
    totalItems: 0
  },
  filters: {
    nome: "",
    page: 0
  }
};

export const tutorState$ = new BehaviorSubject<TutorState>(initialState);

export const tutorStateActions = {
  updateState: (update: Partial<TutorState>) => {
    const current = tutorState$.getValue();
    tutorState$.next({ ...current, ...update });
  }
};
