export interface User {
  id: string;
  nome: string;
  email: string;
  perfil: 'ADMIN' | 'USUARIO';
}

export type AuthView = 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  currentView: AuthView; 
  loading: boolean;
  error: string | null;
}