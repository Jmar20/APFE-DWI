import api from './api';
import { actividadesAutomaticasService } from './actividadesAutomaticasService';
import actividadService from './actividadService';
import alertaService from './alertaService';
import mockMode from '../config/mockMode'; // 🆕 Importar modo mock

// SERVICIO PARA GESTIÓN DE CULTIVOS - FORMATO ACTUALIZADO
const cultivoService = {
  
  // Registrar nuevo cultivo
  async registrar(cultivoData) {
    console.log('=== ✅ CREANDO CULTIVO - FRONTEND COMPLETO, BACKEND ADAPTATIVO ===');
    console.log('Datos recibidos:', cultivoData);

    // 🧪 MODO MOCK - Para desarrollo sin backend
    if (mockMode.enabled) {
      console.log('🧪 MODO MOCK ACTIVADO - Simulando creación de cultivo');
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const cultivoCreado = mockMode.mockResponses.createCultivo(cultivoData);
      console.log('🎉 ¡Cultivo creado en modo mock!', cultivoCreado);
      
      // Agregar a la lista mock
      mockMode.mockCultivos.push(cultivoCreado);
      
      return cultivoCreado;
    }

    // ✅ VALIDAR QUE TENEMOS UN USUARIO ID
    const usuarioId = cultivoData.usuarioId || cultivoData.userId;
    if (!usuarioId) {
      throw new Error('Usuario no identificado. Inicia sesión nuevamente.');
    }

    try {
      // Construir el objeto de cultivo MÍNIMO para evitar errores 400
      const cultivoCompleto = {
        // CAMPOS BÁSICOS OBLIGATORIOS ✅
        tipo: cultivoData.tipo,
        variedad: cultivoData.variedad || '',
        fechaSiembra: cultivoData.fechaSiembra,
        estado: 'ACTIVO',
        userId: usuarioId, // ✅ CORREGIDO: Backend espera 'userId', no 'usuarioId'
      };

      // ✅ AGREGAR PARCELA ID SI ESTÁ PRESENTE
      if (cultivoData.parcelaId) {
        cultivoCompleto.parcelaId = cultivoData.parcelaId;
      }

      // Solo agregar fechaCosechaEstimada si no es null
      if (cultivoData.fechaCosechaEstimada) {
        cultivoCompleto.fechaCosechaEstimada = cultivoData.fechaCosechaEstimada;
      }

      // Solo agregar campos opcionales si están presentes y no son null/undefined
      if (cultivoData.descripcion) {
        cultivoCompleto.descripcion = cultivoData.descripcion;
      }
      if (cultivoData.ubicacion) {
        cultivoCompleto.ubicacion = cultivoData.ubicacion;
      }
      if (cultivoData.area && cultivoData.area > 0) {
        cultivoCompleto.area = cultivoData.area;
      }
      if (cultivoData.notas) {
        cultivoCompleto.notas = cultivoData.notas;
      }

      console.log('📤 Enviando al backend:', JSON.stringify(cultivoCompleto, null, 2));

      // Registrar cultivo
      const response = await api.post('/gestioncultivo/cultivos', cultivoCompleto);
      console.log('🎉 ¡Cultivo registrado exitosamente!');
      console.log('📥 Respuesta del backend:', response.data);

      const cultivoCreado = response.data;

      // 🤖 GENERAR ACTIVIDADES AUTOMÁTICAS
      try {
        console.log('🤖 Generando actividades automáticas...');
        console.log('🤖 Datos del cultivo creado:', cultivoCreado);
        
        await actividadesAutomaticasService.generarActividades(
          cultivoCreado.id,
          cultivoCreado.tipo,
          cultivoCreado.fechaSiembra,
          cultivoCreado.userId || usuarioId // ✅ Pasar el userId
        );
        console.log('✅ Actividades automáticas generadas');
      } catch (actError) {
        console.warn('⚠️ Error generando actividades automáticas:', actError);
        console.warn('⚠️ Detalles del error:', actError.message);
        // No fallar todo el proceso por esto
      }

      return cultivoCreado;
    } catch (error) {
      console.error('❌ Error al registrar cultivo:', error);
      console.error('📋 Datos que se intentaron enviar:', cultivoData);
      console.error('📋 Objeto final enviado:', cultivoCompleto);
      
      if (error.response) {
        console.error('📋 Respuesta del backend:', error.response.data);
        console.error('📋 Status:', error.response.status);
        console.error('📋 Headers:', error.response.headers);
        
        // Analizar el tipo de error
        if (error.response.status === 400) {
          const errorMsg = error.response.data?.message || error.response.data || 'Datos inválidos';
          throw new Error(`Error de validación: ${errorMsg}`);
        } else if (error.response.status === 401) {
          throw new Error('No autorizado. Inicia sesión nuevamente.');
        } else if (error.response.status === 403) {
          throw new Error('Sin permisos para crear cultivos.');
        } else if (error.response.status === 500) {
          throw new Error('Error interno del servidor. Intenta nuevamente.');
        }
      }
      
      throw new Error(error.response?.data?.message || error.message || 'Error al registrar cultivo');
    }
  },

  // Obtener todos los cultivos de un usuario
  async obtenerPorUsuario(usuarioId) {
    try {
      // 🧪 MODO MOCK - Para desarrollo sin backend
      if (mockMode.enabled) {
        console.log('🧪 MODO MOCK - Obteniendo cultivos para usuario:', usuarioId);
        
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const cultivos = mockMode.mockResponses.getCultivos(usuarioId);
        console.log('📦 Cultivos obtenidos (mock):', cultivos.length);
        return cultivos;
      }

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

  // ========================================
  // 🗑️ MÉTODOS DE ELIMINACIÓN DE CULTIVOS
  // ========================================
  // 
  // El backend ahora soporta eliminación en cascada:
  // 
  // ✅ eliminarConCascade(id)     - Elimina cultivo + actividades + alertas (RECOMENDADO)
  // ⚠️  eliminarSinCascade(id)    - Elimina solo el cultivo (puede fallar si hay dependencias)
  // 🔧 eliminar(id, cascade)      - Método base con opción de cascade
  // 
  // Backend endpoints:
  // DELETE /cultivos/{id}?cascade=true   - Eliminación completa
  // DELETE /cultivos/{id}                - Eliminación directa
  // ========================================

  // Eliminar un cultivo (con opción de cascade)
  async eliminar(cultivoId, cascade = true) {
    try {
      console.log('🗑️ Eliminando cultivo:', cultivoId, cascade ? 'con cascade' : 'sin cascade');
      
      const url = cascade 
        ? `/gestioncultivo/cultivos/${cultivoId}?cascade=true`
        : `/gestioncultivo/cultivos/${cultivoId}`;
      
      const response = await api.delete(url);
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
          throw new Error('❌ El cultivo tiene actividades o alertas asociadas.\n\n💡 Solución: Intenta con eliminación en cascada o ve a "Actividades" para eliminarlas manualmente.');
        }
      }
      
      if (error.response?.status === 404) {
        throw new Error('El cultivo no existe o ya fue eliminado.');
      }
      
      throw new Error(errorMessage);
    }
  },

  // Eliminar cultivo sin cascade (método directo)
  async eliminarSinCascade(cultivoId) {
    return this.eliminar(cultivoId, false);
  },

  // Eliminar cultivo con cascade (método recomendado)
  async eliminarConCascade(cultivoId) {
    return this.eliminar(cultivoId, true);
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
