import axios from 'axios';
import { authFacade } from '../facades/auth.facade';

const api = axios.create({
  baseURL: 'https://pet-manager-api.geia.vip/v1'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authFacade.logout(); 
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;