export type Foto = {
  id: number;         
  nome: string;
  contentType: string;
  url: string;
};

export type TutorPetResumo = {
  id: number;
  nome: string;
  raca: string;
  idade: number;
  foto?: Foto | null;
};

export type Tutor = {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cpf: number;       
  foto?: Foto | null;
  pets?: TutorPetResumo[];
};

export type TutorCreateUpdatePayload = {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cpf: number;
};

export type TutorApiResponse = {
  content: Tutor[];
  page: number;
  pageCount: number;
  total: number;
};

export type TutorState = {
  tutores: Tutor[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
  filters: {
    nome: string;
    page: number;
  };
};
