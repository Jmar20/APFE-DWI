import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Box, TextField, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CultivoDebugger = () => {
  const { user } = useAuth();
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const testBackendConnection = async () => {
    setLoading(true);
    try {
      // Datos de prueba mínimos - ACTUALIZADOS PARA BACKEND REAL
      const testData = {
        tipo: 'Tomate',
        variedad: 'Cherry',
        fechaSiembra: '2025-07-15',
        estado: 'ACTIVO',
        userId: user?.userId || user?.id || 1 // ✅ Backend espera 'userId'
      };

      console.log('🧪 Probando backend REAL (puerto 8080) con datos:', testData);
      
      const result = await api.post('/gestioncultivo/cultivos', testData);
      
      setResponse({
        success: true,
        data: result.data,
        status: result.status
      });

    } catch (error) {
      console.error('❌ Error en test:', error);
      setResponse({
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status,
        config: error.config
      });
    } finally {
      setLoading(false);
    }
  };

  const testUserInfo = () => {
    console.log('👤 Usuario actual:', user);
    setResponse({
      success: true,
      userInfo: user,
      userId: user?.userId || user?.id,
      allFields: Object.keys(user || {})
    });
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🧪 Debugger de Cultivos
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button 
            variant="contained" 
            onClick={testUserInfo}
            color="info"
          >
            Mostrar Usuario
          </Button>
          
          <Button 
            variant="contained" 
            onClick={testBackendConnection}
            disabled={loading}
            color="primary"
          >
            {loading ? 'Probando...' : 'Probar Backend'}
          </Button>
        </Box>

        {response && (
          <Alert 
            severity={response.success ? 'success' : 'error'} 
            sx={{ mt: 2 }}
          >
            <Typography variant="body2" component="pre">
              {JSON.stringify(response, null, 2)}
            </Typography>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default CultivoDebugger;
