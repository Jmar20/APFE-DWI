import React, { useState } from "react";
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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Agriculture as AgricultureIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
  Nature as NatureIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import CultivosManager from "../components/CultivosManager";
import ActividadesManager from "../components/ActividadesManager";
import AlertasNotificaciones from "../components/AlertasNotificaciones";

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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Datos de ejemplo para las estadísticas
  const estadisticas = {
    cultivosActivos: 5,
    actividadesPendientes: 3,
    alertasNoLeidas: 2,
    productividadSemanal: 85,
  };

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
                        {estadisticas.cultivosActivos}
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
                        {estadisticas.actividadesPendientes}
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
                        {estadisticas.alertasNoLeidas}
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

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                  color: "white",
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {estadisticas.productividadSemanal}%
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Productividad
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                      <TrendingUpIcon />
                    </Avatar>
                  </Box>
                  <Box mt={2}>
                    <LinearProgress
                      variant="determinate"
                      value={estadisticas.productividadSemanal}
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: "rgba(255,255,255,0.8)",
                        },
                      }}
                    />
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
              icon={<ScheduleIcon />}
              label="Actividades"
              iconPosition="start"
            />
            <Tab
              icon={<NotificationsIcon />}
              label="Alertas"
              iconPosition="start"
            />
            <Tab
              icon={<CalendarIcon />}
              label="Planificación"
              iconPosition="start"
            />
          </Tabs>
        </Paper>

        {/* Contenido de las pestañas */}
        <TabPanel value={activeTab} index={0}>
          <CultivosManager />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <ActividadesManager />
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <AlertasNotificaciones />
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
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
      </Container>
    </Box>
  );
};

export default Dashboard;
