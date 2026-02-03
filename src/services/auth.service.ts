import axios from "axios";
import type { AuthTokens } from "../models/auth.model";

const API_URL = 'https://pet-manager-api.geia.vip';

export interface LoginCredentials {
  username: string;
  password: string;
}


export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    const response = await axios.post(`${API_URL}/autenticacao/login`, {
      username: credentials.username,
      password: credentials.password
    });

    return response.data;
  },
  
  async refreshToken(token: string): Promise<AuthTokens> {
    const response = await axios.put<AuthTokens>(`${API_URL}/autenticacao/refresh`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data;
  }
};