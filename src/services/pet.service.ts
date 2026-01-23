import type { Pet, PetApiResponse } from "../models/pet.model";
import api from "./api";


export const petService = {

  async getPets( page: number = 0,nome: string = '',raca: string = '',size: number = 10): Promise<PetApiResponse> {
    const response = await api.get('/pets', {
      params: {
        page,
        size,
        nome: nome || undefined,
        raca: raca || undefined
      }
    });
    
    return response.data;
  },

  async createPet(pet: Omit<Pet, 'id' | 'foto'>): Promise<Pet> {
    const response = await api.post('/pets', pet);
    return response.data;
  },

  async uploadFoto(petId: number, file: File): Promise<void> {
    const formData = new FormData();
    formData.append('foto', file);

    await api.post(`/pets/${petId}/fotos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  async updatePet(id: number, pet: Omit<Pet, 'id' | 'foto'>): Promise<Pet> {
    const response = await api.put(`/pets/${id}`, pet);
    return response.data;
  },

  async deletePet(id: number): Promise<void> {
    await api.delete(`/pets/${id}`);
  },

};