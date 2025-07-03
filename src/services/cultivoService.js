import api from './api';

// Servicio para gestión de cultivos
export const cultivoService = {
  // Registrar un cultivo
  registrar: async (cultivoData) => {
    try {
      const response = await api.post('/gestioncultivo/cultivos', cultivoData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al registrar cultivo');
    }
  },

  // Obtener cultivos por parcela
  obtenerPorParcela: async (parcelaId) => {
    try {
      const response = await api.get(`/gestioncultivo/cultivos/parcela/${parcelaId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener cultivos');
    }
  },

  // Obtener cultivos por usuario
  obtenerPorUsuario: async (usuarioId) => {
    try {
      const response = await api.get(`/gestioncultivo/cultivos/usuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener cultivos del usuario');
    }
  },

  // Registrar actividad en cultivo
  registrarActividad: async (cultivoId, actividadData) => {
    try {
      const response = await api.post(`/gestioncultivo/cultivos/${cultivoId}/actividades`, actividadData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al registrar actividad');
    }
  },

  // Obtener actividades de un cultivo
  obtenerActividades: async (cultivoId) => {
    try {
      const response = await api.get(`/gestioncultivo/cultivos/${cultivoId}/actividades`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener actividades');
    }
  },
};

export default cultivoService;
