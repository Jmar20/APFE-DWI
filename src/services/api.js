import axios from 'axios';
import config from '../config';

// Configuración base de axios
const API_BASE_URL = config.API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Habilitar el envío automático de cookies
});

// Interceptor para agregar el token a las peticiones (opcional para compatibilidad)
api.interceptors.request.use(
  (config) => {
    // El backend ahora usa cookies para autenticación, pero mantenemos esto por compatibilidad
    const userData = localStorage.getItem('userData');
    if (userData) {
      // Agregar header personalizado si es necesario
      config.headers['X-User-Data'] = userData;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido - solo limpiar localStorage sin redireccionar
      localStorage.removeItem('userData');
      console.log('Sesión expirada o inválida. Datos de autenticación limpiados.');
    }
    return Promise.reject(error);
  }
);

export default api;
