import api from './api';

// Servicio para alertas
export const alertaService = {
  // Obtener todas las alertas
  obtenerTodas: async () => {
    try {
      const response = await api.get('/alertas');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener alertas');
    }
  },

  // Obtener alertas por usuario
  obtenerPorUsuario: async (usuarioId) => {
    try {
      const response = await api.get(`/alertas/usuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener alertas del usuario');
    }
  },

  // Obtener alertas meteorológicas
  obtenerMeteorologicas: async () => {
    try {
      const response = await api.get('/alertas/meteorologicas');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener alertas meteorológicas');
    }
  },

  // Obtener alertas de actividades
  obtenerDeActividades: async (cultivoId) => {
    try {
      const response = await api.get(`/alertas/actividades/cultivo/${cultivoId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener alertas de actividades');
    }
  },

  // Marcar alerta como leída
  marcarComoLeida: async (alertaId) => {
    try {
      const response = await api.put(`/alertas/${alertaId}/leida`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al marcar alerta como leída');
    }
  },
};

export default alertaService;
