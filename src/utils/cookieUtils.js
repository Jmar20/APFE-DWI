// Utilidades para manejo de cookies (sin debugger)
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
      expires,
      maxAge,
      path = '/',
      domain,
      secure,
      sameSite = 'lax'
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

  // Obtener todas las cookies
  getAllCookies: () => {
    const cookies = {};
    document.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
    });
    return cookies;
  }
};

export default cookieUtils;
