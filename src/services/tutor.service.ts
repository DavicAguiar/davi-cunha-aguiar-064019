import type { Pet } from "../models/pet.model";
import type {
  Tutor,
  TutorApiResponse,
  TutorCreateUpdatePayload
} from "../models/tutor.model";
import api from "./api";

export const tutorService = {
  async getTutores(page: number = 0, nome: string = ""): Promise<TutorApiResponse> {
    const response = await api.get("/tutores", {
      params: {
        page,
        size: 10,
        nome: nome || undefined
      }
    });
    return response.data;
  },

  async getTutorById(id: number): Promise<Tutor> {
    const response = await api.get(`/tutores/${id}`);
    return response.data;
  },

  async createTutor(payload: TutorCreateUpdatePayload): Promise<Tutor> {
    const response = await api.post("/tutores", payload);
    return response.data;
  },

  async updateTutor(id: number, payload: TutorCreateUpdatePayload): Promise<Tutor> {
    const response = await api.put(`/tutores/${id}`, payload);
    return response.data;
  },

  async deleteTutor(id: number): Promise<void> {
    await api.delete(`/tutores/${id}`);
  },

  async uploadFoto(tutorId: number, file: File): Promise<void> {
    const formData = new FormData();
    formData.append("foto", file);

    await api.post(`/tutores/${tutorId}/fotos`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  },

  async vincularPet(tutorId: number, petId: number): Promise<void> {
    await api.post(`/tutores/${tutorId}/pets/${petId}`);
  },

  async getLinkedPets(tutorId: number): Promise<Pet[]> {
    const res = await api.get(`/tutores/${tutorId}/pets`);
    const list = (res.data?.content ?? res.data) as Pet[];
    return Array.isArray(list) ? list : [];
  },

  async desvincularPet(tutorId: number, petId: number): Promise<void> {
    await api.delete(`/tutores/${tutorId}/pets/${petId}`);
  }
};
