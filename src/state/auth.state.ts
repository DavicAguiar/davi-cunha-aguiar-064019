import { BehaviorSubject } from 'rxjs';
import type { AuthState, AuthView } from '../models/auth.model';

const savedView = localStorage.getItem('mfa_pending') === 'true' ? 'MFA' : 'LOGIN';

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  currentView: savedView as AuthView,
  loading: false,    
  error: null
};

export const authState$ = new BehaviorSubject<AuthState>(initialState);

export const authStateActions = {
  updateState: (update: Partial<AuthState>) => {
    const current = authState$.getValue();
    authState$.next({ ...current, ...update });
  },

  setLogin: (user: any, token: string, refreshToken?: string) => {
    localStorage.setItem('token', token);
    if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
    
    authStateActions.updateState({
      user,
      token,
      isAuthenticated: true,
      loading: false,
      error: null,
      currentView: 'LOGIN'
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    authState$.next({ 
      user: null, 
      token: null, 
      isAuthenticated: false, 
      currentView: 'LOGIN', 
      loading: false, 
      error: null 
    });
  }
};