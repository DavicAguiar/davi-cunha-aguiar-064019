import axios from "axios";

const API_URL = 'https://pet-manager-api.geia.vip';

export const authService = {
  async login(credentials: any) {
    const response = await axios.post(`${API_URL}/autenticacao/login`, {
      username: credentials.username,
      password: credentials.password
    });
    return response.data;
  },
  
  async refreshToken(token: string) {
    const response = await axios.put(`${API_URL}/autenticacao/refresh`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};