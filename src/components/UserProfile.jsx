import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Paper,
  Grid,
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Lock as LockIcon,
  DeleteForever as DeleteIcon,
  Close as CloseIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services';

const UserProfile = ({ open, onClose }) => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Estados para formularios
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Reset de formularios cuando se abre el modal
  React.useEffect(() => {
    if (open && user) {
      setProfileData({
        name: user.name || '',
        email: user.email || ''
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setError('');
      setSuccess('');
      setShowDeleteConfirm(false);
    }
  }, [open, user]);

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      if (!profileData.name.trim()) {
        setError('El nombre no puede estar vacío');
        return;
      }

      if (!profileData.email.trim() || !profileData.email.includes('@')) {
        setError('Ingresa un email válido');
        return;
      }

      // Llamar al servicio para actualizar perfil
      const updatedUser = await authService.updateUserInfo(user.userId, {
        name: profileData.name,
        email: profileData.email
      });

      // Actualizar contexto
      updateUser(updatedUser);
      
      setSuccess('✅ Perfil actualizado correctamente');
      
    } catch (err) {
      console.error('❌ Error al actualizar perfil:', err);
      setError(err.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      if (!passwordData.currentPassword) {
        setError('Ingresa tu contraseña actual');
        return;
      }

      if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
        setError('La nueva contraseña debe tener al menos 6 caracteres');
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError('Las contraseñas nuevas no coinciden');
        return;
      }

      // Llamar al servicio para cambiar contraseña
      await authService.changePassword(user.userId, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      setSuccess('✅ Contraseña cambiada correctamente');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
    } catch (err) {
      console.error('❌ Error al cambiar contraseña:', err);
      setError(err.message || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      setError('');

      // Llamar al servicio para eliminar cuenta
      await authService.deleteAccount(user.userId);
      
      // Cerrar modal y hacer logout
      onClose();
      // El logout se manejará automáticamente cuando el backend responda
      
    } catch (err) {
      console.error('❌ Error al eliminar cuenta:', err);
      setError(err.message || 'Error al eliminar la cuenta');
      setLoading(false);
    }
  };

  const confirmDeleteAccount = () => {
    const confirmation = window.confirm(
      '🚨 ELIMINAR CUENTA\n\n' +
      '¿Estás seguro de que quieres eliminar tu cuenta?\n\n' +
      '⚠️ ADVERTENCIA: Esta acción es IRREVERSIBLE\n' +
      '• Se eliminarán todos tus cultivos\n' +
      '• Se eliminarán todas tus actividades\n' +
      '• Se eliminarán todas tus parcelas\n' +
      '• No podrás recuperar los datos\n\n' +
      '✅ OK = Eliminar cuenta permanentemente\n' +
      '❌ Cancelar = Mantener cuenta'
    );

    if (confirmation) {
      handleDeleteAccount();
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="h6">Mi Perfil</Typography>
              <Typography variant="body2" color="text.secondary">
                Gestiona tu información personal
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
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

        <Grid container spacing={3}>
          {/* SECCIÓN 1: INFORMACIÓN PERSONAL */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box display="flex" alignItems="center" mb={3}>
                <BadgeIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Información Personal</Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nombre completo"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    disabled={loading}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Correo electrónico"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    disabled={loading}
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
              </Grid>
              
              <Box mt={3} display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon />}
                  onClick={handleUpdateProfile}
                  disabled={loading}
                >
                  Guardar Cambios
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* SECCIÓN 2: CAMBIAR CONTRASEÑA */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box display="flex" alignItems="center" mb={3}>
                <LockIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Cambiar Contraseña</Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Contraseña actual"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nueva contraseña"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    disabled={loading}
                    helperText="Mínimo 6 caracteres"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirmar nueva contraseña"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    disabled={loading}
                  />
                </Grid>
              </Grid>
              
              <Box mt={3} display="flex" justifyContent="flex-end">
                <Button
                  variant="outlined"
                  startIcon={loading ? <CircularProgress size={16} /> : <LockIcon />}
                  onClick={handleChangePassword}
                  disabled={loading}
                >
                  Cambiar Contraseña
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* SECCIÓN 3: ZONA PELIGROSA */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, border: '1px solid', borderColor: 'error.main', bgcolor: 'error.50' }}>
              <Box display="flex" alignItems="center" mb={2}>
                <DeleteIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="h6" color="error">
                  Zona Peligrosa
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                ⚠️ Eliminar tu cuenta es una acción irreversible. Se eliminarán todos tus datos permanentemente.
              </Typography>
              
              <Button
                variant="outlined"
                color="error"
                startIcon={loading ? <CircularProgress size={16} /> : <DeleteIcon />}
                onClick={confirmDeleteAccount}
                disabled={loading}
              >
                Eliminar Mi Cuenta
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={loading}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserProfile;
