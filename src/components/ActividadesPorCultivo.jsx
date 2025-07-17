import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Box,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Checkbox,
  Collapse,
  Avatar,
  Divider,
  Badge,
  IconButton,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  Agriculture as AgricultureIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { cultivoService } from '../services';
import { useAuth } from '../context/AuthContext';

const ActividadesPorCultivo = ({ actividades = [], onToggleCompleted, cultivos = [], tipo = 'pendientes' }) => {
  const [expandedCultivos, setExpandedCultivos] = useState(new Set());

  const toggleExpandedCultivo = (cultivoId) => {
    const newExpanded = new Set(expandedCultivos);
    if (newExpanded.has(cultivoId)) {
      newExpanded.delete(cultivoId);
    } else {
      newExpanded.add(cultivoId);
    }
    setExpandedCultivos(newExpanded);
  };

  const getPrioridadColor = (prioridad) => {
    const colores = {
      'ALTA': 'error',
      'MEDIA': 'warning', 
      'BAJA': 'info'
    };
    return colores[prioridad] || 'default';
  };

  // 📊 AGRUPAR ACTIVIDADES POR CULTIVO
  const getActividadesPorCultivo = () => {
    const actividadesFiltradas = tipo === 'pendientes' 
      ? actividades.filter(a => !a.realizada)
      : actividades.filter(a => a.realizada);
    
    const grupos = {};
    
    actividadesFiltradas.forEach(actividad => {
      if (!grupos[actividad.cultivoId]) {
        // Buscar información del cultivo
        const cultivoInfo = cultivos.find(c => c.id === actividad.cultivoId);
        grupos[actividad.cultivoId] = {
          cultivo: { 
            id: actividad.cultivoId, 
            tipo: cultivoInfo?.tipo || 'Cultivo Desconocido',
            variedad: cultivoInfo?.variedad || ''
          },
          actividades: []
        };
      }
      grupos[actividad.cultivoId].actividades.push(actividad);
    });

    // Ordenar actividades dentro de cada grupo por fecha
    Object.values(grupos).forEach(grupo => {
      grupo.actividades.sort((a, b) => new Date(a.fechaEjecucion) - new Date(b.fechaEjecucion));
    });

    return grupos;
  };

  const gruposCultivos = getActividadesPorCultivo();
  const totalActividades = Object.values(gruposCultivos).reduce((total, grupo) => total + grupo.actividades.length, 0);
  const esPendientes = tipo === 'pendientes';

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {esPendientes ? <ScheduleIcon color="warning" /> : <CheckCircleIcon color="success" />}
        {esPendientes ? 'Actividades Pendientes' : 'Actividades Completadas'} por Cultivo
        <Badge 
          badgeContent={totalActividades} 
          color={esPendientes ? "warning" : "success"} 
        />
      </Typography>
      
      <Box sx={{ maxHeight: 500, overflow: 'auto', pr: 1 }}>
        {Object.entries(gruposCultivos).map(([cultivoId, grupo]) => {
          const isExpanded = expandedCultivos.has(parseInt(cultivoId));
          
          return (
            <Card 
              key={cultivoId} 
              sx={{ 
                mb: 2, 
                border: esPendientes ? '1px solid #c8e6c9' : '1px solid #a5d6a7',
                backgroundColor: esPendientes ? '#f1f8e9' : '#e8f5e8',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  boxShadow: 3,
                  border: esPendientes ? '2px solid #4caf50' : '2px solid #2e7d32'
                }
              }}
            >
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: esPendientes ? '#4caf50' : '#2e7d32' }}>
                    {esPendientes ? <ScheduleIcon /> : <CheckCircleIcon />}
                  </Avatar>
                }
                action={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip
                      label={`${grupo.actividades.length} ${esPendientes ? 'pendientes' : 'completadas'}`}
                      size="small"
                      sx={{ 
                        color: esPendientes ? '#2e7d32' : '#1b5e20',
                        borderColor: esPendientes ? '#4caf50' : '#2e7d32'
                      }}
                      variant="outlined"
                    />
                    <IconButton
                      onClick={() => toggleExpandedCultivo(parseInt(cultivoId))}
                      size="small"
                    >
                      {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>
                }
                title={
                  <Typography variant="h6">
                    🌱 {grupo.cultivo.tipo} {grupo.cultivo.variedad && `(${grupo.cultivo.variedad})`}
                  </Typography>
                }
                subheader={`${grupo.actividades.length} actividades ${esPendientes ? 'por completar' : 'completadas'}`}
                sx={{ 
                  pb: 1, 
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.02)' }
                }}
                onClick={() => toggleExpandedCultivo(parseInt(cultivoId))}
              />
              
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <Divider />
                <CardContent sx={{ pt: 2 }}>
                  <List dense>
                    {grupo.actividades.map((actividad) => {
                      const fechaEjecucion = new Date(actividad.fechaEjecucion);
                      
                      return (
                        <ListItem 
                          key={actividad.id}
                          sx={{
                            borderRadius: 1,
                            mb: 1,
                            border: esPendientes ? '1px solid #c8e6c9' : '1px solid rgba(46, 125, 50, 0.3)',
                            backgroundColor: esPendientes ? '#f1f8e9' : 'rgba(46, 125, 50, 0.08)'
                          }}
                        >
                          <ListItemIcon>
                            <Checkbox
                              icon={<UncheckedIcon />}
                              checkedIcon={<CheckCircleIcon />}
                              checked={actividad.realizada}
                              disabled={actividad.realizada}
                              onChange={() => onToggleCompleted && onToggleCompleted(actividad.id, actividad.realizada)}
                              color={esPendientes ? "primary" : "success"}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography 
                                variant="body2" 
                                fontWeight={500}
                                sx={{
                                  textDecoration: actividad.realizada ? 'line-through' : 'none',
                                  opacity: actividad.realizada ? 0.8 : 1
                                }}
                              >
                                {actividad.nombre}
                              </Typography>
                            }
                            secondary={
                              <Box>
                                <Typography 
                                  variant="caption" 
                                  display="block"
                                  sx={{
                                    textDecoration: actividad.realizada ? 'line-through' : 'none',
                                    opacity: actividad.realizada ? 0.7 : 1
                                  }}
                                >
                                  {actividad.descripcion}
                                </Typography>
                                <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                                  <Typography variant="caption" color="text.secondary">
                                    📅 {fechaEjecucion.toLocaleDateString()}
                                  </Typography>
                                  <Chip
                                    label={actividad.prioridad}
                                    size="small"
                                    color={getPrioridadColor(actividad.prioridad)}
                                    sx={{ 
                                      height: 16, 
                                      fontSize: '0.65rem',
                                      opacity: actividad.realizada ? 0.7 : 1
                                    }}
                                  />
                                  {actividad.realizada && (
                                    <Chip
                                      label="✅ Completada"
                                      size="small"
                                      color="success"
                                      sx={{ height: 16, fontSize: '0.65rem' }}
                                    />
                                  )}
                                </Box>
                              </Box>
                            }
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                </CardContent>
              </Collapse>
            </Card>
          );
        })}
        
        {Object.keys(gruposCultivos).length === 0 && (
          <Card>
            <CardContent>
              <Box textAlign="center" py={3}>
                {esPendientes ? (
                  <>
                    <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      ¡Excelente trabajo!
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      No hay actividades pendientes.
                    </Typography>
                  </>
                ) : (
                  <>
                    <TrendingUpIcon sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Aún no hay actividades completadas
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completa algunas actividades para verlas aquí.
                    </Typography>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default ActividadesPorCultivo;
