import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  Person as PersonIcon,
  Save as SaveIcon,
  Lock as LockIcon,
  DeleteForever as DeleteIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  Agriculture as AgricultureIcon,
  Nature as NatureIcon,
  LocalFlorist as FloristIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';
import { validatePassword } from '../utils/validation';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estados para formularios
  const [profileData, setProfileData] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Sincronizar estado local del formulario con datos del usuario del contexto
  useEffect(() => {
    if (user) {
      setProfileData({
        nombre: user.nombre || '',
        email: user.email || '',
      });
    }
  }, [user]);

  // Limpiar mensajes cuando cambie el formulario
  const clearMessages = () => {
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    clearMessages();
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    clearMessages();
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      if (!profileData.nombre.trim()) {
        setError('❌ El nombre es obligatorio');
        return;
      }

      if (!profileData.email.trim()) {
        setError('❌ El email es obligatorio');
        return;
      }

      console.log('💾 Actualizando perfil para userId:', user.userId);

      // Llamar al servicio para actualizar perfil
      const updatedData = await authService.updateUserInfo(user.userId, {
        nombre: profileData.nombre.trim(),
        email: profileData.email.trim()
      });

      // Crear objeto con datos actualizados
      const newUserData = {
        ...user,
        nombre: profileData.nombre.trim(),
        email: profileData.email.trim()
      };

      // Actualizar el contexto de usuario inmediatamente
      updateUser(newUserData);

      // También actualizar el estado local del formulario para reflejar los cambios
      setProfileData({
        nombre: profileData.nombre.trim(),
        email: profileData.email.trim()
      });

      setSuccess('✅ Perfil actualizado correctamente');
      
    } catch (err) {
      console.error('❌ Error al actualizar perfil:', err);
      
      // Mensajes de error más específicos
      if (err.message.includes('email ya está en uso')) {
        setError('❌ Este email ya está siendo usado por otro usuario.');
      } else if (err.message.includes('Usuario no encontrado')) {
        setError('❌ Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      } else if (err.message.includes('404')) {
        setError('❌ El backend no tiene configurado el endpoint para actualizar usuarios. Contacta al administrador.');
      } else {
        setError(`❌ ${err.message || 'Error al actualizar el perfil'}`);
      }
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
        setError('❌ Ingresa tu contraseña actual');
        return;
      }

      // Validación completa de la nueva contraseña
      const passwordValidation = validatePassword(passwordData.newPassword);
      if (!passwordValidation.isValid) {
        setError(`❌ La nueva contraseña no es válida:\n• ${passwordValidation.errors.join('\n• ')}`);
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError('❌ Las contraseñas nuevas no coinciden');
        return;
      }

      console.log('🔒 Cambiando contraseña para userId:', user.userId);

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
      
      // Mensajes de error más específicos
      if (err.message.includes('contraseña actual es incorrecta')) {
        setError('❌ La contraseña actual que ingresaste es incorrecta.');
      } else if (err.message.includes('no cumple con los requisitos')) {
        setError('❌ La nueva contraseña no cumple con los requisitos de seguridad.');
      } else if (err.message.includes('Usuario no encontrado')) {
        setError('❌ Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      } else if (err.message.includes('404')) {
        setError('❌ El backend no tiene configurado el endpoint para cambiar contraseñas. Contacta al administrador.');
      } else {
        setError(`❌ ${err.message || 'Error al cambiar la contraseña'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('🗑️ Eliminando cuenta para userId:', user.userId);

      // Llamar al servicio para eliminar cuenta
      await authService.deleteAccount(user.userId);

      setSuccess('✅ Cuenta eliminada correctamente');
      
      // Redirigir al login después de un momento
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      
    } catch (err) {
      console.error('❌ Error al eliminar cuenta:', err);
      
      // Mensajes de error más específicos
      if (err.message.includes('Usuario no encontrado')) {
        setError('❌ Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      } else if (err.message.includes('404')) {
        setError('❌ El backend no tiene configurado el endpoint para eliminar usuarios. Contacta al administrador.');
      } else {
        setError(`❌ ${err.message || 'Error al eliminar la cuenta'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteAccount = () => {
    if (window.confirm('⚠️ ¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      handleDeleteAccount();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header decorativo */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: 4,
        background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
        borderRadius: 3,
        p: 4,
        color: 'white'
      }}>
        <Avatar sx={{ 
          bgcolor: 'rgba(255,255,255,0.2)', 
          width: 80, 
          height: 80, 
          mx: 'auto', 
          mb: 2,
          border: '3px solid rgba(255,255,255,0.3)'
        }}>
          <PersonIcon sx={{ fontSize: 40 }} />
        </Avatar>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          Mi Perfil
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Gestiona tu información personal y configuración de cuenta
        </Typography>
      </Box>

      {/* Estadísticas del usuario */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
            color: 'white',
            height: '100%'
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <AgricultureIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                0
              </Typography>
              <Typography variant="body1">
                Cultivos Activos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
            color: 'white',
            height: '100%'
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <NatureIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                0
              </Typography>
              <Typography variant="body1">
                Actividades Pendientes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)',
            color: 'white',
            height: '100%'
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <FloristIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                0
              </Typography>
              <Typography variant="body1">
                Cosechas Realizadas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Contenido principal en 3 columnas */}
      <Grid container spacing={4}>
        {/* Columna 1: Información Personal */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, height: 'fit-content' }}>
            <Box display="flex" alignItems="center" mb={3}>
              <PersonIcon color="primary" sx={{ mr: 2 }} />
              <Typography variant="h5" component="h2" fontWeight="bold">
                Información Personal
              </Typography>
            </Box>

            {/* Información actual */}
            <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Información actual:
              </Typography>
              <Box display="flex" alignItems="center" mb={1}>
                <BadgeIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  <strong>Nombre:</strong> {user?.nombre || 'No especificado'}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  <strong>Email:</strong> {user?.email || 'No especificado'}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Formulario de actualización */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nombre completo"
                  value={profileData.nombre}
                  onChange={(e) => handleProfileChange('nombre', e.target.value)}
                  disabled={loading}
                  InputProps={{
                    startAdornment: <BadgeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Correo electrónico"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  disabled={loading}
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  onClick={handleSaveProfile}
                  disabled={loading}
                  sx={{ py: 1.5 }}
                >
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Columna 2: Cambiar Contraseña */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, height: 'fit-content' }}>
            <Box display="flex" alignItems="center" mb={3}>
              <LockIcon color="primary" sx={{ mr: 2 }} />
              <Typography variant="h5" component="h2" fontWeight="bold">
                Cambiar Contraseña
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Mantén tu cuenta segura actualizando tu contraseña regularmente.
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Contraseña actual"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nueva contraseña"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  disabled={loading}
                  helperText="Debe contener: mayúsculas, minúsculas, números y mínimo 6 caracteres"
                />
                <PasswordStrengthIndicator password={passwordData.newPassword} />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirmar nueva contraseña"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LockIcon />}
                  onClick={handleChangePassword}
                  disabled={loading || !passwordData.currentPassword || !passwordData.newPassword}
                  sx={{ py: 1.5 }}
                >
                  {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Columna 3: Configuración de Cuenta */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, height: 'fit-content' }}>
            <Box display="flex" alignItems="center" mb={3}>
              <WarningIcon color="warning" sx={{ mr: 2 }} />
              <Typography variant="h5" component="h2" fontWeight="bold">
                Configuración
              </Typography>
            </Box>

            {/* Información de la cuenta */}
            <Box sx={{ mb: 3, p: 2, bgcolor: 'info.light', borderRadius: 1, color: 'info.contrastText' }}>
              <Typography variant="subtitle2" gutterBottom>
                Estado de la cuenta:
              </Typography>
              <Chip 
                label="Activa" 
                color="success" 
                size="small" 
                sx={{ fontWeight: 'bold' }}
              />
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                Tu cuenta está en buen estado y todas las funciones están disponibles.
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Zona de peligro */}
            <Box sx={{ 
              p: 2, 
              border: '2px solid', 
              borderColor: 'error.main', 
              borderRadius: 1,
              bgcolor: 'error.light',
              color: 'error.contrastText'
            }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                ⚠️ Zona de Peligro
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                Una vez que elimines tu cuenta, no podrás recuperar tus datos. Esta acción es permanente.
              </Typography>
              <Button
                fullWidth
                variant="contained"
                color="error"
                size="large"
                startIcon={<DeleteIcon />}
                onClick={confirmDeleteAccount}
                disabled={loading}
                sx={{ 
                  py: 1.5,
                  fontWeight: 'bold',
                  '&:hover': {
                    bgcolor: 'error.dark'
                  }
                }}
              >
                Eliminar Cuenta
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Mensajes de estado */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mt: 3 }}
          onClose={() => setError('')}
        >
          <Typography component="pre" sx={{ whiteSpace: 'pre-line', fontFamily: 'inherit' }}>
            {error}
          </Typography>
        </Alert>
      )}

      {success && (
        <Alert 
          severity="success" 
          sx={{ mt: 3 }}
          onClose={() => setSuccess('')}
        >
          {success}
        </Alert>
      )}
    </Container>
  );
};

export default Profile;
