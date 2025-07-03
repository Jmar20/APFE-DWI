import api from './api';

// Servicio para gestión de actividades
export const actividadService = {
  // Registrar una actividad
  registrar: async (actividadData) => {
    try {
      const response = await api.post('/gestioncultivo/actividades', actividadData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al registrar actividad');
    }
  },

  // Obtener actividades por cultivo
  obtenerPorCultivo: async (cultivoId) => {
    try {
      const response = await api.get(`/gestioncultivo/actividades/cultivo/${cultivoId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener actividades');
    }
  },

  // Marcar actividad como realizada
  marcarComoRealizada: async (actividadId) => {
    try {
      const response = await api.put(`/gestioncultivo/actividades/${actividadId}/realizada`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al marcar actividad como realizada');
    }
  },
};

export default actividadService;
