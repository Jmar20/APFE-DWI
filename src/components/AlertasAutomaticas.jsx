import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  Alert,
  Stack,
  Divider,
} from '@mui/material';
import {
  Water as WaterIcon,
  PriorityHigh as PriorityHighIcon,
  Schedule as ScheduleIcon,
  Agriculture as AgricultureIcon,
  Cloud as CloudIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

const AlertasAutomaticas = ({ alertas = [], loading = false }) => {
  // 🎨 OBTENER ÍCONO SEGÚN TIPO DE ALERTA
  const obtenerIconoPorTipo = (tipo) => {
    const iconos = {
      'FALTA_RIEGO': <WaterIcon />,
      'ACTIVIDAD_ALTA_PRIORIDAD': <PriorityHighIcon />,
      'ACTIVIDAD_ATRASADA': <ScheduleIcon />,
      'COSECHA_PROXIMA': <AgricultureIcon />,
      'CLIMA_EXTREMO': <CloudIcon />,
    };
    return iconos[tipo] || <WarningIcon />;
  };

  // 🎨 OBTENER COLOR SEGÚN NIVEL DE PRIORIDAD
  const obtenerColorPorPrioridad = (prioridad) => {
    const colores = {
      'CRITICA': 'error',
      'ALTA': 'warning',
      'MEDIA': 'info',
      'BAJA': 'success',
    };
    return colores[prioridad] || 'default';
  };

  // 🎨 OBTENER SEVERIDAD PARA ALERT COMPONENT
  const obtenerSeveridadPorPrioridad = (prioridad) => {
    const severidades = {
      'CRITICA': 'error',
      'ALTA': 'warning',
      'MEDIA': 'info',
      'BAJA': 'success',
    };
    return severidades[prioridad] || 'info';
  };

  // 📝 FORMATEAR TIPO DE ALERTA PARA MOSTRAR
  const formatearTipoAlerta = (tipo) => {
    const nombres = {
      'FALTA_RIEGO': '🚿 Falta de Riego',
      'ACTIVIDAD_ALTA_PRIORIDAD': '🔥 Actividad de Alta Prioridad',
      'ACTIVIDAD_ATRASADA': '⏰ Actividad Atrasada',
      'COSECHA_PROXIMA': '🌾 Cosecha Próxima',
      'CLIMA_EXTREMO': '🌩️ Clima Extremo',
    };
    return nombres[tipo] || tipo;
  };

  if (loading) {
    return (
      <Card sx={{ mb: 3, border: '2px solid #e0e0e0' }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <WarningIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="h6" fontWeight="bold">
              🚨 Alertas del Sistema
            </Typography>
          </Box>
          <Box textAlign="center" py={2}>
            <Typography variant="body2" color="text.secondary">
              Cargando alertas...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (!alertas || alertas.length === 0) {
    return (
      <Card sx={{ 
        mb: 3, 
        background: 'linear-gradient(45deg, #e8f5e8 30%, #c8e6c9 90%)', 
        border: '2px solid #4caf50' 
      }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <CheckCircleIcon sx={{ mr: 1, color: '#2e7d32' }} />
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#2e7d32' }}>
              🚨 Alertas del Sistema
            </Typography>
          </Box>
          <Box textAlign="center" py={2}>
            <CheckCircleIcon sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32' }}>
              No hay alertas activas por ahora. Todo está bajo control 🌱
            </Typography>
            <Typography variant="body2" sx={{ color: '#1b5e20', opacity: 0.8 }}>
              Seguimos monitoreando tus cultivos y actividades.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Agrupar alertas por prioridad
  const alertasPorPrioridad = alertas.reduce((acc, alerta) => {
    const prioridad = alerta.prioridad || 'MEDIA';
    if (!acc[prioridad]) acc[prioridad] = [];
    acc[prioridad].push(alerta);
    return acc;
  }, {});

  const ordenPrioridad = ['CRITICA', 'ALTA', 'MEDIA', 'BAJA'];

  return (
    <Card sx={{ mb: 3, border: '2px solid #ff9800' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center">
            <WarningIcon sx={{ mr: 1, color: '#ff9800' }} />
            <Typography variant="h6" fontWeight="bold">
              🚨 Alertas del Sistema
            </Typography>
          </Box>
          <Chip 
            label={`${alertas.length} alerta${alertas.length !== 1 ? 's' : ''}`}
            color="warning"
            size="small"
          />
        </Box>

        <Stack spacing={2}>
          {ordenPrioridad.map(prioridad => {
            const alertasDePrioridad = alertasPorPrioridad[prioridad];
            if (!alertasDePrioridad || alertasDePrioridad.length === 0) return null;

            return (
              <Box key={prioridad}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: obtenerColorPorPrioridad(prioridad) === 'error' ? '#d32f2f' : '#ff9800',
                    mb: 1
                  }}
                >
                  {prioridad} ({alertasDePrioridad.length})
                </Typography>
                <Stack spacing={1}>
                  {alertasDePrioridad.map((alerta, index) => (
                    <Alert 
                      key={`${prioridad}-${index}`}
                      severity={obtenerSeveridadPorPrioridad(alerta.prioridad)}
                      icon={obtenerIconoPorTipo(alerta.tipo)}
                      sx={{
                        '& .MuiAlert-message': {
                          width: '100%'
                        }
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {formatearTipoAlerta(alerta.tipo)}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {alerta.mensaje || alerta.descripcion || 'Sin descripción disponible'}
                        </Typography>
                        {alerta.cultivo && (
                          <Typography variant="caption" sx={{ opacity: 0.8, mt: 0.5, display: 'block' }}>
                            📍 Cultivo: {alerta.cultivo.tipo} {alerta.cultivo.variedad && `(${alerta.cultivo.variedad})`}
                          </Typography>
                        )}
                        {alerta.fechaCreacion && (
                          <Typography variant="caption" sx={{ opacity: 0.8, mt: 0.5, display: 'block' }}>
                            🕒 {new Date(alerta.fechaCreacion).toLocaleString()}
                          </Typography>
                        )}
                      </Box>
                    </Alert>
                  ))}
                </Stack>
                {prioridad !== 'BAJA' && alertasPorPrioridad[ordenPrioridad[ordenPrioridad.indexOf(prioridad) + 1]] && (
                  <Divider sx={{ mt: 1 }} />
                )}
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default AlertasAutomaticas;
