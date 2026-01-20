import axios from "axios";

const API_URL = 'https://pet-manager-api.geia.vip';

export const authService = {
  async login(credentials: any) {
    const response = await axios.post(`${API_URL}/v1/autenticacao/login`, credentials);
    return response.data;
  },
  
  async register(data: any) {
    return axios.post(`${API_URL}/v1/usuarios/registrar`, data);
  },
  
  async recoverPassword(email: string) {
    return axios.post(`${API_URL}/v1/usuarios/recuperar-senha`, { email });
  }
};