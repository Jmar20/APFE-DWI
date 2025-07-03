import api from './api';

// Función auxiliar para manejar errores
const handleError = (error) => {
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
};

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
      
      if (response.data.success) {
        // El backend devuelve success: true en lugar del token directamente
        // Obtener el token desde las cookies o hacer login automático
        const loginResponse = await api.post('/auth/login', {
          email: userData.email,
          password: userData.password
        });
        
        if (loginResponse.data.success) {
          // Guardar datos del usuario
          localStorage.setItem('userData', JSON.stringify({
            name: userData.name,
            email: userData.email,
            rol: 'AGRICULTOR'
          }));
          return { success: true, message: 'Registro exitoso' };
        }
      }
      
      return response.data;
    } catch (error) {
      // Mensajes de error personalizados para registro
      if (error.response?.status === 409) {
        throw new Error('Ya existe una cuenta con este correo electrónico');
      } else if (error.response?.status === 400) {
        throw new Error('Datos de registro inválidos. Verifica que todos los campos sean correctos');
      } else if (error.response?.status === 500) {
        throw new Error('Error interno del servidor. Intenta nuevamente más tarde');
      } else {
        throw handleError(error);
      }
    }
  },

  // Login de usuario
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      });
      
      if (response.data.success) {
        // Guardar datos del usuario
        localStorage.setItem('userData', JSON.stringify({
          name: response.data.name || credentials.email,
          email: credentials.email,
          rol: response.data.rol || 'AGRICULTOR'
        }));
        return { success: true, message: 'Inicio de sesión exitoso' };
      }
      
      return response.data;
    } catch (error) {
      // Mensajes de error personalizados para login
      if (error.response?.status === 401) {
        throw new Error('Credenciales incorrectas. Verifica tu correo y contraseña');
      } else if (error.response?.status === 404) {
        throw new Error('No existe una cuenta con este correo electrónico');
      } else if (error.response?.status === 403) {
        throw new Error('Tu cuenta está desactivada. Contacta al administrador');
      } else if (error.response?.status === 500) {
        throw new Error('Error interno del servidor. Intenta nuevamente más tarde');
      } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        throw new Error('Error de conexión. Verifica tu conexión a internet');
      } else {
        throw handleError(error);
      }
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('userData');
    
    // Realizar logout en el backend para limpiar cookies
    api.post('/auth/logout').catch(() => {
      // Ignorar errores del logout del backend
    });
  },

  // Obtener token del localStorage (para compatibilidad)
  getToken: () => {
    // Como ahora usamos cookies para la autenticación, 
    // verificamos si hay datos de usuario en localStorage
    const userData = localStorage.getItem('userData');
    return userData ? 'cookie-auth' : null;
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: () => {
    const userData = localStorage.getItem('userData');
    return !!userData;
  },

  // Obtener datos del usuario
  getUserData: () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },
};

export default authService;
