// Utilidades de validación

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 6) {
    errors.push("La contraseña debe tener al menos 6 caracteres");
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push("Debe contener al menos una letra minúscula");
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push("Debe contener al menos una letra mayúscula");
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push("Debe contener al menos un número");
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

export const getPasswordStrength = (password) => {
  let score = 0;
  
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/(?=.*[a-z])/.test(password)) score++;
  if (/(?=.*[A-Z])/.test(password)) score++;
  if (/(?=.*\d)/.test(password)) score++;
  if (/(?=.*[!@#$%^&*])/.test(password)) score++;
  
  if (score < 3) return { strength: 'weak', color: 'error', text: 'Débil' };
  if (score < 5) return { strength: 'medium', color: 'warning', text: 'Media' };
  return { strength: 'strong', color: 'success', text: 'Fuerte' };
};

export const validateName = (name) => {
  if (!name || name.trim().length < 2) {
    return "El nombre debe tener al menos 2 caracteres";
  }
  if (name.trim().length > 50) {
    return "El nombre no puede tener más de 50 caracteres";
  }
  return null;
};

// Formatear errores de la API
export const formatApiError = (error) => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error.response?.data) {
    const data = error.response.data;
    
    if (typeof data === 'string') {
      return data;
    }
    
    if (data.message) {
      return data.message;
    }
    
    // Si es un objeto con errores de validación
    if (typeof data === 'object') {
      const errorMessages = Object.values(data);
      return errorMessages.join(', ');
    }
  }
  
  return error.message || 'Error desconocido';
};

export default {
  validateEmail,
  validatePassword,
  getPasswordStrength,
  validateName,
  formatApiError,
};
