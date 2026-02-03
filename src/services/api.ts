import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { authService } from '../services/auth.service';
import type { AuthTokens } from '../models/auth.model';
import { authStateActions } from '../state/auth.state';

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

const api = axios.create({
  baseURL: 'https://pet-manager-api.geia.vip/v1'
});

let refreshPromise: Promise<AuthTokens> | null = null;

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers ?? {};

    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalConfig = error.config as (InternalAxiosRequestConfig | undefined);

    // Não é 401 ou não temos config pra retry
    if (status !== 401 || !originalConfig) {
      return Promise.reject(error);
    }

    // Evita loop infinito
    if (originalConfig._retry) {
      authStateActions.logout();
      return Promise.reject(error);
    }
    originalConfig._retry = true;

    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      authStateActions.logout();
      return Promise.reject(error);
    }

    try {
      refreshPromise ??= authService.refreshToken(refreshToken);
      const tokens = await refreshPromise;

      // Atualiza storage 
      authStateActions.setTokens(tokens.access_token, tokens.refresh_token ?? null);

      // Reexecuta a request original com o novo token
      originalConfig.headers = originalConfig.headers ?? {};
      originalConfig.headers.Authorization = `Bearer ${tokens.access_token}`;

      return api(originalConfig);
    } catch (refreshErr) {
      authStateActions.logout();
      return Promise.reject(refreshErr);
    } finally {
      refreshPromise = null;
    }
  }
);

export default api;