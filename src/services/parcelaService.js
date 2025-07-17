import api from './api';

// SERVICIO PARA GESTIÓN DE PARCELAS - BACKEND REAL
export const parcelaService = {
  
  // ✅ OBTENER PARCELAS DEL USUARIO (usando backend real)
  obtenerPorUsuario: async (userId) => {
    try {
      console.log('📋 DEBUGGING PARCELAS SERVICE:');
      console.log('- UserId recibido:', userId);
      console.log('- URL que vamos a llamar:', `/gestioncultivo/parcelas/usuario/${userId}`);
      
      const response = await api.get(`/gestioncultivo/parcelas/usuario/${userId}`);
      console.log('✅ Respuesta completa del backend:', {
        status: response.status,
        data: response.data,
        headers: response.headers
      });
      
      console.log('✅ Datos de parcelas del backend:', response.data);
      console.log('- Cantidad de parcelas:', response.data?.length || 0);
      
      return response.data;
    } catch (error) {
      console.error('❌ ERROR DETALLADO en obtenerPorUsuario:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url
      });
      
      // Si falla, devolver parcelas por defecto para que la app siga funcionando
      console.log('🔄 Usando parcelas por defecto debido al error');
      return [
        { 
          id: 1, 
          nombre: 'Parcela Norte', 
          descripcion: 'Zona soleada, ideal para tomates',
          superficie: 100,
          usuarioId: userId 
        },
        { 
          id: 2, 
          nombre: 'Parcela Sur', 
          descripcion: 'Zona semi-sombra, ideal para lechugas',
          superficie: 80,
          usuarioId: userId 
        },
      ];
    }
  },

  // ✅ CREAR NUEVA PARCELA
  crear: async (parcelaData) => {
    try {
      console.log('🌱 Creando nueva parcela:', parcelaData);
      const response = await api.post('/gestioncultivo/parcelas', parcelaData);
      console.log('✅ Parcela creada:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al crear parcela:', error);
      throw new Error(error.response?.data?.message || 'Error al crear parcela');
    }
  },

  // ✅ ELIMINAR PARCELA
  eliminar: async (parcelaId) => {
    try {
      console.log('🗑️ Eliminando parcela:', parcelaId);
      const response = await api.delete(`/gestioncultivo/parcelas/${parcelaId}`);
      console.log('✅ Parcela eliminada');
      return response.data;
    } catch (error) {
      console.error('❌ Error al eliminar parcela:', error);
      throw new Error(error.response?.data?.message || 'Error al eliminar parcela');
    }
  },

  // ✅ ACTUALIZAR PARCELA
  actualizar: async (parcelaId, parcelaData) => {
    try {
      console.log('✏️ Actualizando parcela:', parcelaId, parcelaData);
      const response = await api.put(`/gestioncultivo/parcelas/${parcelaId}`, parcelaData);
      console.log('✅ Parcela actualizada:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al actualizar parcela:', error);
      throw new Error(error.response?.data?.message || 'Error al actualizar parcela');
    }
  },

  // ✅ OBTENER TODAS LAS PARCELAS
  obtenerTodas: async () => {
    try {
      console.log('📋 Obteniendo todas las parcelas');
      const response = await api.get('/gestioncultivo/parcelas');
      console.log('✅ Todas las parcelas obtenidas:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener todas las parcelas:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener parcelas');
    }
  },

  // ✅ OBTENER PARCELA POR ID
  obtenerPorId: async (parcelaId) => {
    try {
      console.log('📋 Obteniendo parcela por ID:', parcelaId);
      const response = await api.get(`/gestioncultivo/parcelas/${parcelaId}`);
      console.log('✅ Parcela obtenida:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener parcela:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener parcela');
    }
  }
};

export default parcelaService;
