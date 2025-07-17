import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  Alert,
  CircularProgress 
} from '@mui/material';
import { cultivoService } from '../services';

const EjemploCultivos = () => {
  const [cultivos, setCultivos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Función para obtener cultivos por usuario
  const obtenerCultivos = async (usuarioId) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      console.log(`Obteniendo cultivos para usuario: ${usuarioId}`);
      const response = await cultivoService.obtenerPorUsuario(usuarioId);
      console.log('Respuesta del backend:', response);
      
      setCultivos(response);
      setSuccess(`Se obtuvieron ${response.length} cultivos correctamente`);
    } catch (err) {
      console.error('Error al obtener cultivos:', err);
      setError(err.message || 'Error al conectar con el backend');
    } finally {
      setLoading(false);
    }
  };

  // Función para crear un cultivo de ejemplo
  const crearCultivoEjemplo = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    const cultivoData = {
      nombre: 'Tomate Cherry',
      variedad: 'Cherry Red',
      fechaPlantacion: new Date().toISOString().split('T')[0],
      fechaCosechaEstimada: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      estado: 'PLANTADO',
      parcelaId: 1
    };

    try {
      console.log('Creando cultivo:', cultivoData);
      const response = await cultivoService.registrar(cultivoData);
      console.log('Cultivo creado:', response);
      
      setSuccess('Cultivo creado exitosamente');
      // Actualizar la lista después de crear
      obtenerCultivos(1);
    } catch (err) {
      console.error('Error al crear cultivo:', err);
      setError(err.message || 'Error al crear el cultivo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Ejemplo de Conexión con Backend
      </Typography>
      
      <Typography variant="body1" paragraph>
        Este es un ejemplo de cómo conectar el frontend React con tu backend en localhost:8080
      </Typography>

      {/* Mensajes de estado */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Botones de acción */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          onClick={() => obtenerCultivos(1)}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Obtener Cultivos (Usuario ID: 1)
        </Button>
        
        <Button
          variant="outlined"
          onClick={crearCultivoEjemplo}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Crear Cultivo de Ejemplo
        </Button>
      </Box>

      {/* Información de configuración */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Configuración Actual
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Backend URL:</strong> http://localhost:8080/api/v1
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Endpoint de cultivos:</strong> GET /gestioncultivo/cultivos/usuario/{'{id}'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Crear cultivo:</strong> POST /gestioncultivo/cultivos
          </Typography>
        </CardContent>
      </Card>

      {/* Lista de cultivos */}
      {cultivos.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Cultivos Obtenidos ({cultivos.length})
            </Typography>
            {cultivos.map((cultivo, index) => (
              <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                <Typography variant="subtitle1">
                  <strong>{cultivo.nombre}</strong> - {cultivo.variedad}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Estado: {cultivo.estado} | Plantación: {cultivo.fechaPlantacion}
                </Typography>
                {cultivo.fechaCosechaEstimada && (
                  <Typography variant="body2" color="text.secondary">
                    Cosecha estimada: {cultivo.fechaCosechaEstimada}
                  </Typography>
                )}
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Información de debugging */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Debugging Info
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Abre las herramientas de desarrollador (F12) para ver los logs de consola
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Verifica que tu backend esté corriendo en http://localhost:8080
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Revisa la pestaña Network para ver las peticiones HTTP
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EjemploCultivos;
