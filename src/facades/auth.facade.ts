import type { AuthView, User } from '../models/auth.model';
import { authState$, authStateActions } from '../state/auth.state';
import { authService } from '../services/auth.service';
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
    
    try {
      const response = await authService.login(credentials);
      
      const user: User = { 
        username: credentials.username, 
        perfil: credentials.username === 'admin' ? 'ADMIN' : 'USUARIO' 
      };
      
      authStateActions.setLogin(user, response.access_token, response.refresh_token);
      
      this.startRefreshTimer();
    } catch (err) {
      authState$.next({ ...current, loading: false, error: 'Usuário ou senha incorretos.' });
    }
  },

  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) return this.logout();

    try {
      const response = await authService.refreshToken(refreshToken); 
      
      const currentState = authState$.getValue();
      if (currentState.user) {
        authStateActions.setLogin(currentState.user, response.access_token, response.refresh_token);
      }
    } catch (err) {
      console.error('Falha ao renovar token:', err);
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