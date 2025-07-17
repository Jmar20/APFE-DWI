import { actividadService } from './actividadService';
import { obtenerActividadesPorTipo, calcularFechasActividades } from '../utils/actividadesPredeterminadas';

// Servicio para generar actividades automáticamente al crear cultivos
export const actividadesAutomaticasService = {
  
  // Generar y guardar actividades predeterminadas para un cultivo
  generarActividadesParaCultivo: async (cultivoData) => {
    try {
      console.log('🤖 GENERANDO ACTIVIDADES AUTOMÁTICAS para cultivo:', cultivoData);
      
      // 1. Obtener plantilla de actividades según el tipo de cultivo
      const actividadesTemplate = obtenerActividadesPorTipo(cultivoData.tipo);
      console.log('📋 Plantilla de actividades obtenida:', actividadesTemplate.length, 'actividades');
      
      // 2. Calcular fechas basadas en la fecha de siembra
      const actividadesConFechas = calcularFechasActividades(cultivoData.fechaSiembra, actividadesTemplate);
      console.log('📅 Actividades con fechas calculadas:', actividadesConFechas);
      
      // 3. Crear cada actividad en el backend
      const actividadesCreadas = [];
      
      for (const actividad of actividadesConFechas) {
        try {
          const actividadData = {
            nombre: actividad.nombre,
            descripcion: `${actividad.descripcion} - ${cultivoData.tipo} ${cultivoData.variedad ? `(${cultivoData.variedad})` : ''}`,
            fechaEjecucion: actividad.fechaEjecucion,
            prioridad: actividad.prioridad,
            cultivoId: cultivoData.id, // ID del cultivo recién creado
            userId: cultivoData.userId
          };
          
          console.log('🌱 Creando actividad automática:', actividadData.nombre, 'para fecha:', actividadData.fechaEjecucion);
          
          const actividadCreada = await actividadService.registrar(actividadData);
          actividadesCreadas.push(actividadCreada);
          
          console.log('✅ Actividad creada:', actividadCreada);
          
        } catch (error) {
          console.error('❌ Error al crear actividad individual:', actividad.nombre, error);
          // Continuar con las demás actividades aunque una falle
        }
      }
      
      console.log('🎉 ACTIVIDADES AUTOMÁTICAS COMPLETADAS:');
      console.log(`✅ Total creadas: ${actividadesCreadas.length}/${actividadesConFechas.length}`);
      console.log('📋 Actividades:', actividadesCreadas.map(a => a.nombre));
      
      return {
        success: true,
        actividadesCreadas: actividadesCreadas.length,
        total: actividadesConFechas.length,
        actividades: actividadesCreadas
      };
      
    } catch (error) {
      console.error('❌ ERROR GENERAL al generar actividades automáticas:', error);
      return {
        success: false,
        error: error.message,
        actividadesCreadas: 0
      };
    }
  },
  
  // Función para previsualizar las actividades que se generarían
  previsualizarActividades: (tipoCultivo, fechaSiembra, variedad = '') => {
    try {
      const actividadesTemplate = obtenerActividadesPorTipo(tipoCultivo);
      const actividadesConFechas = calcularFechasActividades(fechaSiembra, actividadesTemplate);
      
      return actividadesConFechas.map(actividad => ({
        ...actividad,
        descripcion: `${actividad.descripcion}${variedad ? ` - ${tipoCultivo} (${variedad})` : ` - ${tipoCultivo}`}`
      }));
    } catch (error) {
      console.error('❌ Error al previsualizar actividades:', error);
      return [];
    }
  },

  // 🆕 Alias para compatibilidad - Esta es la función que se llama desde cultivoService
  generarActividades: async (cultivoId, tipoCultivo, fechaSiembra, userId = null) => {
    try {
      console.log('🤖 Generando actividades para cultivo ID:', cultivoId, 'tipo:', tipoCultivo);
      
      // Convertir parámetros al formato que espera la función principal
      const cultivoData = {
        id: cultivoId,
        tipo: tipoCultivo,
        fechaSiembra: fechaSiembra,
        userId: userId // Se pasa desde cultivoService
      };
      
      return await actividadesAutomaticasService.generarActividadesParaCultivo(cultivoData);
    } catch (error) {
      console.error('❌ Error en generarActividades:', error);
      throw error;
    }
  }
};
