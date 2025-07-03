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
} from '@mui/icons-material';
import { actividadService } from '../services';
import { useAuth } from '../context/AuthContext';

const ActividadesManager = ({ cultivoId = null }) => {
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fechaProgramada: '',
    prioridad: 'MEDIA',
    cultivoId: cultivoId || 1,
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
  }, [cultivoId]);

  const cargarActividades = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (cultivoId) {
        const data = await actividadService.obtenerPorCultivo(cultivoId);
        setActividades(data);
      } else {
        // Datos de ejemplo para mostrar en el dashboard general
        setActividades([
          {
            id: 1,
            nombre: 'Riego matutino',
            descripcion: 'Regar las plantas temprano en la mañana',
            fechaProgramada: '2024-07-04',
            prioridad: 'ALTA',
            realizada: false,
            cultivoId: 1,
            cultivoNombre: 'Tomates Cherry',
          },
          {
            id: 2,
            nombre: 'Aplicar fertilizante',
            descripcion: 'Aplicar fertilizante orgánico a las lechugas',
            fechaProgramada: '2024-07-05',
            prioridad: 'MEDIA',
            realizada: false,
            cultivoId: 2,
            cultivoNombre: 'Lechuga',
          },
          {
            id: 3,
            nombre: 'Poda de hojas secas',
            descripcion: 'Remover hojas secas y dañadas',
            fechaProgramada: '2024-07-03',
            prioridad: 'BAJA',
            realizada: true,
            cultivoId: 1,
            cultivoNombre: 'Tomates Cherry',
          },
        ]);
      }
    } catch (err) {
      setError(err.message || 'Error al cargar actividades');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await actividadService.registrar(formData);
      setOpenDialog(false);
      setFormData({
        nombre: '',
        descripcion: '',
        fechaProgramada: '',
        prioridad: 'MEDIA',
        cultivoId: cultivoId || 1,
      });
      cargarActividades();
    } catch (err) {
      setError(err.message || 'Error al guardar actividad');
    }
  };

  const handleToggleRealizada = async (actividadId, realizada) => {
    try {
      if (!realizada) {
        await actividadService.marcarComoRealizada(actividadId);
      }
      cargarActividades();
    } catch (err) {
      setError(err.message || 'Error al actualizar actividad');
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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Nueva Actividad
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Actividades Pendientes */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <ScheduleIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Pendientes ({actividadesPendientes.length})
                </Typography>
              </Box>
              
              <List>
                {actividadesPendientes.map((actividad) => (
                  <ListItem key={actividad.id} divider>
                    <ListItemIcon>
                      <Checkbox
                        icon={<UncheckedIcon />}
                        checkedIcon={<CheckCircleIcon />}
                        checked={false}
                        onChange={() => handleToggleRealizada(actividad.id, actividad.realizada)}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={actividad.nombre}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {actividad.descripcion}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={1} mt={1}>
                            <Typography variant="caption">
                              {new Date(actividad.fechaProgramada).toLocaleDateString()}
                            </Typography>
                            <Chip
                              label={actividad.prioridad}
                              size="small"
                              color={getPrioridadColor(actividad.prioridad)}
                            />
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
                {actividadesPendientes.length === 0 && (
                  <ListItem>
                    <ListItemText
                      primary="No hay actividades pendientes"
                      secondary="¡Excelente trabajo!"
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Actividades Realizadas */}
        <Grid item xs={12} md={6}>
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
                              {new Date(actividad.fechaProgramada).toLocaleDateString()}
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
            
            <TextField
              fullWidth
              label="Fecha programada"
              type="date"
              value={formData.fechaProgramada}
              onChange={(e) => setFormData({...formData, fechaProgramada: e.target.value})}
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
