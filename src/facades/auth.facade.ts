import type { AuthView } from '../models/auth.model';
import { authState$, authStateActions } from '../state/auth.state';
import { map } from 'rxjs/operators';

let refreshTimer: ReturnType<typeof setInterval> | null = null;

export const authFacade = {
  user$: authState$.pipe(map(state => state.user)),
  isAuthenticated$: authState$.pipe(map(state => state.isAuthenticated)),

  setView(view: AuthView) {
    const current = authState$.getValue();
    authState$.next({ ...current, currentView: view, error: null });
  },

  async login(credentials: any) {
    const current = authState$.getValue();
    
    authState$.next({ ...current, loading: true, error: null });
    console.log(credentials);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = { id: '1', nome: 'Davi Aguiar', email: 'davi@exemplo.com' };
      const mockToken = 'seu-jwt-token';
      
      authStateActions.setLogin(mockUser, mockToken);
    } catch (err) {
      authState$.next({ ...current, loading: false, error: 'Falha na autenticação.' });
    }
  },

  async refreshToken() {
    console.log('Renovando token automaticamente...');
    try {
      const newToken = 'novo-token-' + Date.now();
      const currentUser = authState$.getValue().user;
      
      if (currentUser) {
        authStateActions.setLogin(currentUser, newToken);
      }
    } catch (err) {
      this.logout();
    }
  },

  startRefreshTimer() {
    if (refreshTimer) clearInterval(refreshTimer);
    
    refreshTimer = setInterval(() => {
      this.refreshToken();
    }, 4 * 60 * 1000); 
  },

  logout() {
    if (refreshTimer) clearInterval(refreshTimer);
    authStateActions.logout();
  }
};