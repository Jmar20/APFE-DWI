import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Backdrop,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Home as HomeIcon,
  Square as SquareIcon,
  Agriculture as AgricultureIcon,
} from '@mui/icons-material';
import { parcelaService } from '../services/parcelaService';
import { useAuth } from '../context/AuthContext';

const ParcelasManager = () => {
  const [parcelas, setParcelas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingParcela, setEditingParcela] = useState(null);
  const [creatingParcela, setCreatingParcela] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    superficie: 100,
    ubicacion: '',
    tipoSuelo: '',
    caracteristicas: ''
  });

  useEffect(() => {
    cargarParcelas();

    // 🚀 NUEVO: Escuchar evento de usuario registrado
    const handleUserRegistered = (event) => {
      console.log('🔄 Usuario recién registrado detectado en ParcelasManager, recargando datos...', event.detail);
      // Recargar datos después de un pequeño delay adicional
      setTimeout(() => {
        cargarParcelas();
      }, 1500);
    };

    window.addEventListener('userRegistered', handleUserRegistered);

    // Cleanup listeners al desmontar el componente
    return () => {
      window.removeEventListener('userRegistered', handleUserRegistered);
    };
  }, []);

  const cargarParcelas = async (reintentos = 3) => {
    try {
      setLoading(true);
      setError('');
      
      const userIdToUse = user?.userId || user?.id || 1;
      console.log('🏡 Cargando parcelas para usuario:', userIdToUse);
      
      const data = await parcelaService.obtenerPorUsuario(userIdToUse);
      console.log('🏡 Parcelas obtenidas del backend:', data);
      
      setParcelas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ Error al cargar parcelas:', err);
      
      if (reintentos > 1) {
        console.warn('⚠️ Error al cargar parcelas, reintentos restantes:', reintentos - 1);
        // Reintento después de un delay
        setTimeout(() => {
          cargarParcelas(reintentos - 1);
        }, 2000);
      } else {
        setError(err.message || 'Error al cargar parcelas');
        setParcelas([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreatingParcela(true);
    
    try {
      const datosConUserId = {
        ...formData,
        usuarioId: user?.userId || user?.id
      };
      
      console.log('🏗️ Datos de parcela a enviar:', datosConUserId);

      if (editingParcela) {
        // Actualizar parcela existente
        await parcelaService.actualizar(editingParcela.id, datosConUserId);
        console.log('✅ Parcela actualizada correctamente');
        
        setSnackbar({
          open: true,
          message: '✅ Parcela actualizada correctamente',
          severity: 'success'
        });
      } else {
        // Crear nueva parcela
        const parcelaCreada = await parcelaService.crear(datosConUserId);
        console.log('✅ Parcela creada:', parcelaCreada);
        
        setSnackbar({
          open: true,
          message: '✅ Parcela creada correctamente',
          severity: 'success'
        });
      }

      // Limpiar formulario y cerrar diálogo
      setOpenDialog(false);
      setEditingParcela(null);
      setFormData({
        nombre: '',
        descripcion: '',
        superficie: 100,
        ubicacion: '',
        tipoSuelo: '',
        caracteristicas: ''
      });
      
      // Recargar parcelas
      await cargarParcelas();
      
      // 🚨 Disparar evento para que otros componentes se enteren
      window.dispatchEvent(new CustomEvent('parcelaCreated'));
      
    } catch (err) {
      console.error('❌ Error al guardar parcela:', err);
      setError(err.message || 'Error al guardar parcela');
      setSnackbar({
        open: true,
        message: `❌ Error: ${err.message}`,
        severity: 'error'
      });
    } finally {
      setCreatingParcela(false);
    }
  };

  const handleEdit = (parcela) => {
    console.log('✏️ Editando parcela:', parcela);
    setEditingParcela(parcela);
    setFormData({
      nombre: parcela.nombre || '',
      descripcion: parcela.descripcion || '',
      superficie: parcela.superficie || 100,
      ubicacion: parcela.ubicacion || '',
      tipoSuelo: parcela.tipoSuelo || '',
      caracteristicas: parcela.caracteristicas || ''
    });
    setOpenDialog(true);
  };

  const handleDelete = async (parcelaId) => {
    const confirmacion = window.confirm(
      '🗑️ ELIMINAR PARCELA\n\n' +
      '¿Estás seguro de que quieres eliminar esta parcela?\n\n' +
      '⚠️ ADVERTENCIA: Si hay cultivos asociados a esta parcela,\n' +
      'es posible que no se pueda eliminar.\n\n' +
      '✅ OK = Eliminar parcela\n' +
      '❌ Cancelar = No eliminar'
    );

    if (confirmacion) {
      setLoading(true);
      try {
        console.log('🗑️ Eliminando parcela ID:', parcelaId);
        await parcelaService.eliminar(parcelaId);
        console.log('✅ Parcela eliminada correctamente');
        
        setSnackbar({
          open: true,
          message: '✅ Parcela eliminada correctamente',
          severity: 'success'
        });
        
        // Recargar parcelas
        await cargarParcelas();
        
        // Disparar evento para actualizar otros componentes
        window.dispatchEvent(new CustomEvent('parcelaEliminada', { 
          detail: { parcelaId } 
        }));
        
      } catch (err) {
        console.error('❌ Error al eliminar parcela:', err);
        setError(err.message || 'Error al eliminar parcela');
        setSnackbar({
          open: true,
          message: `❌ Error: ${err.message}`,
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleNuevaParcela = () => {
    setEditingParcela(null);
    setFormData({
      nombre: '',
      descripcion: '',
      superficie: 100,
      ubicacion: '',
      tipoSuelo: '',
      caracteristicas: ''
    });
    setOpenDialog(true);
  };

  const getSuperficieColor = (superficie) => {
    if (superficie >= 1000) return 'success';
    if (superficie >= 500) return 'warning';
    return 'info';
  };

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
          🏡 Gestión de Parcelas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNuevaParcela}
        >
          Nueva Parcela
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Estadísticas rápidas */}
      <Alert severity="info" sx={{ mb: 3 }}>
        📊 <strong>Resumen:</strong> {parcelas.length} parcelas registradas | 
        Superficie total: {parcelas.reduce((sum, p) => sum + (p.superficie || 0), 0)}m² |
        Promedio: {parcelas.length > 0 ? Math.round(parcelas.reduce((sum, p) => sum + (p.superficie || 0), 0) / parcelas.length) : 0}m² por parcela
      </Alert>

      {parcelas.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 6 }}>
          <CardContent>
            <HomeIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No hay parcelas registradas
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Comienza creando tu primera parcela para organizar mejor tus cultivos
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleNuevaParcela}
            >
              Crear Primera Parcela
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {parcelas.map((parcela) => (
            <Grid item xs={12} md={6} lg={4} key={parcela.id}>
              <Card sx={{ 
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Box display="flex" alignItems="center">
                      <HomeIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6" component="h3">
                        {parcela.nombre}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(parcela)}
                        title="Editar parcela"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(parcela.id)}
                        title="Eliminar parcela"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                    {parcela.descripcion || 'Sin descripción'}
                  </Typography>

                  <Box display="flex" alignItems="center" mb={1}>
                    <SquareIcon sx={{ mr: 1, fontSize: 16 }} />
                    <Typography variant="body2">
                      Superficie: {parcela.superficie || 0}m²
                    </Typography>
                  </Box>

                  {parcela.ubicacion && (
                    <Box display="flex" alignItems="center" mb={1}>
                      <Typography variant="body2" color="text.secondary">
                        📍 {parcela.ubicacion}
                      </Typography>
                    </Box>
                  )}

                  {parcela.tipoSuelo && (
                    <Box display="flex" alignItems="center" mb={2}>
                      <Typography variant="body2" color="text.secondary">
                        🌱 Suelo: {parcela.tipoSuelo}
                      </Typography>
                    </Box>
                  )}

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Chip
                      label={`${parcela.superficie || 0}m²`}
                      color={getSuperficieColor(parcela.superficie || 0)}
                      size="small"
                    />
                    <Typography variant="caption" color="text.secondary">
                      ID: {parcela.id}
                    </Typography>
                  </Box>

                  {parcela.caracteristicas && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      💡 {parcela.caracteristicas}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog para crear/editar parcela */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingParcela ? '✏️ Editar Parcela' : '🏗️ Nueva Parcela'}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Nombre de la parcela"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              margin="normal"
              required
              placeholder="Ej: Parcela Norte, Invernadero 1, Huerto Este..."
            />
            
            <TextField
              fullWidth
              label="Descripción"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              margin="normal"
              required
              placeholder="Ej: Zona soleada ideal para tomates y pimientos"
              multiline
              rows={2}
            />
            
            <TextField
              fullWidth
              label="Superficie (m²)"
              type="number"
              value={formData.superficie}
              onChange={(e) => setFormData({ ...formData, superficie: parseFloat(e.target.value) || 0 })}
              margin="normal"
              required
              inputProps={{ min: 1, step: 0.1 }}
              placeholder="100"
            />
            
            <TextField
              fullWidth
              label="Ubicación (opcional)"
              value={formData.ubicacion}
              onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
              margin="normal"
              placeholder="Ej: Sector norte del terreno, Junto al almacén..."
            />
            
            <TextField
              fullWidth
              label="Tipo de suelo (opcional)"
              value={formData.tipoSuelo}
              onChange={(e) => setFormData({ ...formData, tipoSuelo: e.target.value })}
              margin="normal"
              placeholder="Ej: Arcilloso, Arenoso, Franco, Orgánico..."
            />
            
            <TextField
              fullWidth
              label="Características especiales (opcional)"
              value={formData.caracteristicas}
              onChange={(e) => setFormData({ ...formData, caracteristicas: e.target.value })}
              margin="normal"
              placeholder="Ej: Sistema de riego automático, Protección contra viento..."
              multiline
              rows={2}
            />
            
            <Alert severity="info" sx={{ mt: 2 }}>
              💡 <strong>Tip:</strong> Una buena descripción ayuda a elegir la parcela adecuada al crear cultivos.
              Incluye información sobre exposición solar, drenaje y características del suelo.
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button type="submit" variant="contained">
              {editingParcela ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Backdrop para loading */}
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.modal + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
        open={creatingParcela}
      >
        <CircularProgress color="inherit" size={60} thickness={4} />
        <Typography variant="h6" component="div" sx={{ fontWeight: 'medium', textAlign: 'center' }}>
          🏗️ {editingParcela ? 'Actualizando' : 'Creando'} parcela...
        </Typography>
      </Backdrop>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ParcelasManager;
