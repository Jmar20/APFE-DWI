import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  Paper,
  Avatar,
  Chip,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Agriculture as AgricultureIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
  Nature as NatureIcon,
  CalendarToday as CalendarIcon,
  Terrain as TerrainIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import CultivosManager from "../components/CultivosManager";
import ParcelasManager from "../components/ParcelasManager";
import ActividadesManager from "../components/ActividadesManager";
import AlertasNotificaciones from "../components/AlertasNotificaciones";
import AlertasAutomaticas from "../components/AlertasAutomaticas";
import BackendStatus from "../components/BackendStatus";
import { cultivoService, actividadService, alertaService } from "../services";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  
  // Estados para las estadísticas dinámicas
  const [estadisticas, setEstadisticas] = useState({
    cultivosActivos: 0,
    actividadesPendientes: 0,
    alertasNoLeidas: 2, // Mantenemos este fijo por ahora
    productividadSemanal: 85, // Mantenemos este fijo por ahora
  });
  const [loadingEstadisticas, setLoadingEstadisticas] = useState(true);
  
  // 🆕 Estados para alertas automáticas
  const [alertasAutomaticas, setAlertasAutomaticas] = useState([]);
  const [loadingAlertas, setLoadingAlertas] = useState(true);
  
  // 🚀 NUEVO: Estado para indicar sincronización de usuario nuevo
  const [sincronizandoUsuarioNuevo, setSincronizandoUsuarioNuevo] = useState(false);

  // ✅ Protección de ruta - Redirigir al login si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('🚫 Usuario no autenticado, redirigiendo al login...');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Si no está autenticado, no renderizar nada mientras se redirige
  if (!isAuthenticated) {
    return null;
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Función para cargar estadísticas dinámicas
  const cargarEstadisticas = async () => {
    if (!user?.userId) return;

    try {
      setLoadingEstadisticas(true);
      
      // Cargar cultivos activos
      const cultivos = await cultivoService.obtenerPorUsuario(user.userId);
      
      // Cargar actividades pendientes
      const actividades = await actividadService.obtenerPorUsuario(user.userId);
      const actividadesPendientes = actividades.filter(act => !act.realizada);
      
      console.log('📊 Estadísticas cargadas:', {
        cultivos: cultivos.length,
        actividadesPendientes: actividadesPendientes.length
      });
      
      setEstadisticas(prev => ({
        ...prev,
        cultivosActivos: cultivos.length,
        actividadesPendientes: actividadesPendientes.length,
      }));
      
    } catch (error) {
      console.error('❌ Error al cargar estadísticas:', error);
    } finally {
      setLoadingEstadisticas(false);
    }
  };

  // 🆕 Función para cargar alertas automáticas
  const cargarAlertasAutomaticas = async () => {
    if (!user?.userId) return;

    try {
      setLoadingAlertas(true);
      console.log('🚨 Cargando alertas automáticas...');
      
      const alertas = await alertaService.obtenerAutomaticasPorUsuario(user.userId);
      console.log('🚨 Alertas automáticas recibidas:', alertas);
      
      setAlertasAutomaticas(alertas || []);
      
      // Actualizar contador de alertas en estadísticas
      setEstadisticas(prev => ({
        ...prev,
        alertasNoLeidas: alertas?.length || 0,
      }));
      
    } catch (error) {
      console.error('❌ Error al cargar alertas automáticas:', error);
      setAlertasAutomaticas([]);
    } finally {
      setLoadingAlertas(false);
    }
  };

  // useEffect para cargar datos cuando el usuario esté disponible
  useEffect(() => {
    if (user?.userId) {
      cargarEstadisticas();
      cargarAlertasAutomaticas();
    }
  }, [user?.userId]);

  // Listener para actualizar datos cuando se crean nuevos cultivos o actividades
  useEffect(() => {
    const handleCultivoCreated = () => {
      console.log('🌱 Evento: Cultivo creado, actualizando datos...');
      cargarEstadisticas();
      cargarAlertasAutomaticas(); // 🆕 Actualizar alertas también
    };

    const handleActividadUpdated = () => {
      console.log('📅 Evento: Actividad actualizada, actualizando datos...');
      cargarEstadisticas();
      cargarAlertasAutomaticas(); // 🆕 Actualizar alertas también
    };

    const handleCultivoEliminado = () => {
      console.log('🗑️ Evento: Cultivo eliminado, actualizando estadísticas...');
      cargarEstadisticas();
      cargarAlertasAutomaticas();
    };

    // 🚀 NUEVO: Escuchar evento de usuario registrado
    const handleUserRegistered = (event) => {
      console.log('🔄 Usuario recién registrado detectado en Dashboard, recargando datos...', event.detail);
      setSincronizandoUsuarioNuevo(true);
      
      // Recargar datos después de un pequeño delay adicional
      setTimeout(() => {
        cargarEstadisticas();
        cargarAlertasAutomaticas();
        
        // Quitar indicador después de que termine la sincronización
        setTimeout(() => {
          setSincronizandoUsuarioNuevo(false);
        }, 3000);
      }, 2500);
    };

    // Agregar listeners
    window.addEventListener('cultivoCreated', handleCultivoCreated);
    window.addEventListener('cultivoUpdated', handleCultivoCreated);
    window.addEventListener('cultivoEliminado', handleCultivoEliminado);
    window.addEventListener('actividadCreated', handleActividadUpdated);
    window.addEventListener('actividadUpdated', handleActividadUpdated);
    window.addEventListener('userRegistered', handleUserRegistered);

    // Cleanup
    return () => {
      window.removeEventListener('cultivoCreated', handleCultivoCreated);
      window.removeEventListener('cultivoUpdated', handleCultivoCreated);
      window.removeEventListener('cultivoEliminado', handleCultivoEliminado);
      window.removeEventListener('actividadCreated', handleActividadUpdated);
      window.removeEventListener('actividadUpdated', handleActividadUpdated);
      window.removeEventListener('userRegistered', handleUserRegistered);
    };
  }, [user?.userId]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pt: 10, // Espacio para el header fijo
        pb: 6,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Container maxWidth="xl">
        {/* Header del Dashboard */}
        <Box mb={4}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: "bold",
              mb: 1,
            }}
          >
            ¡Bienvenido, {user?.name || "Agricultor"}!
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Gestiona tus cultivos y mantente al día con todas las actividades
          </Typography>

          {/* Tarjetas de estadísticas */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  color: "white",
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {loadingEstadisticas ? (
                          <CircularProgress size={24} sx={{ color: 'white' }} />
                        ) : (
                          estadisticas.cultivosActivos
                        )}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Cultivos Activos
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                      <AgricultureIcon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
                  color: "white",
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {loadingEstadisticas ? (
                          <CircularProgress size={24} sx={{ color: 'white' }} />
                        ) : (
                          estadisticas.actividadesPendientes
                        )}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Actividades Pendientes
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                      <ScheduleIcon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
                  color: "white",
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {loadingEstadisticas || loadingAlertas ? (
                          <CircularProgress size={24} sx={{ color: 'white' }} />
                        ) : (
                          estadisticas.alertasNoLeidas
                        )}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Alertas Nuevas
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                      <NotificationsIcon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Navegación por pestañas */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              icon={<AgricultureIcon />}
              label="Mis Cultivos"
              iconPosition="start"
            />
            <Tab
              icon={<TerrainIcon />}
              label="Mis Parcelas"
              iconPosition="start"
            />
            <Tab
              icon={<ScheduleIcon />}
              label="Actividades"
              iconPosition="start"
            />
            <Tab
              icon={<NotificationsIcon />}
              label="Alertas"
              iconPosition="start"
            />
          </Tabs>
        </Paper>

        {/* Contenido de las pestañas */}
        <TabPanel value={activeTab} index={0}>
          <CultivosManager />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <ParcelasManager />
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <ActividadesManager />
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          {/* Alertas Automáticas del Sistema */}
          <AlertasAutomaticas 
            alertas={alertasAutomaticas}
            loading={loadingAlertas}
          />
          
          {/* Alertas y Notificaciones Manuales */}
          <AlertasNotificaciones />
        </TabPanel>

        <TabPanel value={activeTab} index={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <CalendarIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5">
                  Planificación de Cultivos
                </Typography>
              </Box>
              
              <Typography variant="body1" color="text.secondary" paragraph>
                La funcionalidad de planificación te permitirá:
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <NatureIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      Calcular fechas óptimas de siembra y cosecha
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <CalendarIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      Programar actividades automáticamente
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <TrendingUpIcon color="warning" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      Optimizar la productividad de tus cultivos
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <NotificationsIcon color="info" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      Recibir alertas automáticas
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Chip
                label="Próximamente"
                color="primary"
                variant="outlined"
              />
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={activeTab} index={5}>
          <BackendStatus />
        </TabPanel>
      </Container>
    </Box>
  );
};

export default Dashboard;
