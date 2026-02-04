export interface Pet {
  id: number;
  nome: string;
  raca: string;
  idade: number;
  foto?: {
    id: number;
    nome: string;
    contentType: string;
    url: string;
  };
  tutores?: Tutor[];
}

export interface PetApiResponse {
  page: number;
  size: number;
  total: number;
  pageCount: number;
  content: Pet[];
}

export interface PetState {
  pets: Pet[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
  filters: {
    nome: string;
    raca: string;
    page: number;
  };
}

export type Tutor = {
  id: number;
  nome: string;
  email?: string | null;
  telefone?: string | null;
  endereco?: string | null;
  cpf?: string | null;
  foto?: { 
    id: number; 
    nome: string; 
    contentType: string; 
    url: string 
  };
};