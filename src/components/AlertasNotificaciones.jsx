import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  IconButton,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Warning as WarningIcon,
  WbSunny as SunnyIcon,
  Cloud as CloudIcon,
  Opacity as RainIcon,
  Thermostat as TempIcon,
  Notifications as NotificationsIcon,
  CheckCircle as CheckIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { alertaService, notificacionService } from '../services';
import { useAuth } from '../context/AuthContext';

const AlertasNotificaciones = () => {
  const [alertas, setAlertas] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Cargar alertas y notificaciones
      // const alertasData = await alertaService.obtenerPorUsuario(user?.id || 1);
      // const notificacionesData = await notificacionService.obtenerPorUsuario(user?.id || 1);
      
      // Datos de ejemplo para desarrollo
      setAlertas([
        {
          id: 1,
          tipo: 'METEOROLOGICA',
          titulo: 'Lluvia prevista',
          descripcion: 'Se esperan lluvias fuertes para mañana. Considere proteger sus cultivos.',
          severidad: 'MEDIA',
          fechaCreacion: '2024-07-03T10:00:00',
          leida: false,
          icono: 'rain',
        },
        {
          id: 2,
          tipo: 'ACTIVIDAD',
          titulo: 'Riego pendiente',
          descripcion: 'Es hora de regar los tomates cherry.',
          severidad: 'ALTA',
          fechaCreacion: '2024-07-03T08:00:00',
          leida: false,
          cultivoNombre: 'Tomates Cherry',
          icono: 'water',
        },
        {
          id: 3,
          tipo: 'SISTEMA',
          titulo: 'Temperatura alta',
          descripcion: 'La temperatura alcanzará los 35°C. Aumente la frecuencia de riego.',
          severidad: 'ALTA',
          fechaCreacion: '2024-07-03T06:00:00',
          leida: true,
          icono: 'temperature',
        },
      ]);

      setNotificaciones([
        {
          id: 1,
          titulo: 'Actividad completada',
          descripcion: 'Has marcado como completada la poda de hojas secas.',
          fechaCreacion: '2024-07-03T14:30:00',
          leida: false,
          tipo: 'SUCCESS',
        },
        {
          id: 2,
          titulo: 'Nuevo cultivo registrado',
          descripcion: 'Se ha registrado exitosamente el cultivo de Lechuga.',
          fechaCreacion: '2024-07-02T16:00:00',
          leida: false,
          tipo: 'INFO',
        },
        {
          id: 3,
          titulo: 'Recordatorio',
          descripcion: 'No olvides aplicar fertilizante mañana.',
          fechaCreacion: '2024-07-02T12:00:00',
          leida: true,
          tipo: 'REMINDER',
        },
      ]);
    } catch (err) {
      setError(err.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleMarcarAlertaLeida = async (alertaId) => {
    try {
      await alertaService.marcarComoLeida(alertaId);
      setAlertas(alertas.map(a => 
        a.id === alertaId ? { ...a, leida: true } : a
      ));
    } catch (err) {
      setError(err.message || 'Error al marcar alerta como leída');
    }
  };

  const handleMarcarNotificacionLeida = async (notificacionId) => {
    try {
      await notificacionService.marcarComoLeida(notificacionId);
      setNotificaciones(notificaciones.map(n => 
        n.id === notificacionId ? { ...n, leida: true } : n
      ));
    } catch (err) {
      setError(err.message || 'Error al marcar notificación como leída');
    }
  };

  const handleEliminarNotificacion = async (notificacionId) => {
    try {
      await notificacionService.eliminar(notificacionId);
      setNotificaciones(notificaciones.filter(n => n.id !== notificacionId));
    } catch (err) {
      setError(err.message || 'Error al eliminar notificación');
    }
  };

  const getSeveridadColor = (severidad) => {
    switch (severidad) {
      case 'ALTA': return 'error';
      case 'MEDIA': return 'warning';
      case 'BAJA': return 'info';
      default: return 'default';
    }
  };

  const getIconoAlerta = (icono, severidad) => {
    const color = getSeveridadColor(severidad);
    switch (icono) {
      case 'rain': return <RainIcon color={color} />;
      case 'sun': return <SunnyIcon color={color} />;
      case 'cloud': return <CloudIcon color={color} />;
      case 'temperature': return <TempIcon color={color} />;
      default: return <WarningIcon color={color} />;
    }
  };

  const alertasNoLeidas = alertas.filter(a => !a.leida);
  const notificacionesNoLeidas = notificaciones.filter(n => !n.leida);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" component="h2" mb={3}>
        Alertas y Notificaciones
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Alertas */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Badge badgeContent={alertasNoLeidas.length} color="error">
                  <WarningIcon color="primary" />
                </Badge>
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Alertas
                </Typography>
              </Box>
              
              <List>
                {alertas.map((alerta) => (
                  <ListItem
                    key={alerta.id}
                    divider
                    sx={{
                      bgcolor: alerta.leida ? 'transparent' : 'action.hover',
                      borderRadius: 1,
                      mb: 1,
                    }}
                  >
                    <ListItemIcon>
                      {getIconoAlerta(alerta.icono, alerta.severidad)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography
                            variant="subtitle2"
                            sx={{ 
                              fontWeight: alerta.leida ? 'normal' : 'bold',
                            }}
                          >
                            {alerta.titulo}
                          </Typography>
                          <Chip
                            label={alerta.severidad}
                            size="small"
                            color={getSeveridadColor(alerta.severidad)}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {alerta.descripcion}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(alerta.fechaCreacion).toLocaleString()}
                          </Typography>
                          {alerta.cultivoNombre && (
                            <Chip
                              label={alerta.cultivoNombre}
                              size="small"
                              variant="outlined"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                      }
                    />
                    {!alerta.leida && (
                      <IconButton
                        size="small"
                        onClick={() => handleMarcarAlertaLeida(alerta.id)}
                        title="Marcar como leída"
                      >
                        <CheckIcon />
                      </IconButton>
                    )}
                  </ListItem>
                ))}
                {alertas.length === 0 && (
                  <ListItem>
                    <ListItemText
                      primary="No hay alertas"
                      secondary="¡Todo está en orden!"
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Notificaciones */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Badge badgeContent={notificacionesNoLeidas.length} color="primary">
                  <NotificationsIcon color="primary" />
                </Badge>
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Notificaciones
                </Typography>
              </Box>
              
              <List>
                {notificaciones.map((notificacion) => (
                  <ListItem
                    key={notificacion.id}
                    divider
                    sx={{
                      bgcolor: notificacion.leida ? 'transparent' : 'action.hover',
                      borderRadius: 1,
                      mb: 1,
                    }}
                  >
                    <ListItemIcon>
                      <NotificationsIcon 
                        color={notificacion.leida ? 'disabled' : 'primary'} 
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle2"
                          sx={{ 
                            fontWeight: notificacion.leida ? 'normal' : 'bold',
                          }}
                        >
                          {notificacion.titulo}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {notificacion.descripcion}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(notificacion.fechaCreacion).toLocaleString()}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box>
                      {!notificacion.leida && (
                        <IconButton
                          size="small"
                          onClick={() => handleMarcarNotificacionLeida(notificacion.id)}
                          title="Marcar como leída"
                        >
                          <CheckIcon />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => handleEliminarNotificacion(notificacion.id)}
                        title="Eliminar"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))}
                {notificaciones.length === 0 && (
                  <ListItem>
                    <ListItemText
                      primary="No hay notificaciones"
                      secondary="Te mantendremos informado"
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AlertasNotificaciones;
