export interface User {
  username: string;
  perfil: 'ADMIN';
}

export type AuthView = 'ADMIN';

export interface AuthTokens {
  access_token: string;
  refresh_token?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  currentView: AuthView; 
  loading: boolean;
  error: string | null;
}