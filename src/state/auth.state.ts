import { BehaviorSubject } from 'rxjs';
import type { AuthState } from '../models/auth.model';

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  currentView: 'LOGIN',
  loading: false,    
  error: null
};

export const authState$ = new BehaviorSubject<AuthState>(initialState);

export const authStateActions = {
  updateState: (update: Partial<AuthState>) => {
    const current = authState$.getValue();
    authState$.next({ ...current, ...update });
  },
  
  setLogin: (user: any, token: string) => {
    localStorage.setItem('token', token);
    authStateActions.updateState({
      user,
      token,
      isAuthenticated: true,
      loading: false,
      error: null
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    authState$.next({ ...initialState, token: null, isAuthenticated: false });
  }
};