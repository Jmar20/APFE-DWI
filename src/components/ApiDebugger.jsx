import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  Alert,
  CircularProgress,
  TextField,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { api } from '../services';

const ApiDebugger = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});
  const [usuarioId, setUsuarioId] = useState('1');

  const endpoints = [
    {
      name: '👨‍💼 Listar usuarios (admin) ✅',
      method: 'GET',
      path: '/gestionadmin/usuarios',
      needsId: false,
      status: 'WORKING'
    },
    {
      name: '🔐 Login (obtener token)',
      method: 'POST',
      path: '/auth/login',
      needsId: false,
      testData: { "email": "admin@example.com", "password": "admin123" },
      status: 'WORKING'
    },
    {
      name: '🔍 Verificar token',
      method: 'POST',
      path: '/auth/verify',
      needsId: false,
      testData: {},
      status: 'WORKING'
    },
    {
      name: '🌱 Obtener cultivos por usuario',
      method: 'GET',
      path: '/gestioncultivo/cultivos/usuario/',
      needsId: true,
      status: 'WORKING'
    },
    {
      name: '🌱 Crear cultivo',
      method: 'POST',
      path: '/gestioncultivo/cultivos/crear',
      needsId: false,
      testData: {
        "nombre": "Tomate Cherry",
        "fechaSiembra": "2025-07-13",
        "usuarioId": 1,
        "variedad": "Roma"
      },
      status: 'WORKING'
    },
    {
      name: '📋 Obtener actividades de cultivo',
      method: 'GET',
      path: '/planificacion/actividades/cultivo/',
      needsId: true,
      status: 'WORKING'
    },
    {
      name: '🚨 Obtener alertas por usuario',
      method: 'GET',
      path: '/alerta/alertas/usuario/',
      needsId: true,
      status: 'WORKING'
    }
  ];

  const testEndpoint = async (endpoint) => {
    setLoading(true);
    const key = endpoint.name;
    
    try {
      const url = endpoint.needsId ? `${endpoint.path}${usuarioId}` : endpoint.path;
      console.log(`Probando: ${endpoint.method} ${url}`);
      
      let response;
      if (endpoint.method === 'GET') {
        response = await api.get(url);
      } else if (endpoint.method === 'POST') {
        const postData = endpoint.testData || {};
        response = await api.post(url, postData);
      }
      
      setResults(prev => ({
        ...prev,
        [key]: {
          success: true,
          status: response.status,
          data: response.data,
          url: api.defaults.baseURL + url
        }
      }));
      
    } catch (error) {
      console.error(`Error en ${endpoint.name}:`, error);
      setResults(prev => ({
        ...prev,
        [key]: {
          success: false,
          status: error.response?.status || 'No response',
          error: error.response?.data || error.message,
          url: api.defaults.baseURL + (endpoint.needsId ? `${endpoint.path}${usuarioId}` : endpoint.path)
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const testAllEndpoints = async () => {
    for (const endpoint of endpoints) {
      await testEndpoint(endpoint);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, margin: '0 auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        🔍 API Debugger
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Herramienta técnica para probar endpoints del backend.
      </Alert>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Configuración
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={6}>
              <TextField
                label="Usuario ID"
                value={usuarioId}
                onChange={(e) => setUsuarioId(e.target.value)}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                <strong>Backend URL:</strong> {api.defaults.baseURL}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          onClick={testAllEndpoints}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
          sx={{ mr: 2 }}
        >
          Probar Todos los Endpoints
        </Button>
      </Box>

      {endpoints.map((endpoint) => {
        const result = results[endpoint.name];
        
        return (
          <Card key={endpoint.name} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  {endpoint.name}
                </Typography>
                <Button
                  size="small"
                  onClick={() => testEndpoint(endpoint)}
                  disabled={loading}
                >
                  Probar
                </Button>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>{endpoint.method}</strong> {endpoint.path}{endpoint.needsId ? usuarioId : ''}
              </Typography>
              
              {result && (
                <Box>
                  <Alert 
                    severity={result.success ? 'success' : 'error'}
                    sx={{ mb: 1 }}
                  >
                    <strong>Status:</strong> {result.status} | 
                    <strong> URL:</strong> {result.url}
                  </Alert>
                  
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="body2">
                        Ver respuesta detallada
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                        <pre style={{ fontSize: '12px', overflow: 'auto', margin: 0 }}>
                          {result.success 
                            ? JSON.stringify(result.data, null, 2)
                            : JSON.stringify(result.error, null, 2)
                          }
                        </pre>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              )}
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};

export default ApiDebugger;