import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import api from '../services/api';

const BackendStatus = () => {
  const [status, setStatus] = useState({});
  const [loading, setLoading] = useState(false);

  const endpoints = [
    {
      name: 'Usuarios - Obtener',
      method: 'GET',
      path: '/usuarios/25',
      required: true,
      description: 'Obtener información de usuario'
    },
    {
      name: 'Usuarios - Actualizar',
      method: 'PUT', 
      path: '/usuarios/25',
      required: true,
      description: 'Actualizar nombre y email'
    },
    {
      name: 'Usuarios - Cambiar Contraseña',
      method: 'PUT',
      path: '/usuarios/25/password',
      required: true,
      description: 'Cambiar contraseña de usuario'
    },
    {
      name: 'Usuarios - Eliminar',
      method: 'DELETE',
      path: '/usuarios/25', 
      required: true,
      description: 'Eliminar cuenta de usuario'
    },
    {
      name: 'Cultivos - Listar',
      method: 'GET',
      path: '/gestioncultivo/cultivos',
      required: false,
      description: 'Obtener lista de cultivos'
    }
  ];

  const checkEndpoint = async (endpoint) => {
    try {
      let response;
      if (endpoint.method === 'GET') {
        response = await api.get(endpoint.path);
      } else {
        // Para otros métodos, solo verificar si el endpoint existe
        // enviando datos mínimos
        const testData = endpoint.path.includes('password') 
          ? { currentPassword: 'test', newPassword: 'test' }
          : { test: true };
        
        if (endpoint.method === 'PUT') {
          response = await api.put(endpoint.path, testData);
        } else if (endpoint.method === 'DELETE') {
          response = await api.delete(endpoint.path);
        }
      }
      
      return { status: 'available', code: response.status };
    } catch (error) {
      if (error.response?.status === 404) {
        return { status: 'not_found', code: 404 };
      } else if (error.response?.status === 400) {
        return { status: 'available', code: 400, note: 'Disponible (validación falló)' };
      } else if (error.response?.status === 401) {
        return { status: 'available', code: 401, note: 'Disponible (no autorizado)' };
      } else {
        return { status: 'error', code: error.response?.status || 'unknown' };
      }
    }
  };

  const checkAllEndpoints = async () => {
    setLoading(true);
    const newStatus = {};
    
    for (const endpoint of endpoints) {
      console.log(`🔍 Verificando ${endpoint.method} ${endpoint.path}...`);
      newStatus[endpoint.path] = await checkEndpoint(endpoint);
    }
    
    setStatus(newStatus);
    setLoading(false);
  };

  useEffect(() => {
    checkAllEndpoints();
  }, []);

  const getStatusIcon = (endpointStatus) => {
    if (!endpointStatus) return <CircularProgress size={20} />;
    
    switch (endpointStatus.status) {
      case 'available':
        return <CheckIcon color="success" />;
      case 'not_found':
        return <ErrorIcon color="error" />;
      default:
        return <WarningIcon color="warning" />;
    }
  };

  const getStatusColor = (endpointStatus) => {
    if (!endpointStatus) return 'default';
    
    switch (endpointStatus.status) {
      case 'available':
        return 'success';
      case 'not_found':
        return 'error';
      default:
        return 'warning';
    }
  };

  const missingEndpoints = endpoints.filter(ep => 
    status[ep.path]?.status === 'not_found' && ep.required
  );

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Estado del Backend
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={loading ? <CircularProgress size={16} /> : <RefreshIcon />}
            onClick={checkAllEndpoints}
            disabled={loading}
          >
            {loading ? 'Verificando...' : 'Refrescar'}
          </Button>
        </Box>

        {missingEndpoints.length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              ⚠️ Endpoints Críticos No Disponibles
            </Typography>
            <Typography variant="body2">
              Revisa el archivo <code>BACKEND_ENDPOINTS_FALTANTES.md</code> para implementar los endpoints faltantes.
            </Typography>
          </Alert>
        )}

        <List dense>
          {endpoints.map((endpoint) => {
            const endpointStatus = status[endpoint.path];
            return (
              <ListItem key={endpoint.path}>
                <ListItemIcon>
                  {getStatusIcon(endpointStatus)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body2" fontWeight="bold">
                        {endpoint.method}
                      </Typography>
                      <Typography variant="body2" fontFamily="monospace">
                        {endpoint.path}
                      </Typography>
                      <Chip
                        size="small"
                        label={endpointStatus?.status || 'checking'}
                        color={getStatusColor(endpointStatus)}
                        variant="outlined"
                      />
                      {endpoint.required && (
                        <Chip
                          size="small"
                          label="REQUERIDO"
                          color="primary"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {endpoint.description}
                      </Typography>
                      {endpointStatus?.note && (
                        <Typography variant="caption" color="info.main" display="block">
                          {endpointStatus.note}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            );
          })}
        </List>

        <Box mt={2}>
          <Typography variant="caption" color="text.secondary">
            💡 <strong>Tip:</strong> Los endpoints marcados como "REQUERIDO" son necesarios para que las funciones de perfil funcionen correctamente.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BackendStatus;
