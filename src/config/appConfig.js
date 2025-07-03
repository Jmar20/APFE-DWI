// Configuración para deshabilitar validaciones y redirecciones
export const appConfig = {
  // Deshabilitar todas las validaciones de autenticación
  disableAuthValidation: true,
  
  // Deshabilitar redirecciones automáticas
  disableAutoRedirect: true,
  
  // Permitir acceso a todas las rutas sin autenticación
  allowPublicAccess: true,
  
  // Modo de desarrollo sin restricciones
  developmentMode: true,
};

export default appConfig;
