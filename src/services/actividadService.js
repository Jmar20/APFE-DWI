import api from './api';

// Servicio para gestión de actividades
export const actividadService = {
  // Registrar una actividad
  registrar: async (actividadData) => {
    try {
      console.log('🎯 actividadService.registrar - datos recibidos:', actividadData);
      
      // ✅ NUEVA ESTRUCTURA COMPATIBLE CON BACKEND ACTUALIZADO
      // El backend ahora acepta correctamente: nombre, descripcion, fechaEjecucion, prioridad, cultivoId, userId
      const datosParaBackend = {
        nombre: actividadData.nombre,
        descripcion: actividadData.descripcion,
        fechaEjecucion: actividadData.fechaEjecucion,
        prioridad: actividadData.prioridad,
        cultivoId: actividadData.cultivoId,
        userId: actividadData.userId
        // No enviamos 'realizada' porque se establece automáticamente como false
      };
      
      console.log('🎯 URL del POST:', '/gestioncultivo/actividades');
      console.log('🎯 Datos originales del frontend:', actividadData);
      console.log('🎯 Datos para backend actualizado:', datosParaBackend);
      console.log('✅ BACKEND ACTUALIZADO: Ahora acepta estructura con nombre + fechaEjecucion');
      console.log('🎯 Validando campos para API actualizada:');
      console.log('  * nombre:', datosParaBackend.nombre ? '✅' : '❌', `"${datosParaBackend.nombre}"`);
      console.log('  * descripcion:', datosParaBackend.descripcion ? '✅' : '❌', `"${datosParaBackend.descripcion}"`);
      console.log('  * fechaEjecucion:', datosParaBackend.fechaEjecucion ? '✅' : '❌', `"${datosParaBackend.fechaEjecucion}"`);
      console.log('  * prioridad:', datosParaBackend.prioridad ? '✅' : '❌', `"${datosParaBackend.prioridad}"`);
      console.log('  * cultivoId:', datosParaBackend.cultivoId ? '✅' : '❌', datosParaBackend.cultivoId);
      console.log('  * userId:', datosParaBackend.userId ? '✅' : '❌', datosParaBackend.userId);
      
      const response = await api.post('/gestioncultivo/actividades', datosParaBackend);
      console.log('🎯 Actividad creada - response status:', response.status);
      console.log('🎯 Actividad creada - response data:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al registrar actividad:', error);
      console.error('❌ Error response status:', error.response?.status);
      console.error('❌ Error response data:', error.response?.data);
      console.error('❌ Error response headers:', error.response?.headers);
      console.error('❌ Error config:', error.config);
      throw new Error(error.response?.data?.message || 'Error al registrar actividad');
    }
  },

  // Obtener todas las actividades del usuario
  obtenerPorUsuario: async (userId) => {
    try {
      console.log('🎯 actividadService.obtenerPorUsuario - userId:', userId);
      console.log('🎯 URL completa que se va a llamar:', `/gestioncultivo/actividades/usuario/${userId}`);
      console.log('🎯 Tipo de userId:', typeof userId);
      
      const response = await api.get(`/gestioncultivo/actividades/usuario/${userId}`);
      console.log('🎯 Respuesta actividades usuario:', response.data);
      console.log('🎯 Status de respuesta:', response.status);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener actividades:', error);
      console.error('❌ Error response data:', error.response?.data);
      console.error('❌ Error response status:', error.response?.status);
      console.error('❌ Error response headers:', error.response?.headers);
      console.error('❌ Error config:', error.config);
      
      // Si es un 400, probablemente el usuario no tiene actividades
      if (error.response?.status === 400) {
        console.log('🔄 Error 400 - probablemente el usuario no tiene actividades, retornando array vacío');
        return []; // Retornar array vacío en lugar de error
      }
      
      throw new Error(error.response?.data?.message || 'Error al obtener actividades');
    }
  },

  // Actualizar una actividad
  actualizar: async (actividadId, actividadData) => {
    try {
      console.log('🔄 actividadService.actualizar - ID:', actividadId, 'datos:', actividadData);
      
      // ✅ ESTRUCTURA PARA ACTUALIZACIÓN COMPLETA
      const datosParaBackend = {
        nombre: actividadData.nombre,
        descripcion: actividadData.descripcion,
        fechaEjecucion: actividadData.fechaEjecucion,
        prioridad: actividadData.prioridad,
        realizada: actividadData.realizada || false,
        cultivoId: actividadData.cultivoId,
        userId: actividadData.userId
      };
      
      console.log('🔄 Datos para actualización:', datosParaBackend);
      const response = await api.put(`/gestioncultivo/actividades/${actividadId}`, datosParaBackend);
      console.log('✅ Actividad actualizada:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al actualizar actividad:', error);
      throw new Error(error.response?.data?.message || 'Error al actualizar actividad');
    }
  },

  // Marcar actividad como realizada
  marcarRealizada: async (actividadId) => {
    try {
      console.log('✅ Marcando actividad como realizada - ID:', actividadId);
      const response = await api.put(`/gestioncultivo/actividades/${actividadId}/realizada`);
      console.log('✅ Actividad marcada como realizada:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al marcar actividad como realizada:', error);
      throw new Error(error.response?.data?.message || 'Error al marcar actividad como realizada');
    }
  },

  // Crear actividad para cultivo específico
  crearParaCultivo: async (cultivoId, actividadData) => {
    try {
      console.log('🌱 Creando actividad para cultivo ID:', cultivoId, 'datos:', actividadData);
      
      const datosParaBackend = {
        nombre: actividadData.nombre,
        descripcion: actividadData.descripcion,
        fechaEjecucion: actividadData.fechaEjecucion,
        prioridad: actividadData.prioridad,
        userId: actividadData.userId
      };
      
      const response = await api.post(`/gestioncultivo/actividades/cultivo/${cultivoId}`, datosParaBackend);
      console.log('✅ Actividad creada para cultivo:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al crear actividad para cultivo:', error);
      throw new Error(error.response?.data?.message || 'Error al crear actividad para cultivo');
    }
  },

  // Obtener actividades por cultivo
  obtenerPorCultivo: async (cultivoId) => {
    try {
      console.log('📋 Obteniendo actividades para cultivo ID:', cultivoId);
      const response = await api.get(`/gestioncultivo/actividades/cultivo/${cultivoId}`);
      console.log('📋 Actividades del cultivo obtenidas:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener actividades del cultivo:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener actividades del cultivo');
    }
  },

  // Eliminar actividad
  eliminar: async (actividadId) => {
    try {
      console.log('🎯 actividadService.eliminar - ID:', actividadId);
      const response = await api.delete(`/gestioncultivo/actividades/${actividadId}`);
      console.log('🎯 Actividad eliminada');
      return response.data;
    } catch (error) {
      console.error('❌ Error al eliminar actividad:', error);
      throw new Error(error.response?.data?.message || 'Error al eliminar actividad');
    }
  },

  // Eliminar todas las actividades de un cultivo
  eliminarPorCultivo: async (cultivoId) => {
    try {
      console.log('🗑️ Eliminando todas las actividades del cultivo:', cultivoId);
      
      // Obtener las actividades del cultivo primero
      const actividades = await api.get(`/gestioncultivo/actividades/cultivo/${cultivoId}`);
      console.log(`📋 Encontradas ${actividades.data.length} actividades para eliminar`);
      
      // Eliminar cada actividad individualmente
      const eliminadas = [];
      for (const actividad of actividades.data) {
        try {
          await api.delete(`/gestioncultivo/actividades/${actividad.id}`);
          eliminadas.push(actividad.id);
          console.log(`✅ Actividad ${actividad.id} eliminada`);
        } catch (actError) {
          console.warn(`⚠️ No se pudo eliminar actividad ${actividad.id}:`, actError);
        }
      }
      
      console.log(`✅ ${eliminadas.length} actividades eliminadas del cultivo ${cultivoId}`);
      return { message: `${eliminadas.length} actividades eliminadas`, eliminadas };
      
    } catch (error) {
      console.error('❌ Error al eliminar actividades del cultivo:', error);
      // Si no hay actividades, no es un error crítico
      if (error.response?.status === 404) {
        console.log('ℹ️ No se encontraron actividades para este cultivo');
        return { message: 'No hay actividades para eliminar' };
      }
      throw new Error('Error al obtener actividades del cultivo');
    }
  }
};

export default actividadService;
