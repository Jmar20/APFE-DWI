import api from './api';
import { actividadesAutomaticasService } from './actividadesAutomaticasService';
import actividadService from './actividadService';
import alertaService from './alertaService';

// SERVICIO PARA GESTIÓN DE CULTIVOS - FORMATO ACTUALIZADO
const cultivoService = {
  
  // Registrar nuevo cultivo
  async registrar(cultivoData) {
    console.log('=== ✅ CREANDO CULTIVO - FRONTEND COMPLETO, BACKEND ADAPTATIVO ===');
    console.log('Datos recibidos:', cultivoData);

    try {
      // Construir el objeto de cultivo adaptándose al backend
      const cultivoCompleto = {
        // CAMPOS BÁSICOS QUE EL BACKEND ESPERA ✅
        tipo: cultivoData.tipo,
        variedad: cultivoData.variedad || '',
        fechaSiembra: cultivoData.fechaSiembra,
        fechaCosechaEstimada: cultivoData.fechaCosechaEstimada || null,
        estado: 'ACTIVO',
        usuarioId: cultivoData.usuarioId,

        // CAMPOS ADICIONALES DE FRONTEND - Se ignorarán si backend no los soporta
        descripcion: cultivoData.descripcion || `Cultivo de ${cultivoData.tipo}`,
        ubicacion: cultivoData.ubicacion || '',
        area: cultivoData.area || null,
        notas: cultivoData.notas || '',
        
        // CAMPOS ESPECÍFICOS DE PARCELA
        parcela: cultivoData.parcela ? {
          nombre: cultivoData.parcela.nombre || `Parcela ${cultivoData.tipo}`,
          ubicacion: cultivoData.parcela.ubicacion || '',
          area: cultivoData.parcela.area || 0,
          usuarioId: cultivoData.usuarioId
        } : null
      };

      console.log('📤 Enviando al backend:', JSON.stringify(cultivoCompleto, null, 2));

      // Registrar cultivo
      const response = await api.post('/gestioncultivo/cultivos', cultivoCompleto);
      console.log('🎉 ¡Cultivo registrado exitosamente!');
      console.log('📥 Respuesta del backend:', response.data);

      const cultivoCreado = response.data;

      // 🤖 GENERAR ACTIVIDADES AUTOMÁTICAS
      try {
        console.log('🤖 Generando actividades automáticas...');
        await actividadesAutomaticasService.generarActividades(
          cultivoCreado.id,
          cultivoCreado.tipo,
          cultivoCreado.fechaSiembra
        );
        console.log('✅ Actividades automáticas generadas');
      } catch (actError) {
        console.warn('⚠️ Error generando actividades automáticas:', actError);
        // No fallar todo el proceso por esto
      }

      return cultivoCreado;
    } catch (error) {
      console.error('❌ Error al registrar cultivo:', error);
      console.error('📋 Datos que se intentaron enviar:', cultivoData);
      
      if (error.response) {
        console.error('📋 Respuesta del backend:', error.response.data);
        console.error('📋 Status:', error.response.status);
      }
      
      throw new Error(error.response?.data?.message || 'Error al registrar cultivo');
    }
  },

  // Obtener todos los cultivos de un usuario
  async obtenerPorUsuario(usuarioId) {
    try {
      console.log('🔍 Obteniendo cultivos para usuario:', usuarioId);
      const response = await api.get(`/gestioncultivo/cultivos/usuario/${usuarioId}`);
      console.log('📦 Cultivos obtenidos:', response.data?.length || 0);
      return response.data || [];
    } catch (error) {
      console.error('❌ Error al obtener cultivos:', error);
      
      // Si es 404, significa que no hay cultivos, devolver array vacío
      if (error.response?.status === 404) {
        console.log('ℹ️ No se encontraron cultivos para el usuario');
        return [];
      }
      
      throw new Error(error.response?.data?.message || 'Error al obtener cultivos');
    }
  },

  // Obtener un cultivo por ID
  async obtenerPorId(cultivoId) {
    try {
      console.log('🔍 Obteniendo cultivo por ID:', cultivoId);
      const response = await api.get(`/gestioncultivo/cultivos/${cultivoId}`);
      console.log('📦 Cultivo obtenido:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener cultivo:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener cultivo');
    }
  },

  // Actualizar un cultivo
  async actualizar(cultivoId, cultivoData) {
    try {
      console.log('📝 Actualizando cultivo:', cultivoId);
      console.log('📝 Datos de actualización:', cultivoData);
      
      const response = await api.put(`/gestioncultivo/cultivos/${cultivoId}`, cultivoData);
      console.log('✅ Cultivo actualizado');
      return response.data;
    } catch (error) {
      console.error('❌ Error al actualizar cultivo:', error);
      throw new Error(error.response?.data?.message || 'Error al actualizar cultivo');
    }
  },

  // Eliminar un cultivo (método directo)
  async eliminar(cultivoId) {
    try {
      console.log('🗑️ Eliminando cultivo:', cultivoId);
      const response = await api.delete(`/gestioncultivo/cultivos/${cultivoId}`);
      console.log('✅ Cultivo eliminado correctamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error al eliminar cultivo:', error);
      
      const errorData = error.response?.data;
      const errorMessage = errorData?.message || errorData?.error || 'Error al eliminar cultivo';
      
      // Mensajes más específicos según el tipo de error
      if (error.response?.status === 400) {
        if (errorMessage.includes('foreign key') || 
            errorMessage.includes('constraint') || 
            errorMessage.includes('referencia') ||
            errorMessage.includes('dependency')) {
          throw new Error('❌ El cultivo tiene actividades o alertas asociadas.\n\n💡 Solución: Ve a la sección de "Actividades" y elimina primero todas las actividades de este cultivo.');
        }
      }
      
      if (error.response?.status === 404) {
        throw new Error('El cultivo no existe o ya fue eliminado.');
      }
      
      throw new Error(errorMessage);
    }
  },

  // Función para depurar el registro de cultivos
  async debug_registrarConVerificacion(cultivoData) {
    console.log('🔍 DEBUG: Registrando cultivo con datos:', JSON.stringify(cultivoData, null, 2));
    
    try {
      const resultado = await this.registrar(cultivoData);
      console.log('🔍 DEBUG: Cultivo registrado exitosamente:', resultado);
      return resultado;
    } catch (error) {
      console.log('🔍 DEBUG: Error en registro:', error.message);
      throw error;
    }
  },

  // Función para obtener estadísticas de cultivos de un usuario
  async obtenerEstadisticas(usuarioId) {
    try {
      console.log('📊 Obteniendo estadísticas de cultivos para usuario:', usuarioId);
      const cultivos = await this.obtenerPorUsuario(usuarioId);
      
      const estadisticas = {
        total: cultivos.length,
        activos: cultivos.filter(c => c.estado === 'ACTIVO').length,
        porTipo: cultivos.reduce((acc, cultivo) => {
          const tipo = cultivo.tipo || 'Sin tipo';
          acc[tipo] = (acc[tipo] || 0) + 1;
          return acc;
        }, {}),
        proximosCosecha: cultivos.filter(c => {
          if (!c.fechaCosechaEstimada) return false;
          const fechaCosecha = new Date(c.fechaCosechaEstimada);
          const hoy = new Date();
          const diasDiferencia = Math.ceil((fechaCosecha - hoy) / (1000 * 60 * 60 * 24));
          return diasDiferencia >= 0 && diasDiferencia <= 30; // Próximos 30 días
        }).length
      };
      
      console.log('📊 Estadísticas calculadas:', estadisticas);
      return estadisticas;
    } catch (error) {
      console.error('❌ Error al obtener estadísticas:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener estadísticas');
    }
  }
};

export default cultivoService;
