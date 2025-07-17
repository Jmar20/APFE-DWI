import axios from 'axios';
import config from '../config';

// Configuración base de axios
const API_BASE_URL = config.API_BASE_URL;

console.log('🌐 Configuración de API Base URL:', API_BASE_URL);

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
    
    // Debug: Log de la petición
    console.log(`🌐 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    console.log('📤 Headers enviados:', config.headers);
    console.log('🍪 WithCredentials:', config.withCredentials);
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} → ${response.status}`);
    console.log('📥 Respuesta exitosa:', response.data);
    return response;
  },
  (error) => {
    console.log(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} → ${error.response?.status}`);
    console.log('📥 Error response:', error.response?.data);
    console.log('📥 Error headers:', error.response?.headers);
    
    if (error.response?.status === 401) {
      // Token expirado o inválido - solo limpiar localStorage sin redireccionar
      localStorage.removeItem('userData');
      console.log('Sesión expirada o inválida. Datos de autenticación limpiados.');
    }
    return Promise.reject(error);
  }
);

export { api };
export default api;
