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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Agriculture as AgricultureIcon,
  DateRange as DateRangeIcon,
} from '@mui/icons-material';
import { cultivoService } from '../services';
import { useAuth } from '../context/AuthContext';

const CultivosManager = () => {
  const [cultivos, setCultivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCultivo, setEditingCultivo] = useState(null);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    nombre: '',
    variedad: '',
    fechaPlantacion: '',
    fechaCosechaEstimada: '',
    estado: 'PLANTADO',
    parcelaId: 1, // Por defecto, se podría obtener de un selector
  });

  const estados = [
    { value: 'PLANTADO', label: 'Plantado', color: 'success' },
    { value: 'CRECIENDO', label: 'Creciendo', color: 'info' },
    { value: 'FLORECIENDO', label: 'Floreciendo', color: 'warning' },
    { value: 'MADURO', label: 'Maduro', color: 'primary' },
    { value: 'COSECHADO', label: 'Cosechado', color: 'default' },
  ];

  useEffect(() => {
    cargarCultivos();
  }, []);

  const cargarCultivos = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Intentar obtener cultivos del usuario si está autenticado
      if (user && user.id) {
        const data = await cultivoService.obtenerPorUsuario(user.id);
        setCultivos(data);
      } else {
        // Si no está autenticado, intentar obtener cultivos del usuario por defecto
        try {
          const data = await cultivoService.obtenerPorUsuario(1);
          setCultivos(data);
        } catch (authError) {
          // Si falla por autenticación, mostrar datos de ejemplo
          console.log('No autenticado, mostrando datos de ejemplo');
          setCultivos([
            {
              id: 1,
              nombre: 'Tomates Cherry',
              variedad: 'Roma',
              fechaPlantacion: '2024-01-15',
              fechaCosechaEstimada: '2024-04-15',
              estado: 'CRECIENDO',
              parcelaId: 1,
            },
            {
              id: 2,
              nombre: 'Lechuga',
              variedad: 'Iceberg',
              fechaPlantacion: '2024-02-01',
              fechaCosechaEstimada: '2024-03-15',
              estado: 'MADURO',
              parcelaId: 1,
            },
            {
              id: 3,
              nombre: 'Zanahorias',
              variedad: 'Nantes',
              fechaPlantacion: '2024-01-20',
              fechaCosechaEstimada: '2024-04-20',
              estado: 'PLANTADO',
              parcelaId: 1,
            },
          ]);
        }
      }
    } catch (err) {
      setError(err.message || 'Error al cargar cultivos');
      // Datos de ejemplo para desarrollo
      setCultivos([
        {
          id: 1,
          nombre: 'Tomates Cherry',
          variedad: 'Roma',
          fechaPlantacion: '2024-01-15',
          fechaCosechaEstimada: '2024-04-15',
          estado: 'CRECIENDO',
          parcelaId: 1,
        },
        {
          id: 2,
          nombre: 'Lechuga',
          variedad: 'Iceberg',
          fechaPlantacion: '2024-02-01',
          fechaCosechaEstimada: '2024-03-15',
          estado: 'MADURO',
          parcelaId: 1,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCultivo) {
        // Actualizar cultivo existente
        // await cultivoService.actualizar(editingCultivo.id, formData);
        console.log('Actualizando cultivo:', formData);
      } else {
        // Crear nuevo cultivo
        await cultivoService.registrar(formData);
      }
      
      setOpenDialog(false);
      setEditingCultivo(null);
      setFormData({
        nombre: '',
        variedad: '',
        fechaPlantacion: '',
        fechaCosechaEstimada: '',
        estado: 'PLANTADO',
        parcelaId: 1,
      });
      cargarCultivos();
    } catch (err) {
      setError(err.message || 'Error al guardar cultivo');
    }
  };

  const handleEdit = (cultivo) => {
    setEditingCultivo(cultivo);
    setFormData({
      nombre: cultivo.nombre,
      variedad: cultivo.variedad,
      fechaPlantacion: cultivo.fechaPlantacion,
      fechaCosechaEstimada: cultivo.fechaCosechaEstimada,
      estado: cultivo.estado,
      parcelaId: cultivo.parcelaId,
    });
    setOpenDialog(true);
  };

  const handleDelete = async (cultivoId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cultivo?')) {
      try {
        // await cultivoService.eliminar(cultivoId);
        console.log('Eliminando cultivo:', cultivoId);
        cargarCultivos();
      } catch (err) {
        setError(err.message || 'Error al eliminar cultivo');
      }
    }
  };

  const getEstadoColor = (estado) => {
    const estadoObj = estados.find(e => e.value === estado);
    return estadoObj ? estadoObj.color : 'default';
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
          Mis Cultivos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Nuevo Cultivo
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {cultivos.map((cultivo) => (
          <Grid item xs={12} md={6} lg={4} key={cultivo.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                  <Box display="flex" alignItems="center">
                    <AgricultureIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" component="h3">
                      {cultivo.nombre}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton size="small" onClick={() => handleEdit(cultivo)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(cultivo.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Variedad: {cultivo.variedad}
                </Typography>

                <Box display="flex" alignItems="center" mb={1}>
                  <DateRangeIcon sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="body2">
                    Plantado: {new Date(cultivo.fechaPlantacion).toLocaleDateString()}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={2}>
                  <DateRangeIcon sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="body2">
                    Cosecha estimada: {new Date(cultivo.fechaCosechaEstimada).toLocaleDateString()}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Chip
                    label={cultivo.estado}
                    color={getEstadoColor(cultivo.estado)}
                    size="small"
                  />
                  <Typography variant="caption" color="text.secondary">
                    Parcela #{cultivo.parcelaId}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog para crear/editar cultivo */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingCultivo ? 'Editar Cultivo' : 'Nuevo Cultivo'}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Nombre del cultivo"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Variedad"
              value={formData.variedad}
              onChange={(e) => setFormData({...formData, variedad: e.target.value})}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Fecha de plantación"
              type="date"
              value={formData.fechaPlantacion}
              onChange={(e) => setFormData({...formData, fechaPlantacion: e.target.value})}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              fullWidth
              label="Fecha de cosecha estimada"
              type="date"
              value={formData.fechaCosechaEstimada}
              onChange={(e) => setFormData({...formData, fechaCosechaEstimada: e.target.value})}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Estado</InputLabel>
              <Select
                value={formData.estado}
                onChange={(e) => setFormData({...formData, estado: e.target.value})}
                label="Estado"
              >
                {estados.map((estado) => (
                  <MenuItem key={estado.value} value={estado.value}>
                    {estado.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button type="submit" variant="contained">
              {editingCultivo ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default CultivosManager;
