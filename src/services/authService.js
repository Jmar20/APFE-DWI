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
        rol: userData.rol || 'AGRICULTOR' // Rol por defecto para registros desde la web
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
      
      console.log('🔍 RESPUESTA COMPLETA DEL LOGIN:', response.data);
      
      if (response.data.success) {
        // Crear objeto con todos los datos disponibles - ACTUALIZADO para backend v2
        const userData = {
          name: response.data.userName || response.data.name || response.data.nombre || credentials.email, // ← NUEVO: usar userName del backend
          email: response.data.userEmail || credentials.email, // ← ACTUALIZADO: usar userEmail del backend
          rol: response.data.userRole || response.data.rol || 'AGRICULTOR', // ← ACTUALIZADO: usar userRole del backend
          userId: response.data.userId || response.data.id || response.data.user?.id || response.data.usuario?.id,
          token: response.data.token, // ← Asegurar que el token se guarde
          ...response.data // Incluir todos los datos extras
        };
        
        console.log('💾 GUARDANDO DATOS DE USUARIO (Backend v2):', userData);
        console.log('📋 userName desde backend:', response.data.userName);
        console.log('📋 userEmail desde backend:', response.data.userEmail);
        console.log('📋 userRole desde backend:', response.data.userRole);
        
        // Guardar datos del usuario
        localStorage.setItem('userData', JSON.stringify(userData));
        
        return { 
          success: true, 
          message: 'Inicio de sesión exitoso',
          userData: userData
        };
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

  // Verificar token con el backend
  verifyToken: async () => {
    try {
      const response = await api.post('/auth/verify');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al verificar token');
    }
  },

  // Obtener información actualizada del usuario
  getCurrentUserInfo: async (userId) => {
    try {
      console.log('📄 Obteniendo información actualizada del usuario:', userId);
      
      // Intentar diferentes endpoints para obtener información del usuario
      const possibleEndpoints = [
        `/usuarios/${userId}`,           // GET /api/v1/usuarios/25
        `/usuario/${userId}`,            // GET /api/v1/usuario/25
        `/users/${userId}`,              // GET /api/v1/users/25
        `/user/${userId}`,               // GET /api/v1/user/25
      ];
      
      let response;
      let workingEndpoint = null;
      
      for (const endpoint of possibleEndpoints) {
        try {
          console.log(`🔍 Intentando obtener usuario desde: ${api.defaults.baseURL}${endpoint}`);
          response = await api.get(endpoint);
          console.log(`📋 RESPUESTA COMPLETA DEL GET ${endpoint}:`, response.data);
          workingEndpoint = endpoint;
          console.log(`✅ Endpoint GET funcionando: ${endpoint}`);
          break;
        } catch (error) {
          console.log(`❌ Endpoint GET ${endpoint} falló con status:`, error.response?.status);
          if (error.response?.status !== 404) {
            // Si no es 404, es otro tipo de error, lanzarlo
            throw error;
          }
        }
      }
      
      if (!workingEndpoint) {
        console.warn('⚠️ No se pudo obtener información actualizada, usando datos del localStorage');
        return JSON.parse(localStorage.getItem('userData') || '{}');
      }
      
      if (response && response.data) {
        // Estructurar los datos del usuario
        const userData = {
          name: response.data.nombre || response.data.name || 'Usuario',
          email: response.data.email || 'email@ejemplo.com',
          rol: response.data.rol || 'AGRICULTOR',
          userId: response.data.id || userId,
          ...response.data
        };
        
        console.log(`✅ Información actualizada obtenida desde: ${workingEndpoint}`, userData);
        return userData;
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener información del usuario:', error);
      // En caso de error, devolver los datos del localStorage
      return JSON.parse(localStorage.getItem('userData') || '{}');
    }
  },

  // Actualizar información del usuario
  updateUserInfo: async (userId, userData) => {
    try {
      console.log('🔄 Actualizando información del usuario:', userId, userData);
      console.log('🌐 URL completa:', `${api.defaults.baseURL}/usuarios/${userId}`);
      
      const response = await api.put(`/usuarios/${userId}`, {
        nombre: userData.nombre,
        email: userData.email
      });
      
      console.log('📥 Respuesta del servidor:', response.data);
      
      if (response && response.data) {
        // Actualizar localStorage con los nuevos datos
        const currentUserData = JSON.parse(localStorage.getItem('userData') || '{}');
        const updatedUserData = {
          ...currentUserData,
          nombre: userData.nombre,
          email: userData.email
        };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        
        console.log('✅ Información de usuario actualizada exitosamente');
        console.log('✅ Datos actualizados:', updatedUserData);
        return updatedUserData;
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Error al actualizar información de usuario:', error);
      console.log('❌ URL que falló:', error.config?.url);
      console.log('❌ Datos enviados:', { nombre: userData.nombre, email: userData.email });
      console.log('❌ Respuesta del servidor:', error.response?.data);
      console.log('❌ Status code:', error.response?.status);
      
      if (error.response?.status === 404) {
        throw new Error('Usuario no encontrado');
      } else if (error.response?.status === 409) {
        throw new Error('El correo electrónico ya está en uso por otro usuario');
      } else if (error.response?.status === 400) {
        throw new Error('Datos inválidos. Verifica que el correo tenga un formato válido');
      } else {
        throw handleError(error);
      }
    }
  },

  // Cambiar contraseña del usuario
  changePassword: async (userId, passwordData) => {
    try {
      console.log('🔒 Cambiando contraseña del usuario:', userId);
      console.log('🌐 URL completa:', `${api.defaults.baseURL}/usuarios/${userId}/password`);
      
      // ✅ CAMPOS REQUERIDOS POR EL BACKEND (confirmado por logs):
      // - passwordActual: contraseña actual del usuario
      // - nuevaPassword: nueva contraseña a establecer  
      // - confirmarPassword: confirmación de la nueva contraseña
      const response = await api.put(`/usuarios/${userId}/password`, {
        passwordActual: passwordData.currentPassword,
        nuevaPassword: passwordData.newPassword,
        confirmarPassword: passwordData.newPassword  // El backend requiere confirmación
      });
      
      console.log('✅ Contraseña cambiada exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al cambiar contraseña:', error);
      console.log('❌ URL que falló:', error.config?.url);
      console.log('❌ Datos enviados:', {
        passwordActual: '***OCULTO***',
        nuevaPassword: '***OCULTO***',
        confirmarPassword: '***OCULTO***'
      });
      console.log('❌ Respuesta del servidor:', error.response?.data);
      console.log('❌ Status code:', error.response?.status);
      
      if (error.response?.status === 401) {
        throw new Error('La contraseña actual es incorrecta');
      } else if (error.response?.status === 400) {
        const messageString = typeof error.response.data === 'string' 
          ? error.response.data 
          : error.response.data?.message || JSON.stringify(error.response.data);
        throw new Error(`La nueva contraseña no cumple con los requisitos: ${messageString}`);
      } else if (error.response?.status === 404) {
        throw new Error('Usuario no encontrado o endpoint no disponible');
      } else {
        throw handleError(error);
      }
    }
  },

  // Eliminar cuenta del usuario
  deleteAccount: async (userId) => {
    try {
      console.log('🗑️ Eliminando cuenta del usuario:', userId);
      console.log('🌐 URL completa:', `${api.defaults.baseURL}/usuarios/${userId}`);
      
      const response = await api.delete(`/usuarios/${userId}`);
      
      // Limpiar localStorage inmediatamente
      localStorage.removeItem('userData');
      
      console.log('✅ Cuenta eliminada exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al eliminar cuenta:', error);
      console.log('❌ URL que falló:', error.config?.url);
      console.log('❌ Respuesta del servidor:', error.response?.data);
      console.log('❌ Status code:', error.response?.status);
      
      if (error.response?.status === 404) {
        throw new Error('Usuario no encontrado');
      } else if (error.response?.status === 403) {
        throw new Error('No tienes permisos para eliminar esta cuenta');
      } else if (error.response?.status === 409) {
        throw new Error('No se puede eliminar la cuenta. Primero elimina todos tus cultivos y actividades');
      } else {
        throw handleError(error);
      }
    }
  }
};

export default authService;
