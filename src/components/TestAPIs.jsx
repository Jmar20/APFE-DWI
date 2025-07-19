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
  Tabs,
  Tab
} from '@mui/material';
import { authService, cultivoService, alertaService, planificacionService } from '../services';
import { config } from '../config';

const TestAPIs = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});
  const [tabValue, setTabValue] = useState(0);
  const [loginData, setLoginData] = useState({
    email: 'admin@example.com',
    password: 'admin123'
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const showResult = (key, success, data, error = null) => {
    setResults(prev => ({
      ...prev,
      [key]: { success, data, error, timestamp: new Date().toLocaleTimeString() }
    }));
  };

  // Test de login
  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await authService.login(loginData);
      console.log('=== RESPUESTA COMPLETA DEL LOGIN ===');
      console.log('Response completa:', response);
      console.log('Response data:', response.data);
      console.log('Response user:', response.user);
      console.log('Response usuario:', response.usuario);
      console.log('Response id:', response.id);
      console.log('Response userId:', response.userId);
      console.log('Response userData:', response.userData);
      console.log('=== FIN RESPUESTA LOGIN ===');
      
      // Obtener userData del localStorage después del login
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      console.log('📄 DATOS GUARDADOS EN LOCALSTORAGE:', userData);
      
      showResult('login', true, response);
    } catch (error) {
      showResult('login', false, null, error.message);
    } finally {
      setLoading(false);
    }
  };

  // Test de obtener cultivos
  const testObtenerCultivos = async () => {
    setLoading(true);
    try {
      const response = await cultivoService.obtenerPorUsuario(1);
      showResult('cultivos', true, response);
    } catch (error) {
      showResult('cultivos', false, null, error.message);
    } finally {
      setLoading(false);
    }
  };

  // Test de crear cultivo
  const testCrearCultivo = async () => {
    setLoading(true);
    try {
      console.log('=== 🚀 NUEVO TEST - CULTIVO CON FORMATO ACTUALIZADO ===');
      
      // PASO 1: Login como admin
      console.log('=== PASO 1: LOGIN COMO ADMIN ===');
      const loginResult = await authService.login({
        email: "admin@example.com",
        password: "admin123"
      });
      console.log("✅ Login exitoso:", loginResult);
      
      // PASO 2: Obtener userId del localStorage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      console.log("📄 DATOS DEL USUARIO LOGUEADO:", userData);
      
      if (!userData.userId) {
        throw new Error('❌ No se encontró userId en localStorage');
      }

      // PASO 3: Crear cultivo con el NUEVO FORMATO
      console.log('=== PASO 3: CREANDO CULTIVO CON NUEVO FORMATO ===');
      
      const cultivoData = {
        tipo: 'Tomate Cherry Premium',  // Se mapea a 'nombre' en el backend
        variedad: 'Cherry Deluxe',
        fechaSiembra: '2025-07-13',
        userId: userData.userId        // ✅ Usando userId directamente
      };

      console.log('📤 Enviando datos:', cultivoData);

      const resultado = await cultivoService.registrar(cultivoData);

      console.log('🎉 ¡ÉXITO COMPLETO!:', resultado);
      showResult('crearCultivo', true, resultado, `
🎉 ¡CULTIVO CREADO EXITOSAMENTE!
📋 Datos enviados:
   - Nombre: ${cultivoData.tipo}
   - Variedad: ${cultivoData.variedad}  
   - Fecha: ${cultivoData.fechaSiembra}
   - UserId: ${cultivoData.userId}

🎯 ID del cultivo creado: ${resultado.id || resultado.cultivoId || 'N/A'}
✅ INTEGRACIÓN FRONTEND-BACKEND FUNCIONANDO PERFECTAMENTE!`);

    } catch (error) {
      console.error('❌ Error en test:', error);
      showResult('crearCultivo', false, null, error.message);
    } finally {
      setLoading(false);
    }
  };

  // Test de alertas
  const testObtenerAlertas = async () => {
    setLoading(true);
    try {
      const response = await alertaService.obtenerPorUsuario(1);
      showResult('alertas', true, response);
    } catch (error) {
      showResult('alertas', false, null, error.message);
    } finally {
      setLoading(false);
    }
  };

  // Test de actividades
  const testObtenerActividades = async () => {
    setLoading(true);
    try {
      const response = await planificacionService.obtenerActividadesPorCultivo(1);
      showResult('actividades', true, response);
    } catch (error) {
      showResult('actividades', false, null, error.message);
    } finally {
      setLoading(false);
    }
  };

  const ResultCard = ({ title, resultKey }) => {
    const result = results[resultKey];
    if (!result) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {title} - {result.timestamp}
          </Typography>
          <Alert severity={result.success ? 'success' : 'error'} sx={{ mb: 2 }}>
            {result.success ? 'Éxito' : `Error: ${result.error}`}
          </Alert>
          {result.success && (
            <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1 }}>
              <pre style={{ fontSize: '12px', overflow: 'auto', margin: 0 }}>
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ maxWidth: 1000, margin: '0 auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        🧪 Test de APIs Reales
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Esta herramienta prueba las APIs reales de tu backend usando los servicios configurados.
      </Alert>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="🔐 Autenticación" />
        <Tab label="🌱 Cultivos" />
        <Tab label="🚨 Alertas" />
        <Tab label="📋 Actividades" />
      </Tabs>

      {/* Tab de Autenticación */}
      {tabValue === 0 && (
        <Box>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Datos de Login
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Email"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({...prev, email: e.target.value}))}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({...prev, password: e.target.value}))}
                    fullWidth
                    size="small"
                  />
                </Grid>
              </Grid>
              <Button
                variant="contained"
                onClick={testLogin}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
                sx={{ mt: 2 }}
              >
                Probar Login
              </Button>
            </CardContent>
          </Card>
          <ResultCard title="Login" resultKey="login" />
        </Box>
      )}

      {/* Tab de Cultivos */}
      {tabValue === 1 && (
        <Box>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Operaciones de Cultivos
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  onClick={testObtenerCultivos}
                  disabled={loading}
                >
                  Obtener Cultivos (Usuario 1)
                </Button>
                <Button
                  variant="outlined"
                  onClick={testCrearCultivo}
                  disabled={loading}
                >
                  Crear Cultivo de Prueba
                </Button>
              </Box>
            </CardContent>
          </Card>
          <ResultCard title="Obtener Cultivos" resultKey="cultivos" />
          <ResultCard title="Crear Cultivo" resultKey="crearCultivo" />
        </Box>
      )}

      {/* Tab de Alertas */}
      {tabValue === 2 && (
        <Box>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Gestión de Alertas
              </Typography>
              <Button
                variant="contained"
                onClick={testObtenerAlertas}
                disabled={loading}
              >
                Obtener Alertas (Usuario 1)
              </Button>
            </CardContent>
          </Card>
          <ResultCard title="Obtener Alertas" resultKey="alertas" />
        </Box>
      )}

      {/* Tab de Actividades */}
      {tabValue === 3 && (
        <Box>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Planificación de Actividades
              </Typography>
              <Button
                variant="contained"
                onClick={testObtenerActividades}
                disabled={loading}
              >
                Obtener Actividades (Cultivo 1)
              </Button>
            </CardContent>
          </Card>
          <ResultCard title="Obtener Actividades" resultKey="actividades" />
        </Box>
      )}

      {/* Información de configuración */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📋 Información
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>Backend URL:</strong> {config.API_BASE_URL}
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>Usuario de prueba:</strong> admin@example.com / admin123
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>Usuario ID:</strong> 1
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TestAPIs;
