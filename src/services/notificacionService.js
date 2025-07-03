import api from './api';

// Servicio para notificaciones
export const notificacionService = {
  // Obtener todas las notificaciones
  obtenerTodas: async () => {
    try {
      const response = await api.get('/notificaciones');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener notificaciones');
    }
  },

  // Obtener notificaciones por usuario
  obtenerPorUsuario: async (usuarioId) => {
    try {
      const response = await api.get(`/notificaciones/usuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener notificaciones del usuario');
    }
  },

  // Marcar notificación como leída
  marcarComoLeida: async (notificacionId) => {
    try {
      const response = await api.put(`/notificaciones/${notificacionId}/leida`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al marcar notificación como leída');
    }
  },

  // Eliminar notificación
  eliminar: async (notificacionId) => {
    try {
      await api.delete(`/notificaciones/${notificacionId}`);
      return { success: true };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al eliminar notificación');
    }
  },
};

export default notificacionService;
