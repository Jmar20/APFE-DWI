import api from './api';

// Servicio para gestión de parcelas
export const parcelaService = {
  // Registrar una parcela
  registrar: async (parcelaData) => {
    try {
      const response = await api.post('/gestioncultivo/parcelas', parcelaData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al registrar parcela');
    }
  },

  // Obtener todas las parcelas (si se implementa en el backend)
  obtenerTodas: async () => {
    try {
      const response = await api.get('/gestioncultivo/parcelas');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener parcelas');
    }
  },

  // Obtener parcela por ID
  obtenerPorId: async (parcelaId) => {
    try {
      const response = await api.get(`/gestioncultivo/parcelas/${parcelaId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener parcela');
    }
  },
};

export default parcelaService;
