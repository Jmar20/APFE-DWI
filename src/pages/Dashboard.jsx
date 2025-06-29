import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import {
  Agriculture,
  TrendingUp,
  Notifications,
  Assessment,
} from '@mui/icons-material';

const Dashboard = () => {
  const theme = useTheme();
  const { user } = useAuth();

  const dashboardCards = [
    {
      title: 'Mis Cultivos',
      description: 'Gestiona tus cultivos y planificaciones',
      icon: <Agriculture sx={{ fontSize: 40 }} />,
      color: theme.palette.primary.main,
      action: 'Ver Cultivos',
    },
    {
      title: 'Análisis',
      description: 'Revisa estadísticas y tendencias',
      icon: <Assessment sx={{ fontSize: 40 }} />,
      color: theme.palette.secondary.main,
      action: 'Ver Análisis',
    },
    {
      title: 'Alertas',
      description: 'Notificaciones importantes',
      icon: <Notifications sx={{ fontSize: 40 }} />,
      color: theme.palette.warning.main,
      action: 'Ver Alertas',
    },
    {
      title: 'Productividad',
      description: 'Métricas de rendimiento',
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: theme.palette.success.main,
      action: 'Ver Métricas',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pt: 10, // Espacio para el header fijo
        pb: 6,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Container maxWidth="lg">
        {/* Encabezado de bienvenida */}
        <Paper
          elevation={2}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
          }}
        >
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
            ¡Bienvenido, {user?.name || 'Usuario'}! 🌱
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Gestiona tus cultivos y optimiza tu producción agrícola
          </Typography>
        </Paper>

        {/* Tarjetas del dashboard */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {dashboardCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                elevation={3}
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box
                    sx={{
                      color: card.color,
                      mb: 2,
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: card.color,
                      color: card.color,
                      '&:hover': {
                        backgroundColor: card.color,
                        color: 'white',
                      },
                    }}
                  >
                    {card.action}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Sección de acciones rápidas */}
        <Paper
          elevation={2}
          sx={{
            p: 4,
            borderRadius: 3,
          }}
        >
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
            Acciones Rápidas
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                startIcon={<Agriculture />}
                sx={{ py: 1.5 }}
              >
                Nuevo Cultivo
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                size="large"
                startIcon={<Assessment />}
                sx={{ py: 1.5 }}
              >
                Generar Reporte
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                size="large"
                startIcon={<TrendingUp />}
                sx={{ py: 1.5 }}
              >
                Ver Estadísticas
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard;
