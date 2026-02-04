import { Subject } from "rxjs";
import { map, distinctUntilChanged, debounceTime, switchMap } from "rxjs/operators";
import { tutorState$, tutorStateActions } from "../state/tutor.state";
import { tutorService } from "../services/tutor.service";
import type { Tutor, TutorCreateUpdatePayload } from "../models/tutor.model";
import { uiActions } from "../state/ui.state";
import type { Pet } from "../models/pet.model";
import { petService } from "../services/pet.service";

type PetSearchParams = { nome?: string; page: number; size: number };
const searchTrigger$ = new Subject<void>();

export const tutorFacade = {
  tutores$: tutorState$.pipe(map(s => s.tutores), distinctUntilChanged()),
  loading$: tutorState$.pipe(map(s => s.loading), distinctUntilChanged()),
  pagination$: tutorState$.pipe(map(s => s.pagination), distinctUntilChanged()),
  filters$: tutorState$.pipe(map(s => s.filters), distinctUntilChanged()),

  initialize() {
    searchTrigger$
      .pipe(
        debounceTime(300),
        switchMap(() => {
          const { filters } = tutorState$.getValue();
          tutorStateActions.updateState({ loading: true, error: null });
          return tutorService.getTutores(filters.page, filters.nome);
        })
      )
      .subscribe({
        next: (data) => {
          tutorStateActions.updateState({
            tutores: data.content,
            pagination: {
              currentPage: data.page,
              totalPages: data.pageCount,
              totalItems: data.total
            },
            loading: false
          });
        },
        error: () => tutorStateActions.updateState({ loading: false })
      });
  },

  loadTutores() {
    searchTrigger$.next();
  },

  setFilters(nome: string) {
    const current = tutorState$.getValue().filters;
    tutorStateActions.updateState({
      filters: { ...current, nome, page: 0 }
    });
    this.loadTutores();
  },

  changePage(page: number) {
    const current = tutorState$.getValue().filters;
    tutorStateActions.updateState({
      filters: { ...current, page }
    });
    this.loadTutores();
  },

  async getTutorById(id: number): Promise<Tutor> {
    try {
      return await tutorService.getTutorById(id);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Falha ao buscar tutor.";
      uiActions.notify(msg, "error");
      throw err;
    }
  },

  async saveTutor(payload: TutorCreateUpdatePayload, file?: File | null, tutorId?: number) {
    tutorStateActions.updateState({ loading: true, error: null });

    try {
      const saved = tutorId
        ? await tutorService.updateTutor(tutorId, payload)
        : await tutorService.createTutor(payload);

      if (file && saved.id) {
        await tutorService.uploadFoto(saved.id, file);
      }

      uiActions.notify("Tutor processado com sucesso!", "success");
      this.loadTutores();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Falha ao sincronizar com o servidor.";
      tutorStateActions.updateState({ loading: false, error: msg });
      uiActions.notify(msg, "error");
      throw err;
    }
  },

  async deleteTutor(id: number) {
    tutorStateActions.updateState({ loading: true, error: null });

    try {
      await tutorService.deleteTutor(id);
      uiActions.notify("Tutor excluído com sucesso!", "success");
      this.loadTutores();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Erro ao excluir tutor.";
      tutorStateActions.updateState({ loading: false, error: msg });
      uiActions.notify(msg, "error");
      throw err;
    }
  },

  async vincularPet(tutorId: number, petId: number) {
    tutorStateActions.updateState({ loading: true, error: null });

    try {
      await tutorService.vincularPet(tutorId, petId);
      uiActions.notify("Pet vinculado ao tutor com sucesso!", "success");

      this.loadTutores();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Erro ao vincular pet.";

      tutorStateActions.updateState({ loading: false, error: msg });
      uiActions.notify(msg, "error");
      throw err;
    }
  },

  async getLinkedPets(tutorId: number): Promise<Pet[]> {
    if (!Number.isFinite(tutorId) || tutorId <= 0) return [];

    try {
      const tutor = await tutorService.getTutorById(tutorId);

      const pets = (tutor as any).pets ?? (tutor as any).petsVinculados ?? [];

      return Array.isArray(pets) ? pets : [];
    } catch (err: any) {
      const msg = err.response?.data?.message || "Falha ao carregar pets vinculados.";
      uiActions.notify(msg, "error");
      return [];
    }
  },

  async searchPetsToLink(params: PetSearchParams) {
    try {
      const resp = await petService.getPets(params.page, params.nome ?? '', '', params.size ?? 5);
      return resp;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Falha ao buscar pets para vincular.";
      uiActions.notify(msg, "error");
      
      return { content: [], page: 0, pageCount: 0, total: 0 };
    }
  },

  async desvincularPet(tutorId: number, petId: number) {
    tutorStateActions.updateState({ loading: true, error: null });

    try {
      await tutorService.desvincularPet(tutorId, petId);

      uiActions.notify("Vínculo removido com sucesso!", "success");
      this.loadTutores();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Erro ao remover vínculo.";
      
      tutorStateActions.updateState({ loading: false, error: msg });
      uiActions.notify(msg, "error");
      throw err;
    }
  }
};
