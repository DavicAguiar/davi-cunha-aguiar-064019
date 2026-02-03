import type { AuthTokens, AuthView, User } from '../models/auth.model';
import { authState$, authStateActions } from '../state/auth.state';
import { authService, type LoginCredentials } from '../services/auth.service';
import { map } from 'rxjs/operators';

let refreshTimer: ReturnType<typeof setTimeout> | null = null;
let refreshInFlight: Promise<AuthTokens> | null = null;

const clearRefreshTimer = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
};

const decodeJwtExpMs = (jwt: string): number | null => {
  try {
    const [, payloadB64] = jwt.split('.');
    if (!payloadB64) return null;

    const base64 = payloadB64.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '==='.slice((base64.length + 3) % 4);

    const json = atob(padded);
    const payload = JSON.parse(json) as { exp?: number };
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
};

//Atualiza o timer de refresh baseado no token atual
const scheduleRefreshFromAccessToken = (accessToken: string) => {
  clearRefreshTimer();

  const expMs = decodeJwtExpMs(accessToken);
  const now = Date.now();

  const fallbackDelay = 4 * 60 * 1000;

  const delay = expMs
    ? Math.max(expMs - now - 60_000, 5_000)
    : fallbackDelay;

  refreshTimer = setTimeout(() => {
    void authFacade.refreshToken();
  }, delay);
};

authState$.subscribe((s) => {
  if (!s.isAuthenticated || !s.token) {
    clearRefreshTimer();
  }
});

export const authFacade = {
  user$: authState$.pipe(map(state => state.user)),
  isAuthenticated$: authState$.pipe(map(state => state.isAuthenticated)),

  setView(view: AuthView) {
    const current = authState$.getValue();
    authState$.next({ ...current, currentView: view, error: null });
  },

  async login(credentials: LoginCredentials) {
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
    } catch {
      authState$.next({ ...current, loading: false, error: 'Usuário ou senha incorretos.' });
    }
  },

  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
      this.logout();
      return;
    }

    // Evita outras chamadas
    if (refreshInFlight) {
      try {
        const tokens = await refreshInFlight;
        authStateActions.setTokens(tokens.access_token, tokens.refresh_token ?? null);
        scheduleRefreshFromAccessToken(tokens.access_token);
      } catch {
        //Falha é tratada abaixo
      }
      return;
    }

    try {
      refreshInFlight = authService.refreshToken(refreshToken);
      const response = await refreshInFlight;

      authStateActions.setTokens(response.access_token, response.refresh_token ?? null);
      scheduleRefreshFromAccessToken(response.access_token);
    } catch (err) {
      console.error('Falha ao renovar token:', err);
      this.logout();
    } finally {
      refreshInFlight = null;
    }
  },

  startRefreshTimer() {
    const token = authState$.getValue().token ?? localStorage.getItem('token');
    if (!token) return;
    scheduleRefreshFromAccessToken(token);
  },

  logout() {
    clearRefreshTimer();
    authStateActions.logout();
  }
};