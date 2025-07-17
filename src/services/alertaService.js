import api from './api';

// Servicio para alertas
export const alertaService = {
  // Obtener alertas por usuario
  obtenerPorUsuario: async (usuarioId) => {
    try {
      const response = await api.get(`/alerta/alertas/usuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener alertas del usuario');
    }
  },

  // Crear nueva alerta
  crear: async (alertaData) => {
    try {
      const response = await api.post('/alerta/alertas', alertaData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al crear alerta');
    }
  },

  // Obtener alerta por ID
  obtenerPorId: async (alertaId) => {
    try {
      const response = await api.get(`/alerta/alertas/${alertaId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener alerta');
    }
  },

  // Marcar alerta como leída
  marcarLeida: async (alertaId) => {
    try {
      const response = await api.put(`/alerta/alertas/${alertaId}/marcar-leida`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al marcar alerta como leída');
    }
  },

  // Eliminar alerta
  eliminar: async (alertaId) => {
    try {
      const response = await api.delete(`/alerta/alertas/${alertaId}`);
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

  // 🆕 ALERTAS AUTOMÁTICAS
  // Obtener alertas automáticas por usuario
  obtenerAutomaticasPorUsuario: async (usuarioId) => {
    try {
      console.log('🚨 Obteniendo alertas automáticas para usuario:', usuarioId);
      const response = await api.get(`/alerta/automaticas/usuario/${usuarioId}`);
      console.log('🚨 Alertas automáticas obtenidas:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener alertas automáticas:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener alertas automáticas');
    }
  },

  // Obtener estadísticas de alertas automáticas
  obtenerEstadisticasAutomaticas: async (usuarioId) => {
    try {
      console.log('📊 Obteniendo estadísticas de alertas para usuario:', usuarioId);
      const response = await api.get(`/alerta/automaticas/usuario/${usuarioId}/estadisticas`);
      console.log('📊 Estadísticas de alertas obtenidas:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener estadísticas de alertas:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener estadísticas de alertas');
    }
  },

  // Eliminar todas las alertas de un cultivo
  eliminarPorCultivo: async (cultivoId) => {
    try {
      console.log('🗑️ Eliminando todas las alertas del cultivo:', cultivoId);
      
      // Intentar obtener las alertas del cultivo
      let alertas = [];
      try {
        const response = await api.get(`/gestionalerta/alertas/cultivo/${cultivoId}`);
        alertas = response.data;
      } catch (getError) {
        if (getError.response?.status === 404) {
          console.log('ℹ️ No se encontraron alertas para este cultivo');
          return { message: 'No hay alertas para eliminar' };
        }
        throw getError;
      }
      
      console.log(`📋 Encontradas ${alertas.length} alertas para eliminar`);
      
      // Eliminar cada alerta individualmente
      const eliminadas = [];
      for (const alerta of alertas) {
        try {
          await api.delete(`/gestionalerta/alertas/${alerta.id}`);
          eliminadas.push(alerta.id);
          console.log(`✅ Alerta ${alerta.id} eliminada`);
        } catch (alertError) {
          console.warn(`⚠️ No se pudo eliminar alerta ${alerta.id}:`, alertError);
        }
      }
      
      console.log(`✅ ${eliminadas.length} alertas eliminadas del cultivo ${cultivoId}`);
      return { message: `${eliminadas.length} alertas eliminadas`, eliminadas };
      
    } catch (error) {
      console.error('❌ Error al eliminar alertas del cultivo:', error);
      // Si no hay alertas, no es un error crítico
      if (error.response?.status === 404) {
        console.log('ℹ️ No se encontraron alertas para este cultivo');
        return { message: 'No hay alertas para eliminar' };
      }
      throw new Error('Error al obtener alertas del cultivo');
    }
  },
};

export default alertaService;
