import api from './api';

// Servicio para planificación
export const planificacionService = {
  // Crear una planificación
  crear: async (planificacionData) => {
    try {
      const response = await api.post('/planificaciones', planificacionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al crear planificación');
    }
  },

  // Obtener todas las planificaciones
  obtenerTodas: async () => {
    try {
      const response = await api.get('/planificaciones');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener planificaciones');
    }
  },

  // Obtener planificación por ID
  obtenerPorId: async (planificacionId) => {
    try {
      const response = await api.get(`/planificaciones/${planificacionId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener planificación');
    }
  },

  // Obtener planificaciones por cultivo
  obtenerPorCultivo: async (cultivoId) => {
    try {
      const response = await api.get(`/planificaciones/cultivo/${cultivoId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener planificaciones del cultivo');
    }
  },

  // Actualizar planificación
  actualizar: async (planificacionId, planificacionData) => {
    try {
      const response = await api.put(`/planificaciones/${planificacionId}`, planificacionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar planificación');
    }
  },

  // Eliminar planificación
  eliminar: async (planificacionId) => {
    try {
      await api.delete(`/planificaciones/${planificacionId}`);
      return { success: true };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al eliminar planificación');
    }
  },

  // Calcular fecha de maduración
  calcularMaduracion: async (fechaSiembra, diasMaduracion) => {
    try {
      const response = await api.post('/planificaciones/calcular-maduracion', {
        fechaSiembra,
        diasMaduracion
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al calcular fecha de maduración');
    }
  },
};

export default planificacionService;
