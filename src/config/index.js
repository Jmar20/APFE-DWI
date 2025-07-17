// Configuración del entorno
export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1', // ✅ REVERTIDO: Backend está en puerto 8080
  APP_NAME: 'AgroPE',
  VERSION: '1.0.0',
  
  // Configuración de validación
  VALIDATION: {
    PASSWORD_MIN_LENGTH: 6,
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 50,
  },
  
  // Configuración de autenticación
  AUTH: {
    TOKEN_KEY: 'authToken',
    USER_DATA_KEY: 'userData',
  },
};

export default config;
