import React, { useState, useEffect, useRef } from 'react';
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
  Alert,
  CircularProgress,
  Backdrop,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Home as HomeIcon,
  Square as SquareIcon,
  Agriculture as AgricultureIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { parcelaService } from '../services/parcelaService';
import { useAuth } from '../context/AuthContext';

const ParcelasManager = () => {
  const [parcelas, setParcelas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingParcela, setEditingParcela] = useState(null);
  const [creatingParcela, setCreatingParcela] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    superficie: 100,
    ubicacion: '',
    tipoSuelo: '',
    caracteristicas: '',
    latitud: '',
    longitud: ''
  });

  const [climaData, setClimaData] = useState(null);
  const [loadingClima, setLoadingClima] = useState(false);
  const [climaModalOpen, setClimaModalOpen] = useState(false);
  const [parcelaClimaSeleccionada, setParcelaClimaSeleccionada] = useState(null);
  const [climasParcelas, setClimasParcelas] = useState({}); // Almacenar clima de cada parcela
  const [ultimaActualizacionClima, setUltimaActualizacionClima] = useState(null);
  const parcelasRef = useRef([]); // Referencia para acceder a parcelas sin causar re-renders

  // Actualizar la referencia cuando cambien las parcelas
  useEffect(() => {
    parcelasRef.current = parcelas;
  }, [parcelas]);

  useEffect(() => {
    cargarParcelas();

    // 🚀 NUEVO: Escuchar evento de usuario registrado
    const handleUserRegistered = (event) => {
      console.log('🔄 Usuario recién registrado detectado en ParcelasManager, recargando datos...', event.detail);
      // Recargar datos después de un pequeño delay adicional
      setTimeout(() => {
        cargarParcelas();
      }, 1500);
    };

    // 🌤️ ACTUALIZACIÓN AUTOMÁTICA: Recargar clima cuando la ventana recibe foco
    const handleWindowFocus = () => {
      console.log('🔄 Ventana enfocada, verificando si necesita actualizar clima...');
      // Solo actualizar si han pasado al menos 30 minutos desde la última actualización
      if (ultimaActualizacionClima) {
        const tiempoTranscurrido = Date.now() - ultimaActualizacionClima.getTime();
        const treintaMinutos = 30 * 60 * 1000;
        
        if (tiempoTranscurrido > treintaMinutos && parcelasRef.current.length > 0) {
          console.log('⏰ Han pasado más de 30 minutos, actualizando clima...');
          cargarClimasAutomaticamente(parcelasRef.current);
        } else {
          console.log('⏰ Clima actualizado recientemente, no es necesario actualizar');
        }
      } else if (parcelasRef.current.length > 0) {
        console.log('🔄 Primera carga de clima...');
        cargarClimasAutomaticamente(parcelasRef.current);
      }
    };

    // 🔄 ACTUALIZACIÓN PERIÓDICA: Recargar clima cada 6 horas
    const climaInterval = setInterval(() => {
      console.log('⏰ Actualización programada del clima (cada 6 horas)...');
      if (parcelasRef.current.length > 0) {
        cargarClimasAutomaticamente(parcelasRef.current);
      }
    }, 6 * 60 * 60 * 1000); // 6 horas

    window.addEventListener('userRegistered', handleUserRegistered);
    window.addEventListener('focus', handleWindowFocus);

    // Cleanup listeners al desmontar el componente
    return () => {
      window.removeEventListener('userRegistered', handleUserRegistered);
      window.removeEventListener('focus', handleWindowFocus);
      clearInterval(climaInterval);
    };
  }, []); // Sin dependencias para evitar re-ejecución constante

  const cargarParcelas = async (reintentos = 3) => {
    try {
      setLoading(true);
      setError('');
      
      const userIdToUse = user?.userId || user?.id || 1;
      console.log('🏡 Cargando parcelas para usuario:', userIdToUse);
      
      const data = await parcelaService.obtenerPorUsuario(userIdToUse);
      console.log('🏡 Parcelas obtenidas del backend:', data);
      
      setParcelas(Array.isArray(data) ? data : []);
      
      // 🌤️ Cargar clima automáticamente solo en la primera carga
      if (Array.isArray(data) && data.length > 0 && !ultimaActualizacionClima) {
        console.log('🌤️ Primera carga de parcelas, cargando clima automáticamente...');
        cargarClimasAutomaticamente(data);
      }
    } catch (err) {
      console.error('❌ Error al cargar parcelas:', err);
      
      if (reintentos > 1) {
        console.warn('⚠️ Error al cargar parcelas, reintentos restantes:', reintentos - 1);
        // Reintento después de un delay
        setTimeout(() => {
          cargarParcelas(reintentos - 1);
        }, 2000);
      } else {
        setError(err.message || 'Error al cargar parcelas');
        setParcelas([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // 🌤️ Función para cargar clima automáticamente de todas las parcelas
  const cargarClimasAutomaticamente = async (parcelas) => {
    const climasTemp = {};
    
    // Agrupar parcelas por coordenadas para optimizar llamadas API
    const coordenadasUnicas = new Map();
    parcelas.forEach(parcela => {
      if (parcela.latitud && parcela.longitud) {
        const coordKey = `${parcela.latitud.toFixed(4)},${parcela.longitud.toFixed(4)}`;
        if (!coordenadasUnicas.has(coordKey)) {
          coordenadasUnicas.set(coordKey, {
            latitud: parcela.latitud,
            longitud: parcela.longitud,
            parcelas: []
          });
        }
        coordenadasUnicas.get(coordKey).parcelas.push(parcela);
      }
    });

    console.log(`� Cargando clima para ${coordenadasUnicas.size} ubicaciones únicas...`);
    
    // Cargar clima para cada ubicación única
    for (const [coordKey, coordData] of coordenadasUnicas) {
      try {
        console.log(`🌤️ Consultando clima para coordenadas ${coordKey} (${coordData.parcelas.length} parcelas)...`);
        
        const response = await fetch(
          `http://localhost:8080/api/v1/alertas/openweather/clima?latitud=${coordData.latitud}&longitud=${coordData.longitud}`
        );
        
        if (response.ok) {
          const climaActual = await response.json();
          
          // Asignar el mismo clima a todas las parcelas con estas coordenadas
          coordData.parcelas.forEach(parcela => {
            climasTemp[parcela.id] = {
              ...climaActual,
              coordenadas: `${coordData.latitud.toFixed(4)}, ${coordData.longitud.toFixed(4)}`,
              region: parcela.ubicacion || climaActual.ubicacion
            };
          });
          
          console.log(`✅ Clima cargado para ${coordData.parcelas.map(p => p.nombre).join(', ')}:`, {
            ubicacion: climaActual.ubicacion,
            temperatura: climaActual.temperatura,
            condicionesExtremas: climaActual.tieneCondicionesExtremas
          });
        } else {
          console.warn(`⚠️ Error HTTP ${response.status} para coordenadas ${coordKey}`);
        }
        
        // Pequeña pausa entre llamadas para no sobrecargar la API
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.warn(`⚠️ Error al cargar clima para coordenadas ${coordKey}:`, error);
      }
    }
    
    console.log(`🌤️ Climas cargados para ${Object.keys(climasTemp).length} parcelas`);
    setClimasParcelas(climasTemp);
    setUltimaActualizacionClima(new Date());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreatingParcela(true);
    
    try {
      // Preparar datos según la estructura esperada por el backend
      const datosConUserId = {
        nombre: formData.nombre,
        ubicacion: formData.ubicacion,
        descripcion: formData.descripcion,
        superficie: formData.superficie,
        usuarioId: user?.userId || user?.id
      };

      // Agregar dirección si hay coordenadas
      if (formData.latitud && formData.longitud) {
        datosConUserId.direccion = {
          lat: parseFloat(formData.latitud),
          lng: parseFloat(formData.longitud),
          descripcion: formData.ubicacion || 'Ubicación de la parcela'
        };
      }
      
      console.log('🏗️ Datos de parcela a enviar:', datosConUserId);

      if (editingParcela) {
        // Actualizar parcela existente
        await parcelaService.actualizar(editingParcela.id, datosConUserId);
        console.log('✅ Parcela actualizada correctamente');
        
        setSnackbar({
          open: true,
          message: '✅ Parcela actualizada correctamente',
          severity: 'success'
        });
      } else {
        // Crear nueva parcela
        const parcelaCreada = await parcelaService.crear(datosConUserId);
        console.log('✅ Parcela creada:', parcelaCreada);
        
        setSnackbar({
          open: true,
          message: '✅ Parcela creada correctamente',
          severity: 'success'
        });
      }

      // Limpiar formulario y cerrar diálogo
      setOpenDialog(false);
      setEditingParcela(null);
      setFormData({
        nombre: '',
        descripcion: '',
        superficie: 100,
        ubicacion: '',
        tipoSuelo: '',
        caracteristicas: '',
        latitud: '',
        longitud: ''
      });
      
      // Recargar parcelas
      await cargarParcelas();
      
      // 🌤️ Si se agregaron/cambiaron coordenadas, actualizar clima específicamente
      if (formData.latitud && formData.longitud) {
        // Crear datos temporales para la parcela actualizada/creada
        const parcelaParaClima = {
          id: editingParcela?.id || 'temp',
          nombre: formData.nombre,
          latitud: parseFloat(formData.latitud),
          longitud: parseFloat(formData.longitud),
          ubicacion: formData.ubicacion
        };
        
        console.log('🌤️ Actualizando clima para parcela:', parcelaParaClima);
        
        // Pequeño delay para asegurar que la parcela se haya guardado
        setTimeout(async () => {
          try {
            const response = await fetch(
              `http://localhost:8080/api/v1/alertas/openweather/clima?latitud=${parcelaParaClima.latitud}&longitud=${parcelaParaClima.longitud}`
            );
            
            if (response.ok) {
              const climaActual = await response.json();
              setClimasParcelas(prev => ({
                ...prev,
                [parcelaParaClima.id]: {
                  ...climaActual,
                  coordenadas: `${parcelaParaClima.latitud.toFixed(4)}, ${parcelaParaClima.longitud.toFixed(4)}`,
                  region: parcelaParaClima.ubicacion || climaActual.ubicacion
                }
              }));
              
              console.log('✅ Clima actualizado para parcela editada');
            }
          } catch (error) {
            console.warn('⚠️ Error al actualizar clima de parcela editada:', error);
          }
        }, 1500);
      }
      
      // 🚨 Disparar evento para que otros componentes se enteren
      window.dispatchEvent(new CustomEvent('parcelaCreated'));
      
    } catch (err) {
      console.error('❌ Error al guardar parcela:', err);
      setError(err.message || 'Error al guardar parcela');
      setSnackbar({
        open: true,
        message: `❌ Error: ${err.message}`,
        severity: 'error'
      });
    } finally {
      setCreatingParcela(false);
    }
  };

  const handleEdit = (parcela) => {
    console.log('✏️ Editando parcela:', parcela);
    setEditingParcela(parcela);
    setFormData({
      nombre: parcela.nombre || '',
      descripcion: parcela.descripcion || '',
      superficie: parcela.superficie || 100,
      ubicacion: parcela.ubicacion || '',
      tipoSuelo: parcela.tipoSuelo || '',
      caracteristicas: parcela.caracteristicas || '',
      latitud: parcela.latitud || '',
      longitud: parcela.longitud || ''
    });
    setClimaData(null); // Limpiar datos del clima al editar
    setOpenDialog(true);
  };

  const handleDelete = async (parcelaId) => {
    const confirmacion = window.confirm(
      '🗑️ ELIMINAR PARCELA\n\n' +
      '¿Estás seguro de que quieres eliminar esta parcela?\n\n' +
      '⚠️ ADVERTENCIA: Si hay cultivos asociados a esta parcela,\n' +
      'es posible que no se pueda eliminar.\n\n' +
      '✅ OK = Eliminar parcela\n' +
      '❌ Cancelar = No eliminar'
    );

    if (confirmacion) {
      setLoading(true);
      try {
        console.log('🗑️ Eliminando parcela ID:', parcelaId);
        await parcelaService.eliminar(parcelaId);
        console.log('✅ Parcela eliminada correctamente');
        
        setSnackbar({
          open: true,
          message: '✅ Parcela eliminada correctamente',
          severity: 'success'
        });
        
        // Recargar parcelas
        await cargarParcelas();
        
        // Disparar evento para actualizar otros componentes
        window.dispatchEvent(new CustomEvent('parcelaEliminada', { 
          detail: { parcelaId } 
        }));
        
      } catch (err) {
        console.error('❌ Error al eliminar parcela:', err);
        setError(err.message || 'Error al eliminar parcela');
        setSnackbar({
          open: true,
          message: `❌ Error: ${err.message}`,
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleNuevaParcela = () => {
    setEditingParcela(null);
    setFormData({
      nombre: '',
      descripcion: '',
      superficie: 100,
      ubicacion: '',
      tipoSuelo: '',
      caracteristicas: '',
      latitud: '',
      longitud: ''
    });
    setClimaData(null);
    setOpenDialog(true);
  };

  // Nueva función para obtener datos del clima
  const obtenerClimaActual = async () => {
    if (!formData.latitud || !formData.longitud) {
      setSnackbar({
        open: true,
        message: '⚠️ Ingresa latitud y longitud para obtener datos del clima',
        severity: 'warning'
      });
      return;
    }

    setLoadingClima(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/alertas/openweather/clima?latitud=${formData.latitud}&longitud=${formData.longitud}`
      );
      
      if (!response.ok) {
        throw new Error('Error al obtener datos del clima');
      }
      
      const climaActual = await response.json();
      setClimaData(climaActual);
      
      setSnackbar({
        open: true,
        message: '🌤️ Datos del clima obtenidos correctamente',
        severity: 'success'
      });
      
    } catch (error) {
      console.error('Error al obtener clima:', error);
      setSnackbar({
        open: true,
        message: `❌ Error al obtener clima: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoadingClima(false);
    }
  };

  // Función para usar ubicación actual del usuario
  const usarUbicacionActual = () => {
    if (!navigator.geolocation) {
      setSnackbar({
        open: true,
        message: '❌ Geolocalización no disponible en este navegador',
        severity: 'error'
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        
        setFormData({
          ...formData,
          latitud: lat,
          longitud: lng
        });
        
        setSnackbar({
          open: true,
          message: `📍 Ubicación detectada: ${lat}, ${lng}`,
          severity: 'success'
        });
      },
      (error) => {
        console.error('Error de geolocalización:', error);
        setSnackbar({
          open: true,
          message: '❌ No se pudo obtener la ubicación. Verifica los permisos.',
          severity: 'error'
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Función para consultar clima de parcela existente
  const consultarClimaParaParcela = async (parcela) => {
    if (!parcela.latitud || !parcela.longitud) {
      setSnackbar({
        open: true,
        message: '⚠️ Esta parcela no tiene coordenadas configuradas',
        severity: 'warning'
      });
      return;
    }

    setParcelaClimaSeleccionada(parcela);
    setLoadingClima(true);
    setClimaModalOpen(true);

    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/alertas/openweather/clima?latitud=${parcela.latitud}&longitud=${parcela.longitud}`
      );
      
      if (!response.ok) {
        throw new Error('Error al obtener datos del clima');
      }
      
      const climaActual = await response.json();
      setClimaData(climaActual);
      
      // 🌤️ Actualizar también el estado local de climas
      setClimasParcelas(prev => ({
        ...prev,
        [parcela.id]: climaActual
      }));
      
      // Actualizar timestamp de última actualización
      setUltimaActualizacionClima(new Date());
      
    } catch (error) {
      console.error('Error al obtener clima:', error);
      setSnackbar({
        open: true,
        message: `❌ Error al obtener clima: ${error.message}`,
        severity: 'error'
      });
      setClimaModalOpen(false);
    } finally {
      setLoadingClima(false);
    }
  };

  const getSuperficieColor = (superficie) => {
    if (superficie >= 1000) return 'success';
    if (superficie >= 500) return 'warning';
    return 'info';
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
          🏡 Gestión de Parcelas
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => {
              console.log('🔄 Actualizando datos del clima manualmente...');
              if (parcelasRef.current.length > 0) {
                cargarClimasAutomaticamente(parcelasRef.current);
                setSnackbar({
                  open: true,
                  message: '🌤️ Actualizando datos del clima...',
                  severity: 'info'
                });
              }
            }}
            disabled={parcelas.length === 0}
          >
            Actualizar Clima
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNuevaParcela}
          >
            Nueva Parcela
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Estadísticas rápidas */}
      <Alert severity="info" sx={{ mb: 3 }}>
        📊 <strong>Resumen:</strong> {parcelas.length} parcelas registradas | 
        Superficie total: {parcelas.reduce((sum, p) => sum + (p.superficie || 0), 0)}m² |
        Promedio: {parcelas.length > 0 ? Math.round(parcelas.reduce((sum, p) => sum + (p.superficie || 0), 0) / parcelas.length) : 0}m² por parcela
        {Object.keys(climasParcelas).length > 0 && (
          <>
            <span> | 🌤️ {Object.keys(climasParcelas).length} con datos climáticos</span>
            {ultimaActualizacionClima && (
              <span> | ⏰ Última actualización: {ultimaActualizacionClima.toLocaleTimeString('es-ES')} | 🔄 Auto-actualización: cada 6h</span>
            )}
          </>
        )}
      </Alert>

      {/* Resumen climático por regiones */}
      {Object.keys(climasParcelas).length > 0 && (
        <Card sx={{ mb: 3, bgcolor: 'background.paper' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🌍 Resumen Climático por Regiones
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(climasParcelas).map(([parcelaId, clima]) => {
                const parcela = parcelas.find(p => p.id.toString() === parcelaId);
                if (!parcela) return null;
                
                return (
                  <Grid item xs={12} sm={6} md={4} key={parcelaId}>
                    <Box sx={{ 
                      p: 1, 
                      border: 1, 
                      borderColor: clima.tieneCondicionesExtremas ? 'warning.main' : 'divider',
                      borderRadius: 1,
                      bgcolor: clima.tieneCondicionesExtremas ? 'warning.light' : 'background.default'
                    }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {parcela.nombre} - {clima.region || clima.ubicacion}
                      </Typography>
                      <Typography variant="caption" display="block">
                        🌡️ {clima.temperatura?.toFixed(1)}°C | 💧 {clima.humedad?.toFixed(0)}% | 🌧️ {clima.lluvia?.toFixed(1)}mm/h
                        {clima.tieneCondicionesExtremas && <span style={{ color: '#f57c00' }}> ⚠️ Extremo</span>}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>
      )}

      {parcelas.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 6 }}>
          <CardContent>
            <HomeIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No hay parcelas registradas
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Comienza creando tu primera parcela para organizar mejor tus cultivos
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleNuevaParcela}
            >
              Crear Primera Parcela
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {parcelas.map((parcela) => (
            <Grid item xs={12} md={6} lg={4} key={parcela.id}>
              <Card sx={{ 
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Box display="flex" alignItems="center">
                      <HomeIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6" component="h3">
                        {parcela.nombre}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(parcela)}
                        title="Editar parcela"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(parcela.id)}
                        title="Eliminar parcela"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                    {parcela.descripcion || 'Sin descripción'}
                  </Typography>

                  <Box display="flex" alignItems="center" mb={1}>
                    <SquareIcon sx={{ mr: 1, fontSize: 16 }} />
                    <Typography variant="body2">
                      Superficie: {parcela.superficie || 0}m²
                    </Typography>
                  </Box>

                  {parcela.ubicacion && (
                    <Box display="flex" alignItems="center" mb={1}>
                      <Typography variant="body2" color="text.secondary">
                        📍 {parcela.ubicacion}
                      </Typography>
                    </Box>
                  )}

                  {parcela.tipoSuelo && (
                    <Box display="flex" alignItems="center" mb={2}>
                      <Typography variant="body2" color="text.secondary">
                        🌱 Suelo: {parcela.tipoSuelo}
                      </Typography>
                    </Box>
                  )}

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Chip
                      label={`${parcela.superficie || 0}m²`}
                      color={getSuperficieColor(parcela.superficie || 0)}
                      size="small"
                    />
                    <Typography variant="caption" color="text.secondary">
                      ID: {parcela.id}
                    </Typography>
                  </Box>

                  {parcela.caracteristicas && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      💡 {parcela.caracteristicas}
                    </Typography>
                  )}

                  {/* Mostrar datos del clima si están disponibles */}
                  {climasParcelas[parcela.id] && (
                    <Box sx={{ mt: 2, p: 1.5, bgcolor: 'primary.light', borderRadius: 1, color: 'white' }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        🌤️ Clima - {climasParcelas[parcela.id].region || climasParcelas[parcela.id].ubicacion}
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={4}>
                          <Box textAlign="center">
                            <Typography variant="h6" component="div" sx={{
                              color: climasParcelas[parcela.id].esTemperaturaExtrema ? '#ffeb3b' : 'white'
                            }}>
                              {climasParcelas[parcela.id].temperatura?.toFixed(1)}°C
                            </Typography>
                            <Typography variant="caption">Temperatura</Typography>
                            {climasParcelas[parcela.id].esTemperaturaExtrema && (
                              <Typography variant="caption" display="block" sx={{ color: '#ffeb3b' }}>
                                ⚠️ Extrema
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Box textAlign="center">
                            <Typography variant="h6" component="div">
                              {climasParcelas[parcela.id].humedad?.toFixed(0)}%
                            </Typography>
                            <Typography variant="caption">Humedad</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Box textAlign="center">
                            <Typography variant="h6" component="div" sx={{
                              color: climasParcelas[parcela.id].esLluviaFuerte ? '#ffeb3b' : 'white'
                            }}>
                              {climasParcelas[parcela.id].lluvia?.toFixed(1)}mm/h
                            </Typography>
                            <Typography variant="caption">Lluvia</Typography>
                            {climasParcelas[parcela.id].esLluviaFuerte && (
                              <Typography variant="caption" display="block" sx={{ color: '#ffeb3b' }}>
                                ⚠️ Fuerte
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                      
                      {climasParcelas[parcela.id].tieneCondicionesExtremas && (
                        <Alert severity="warning" size="small" sx={{ 
                          mt: 1, 
                          bgcolor: 'warning.main',
                          '& .MuiAlert-message': { color: 'white' }
                        }}>
                          ⚠️ {climasParcelas[parcela.id].descripcion}
                        </Alert>
                      )}
                      
                      <Typography variant="caption" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
                        📍 Coordenadas: {climasParcelas[parcela.id].coordenadas || 
                          `${parseFloat(parcela.latitud).toFixed(4)}, ${parseFloat(parcela.longitud).toFixed(4)}`}
                      </Typography>
                      
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => consultarClimaParaParcela(parcela)}
                        sx={{ 
                          mt: 1, 
                          fontSize: '0.7rem', 
                          p: 0.5, 
                          color: 'white', 
                          borderColor: 'white',
                          '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                        }}
                        fullWidth
                      >
                        🔄 Actualizar • 📊 Ver Detalles
                      </Button>
                    </Box>
                  )}

                  {/* Mostrar coordenadas si están disponibles pero no hay clima */}
                  {(parcela.latitud && parcela.longitud && !climasParcelas[parcela.id]) && (
                    <Box sx={{ mt: 1, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        🌍 Coordenadas: {parseFloat(parcela.latitud).toFixed(4)}, {parseFloat(parcela.longitud).toFixed(4)}
                      </Typography>
                      <Button
                        size="small"
                        variant="text"
                        onClick={() => consultarClimaParaParcela(parcela)}
                        sx={{ mt: 0.5, fontSize: '0.7rem', p: 0.5 }}
                      >
                        🌤️ Cargar Clima
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog para crear/editar parcela */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingParcela ? '✏️ Editar Parcela' : '🏗️ Nueva Parcela'}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Nombre de la parcela"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              margin="normal"
              required
              placeholder="Ej: Parcela Norte, Invernadero 1, Huerto Este..."
            />
            
            <TextField
              fullWidth
              label="Descripción"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              margin="normal"
              required
              placeholder="Ej: Zona soleada ideal para tomates y pimientos"
              multiline
              rows={2}
            />
            
            <TextField
              fullWidth
              label="Superficie (m²)"
              type="number"
              value={formData.superficie}
              onChange={(e) => setFormData({ ...formData, superficie: parseFloat(e.target.value) || 0 })}
              margin="normal"
              required
              inputProps={{ min: 1, step: 0.1 }}
              placeholder="100"
            />
            
            <TextField
              fullWidth
              label="Ubicación (opcional)"
              value={formData.ubicacion}
              onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
              margin="normal"
              placeholder="Ej: Sector norte del terreno, Junto al almacén..."
            />
            
            <TextField
              fullWidth
              label="Tipo de suelo (opcional)"
              value={formData.tipoSuelo}
              onChange={(e) => setFormData({ ...formData, tipoSuelo: e.target.value })}
              margin="normal"
              placeholder="Ej: Arcilloso, Arenoso, Franco, Orgánico..."
            />
            
            <TextField
              fullWidth
              label="Características especiales (opcional)"
              value={formData.caracteristicas}
              onChange={(e) => setFormData({ ...formData, caracteristicas: e.target.value })}
              margin="normal"
              placeholder="Ej: Sistema de riego automático, Protección contra viento..."
              multiline
              rows={2}
            />

            {/* Nueva sección para coordenadas geográficas */}
            <Typography variant="h6" sx={{ mt: 3, mb: 2, color: 'primary.main' }}>
              🌍 Ubicación Geográfica (Opcional)
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Latitud"
                  type="number"
                  value={formData.latitud}
                  onChange={(e) => setFormData({ ...formData, latitud: e.target.value })}
                  placeholder="-12.0464"
                  inputProps={{ step: 0.000001 }}
                  helperText="Coordenada Norte/Sur"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Longitud"
                  type="number"
                  value={formData.longitud}
                  onChange={(e) => setFormData({ ...formData, longitud: e.target.value })}
                  placeholder="-77.0428"
                  inputProps={{ step: 0.000001 }}
                  helperText="Coordenada Este/Oeste"
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                size="small"
                onClick={usarUbicacionActual}
                startIcon={<HomeIcon />}
              >
                📍 Usar Mi Ubicación
              </Button>
              
              <Button
                variant="outlined"
                size="small"
                onClick={obtenerClimaActual}
                disabled={!formData.latitud || !formData.longitud || loadingClima}
                startIcon={loadingClima ? <CircularProgress size={16} /> : <AgricultureIcon />}
              >
                {loadingClima ? 'Consultando...' : '🌤️ Consultar Clima'}
              </Button>
            </Box>

            {/* Mostrar datos del clima si están disponibles */}
            {climaData && (
              <Card sx={{ mt: 2, bgcolor: 'primary.main', color: 'white' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    🌤️ Clima Actual - {climaData.ubicacion}
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Box textAlign="center">
                        <Typography variant="h4" component="div">
                          {climaData.temperatura?.toFixed(1) || '--'}°C
                        </Typography>
                        <Typography variant="caption">Temperatura</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box textAlign="center">
                        <Typography variant="h4" component="div">
                          {climaData.humedad?.toFixed(0) || '--'}%
                        </Typography>
                        <Typography variant="caption">Humedad</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box textAlign="center">
                        <Typography variant="h4" component="div">
                          {climaData.lluvia?.toFixed(1) || '0.0'}mm/h
                        </Typography>
                        <Typography variant="caption">Lluvia</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box textAlign="center">
                        <Typography variant="body2" component="div">
                          {climaData.tieneCondicionesExtremas ? '⚠️' : '✅'}
                        </Typography>
                        <Typography variant="caption">
                          {climaData.tieneCondicionesExtremas ? 'Extremo' : 'Normal'}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  
                  <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                    📝 {climaData.descripcion}
                  </Typography>
                  
                  {climaData.tieneCondicionesExtremas && (
                    <Alert severity="warning" sx={{ mt: 2, bgcolor: 'warning.main', color: 'warning.contrastText' }}>
                      ⚠️ <strong>Condiciones Extremas Detectadas:</strong> Se recomienda considerar estas condiciones para 
                      la planificación de cultivos en esta parcela.
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}
            
            <Alert severity="info" sx={{ mt: 2 }}>
              🌍 <strong>Coordenadas Geográficas:</strong> Permite obtener datos meteorológicos precisos para esta parcela.
              <br />
              💡 <strong>Ejemplos:</strong> Lima: -12.0464, -77.0428 | Buenos Aires: -34.6118, -58.3960 | Bogotá: 4.7110, -74.0721
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button type="submit" variant="contained">
              {editingParcela ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Backdrop para loading */}
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.modal + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
        open={creatingParcela}
      >
        <CircularProgress color="inherit" size={60} thickness={4} />
        <Typography variant="h6" component="div" sx={{ fontWeight: 'medium', textAlign: 'center' }}>
          🏗️ {editingParcela ? 'Actualizando' : 'Creando'} parcela...
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

      {/* Modal para mostrar clima de parcela */}
      <Dialog 
        open={climaModalOpen} 
        onClose={() => setClimaModalOpen(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          🌤️ Clima Actual - {parcelaClimaSeleccionada?.nombre}
        </DialogTitle>
        <DialogContent>
          {loadingClima ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Consultando datos meteorológicos...</Typography>
            </Box>
          ) : climaData ? (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                📍 <strong>Ubicación:</strong> {parcelaClimaSeleccionada?.latitud}, {parcelaClimaSeleccionada?.longitud}
                <br />
                🕐 <strong>Última actualización:</strong> {new Date(climaData.fecha).toLocaleString('es-ES')}
              </Alert>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
                    <CardContent>
                      <Typography variant="h3" component="div">
                        {climaData.temperatura?.toFixed(1) || '--'}°C
                      </Typography>
                      <Typography variant="subtitle1">🌡️ Temperatura</Typography>
                      {climaData.esTemperaturaExtrema && (
                        <Chip label="⚠️ Extrema" color="warning" size="small" sx={{ mt: 1 }} />
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ textAlign: 'center', bgcolor: 'info.light', color: 'white' }}>
                    <CardContent>
                      <Typography variant="h3" component="div">
                        {climaData.humedad?.toFixed(0) || '--'}%
                      </Typography>
                      <Typography variant="subtitle1">💧 Humedad</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ textAlign: 'center', bgcolor: climaData.lluvia > 10 ? 'warning.light' : 'success.light', color: 'white' }}>
                    <CardContent>
                      <Typography variant="h3" component="div">
                        {climaData.lluvia?.toFixed(1) || '0.0'}
                      </Typography>
                      <Typography variant="subtitle1">🌧️ Lluvia (mm/h)</Typography>
                      {climaData.esLluviaFuerte && (
                        <Chip label="⚠️ Fuerte" color="warning" size="small" sx={{ mt: 1 }} />
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ textAlign: 'center', bgcolor: climaData.tieneCondicionesExtremas ? 'error.light' : 'success.light', color: 'white' }}>
                    <CardContent>
                      <Typography variant="h3" component="div">
                        {climaData.tieneCondicionesExtremas ? '⚠️' : '✅'}
                      </Typography>
                      <Typography variant="subtitle1">Estado General</Typography>
                      <Typography variant="caption">
                        {climaData.tieneCondicionesExtremas ? 'Condiciones Extremas' : 'Condiciones Normales'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Alert 
                severity={climaData.tieneCondicionesExtremas ? 'warning' : 'success'} 
                sx={{ mt: 3 }}
              >
                <Typography variant="body1">
                  <strong>📝 Análisis:</strong> {climaData.descripcion}
                </Typography>
              </Alert>

              {climaData.tieneCondicionesExtremas && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  <Typography variant="body1">
                    <strong>⚠️ Recomendaciones:</strong>
                  </Typography>
                  <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                    {climaData.temperatura > 35 && (
                      <li>Aumentar riego y proporcionar sombra a los cultivos</li>
                    )}
                    {climaData.temperatura < 5 && (
                      <li>Proteger cultivos del frío con mantas o invernaderos</li>
                    )}
                    {climaData.lluvia > 10 && (
                      <li>Verificar drenaje y proteger de encharcamientos</li>
                    )}
                    <li>Monitorear cultivos más frecuentemente</li>
                    <li>Considerar postponer actividades de siembra o transplante</li>
                  </ul>
                </Alert>
              )}
            </Box>
          ) : (
            <Typography>No se pudieron obtener datos del clima</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClimaModalOpen(false)}>Cerrar</Button>
          {climaData && !loadingClima && (
            <Button 
              variant="contained" 
              onClick={() => consultarClimaParaParcela(parcelaClimaSeleccionada)}
            >
              🔄 Actualizar
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ParcelasManager;
