import api from './api';

// Servicio para gestión de plantas (admin)
export const plantaService = {
  // Registrar planta con etapas
  registrarConEtapas: async (plantaData) => {
    try {
      const response = await api.post('/gestionadmin/plantas', plantaData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al registrar planta con etapas');
    }
  },

  // Obtener todas las plantas
  obtenerTodas: async () => {
    try {
      const response = await api.get('/gestionadmin/plantas');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener plantas');
    }
  },

  // Obtener planta por ID
  obtenerPorId: async (plantaId) => {
    try {
      const response = await api.get(`/gestionadmin/plantas/${plantaId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener planta');
    }
  },
};

export default plantaService;
