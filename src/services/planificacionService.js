import api from './api';

// Servicio para planificación de actividades
export const planificacionService = {
  // Obtener actividades de un cultivo
  obtenerActividadesPorCultivo: async (cultivoId) => {
    try {
      const response = await api.get(`/planificacion/actividades/cultivo/${cultivoId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener actividades');
    }
  },

  // Crear nueva actividad
  crearActividad: async (actividadData) => {
    try {
      const response = await api.post('/planificacion/actividades', actividadData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al crear actividad');
    }
  },

  // Obtener actividad por ID
  obtenerActividadPorId: async (actividadId) => {
    try {
      const response = await api.get(`/planificacion/actividades/${actividadId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener actividad');
    }
  },

  // Actualizar actividad
  actualizarActividad: async (actividadId, actividadData) => {
    try {
      const response = await api.put(`/planificacion/actividades/${actividadId}`, actividadData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar actividad');
    }
  },

  // Eliminar actividad
  eliminarActividad: async (actividadId) => {
    try {
      const response = await api.delete(`/planificacion/actividades/${actividadId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al eliminar actividad');
    }
  },

  // Marcar actividad como completada
  completarActividad: async (actividadId) => {
    try {
      const response = await api.put(`/planificacion/actividades/${actividadId}/completar`);
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
