export interface User {
  username: string;
  perfil: 'ADMIN' | 'USUARIO';
}

export type AuthView = 'LOGIN';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  currentView: AuthView; 
  loading: boolean;
  error: string | null;
}