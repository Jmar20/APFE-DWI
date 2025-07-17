import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  Chip,
  Checkbox,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  Warning as WarningIcon,
  Agriculture as AgricultureIcon,
} from '@mui/icons-material';

const ActividadesUrgentes = ({ actividades = [], onToggleCompleted }) => {
  // 🚨 OBTENER LAS 3 ACTIVIDADES MÁS URGENTES
  const getActividadesUrgentes = () => {
    const hoy = new Date();
    const actividadesPendientes = actividades.filter(a => !a.realizada);
    
    return actividadesPendientes
      .sort((a, b) => {
        // Primero por prioridad (ALTA > MEDIA > BAJA)
        const prioridadOrder = { 'ALTA': 3, 'MEDIA': 2, 'BAJA': 1 };
        if (prioridadOrder[a.prioridad] !== prioridadOrder[b.prioridad]) {
          return prioridadOrder[b.prioridad] - prioridadOrder[a.prioridad];
        }
        // Luego por fecha (más cercana primero)
        return new Date(a.fechaEjecucion) - new Date(b.fechaEjecucion);
      })
      .slice(0, 3);
  };

  const getPrioridadColor = (prioridad) => {
    const colores = {
      'ALTA': 'error',
      'MEDIA': 'warning', 
      'BAJA': 'info'
    };
    return colores[prioridad] || 'default';
  };

  const actividadesUrgentes = getActividadesUrgentes();

  if (actividadesUrgentes.length === 0) {
    return (
      <Card sx={{ mb: 3, background: 'linear-gradient(45deg, #e8f5e8 30%, #c8e6c9 90%)', border: '2px solid #4caf50' }}>
        <CardContent>
          <Box textAlign="center" py={2}>
            <CheckCircleIcon sx={{ fontSize: 48, color: 'white', mb: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
              🎉 ¡No hay actividades urgentes!
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Todas las actividades están bajo control.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 3, background: 'linear-gradient(45deg, #e8f5e8 30%, #4caf50 90%)', border: '2px solid #2e7d32' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <WarningIcon sx={{ mr: 1, color: 'white' }} />
          <Typography variant="h6" fontWeight="bold" sx={{ color: 'black' }}>
            🌿 Próximas 3 Actividades Urgentes
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {Array.from({ length: 3 }).map((_, index) => {
            const actividad = actividadesUrgentes[index];
            
            // Si no hay actividad para este slot, mostrar card vacía
            if (!actividad) {
              return (
                <Grid item xs={12} md={4} key={`empty-${index}`}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      border: '1px dashed #c8e6c9',
                      background: 'rgba(241, 248, 233, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: '120px'
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <CheckCircleIcon sx={{ fontSize: 32, color: '#4caf50', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Slot disponible
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        No hay más actividades urgentes
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            }

            const fechaEjecucion = new Date(actividad.fechaEjecucion);
            const hoy = new Date();
            const diasRestantes = Math.ceil((fechaEjecucion - hoy) / (1000 * 60 * 60 * 24));
            const esUrgente = diasRestantes <= 2;
            
            return (
              <Grid item xs={12} md={4} key={actividad.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    border: esUrgente ? '2px solid #d32f2f' : '1px solid #c8e6c9',
                    background: esUrgente ? '#ffebee' : '#f1f8e9',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                      border: esUrgente ? '2px solid #d32f2f' : '2px solid #4caf50'
                    }
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                      <Typography variant="body1" fontWeight="bold" sx={{ flex: 1 }}>
                        {actividad.nombre}
                      </Typography>
                      <Chip
                        label={actividad.prioridad}
                        size="small"
                        color={getPrioridadColor(actividad.prioridad)}
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {actividad.descripcion}
                    </Typography>
                    
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <AgricultureIcon sx={{ fontSize: 16 }} />
                      <Typography variant="caption">
                        {actividad.cultivoTipo || 'Cultivo'} {actividad.cultivoVariedad && `(${actividad.cultivoVariedad})`}
                      </Typography>
                    </Box>
                    
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption" color={esUrgente ? 'error' : 'text.secondary'}>
                        📅 {fechaEjecucion.toLocaleDateString()}
                        {diasRestantes <= 0 ? ' (¡HOY!)' : 
                         diasRestantes === 1 ? ' (Mañana)' : 
                         diasRestantes <= 2 ? ` (${diasRestantes} días)` : ''}
                      </Typography>
                      <Checkbox
                        icon={<UncheckedIcon />}
                        checkedIcon={<CheckCircleIcon />}
                        checked={false}
                        onChange={() => onToggleCompleted && onToggleCompleted(actividad.id, actividad.realizada)}
                        sx={{ p: 0.5 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ActividadesUrgentes;
