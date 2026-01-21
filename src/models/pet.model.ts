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