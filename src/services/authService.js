import api from './api';
import cookieUtils from '../utils/cookieUtils';

// Servicio de autenticación
export const authService = {
  // Registro de usuario
  register: async (userData) => {
    try {
      const response = await api.post('/auth/registro', {
        nombre: userData.name,
        email: userData.email,
        password: userData.password,
        rol: 'AGRICULTOR' // Rol por defecto para registros desde la web
      });
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        // Guardar datos del usuario (opcional)
        localStorage.setItem('userData', JSON.stringify({
          name: userData.name,
          email: userData.email,
          rol: 'AGRICULTOR'
        }));
      }
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Login de usuario
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      });
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        // Podrías obtener más datos del usuario aquí si el backend los devuelve
        localStorage.setItem('userData', JSON.stringify({
          email: credentials.email
        }));
      }

      // Verificar si se recibió una cookie de autenticación del backend
      const authCookie = cookieUtils.getCookie('authToken') || cookieUtils.getCookie('JSESSIONID');
      if (authCookie) {
        console.log('Cookie de autenticación recibida:', authCookie);
      }
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Verificar token
  verifyToken: async () => {
    try {
      const response = await api.post('/auth/verify');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    // Limpiar cookies de autenticación si existen
    cookieUtils.removeCookie('authToken');
    cookieUtils.removeCookie('JSESSIONID');
    
    // Log para verificar que las cookies se eliminaron
    console.log('Cookies después del logout:', cookieUtils.getAllCookies());
  },

  // Obtener token del localStorage o cookies
  getToken: () => {
    // Primero intentar obtener del localStorage
    let token = localStorage.getItem('authToken');
    
    // Si no está en localStorage, intentar obtener de cookies
    if (!token) {
      token = cookieUtils.getCookie('authToken');
    }
    
    return token;
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    const cookieToken = cookieUtils.getCookie('authToken');
    const sessionCookie = cookieUtils.getCookie('JSESSIONID');
    
    return !!(token || cookieToken || sessionCookie);
  },

  // Obtener datos del usuario
  getUserData: () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },

  // Método para debugging - obtener información de cookies
  getCookieInfo: () => {
    return {
      allCookies: cookieUtils.getAllCookies(),
      authToken: cookieUtils.getCookie('authToken'),
      sessionId: cookieUtils.getCookie('JSESSIONID'),
      hasCookies: Object.keys(cookieUtils.getAllCookies()).length > 0
    };
  },

  // Manejar errores de la API
  handleError: (error) => {
    if (error.response?.data) {
      // Error del servidor con mensaje específico
      if (typeof error.response.data === 'string') {
        return new Error(error.response.data);
      } else if (error.response.data.message) {
        return new Error(error.response.data.message);
      } else if (typeof error.response.data === 'object') {
        // Errores de validación
        const errorMessages = Object.values(error.response.data).join(', ');
        return new Error(errorMessages);
      }
    } else if (error.message) {
      return new Error(error.message);
    } else {
      return new Error('Error de conexión con el servidor');
    }
  }
};

export default authService;
