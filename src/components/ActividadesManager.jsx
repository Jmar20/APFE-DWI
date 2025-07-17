import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
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
  Checkbox,
} from '@mui/material';
import {
  Add as AddIcon,
  Task as TaskIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  Schedule as ScheduleIcon,
  Agriculture as AgricultureIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { actividadService } from '../services';
import { useAuth } from '../context/AuthContext';
import ActividadesUrgentes from './ActividadesUrgentes';
import ActividadesPorCultivo from './ActividadesPorCultivo';
import { actividadesAutomaticasService } from '../services/actividadesAutomaticasService';
import { cultivoService } from '../services';

const ActividadesManager = ({ cultivoId = null }) => {
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [cultivos, setCultivos] = useState([]);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fechaEjecucion: '',
    prioridad: 'MEDIA',
    cultivoId: cultivoId || null,
  });

  const prioridades = [
    { value: 'ALTA', label: 'Alta', color: 'error' },
    { value: 'MEDIA', label: 'Media', color: 'warning' },
    { value: 'BAJA', label: 'Baja', color: 'info' },
  ];

  const tiposActividad = [
    'Riego',
    'Fertilización',
    'Poda',
    'Control de plagas',
    'Cosecha',
    'Preparación del suelo',
    'Siembra',
    'Transplante',
    'Monitoreo',
    'Otro',
  ];

  useEffect(() => {
    cargarActividades();
    cargarCultivos();
  }, [cultivoId, user?.id]); // Agregamos user?.id para recargar cuando cambie el usuario

  // Agregar listener para eventos de actualización
  useEffect(() => {
    const handleCultivoUpdate = () => {
      console.log('🔄 Evento de actualización de cultivo detectado, recargando datos...');
      refrescarDatos();
    };

    const handleCultivoEliminado = (event) => {
      console.log('🗑️ Cultivo eliminado detectado:', event.detail);
      refrescarDatos();
    };

    // 🚀 NUEVO: Escuchar evento de usuario registrado
    const handleUserRegistered = (event) => {
      console.log('🔄 Usuario recién registrado detectado en ActividadesManager, recargando datos...', event.detail);
      // Recargar datos después de un pequeño delay adicional
      setTimeout(() => {
        refrescarDatos();
      }, 2000);
    };

    // Escuchar eventos personalizados
    window.addEventListener('cultivoCreated', handleCultivoUpdate);
    window.addEventListener('cultivoUpdated', handleCultivoUpdate);
    window.addEventListener('cultivoEliminado', handleCultivoEliminado);
    window.addEventListener('userRegistered', handleUserRegistered);

    return () => {
      window.removeEventListener('cultivoCreated', handleCultivoUpdate);
      window.removeEventListener('cultivoUpdated', handleCultivoUpdate);
      window.removeEventListener('cultivoEliminado', handleCultivoEliminado);
      window.removeEventListener('userRegistered', handleUserRegistered);
    };
  }, []);

  // Polling cada 30 segundos para asegurar sincronización
  useEffect(() => {
    const interval = setInterval(() => {
      if (!document.hidden) { // Solo refrescar si la página está visible
        refrescarDatos();
      }
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, []);

  const cargarCultivos = async () => {
    try {
      if (user?.userId && !cultivoId) {
        console.log('🌱 Cargando cultivos para usuario:', user.userId);
        const data = await cultivoService.obtenerPorUsuario(user.userId);
        console.log('🌱 Cultivos obtenidos:', data);
        setCultivos(data);
      }
    } catch (err) {
      console.error('❌ Error al cargar cultivos:', err);
    }
  };

  const refrescarDatos = async () => {
    await Promise.all([
      cargarActividades(),
      cargarCultivos()
    ]);
  };

  const cargarActividades = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔍 ActividadesManager - cargarActividades iniciado');
      console.log('🔍 cultivoId:', cultivoId);
      console.log('🔍 user?.userId:', user?.userId);
      
      if (cultivoId) {
        // Cargar actividades específicas del cultivo
        console.log('🔍 Cargando actividades para cultivo específico:', cultivoId);
        const data = await actividadService.obtenerPorCultivo(cultivoId);
        console.log('🔍 Actividades del cultivo obtenidas:', data);
        setActividades(data);
      } else {
        // Cargar todas las actividades del usuario autenticado
        if (user?.userId) {
          console.log('🔍 Cargando actividades para usuario:', user.userId);
          const data = await actividadService.obtenerPorUsuario(user.userId);
          console.log('🔍 Actividades del usuario obtenidas:', data);
          console.log('🔍 Cantidad de actividades:', data?.length || 0);
          setActividades(data);
        } else {
          console.log('🔍 No hay usuario autenticado, estableciendo array vacío');
          setActividades([]);
        }
      }
    } catch (err) {
      console.error('❌ Error al cargar actividades:', err);
      setError(err.message || 'Error al cargar actividades');
      setActividades([]); // Array vacío en caso de error
    } finally {
      setLoading(false);
      console.log('🔍 cargarActividades completado, loading establecido a false');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const actividadData = {
        ...formData,
        userId: user?.userId,
        cultivoId: cultivoId || formData.cultivoId
      };

      if (cultivoId) {
        // Crear actividad para cultivo específico
        await actividadService.crearParaCultivo(cultivoId, actividadData);
      } else {
        // Crear actividad general
        await actividadService.registrar(actividadData);
      }

      setOpenDialog(false);
      setFormData({
        nombre: '',
        descripcion: '',
        fechaEjecucion: '',
        prioridad: 'MEDIA',
        cultivoId: cultivoId || null,
      });
      refrescarDatos(); // Usar refrescarDatos en lugar de solo cargarActividades
      
      // 🚨 Disparar evento para actualizar alertas en Dashboard
      window.dispatchEvent(new CustomEvent('actividadCreated'));
    } catch (err) {
      setError(err.message || 'Error al guardar actividad');
    }
  };

  const handleToggleRealizada = async (actividadId, realizada) => {
    try {
      if (!realizada) {
        await actividadService.marcarRealizada(actividadId);
        refrescarDatos(); // Usar refrescarDatos
        
        // 🚨 Disparar evento para actualizar alertas en Dashboard
        window.dispatchEvent(new CustomEvent('actividadUpdated'));
      }
    } catch (err) {
      setError(err.message || 'Error al actualizar actividad');
    }
  };

  const handleGenerarActividadesAutomaticas = async () => {
    try {
      if (!user?.userId) {
        setError('Usuario no autenticado');
        return;
      }

      // Obtener cultivos del usuario
      const cultivos = await cultivoService.obtenerPorUsuario(user.userId);
      
      if (cultivos.length === 0) {
        setError('No tienes cultivos registrados. Crea un cultivo primero.');
        return;
      }

      // Generar actividades para cada cultivo
      for (const cultivo of cultivos) {
        try {
          await actividadesAutomaticasService.generarActividadesParaCultivo({
            ...cultivo,
            userId: user.id
          });
        } catch (error) {
          console.error(`Error al generar actividades para cultivo ${cultivo.tipo}:`, error);
        }
      }

      // Recargar actividades
      refrescarDatos(); // Usar refrescarDatos para recargar todo
      setError(''); // Limpiar errores previos
    } catch (err) {
      setError(err.message || 'Error al generar actividades automáticas');
    }
  };

  const getPrioridadColor = (prioridad) => {
    const prioridadObj = prioridades.find(p => p.value === prioridad);
    return prioridadObj ? prioridadObj.color : 'default';
  };

  const actividadesPendientes = actividades.filter(a => !a.realizada);
  const actividadesRealizadas = actividades.filter(a => a.realizada);

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
          {cultivoId ? 'Actividades del Cultivo' : 'Mis Actividades'}
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            size="small"
            onClick={refrescarDatos}
            startIcon={<RefreshIcon />}
            sx={{ 
              borderColor: '#666',
              color: '#666',
              minWidth: 'auto',
              '&:hover': {
                borderColor: '#333',
                backgroundColor: 'rgba(0,0,0,0.04)'
              }
            }}
          >
            Refrescar
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Nueva Actividad
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* 🚨 NUEVA FUNCIONALIDAD: ACTIVIDADES URGENTES */}
      <ActividadesUrgentes 
        actividades={actividades}
        onToggleCompleted={handleToggleRealizada}
      />

      <Grid container spacing={3}>
        {/* Actividades por Cultivo */}
        {!cultivoId && (
          <Grid item xs={12} md={6}>
            <ActividadesPorCultivo 
              actividades={actividades}
              onToggleCompleted={handleToggleRealizada}
              cultivos={cultivos}
            />
          </Grid>
        )}

        {/* Actividades Realizadas */}
        <Grid item xs={12} md={cultivoId ? 12 : 6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Realizadas ({actividadesRealizadas.length})
                </Typography>
              </Box>
              
              <List>
                {actividadesRealizadas.map((actividad) => (
                  <ListItem key={actividad.id} divider>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body1"
                          sx={{ textDecoration: 'line-through', opacity: 0.7 }}
                        >
                          {actividad.nombre}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {actividad.descripcion}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={1} mt={1}>
                            <Typography variant="caption">
                              {new Date(actividad.fechaEjecucion).toLocaleDateString()}
                            </Typography>
                            {!cultivoId && (
                              <Chip
                                label={actividad.cultivoNombre}
                                size="small"
                                variant="outlined"
                                icon={<AgricultureIcon />}
                              />
                            )}
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
                {actividadesRealizadas.length === 0 && (
                  <ListItem>
                    <ListItemText
                      primary="No hay actividades realizadas"
                      secondary="Completa algunas tareas para verlas aquí"
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog para crear actividad */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Nueva Actividad</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="normal">
              <InputLabel>Tipo de actividad</InputLabel>
              <Select
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                label="Tipo de actividad"
                required
              >
                {tiposActividad.map((tipo) => (
                  <MenuItem key={tipo} value={tipo}>
                    {tipo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Descripción"
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              margin="normal"
              multiline
              rows={3}
              required
            />

            {!cultivoId && (
              <FormControl fullWidth margin="normal">
                <InputLabel>Cultivo</InputLabel>
                <Select
                  value={formData.cultivoId || ''}
                  onChange={(e) => setFormData({...formData, cultivoId: e.target.value})}
                  label="Cultivo"
                  required
                >
                  {cultivos.map((cultivo) => (
                    <MenuItem key={cultivo.id} value={cultivo.id}>
                      {cultivo.tipo} {cultivo.variedad && `(${cultivo.variedad})`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            
            <TextField
              fullWidth
              label="Fecha programada"
              type="date"
              value={formData.fechaEjecucion}
              onChange={(e) => setFormData({...formData, fechaEjecucion: e.target.value})}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Prioridad</InputLabel>
              <Select
                value={formData.prioridad}
                onChange={(e) => setFormData({...formData, prioridad: e.target.value})}
                label="Prioridad"
              >
                {prioridades.map((prioridad) => (
                  <MenuItem key={prioridad.value} value={prioridad.value}>
                    {prioridad.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button type="submit" variant="contained">
              Crear Actividad
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ActividadesManager;
