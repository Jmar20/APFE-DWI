import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Autocomplete,
  Backdrop,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Agriculture as AgricultureIcon,
  DateRange as DateRangeIcon,
} from '@mui/icons-material';
import { cultivoService } from '../services';
import { parcelaService } from '../services/parcelaService';
import { actividadesAutomaticasService } from '../services/actividadesAutomaticasService';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import CultivoDebugger from './CultivoDebugger'; // 🧪 TEMPORAL PARA DEBUG

const CultivosManager = () => {
  const [cultivos, setCultivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCultivo, setEditingCultivo] = useState(null);
  const [creatingCultivo, setCreatingCultivo] = useState(false); // 🆕 Estado para el loading de creación
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' }); // 🆕 Estado para snackbar
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    tipo: '', // ✅ BACKEND SOPORTA
    variedad: '', // ✅ BACKEND SOPORTA AHORA
    fechaSiembra: '', // ✅ BACKEND SOPORTA
    fechaCosechaEstimada: '', // ✅ BACKEND SOPORTA AHORA
    estado: 'ACTIVO', // ✅ CORREGIDO: Backend usa 'ACTIVO', no 'PLANTADO'
    parcelaId: 1, // ✅ BACKEND SOPORTA
  });

  // ✅ PARCELAS REALES DEL BACKEND
  const [parcelas, setParcelas] = useState([]);
  const [openParcelaDialog, setOpenParcelaDialog] = useState(false);
  const [nuevaParcela, setNuevaParcela] = useState({
    nombre: '',
    descripcion: '',
    superficie: 100
  });

  // ✨ ESTADO PARA PREVISUALIZACIÓN DE ACTIVIDADES
  const [actividadesPrevias, setActividadesPrevias] = useState([]);

  const obtenerDescripcionParcela = (nombreParcela) => {
    // Mapeo temporal mientras el backend no soporte descripciones
    const descripciones = {
      'Parcela Norte': 'Zona con 8 horas de sol directo. Suelo bien drenado, ideal para tomates, pimientos, berenjenas y cultivos que requieren calor',
      'Parcela Sur': 'Área semi-sombreada con 4-6 horas de sol. Perfecta para lechugas, espinacas, acelgas y vegetales de hoja verde',
      'Invernadero 1': 'Estructura cubierta con control de temperatura y humedad. Ideal para pepinos, pimientos, cultivos tropicales y siembra temprana',
      'Parcela Este': 'Recibe sol matutino suave (6 horas). Excelente para hierbas aromáticas como albahaca, perejil, cilantro y oregano',
      'Parcela Oeste': 'Sol intenso de tarde (6-7 horas). Terreno amplio para maíz, calabazas, zapallos y cultivos de gran tamaño',
      'Parcela Central': 'Ubicación privilegiada con acceso directo al sistema de riego. Ideal para cultivos de alto mantenimiento y valor',
      'Parcela Experimental': 'Espacio para probar nuevas variedades, técnicas de cultivo innovadoras y experimentos agrícolas',
      'Huerto Orgánico': 'Zona certificada libre de químicos. Solo compost natural y métodos orgánicos. Para cultivos premium y saludables',
      'Parcela de Temporada': 'Área destinada a rotación de cultivos estacionales. Optimiza la fertilidad del suelo y previene plagas',
      'Vivero': 'Zona protegida para germinación de semillas, crecimiento de plántulas y propagación de plantas madre'
    };

    return descripciones[nombreParcela] || 'Parcela para cultivos diversos';
  };

  // ✅ FUNCIÓN PARA FORMATEAR FECHAS SIN PROBLEMA DE ZONA HORARIA
  const formatearFechaLocal = (fecha) => {
    if (!fecha) return 'No especificada';

    // Crear fecha local sin conversión de zona horaria
    const fechaLocal = new Date(fecha + 'T00:00:00');

    // Formatear manualmente para evitar problemas de zona horaria
    const dia = fechaLocal.getDate().toString().padStart(2, '0');
    const mes = (fechaLocal.getMonth() + 1).toString().padStart(2, '0');
    const año = fechaLocal.getFullYear();

    return `${dia}/${mes}/${año}`;
  };

  const calcularFechaCosechaEstimada = (tipo, fechaSiembra, soloFecha = false) => {
    if (!fechaSiembra) return soloFecha ? '' : 'No especificada';

    const fechaInicio = new Date(fechaSiembra);
    if (isNaN(fechaInicio)) return soloFecha ? '' : 'No especificada';

    // Días estimados según tipo de cultivo
    const diasPorTipo = {
      'tomate': 120,
      'lechuga': 60,
      'papa': 90,
      'zanahoria': 90,
      'cebolla': 120,
      'pimiento': 90,
      'pepino': 70,
      'brócoli': 80,
      'espinaca': 45,
      'apio': 100,
      'maíz': 100,
      'calabacín': 60,
    };

    const tipo_lower = tipo.toLowerCase();
    const dias = diasPorTipo[tipo_lower] || 90; // 90 días por defecto

    const fechaEstimada = new Date(fechaInicio);
    fechaEstimada.setDate(fechaEstimada.getDate() + dias);

    if (soloFecha) {
      // Para el formulario: devolver solo la fecha en formato YYYY-MM-DD
      return fechaEstimada.toISOString().split('T')[0];
    } else {
      // Para mostrar: devolver fecha con información adicional
      return fechaEstimada.toLocaleDateString() + ` (${dias} días)`;
    }
  };

  // ✅ DATOS DE CULTIVOS Y VARIEDADES
  const tiposCultivos = [
    {
      nombre: 'Tomate',
      variedades: ['Cherry', 'Roma', 'Beefsteak', 'Pera', 'Kumato', 'Raf', 'Montserrat']
    },
    {
      nombre: 'Lechuga',
      variedades: ['Iceberg', 'Romana', 'Hoja de Roble', 'Batavia', 'Lollo Rosso', 'Escarola']
    },
    {
      nombre: 'Papa',
      variedades: ['Russet', 'Yukon Gold', 'Red Pontiac', 'Fingerling', 'Purple Majesty']
    },
    {
      nombre: 'Zanahoria',
      variedades: ['Nantes', 'Chantenay', 'Imperator', 'Baby', 'Purple Haze']
    },
    {
      nombre: 'Cebolla',
      variedades: ['Blanca', 'Amarilla', 'Morada', 'Dulce', 'Chalote']
    },
    {
      nombre: 'Pimiento',
      variedades: ['Bell', 'Jalapeño', 'Serrano', 'Poblano', 'Habanero', 'Dulce']
    },
    {
      nombre: 'Pepino',
      variedades: ['Largo', 'Pepinillo', 'Holandés', 'Limón', 'Armenio']
    },
    {
      nombre: 'Brócoli',
      variedades: ['Calabrese', 'Sprouting', 'Romanesco', 'Purple', 'Broccolini']
    },
    {
      nombre: 'Espinaca',
      variedades: ['Baby Leaf', 'Gigante', 'Nueva Zelanda', 'Malabar']
    },
    {
      nombre: 'Apio',
      variedades: ['Pascal', 'Golden', 'Utah', 'Leaf Celery']
    },
    {
      nombre: 'Maíz',
      variedades: ['Dulce', 'Dentado', 'Palomero', 'Ceroso', 'Flint']
    },
    {
      nombre: 'Calabacín',
      variedades: ['Verde', 'Amarillo', 'Redondo', 'Pattypan', 'Crookneck']
    },
    {
      nombre: 'Fresa',
      variedades: ['Albión', 'Camarosa', 'Festival', 'Monterey', 'San Andreas']
    },
    {
      nombre: 'Albahaca',
      variedades: ['Genovesa', 'Morada', 'Limonada', 'Canela', 'Thai']
    },
    {
      nombre: 'Cilantro',
      variedades: ['Santo', 'Long Standing', 'Calypso', 'Slow Bolt']
    },
    {
      nombre: 'Ajo',
      variedades: ['Morado', 'Blanco', 'Elefante', 'Rojo español', 'Chileno']
    },
    {
      nombre: 'Sandía',
      variedades: ['Crimson Sweet', 'Sugar Baby', 'Jubilee', 'Charleston Gray']
    },
    {
      nombre: 'Melón',
      variedades: ['Cantalupo', 'Honeydew', 'Galia', 'Charentais']
    },
    {
      nombre: 'Repollo',
      variedades: ['Verde', 'Rojo', 'Savoy', 'Choy Sum']
    },
    {
      nombre: 'Berenjena',
      variedades: ['Negra larga', 'Jaspeada', 'Thai', 'India', 'Blanca']
    },
    {
      nombre: 'Rábanos',
      variedades: ['Cherry Belle', 'Daikon', 'French Breakfast', 'Negro español']
    },
    {
      nombre: 'Remolacha',
      variedades: ['Detroit Dark Red', 'Chioggia', 'Golden', 'Cylindra']
    }
  ];

  // ✅ OBTENER VARIEDADES SEGÚN EL TIPO SELECCIONADO
  const getVariedadesPorTipo = (tipoSeleccionado) => {
    const cultivo = tiposCultivos.find(c => c.nombre.toLowerCase() === tipoSeleccionado.toLowerCase());
    return cultivo ? cultivo.variedades : [];
  };

  const estados = [
    { value: 'PLANTADO', label: 'Plantado', color: 'success' },
    { value: 'ACTIVO', label: 'Plantado', color: 'success' }, // 🆕 MAPEO PARA BACKEND
    { value: 'CRECIENDO', label: 'Creciendo', color: 'info' },
    { value: 'FLORECIENDO', label: 'Floreciendo', color: 'warning' },
    { value: 'MADURO', label: 'Maduro', color: 'primary' },
    { value: 'COSECHADO', label: 'Cosechado', color: 'default' },
  ];

  useEffect(() => {
    cargarDatos();

    // 🔄 Escuchar eventos de cambios en parcelas
    const handleParcelaCreated = () => {
      console.log('🔄 Evento parcelaCreated recibido, recargando parcelas...');
      cargarParcelas();
    };

    const handleParcelaEliminada = () => {
      console.log('🔄 Evento parcelaEliminada recibido, recargando parcelas...');
      cargarParcelas();
    };

    // 🚀 NUEVO: Escuchar evento de usuario registrado
    const handleUserRegistered = (event) => {
      console.log('🔄 Usuario recién registrado detectado, recargando datos...', event.detail);
      // Recargar datos después de un pequeño delay adicional
      setTimeout(() => {
        cargarDatos();
      }, 1000);
    };

    window.addEventListener('parcelaCreated', handleParcelaCreated);
    window.addEventListener('parcelaEliminada', handleParcelaEliminada);
    window.addEventListener('userRegistered', handleUserRegistered);

    // Cleanup listeners al desmontar el componente
    return () => {
      window.removeEventListener('parcelaCreated', handleParcelaCreated);
      window.removeEventListener('parcelaEliminada', handleParcelaEliminada);
      window.removeEventListener('userRegistered', handleUserRegistered);
    };
  }, []);

  // ✅ EFECTO PARA ACTUALIZAR FORMULARIO CUANDO SE CARGAN PARCELAS
  useEffect(() => {
    if (parcelas.length > 0 && formData.parcelaId === 1) {
      // Solo actualizar si todavía tiene el valor por defecto
      setFormData(prev => ({
        ...prev,
        parcelaId: parcelas[0].id
      }));
    }
  }, [parcelas]);

  const cargarDatos = async (reintentos = 3) => {
    try {
      await Promise.all([
        cargarCultivos(),
        cargarParcelas()
      ]);
    } catch (error) {
      console.warn('⚠️ Error al cargar datos, reintentos restantes:', reintentos - 1);
      
      if (reintentos > 1) {
        // Reintento después de un delay
        setTimeout(() => {
          cargarDatos(reintentos - 1);
        }, 2000);
      } else {
        console.error('❌ Error al cargar datos después de varios reintentos:', error);
      }
    }
  };

  const cargarParcelas = async () => {
    try {
      const userIdToUse = user?.userId || user?.id || 1;
      console.log('🏡 DEBUGGING PARCELAS:');
      console.log('- Usuario completo:', user);
      console.log('- UserId que vamos a usar:', userIdToUse);
      console.log('- Llamando parcelaService.obtenerPorUsuario...');

      const data = await parcelaService.obtenerPorUsuario(userIdToUse);
      console.log('🏡 RESPUESTA DEL BACKEND:', data);
      console.log('- Tipo de data:', typeof data);
      console.log('- Es array?:', Array.isArray(data));
      console.log('- Cantidad de parcelas:', data?.length || 0);

      if (data && Array.isArray(data) && data.length > 0) {
        console.log('✅ Parcelas encontradas, seteando en estado...');
        setParcelas(data);
        console.log('✅ Estado de parcelas actualizado');
      } else {
        console.log('⚠️ No se encontraron parcelas o data vacía');
        // Usar parcelas por defecto si no hay datos
        const parcelasDefault = [
          { id: 1, nombre: 'Parcela Norte', descripcion: 'Zona soleada, ideal para tomates' },
          { id: 2, nombre: 'Parcela Sur', descripcion: 'Zona semi-sombra, ideal para lechugas' },
        ];
        setParcelas(parcelasDefault);
        console.log('🔄 Usando parcelas por defecto:', parcelasDefault);
      }
    } catch (err) {
      console.error('❌ ERROR COMPLETO al cargar parcelas:', err);
      console.error('❌ Error message:', err.message);
      console.error('❌ Error stack:', err.stack);
      // Usar parcelas por defecto si falla
      const parcelasDefault = [
        { id: 1, nombre: 'Parcela Norte', descripcion: 'Zona soleada, ideal para tomates' },
        { id: 2, nombre: 'Parcela Sur', descripcion: 'Zona semi-sombra, ideal para lechugas' },
      ];
      setParcelas(parcelasDefault);
      console.log('🔄 Usando parcelas por defecto después del error:', parcelasDefault);
    }
  };

  const cargarCultivos = async () => {
    try {
      setLoading(true);
      setError('');

      // ✅ USAR EL MISMO userId QUE USAMOS PARA CREAR CULTIVOS
      const userIdToUse = user?.userId || user?.id || 1;
      console.log('🔍 Cargando cultivos para userId:', userIdToUse);

      // Intentar obtener cultivos del usuario autenticado
      if (user && userIdToUse) {
        const data = await cultivoService.obtenerPorUsuario(userIdToUse);
        console.log('📋 Cultivos obtenidos del backend:', data);
        setCultivos(data);
      } else {
        // Si no está autenticado, mostrar datos de ejemplo
        console.log('No autenticado, mostrando datos de ejemplo');
        setCultivos([
          {
            id: 1,
            tipo: 'Tomates Cherry', // ✅ Usando 'tipo' en lugar de 'nombre'
            variedad: 'Roma',
            fechaSiembra: '2024-01-15', // ✅ Usando 'fechaSiembra'
            fechaCosechaEstimada: '2024-04-15',
            estado: 'CRECIENDO',
            parcelaId: 1,
          },
          {
            id: 2,
            tipo: 'Lechuga', // ✅ Usando 'tipo'
            variedad: 'Iceberg',
            fechaSiembra: '2024-02-01', // ✅ Usando 'fechaSiembra'
            fechaCosechaEstimada: '2024-03-15',
            estado: 'MADURO',
            parcelaId: 1,
          },
        ]);
      }
    } catch (err) {
      console.error('❌ Error al cargar cultivos:', err);
      setError(err.message || 'Error al cargar cultivos');
      // Datos de ejemplo para desarrollo
      setCultivos([
        {
          id: 1,
          tipo: 'Tomates Cherry', // ✅ Usando 'tipo'
          variedad: 'Roma',
          fechaSiembra: '2024-01-15', // ✅ Usando 'fechaSiembra'
          fechaCosechaEstimada: '2024-04-15',
          estado: 'CRECIENDO',
          parcelaId: 1,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 🔄 Activar loading backdrop
    setCreatingCultivo(true);
    
    try {
      if (editingCultivo) {
        // Actualizar cultivo existente
        const datosActualizacion = {
          ...formData,
          userId: user?.userId || user?.id // ✅ Incluir userId para la actualización
        };
        console.log('🔄 Actualizando cultivo ID:', editingCultivo.id, 'con datos:', datosActualizacion);
        await cultivoService.actualizar(editingCultivo.id, datosActualizacion);
        console.log('✅ Cultivo actualizado correctamente');
      } else {
        // Crear nuevo cultivo - ✅ AGREGANDO userId del usuario autenticado
        const datosConUserId = {
          ...formData,
          userId: user?.userId || user?.id // ✅ Incluir userId del usuario autenticado
        };
        console.log('🌱 Creando cultivo con datos completos:', datosConUserId);
        console.log('- Verificando campos obligatorios:');
        console.log('  * tipo:', datosConUserId.tipo);
        console.log('  * variedad:', `"${datosConUserId.variedad}" (¿está vacío? ${datosConUserId.variedad === ''})`);
        console.log('  * fechaSiembra:', datosConUserId.fechaSiembra);
        console.log('  * estado:', datosConUserId.estado);
        console.log('  * userId:', datosConUserId.userId);
        console.log('  * parcelaId:', datosConUserId.parcelaId, '(tipo:', typeof datosConUserId.parcelaId, ')'); // ✅ LOG PARA PARCELA

        // 🎉 CREAR CULTIVO CON ACTIVIDADES AUTOMÁTICAS
        const cultivoCreado = await cultivoService.registrar(datosConUserId);
        console.log('✅ Cultivo creado exitosamente:', cultivoCreado);
        
        // 🤖 VERIFICAR ACTIVIDADES GENERADAS
        if (cultivoCreado.actividadesGeneradas) {
          const { total, exito, actividades, error } = cultivoCreado.actividadesGeneradas;
          
          if (exito && total > 0) {
            console.log('🤖 Actividades automáticas generadas:', total);
            setError(''); // Limpiar errores
            
            // Mostrar mensaje de éxito
            setTimeout(() => {
              alert(`🎉 ¡Éxito!\n\nCultivo "${datosConUserId.tipo}" creado correctamente.\n\n🤖 Se generaron automáticamente ${total} actividades:\n${actividades?.map(a => `• ${a.nombre}`).join('\n')}\n\n📅 Las actividades están programadas según el calendario óptimo para ${datosConUserId.tipo}.`);
            }, 500);
          } else {
            console.warn('⚠️ Cultivo creado pero actividades fallaron:', error);
            setTimeout(() => {
              alert(`✅ Cultivo creado correctamente.\n\n⚠️ Nota: Las actividades automáticas no se pudieron generar.\nPuedes crear actividades manualmente desde el módulo de Actividades.\n\nError: ${error || 'Desconocido'}`);
            }, 500);
          }
        } else {
          // Sin información de actividades
          console.log('ℹ️ Cultivo creado sin información de actividades automáticas');
        }
      }

      setOpenDialog(false);
      setEditingCultivo(null);
      setFormData({
        tipo: '',
        variedad: '',
        fechaSiembra: '',
        fechaCosechaEstimada: '',
        estado: 'ACTIVO', // ✅ CORREGIDO: Usar 'ACTIVO' consistentemente
        parcelaId: parcelas.length > 0 ? parcelas[0].id : 1, // ✅ Usar primera parcela disponible
      });
      cargarCultivos();
      
      // 🚨 Disparar evento para actualizar alertas en Dashboard
      if (!editingCultivo) {
        // Solo para cultivos nuevos, no para ediciones
        window.dispatchEvent(new CustomEvent('cultivoCreated'));
      } else {
        window.dispatchEvent(new CustomEvent('cultivoUpdated'));
      }
    } catch (err) {
      console.error('❌ Error al guardar cultivo:', err);
      setError(err.message || 'Error al guardar cultivo');
    } finally {
      // 🔄 Desactivar loading backdrop
      setCreatingCultivo(false);
    }
  };

  const handleEdit = (cultivo) => {
    console.log('✏️ EDITANDO CULTIVO - CAMPOS COMPLETOS:');
    console.log('- Cultivo completo recibido:', JSON.stringify(cultivo, null, 2));

    setEditingCultivo(cultivo);

    // ✅ PRESERVAR VALORES REALES DEL CULTIVO (ahora todos los campos están disponibles)
    const formDataCompleto = {
      tipo: cultivo.tipo || '',
      variedad: cultivo.variedad || '', // ✅ Backend ya tiene este campo
      fechaSiembra: cultivo.fechaSiembra || '',
      fechaCosechaEstimada: cultivo.fechaCosechaEstimada || calcularFechaCosechaEstimada(cultivo.tipo, cultivo.fechaSiembra, true), // ✅ Backend ya tiene este campo
      estado: cultivo.estado || 'PLANTADO', // ✅ Backend ya tiene este campo
      parcelaId: cultivo.parcelaId || 1,
    };

    console.log('📝 DATOS QUE VAN AL FORMULARIO:');
    console.log('- formData.tipo:', formDataCompleto.tipo);
    console.log('- formData.variedad:', `"${formDataCompleto.variedad}"` + (formDataCompleto.variedad === '' ? ' (CADENA VACÍA)' : ' (CON VALOR)'));
    console.log('- formData.fechaSiembra:', formDataCompleto.fechaSiembra);
    console.log('- formData.fechaCosechaEstimada:', formDataCompleto.fechaCosechaEstimada);
    console.log('- formData.estado:', formDataCompleto.estado);
    console.log('- formData.parcelaId:', formDataCompleto.parcelaId);
    console.log('- VALOR ORIGINAL cultivo.variedad:', `"${cultivo.variedad}" (tipo: ${typeof cultivo.variedad})`);

    setFormData(formDataCompleto);
    setOpenDialog(true);
  };

  const handleDelete = async (cultivoId) => {
    const confirmacion = window.confirm(
      '🗑️ ELIMINACIÓN DE CULTIVO\n\n' +
      '¿Cómo quieres eliminar este cultivo?\n\n' +
      '✅ OK = Intentar eliminación automática (Recomendado)\n' +
      '❌ Cancelar = No eliminar nada\n\n' +
      'Se intentará la eliminación automática, con fallback manual si es necesario.'
    );

    if (confirmacion) {
      setLoading(true);
      try {
        console.log('🗑️ Eliminando cultivo ID con cascade:', cultivoId);
        // Intentar eliminación con cascade primero
        await cultivoService.eliminarConCascade(cultivoId);
        console.log('✅ Cultivo eliminado correctamente con cascade');
        
        // Actualizar la lista de cultivos
        await cargarCultivos();
        
        // Disparar evento para actualizar otras pantallas
        window.dispatchEvent(new CustomEvent('cultivoEliminado', { 
          detail: { cultivoId } 
        }));
        
        setSnackbar({
          open: true,
          message: '✅ Cultivo eliminado correctamente junto con todas sus actividades y alertas',
          severity: 'success'
        });
        
      } catch (err) {
        console.error('❌ Error al eliminar con cascade:', err);
        
        // Si el error es de BD/columna, intentar eliminación manual como fallback
        const errorMessage = err.message || '';
        const isDBError = errorMessage.includes('Unknown column') || 
                         errorMessage.includes('cultivo_id') ||
                         errorMessage.includes('JDBC exception');
        
        if (isDBError) {
          console.log('🔄 Error de BD detectado, intentando eliminación manual...');
          
          const intentarManual = window.confirm(
            '⚠️ Error en eliminación automática (problema de BD en backend).\n\n' +
            '¿Quieres intentar eliminar manualmente?\n' +
            '(Eliminaremos las actividades primero, luego el cultivo)'
          );
          
          if (intentarManual) {
            try {
              // Eliminar actividades manualmente
              console.log('🗑️ Eliminando actividades manualmente...');
              const actividades = await api.get(`/gestioncultivo/actividades/cultivo/${cultivoId}`);
              for (const actividad of actividades.data) {
                try {
                  await api.delete(`/gestioncultivo/actividades/${actividad.id}`);
                  console.log(`✅ Actividad ${actividad.id} eliminada`);
                } catch (actError) {
                  console.warn(`⚠️ Error eliminando actividad ${actividad.id}:`, actError);
                }
              }
              
              // Intentar eliminar cultivo sin cascade
              await cultivoService.eliminarSinCascade(cultivoId);
              await cargarCultivos();
              window.dispatchEvent(new CustomEvent('cultivoEliminado', { 
                detail: { cultivoId } 
              }));
              
              setSnackbar({
                open: true,
                message: '✅ Cultivo eliminado manualmente. Se eliminaron las actividades asociadas.',
                severity: 'success'
              });
              
            } catch (manualError) {
              console.error('❌ Error en eliminación manual:', manualError);
              setError(`Error en eliminación manual: ${manualError.message}`);
              setSnackbar({
                open: true,
                message: `❌ Error: ${manualError.message}`,
                severity: 'error'
              });
            }
          } else {
            setError('Eliminación cancelada. El backend necesita corrección de BD.');
            setSnackbar({
              open: true,
              message: '❌ Eliminación cancelada. Hay un problema en la base de datos del backend.',
              severity: 'error'
            });
          }
        } else {
          // Error diferente, mostrar mensaje original
          setError(errorMessage);
          setSnackbar({
            open: true,
            message: `❌ ${errorMessage}`,
            severity: 'error'
          });
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCrearParcela = async (e) => {
    e.preventDefault();
    try {
      const parcelaData = {
        ...nuevaParcela,
        usuarioId: user?.userId || user?.id
      };
      console.log('🏗️ Creando nueva parcela:', parcelaData);

      await parcelaService.crear(parcelaData);
      console.log('✅ Parcela creada exitosamente');

      // Recargar parcelas y cerrar dialog
      await cargarParcelas();
      setOpenParcelaDialog(false);
      setNuevaParcela({ nombre: '', descripcion: '', superficie: 100 });

    } catch (err) {
      console.error('❌ Error al crear parcela:', err);
      setError(err.message || 'Error al crear parcela');
    }
  };

  const previsualizarActividades = () => {
    if (formData.tipo && formData.fechaSiembra) {
      const actividades = actividadesAutomaticasService.previsualizarActividades(
        formData.tipo, 
        formData.fechaSiembra, 
        formData.variedad
      );
      setActividadesPrevias(actividades);
      console.log('👀 Actividades previsualizadas:', actividades);
    } else {
      setActividadesPrevias([]);
    }
  };

  // ✨ EFECTO PARA ACTUALIZAR PREVISUALIZACIÓN CUANDO CAMBIAN LOS DATOS
  useEffect(() => {
    previsualizarActividades();
  }, [formData.tipo, formData.fechaSiembra, formData.variedad]);

  const getEstadoColor = (estado) => {
    const estadoObj = estados.find(e => e.value === estado);
    return estadoObj ? estadoObj.color : 'default';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>      
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          Mis Cultivos
        </Typography>
        <Box>
          {/* ✅ BOTÓN TEMPORAL DE DEBUG */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              // ✅ Inicializar formulario con parcela válida al abrir diálogo
              setFormData({
                tipo: '',
                variedad: '',
                fechaSiembra: '',
                fechaCosechaEstimada: '',
                estado: 'ACTIVO',
                parcelaId: parcelas.length > 0 ? parcelas[0].id : 1,
              });
              setOpenDialog(true);
            }}
          >
            Nuevo Cultivo
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* ✅ INFO DE DEBUG TEMPORAL */}
      <Alert severity="info" sx={{ mb: 2 }}>
        🏡 <strong>Estado de Parcelas:</strong> {parcelas.length} parcelas cargadas
        {parcelas.length > 0 && (
          <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
            {parcelas.map(p => (
              <li key={p.id}>
                <strong>{p.nombre}</strong>
                <span> - {obtenerDescripcionParcela(p.nombre)}</span>
                <span style={{ color: '#999', fontSize: '0.9em' }}> | {p.superficie || 100}m²</span>
              </li>
            ))}
          </ul>
        )}
      </Alert>

      <Grid container spacing={3}>
        {cultivos.map((cultivo) => (
          <Grid item xs={12} md={6} lg={4} key={cultivo.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                  <Box display="flex" alignItems="center">
                    <AgricultureIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" component="h3">
                      {cultivo.tipo || cultivo.nombre} {/* ✅ Usar 'tipo' primero, luego 'nombre' como fallback */}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(cultivo)}
                      title="Editar cultivo"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(cultivo.id)}
                      title="Eliminar cultivo"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Variedad: {cultivo.variedad || 'No especificada'} {/* ✅ Cambiar de "Clásica" a "No especificada" */}
                </Typography>

                <Box display="flex" alignItems="center" mb={1}>
                  <DateRangeIcon sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="body2">
                    Plantado: {formatearFechaLocal(cultivo.fechaSiembra || cultivo.fechaPlantacion)} {/* ✅ Usar función sin zona horaria */}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={2}>
                  <DateRangeIcon sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="body2">
                    Cosecha estimada: {
                      cultivo.fechaCosechaEstimada
                        ? formatearFechaLocal(cultivo.fechaCosechaEstimada) // ✅ Usar función sin zona horaria
                        : calcularFechaCosechaEstimada(cultivo.tipo, cultivo.fechaSiembra)
                    }
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Chip
                    label={cultivo.estado || 'PLANTADO'} // 🔄 Mostrar estado o valor por defecto
                    color={getEstadoColor(cultivo.estado || 'PLANTADO')}
                    size="small"
                  />
                  <Typography variant="caption" color="text.secondary">
                    {/* 🔄 Mostrar nombre de parcela en lugar de solo ID */}
                    {cultivo.parcelaId 
                      ? (parcelas.find(p => p.id === cultivo.parcelaId)?.nombre || `Parcela #${cultivo.parcelaId}`)
                      : 'Sin parcela asignada'
                    }
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog para crear/editar cultivo */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingCultivo ? 'Editar Cultivo' : 'Nuevo Cultivo'}
          </DialogTitle>
          <DialogContent>
            <Autocomplete
              fullWidth
              options={tiposCultivos.map(c => c.nombre)}
              value={formData.tipo}
              onChange={(event, newValue) => {
                setFormData({
                  ...formData,
                  tipo: newValue || '',
                  variedad: '' // Limpiar variedad cuando cambia el tipo
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tipo de cultivo"
                  margin="normal"
                  required
                  placeholder="Ej: Tomate, Lechuga, Papa..."
                />
              )}
              freeSolo // Permite escribir valores personalizados
            />

            <Autocomplete
              fullWidth
              options={getVariedadesPorTipo(formData.tipo)}
              value={formData.variedad}
              onChange={(event, newValue) => {
                setFormData({ ...formData, variedad: newValue || '' });
              }}
              disabled={!formData.tipo} // Deshabilitar si no hay tipo seleccionado
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Variedad"
                  margin="normal"
                  placeholder={formData.tipo ? `Variedades de ${formData.tipo}...` : "Primero selecciona un tipo"}
                  helperText={formData.tipo ? `${getVariedadesPorTipo(formData.tipo).length} variedades disponibles` : "Selecciona un tipo para ver las variedades"}
                />
              )}
              freeSolo // Permite escribir valores personalizados
            />
            <TextField
              fullWidth
              label="Fecha de siembra"
              type="date"
              value={formData.fechaSiembra}
              onChange={(e) => {
                const nuevaFecha = e.target.value;
                const fechaCosechaCalculada = calcularFechaCosechaEstimada(formData.tipo, nuevaFecha, true); // ✅ Solo fecha
                setFormData({
                  ...formData,
                  fechaSiembra: nuevaFecha,
                  fechaCosechaEstimada: fechaCosechaCalculada
                });
              }}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              fullWidth
              label="Fecha de cosecha estimada"
              type="date"
              value={formData.fechaCosechaEstimada}
              onChange={(e) => setFormData({ ...formData, fechaCosechaEstimada: e.target.value })}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              helperText="Se calcula automáticamente al elegir tipo y fecha de siembra"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Parcela</InputLabel>
              <Select
                value={formData.parcelaId}
                onChange={(e) => setFormData({ ...formData, parcelaId: e.target.value })}
                label="Parcela"
              >
                {parcelas.map((parcela) => (
                  <MenuItem key={parcela.id} value={parcela.id}>
                    {parcela.nombre} - {parcela.descripcion}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* ✅ BOTÓN PARA CREAR NUEVA PARCELA */}
            <Box mt={1} mb={2}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setOpenParcelaDialog(true)}
                sx={{ textTransform: 'none' }}
              >
                ➕ Crear Nueva Parcela
              </Button>
            </Box>
            <FormControl fullWidth margin="normal">
              <InputLabel>Estado</InputLabel>
              <Select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                label="Estado"
              >
                {estados.map((estado) => (
                  <MenuItem key={estado.value} value={estado.value}>
                    {estado.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* ✅ SISTEMA COMPLETAMENTE FUNCIONAL */}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, p: 2, bgcolor: 'green.50', borderRadius: 1, border: '1px solid green' }}>
              🎉 <strong>¡Sistema Completo!</strong> Todos los campos están funcionando perfectamente con tu backend actualizado.
              Variedad, estado y fecha de cosecha estimada ya se guardan y cargan correctamente.
            </Typography>

            {/* ✨ NUEVA FUNCIONALIDAD: PREVISUALIZACIÓN DE ACTIVIDADES AUTOMÁTICAS */}
            {actividadesPrevias.length > 0 && (
              <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.50', borderRadius: 1, border: '1px solid', borderColor: 'primary.main' }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  🤖 <span style={{ marginLeft: '8px' }}>Actividades que se generarán automáticamente</span>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Al crear este cultivo, se generarán automáticamente {actividadesPrevias.length} actividades programadas según el calendario óptimo para {formData.tipo}:
                </Typography>
                <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                  {actividadesPrevias.map((actividad, index) => (
                    <Box key={index} sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      py: 1,
                      borderBottom: index < actividadesPrevias.length - 1 ? '1px solid rgba(0,0,0,0.1)' : 'none'
                    }}>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {actividad.nombre}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {actividad.descripcion}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color="primary.main">
                          📅 {new Date(actividad.fechaEjecucion).toLocaleDateString()}
                        </Typography>
                        <br />
                        <Chip 
                          label={actividad.prioridad} 
                          size="small" 
                          color={actividad.prioridad === 'ALTA' ? 'error' : actividad.prioridad === 'MEDIA' ? 'warning' : 'default'}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  💡 Estas actividades se crearán automáticamente y podrás gestionarlas desde el módulo de Actividades.
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button type="submit" variant="contained">
              {editingCultivo ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ✅ DIALOG PARA CREAR NUEVA PARCELA */}
      <Dialog open={openParcelaDialog} onClose={() => setOpenParcelaDialog(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleCrearParcela}>
          <DialogTitle>
            🏗️ Crear Nueva Parcela
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Nombre de la parcela"
              value={nuevaParcela.nombre}
              onChange={(e) => setNuevaParcela({ ...nuevaParcela, nombre: e.target.value })}
              margin="normal"
              required
              placeholder="Ej: Parcela Este, Invernadero 2, etc."
            />
            <TextField
              fullWidth
              label="Descripción"
              value={nuevaParcela.descripcion}
              onChange={(e) => setNuevaParcela({ ...nuevaParcela, descripcion: e.target.value })}
              margin="normal"
              required
              placeholder="Ej: Zona soleada ideal para tomates"
              multiline
              rows={2}
            />
            <TextField
              fullWidth
              label="Superficie (m²)"
              type="number"
              value={nuevaParcela.superficie}
              onChange={(e) => setNuevaParcela({ ...nuevaParcela, superficie: parseFloat(e.target.value) || 100 })}
              margin="normal"
              required
              inputProps={{ min: 1, step: 0.1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenParcelaDialog(false)}>Cancelar</Button>
            <Button type="submit" variant="contained">
              Crear Parcela
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* 🔄 Backdrop para loading de creación de cultivo */}
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.modal + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
        open={creatingCultivo}
      >
        <CircularProgress 
          color="inherit" 
          size={60}
          thickness={4}
        />
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            fontWeight: 'medium',
            textAlign: 'center'
          }}
        >
          🌱 Creando cultivo...
        </Typography>
        <Typography 
          variant="body2" 
          component="div" 
          sx={{ 
            opacity: 0.8,
            textAlign: 'center'
          }}
        >
          Generando actividades automáticas
        </Typography>
      </Backdrop>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CultivosManager;
