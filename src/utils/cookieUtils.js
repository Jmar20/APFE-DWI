// Utilidades para manejo de cookies
export const cookieUtils = {
  // Obtener el valor de una cookie por nombre
  getCookie: (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(';').shift();
    }
    return null;
  },

  // Establecer una cookie
  setCookie: (name, value, options = {}) => {
    const {
      expires = null,
      maxAge = null,
      path = '/',
      domain = null,
      secure = false,
      sameSite = 'Lax'
    } = options;

    let cookieString = `${name}=${value}`;
    
    if (expires) {
      cookieString += `; expires=${expires.toUTCString()}`;
    }
    
    if (maxAge) {
      cookieString += `; max-age=${maxAge}`;
    }
    
    cookieString += `; path=${path}`;
    
    if (domain) {
      cookieString += `; domain=${domain}`;
    }
    
    if (secure) {
      cookieString += `; secure`;
    }
    
    cookieString += `; samesite=${sameSite}`;
    
    document.cookie = cookieString;
  },

  // Eliminar una cookie
  removeCookie: (name, path = '/', domain = null) => {
    let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
    
    if (domain) {
      cookieString += `; domain=${domain}`;
    }
    
    document.cookie = cookieString;
  },

  // Verificar si una cookie existe
  hasCookie: (name) => {
    return cookieUtils.getCookie(name) !== null;
  },

  // Obtener todas las cookies como objeto
  getAllCookies: () => {
    const cookies = {};
    if (document.cookie) {
      document.cookie.split(';').forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        cookies[name] = value;
      });
    }
    return cookies;
  },

  // Limpiar todas las cookies del dominio actual
  clearAllCookies: () => {
    const cookies = cookieUtils.getAllCookies();
    Object.keys(cookies).forEach(name => {
      cookieUtils.removeCookie(name);
    });
  }
};

export default cookieUtils;
