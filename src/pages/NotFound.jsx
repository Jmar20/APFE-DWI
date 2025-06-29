import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Home, ArrowBack, Search } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pt: 10, // Espacio para el header fijo
        pb: 6,
        backgroundColor: theme.palette.background.default,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 8 },
            borderRadius: 4,
            textAlign: "center",
            backgroundColor: "transparent",
          }}
        >
          {/* Número 404 grande */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "8rem", md: "12rem" },
              fontWeight: 900,
              color: theme.palette.primary.main,
              opacity: 0.8,
              lineHeight: 1,
              mb: 2,
            }}
          >
            404
          </Typography>

          {/* Título del error */}
          <Typography
            variant="h3"
            component="h1"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: "bold",
              mb: 2,
              fontSize: { xs: "2rem", md: "3rem" },
            }}
          >
            Página no encontrada
          </Typography>

          {/* Descripción */}
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              mb: 4,
              maxWidth: "600px",
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            Lo sentimos, la página que buscas no existe o ha sido movida. 
            Puede que hayas escrito mal la dirección o que la página haya sido eliminada.
          </Typography>

          {/* Imagen ilustrativa (usando texto como placeholder) */}
          <Box
            sx={{
              mb: 6,
              p: 4,
              backgroundColor: theme.palette.background.paper,
              borderRadius: 3,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              maxWidth: "400px",
              mx: "auto",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                color: theme.palette.primary.light,
                mb: 2,
                fontSize: "4rem",
              }}
            >
              🌱
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                fontStyle: "italic",
              }}
            >
              "Incluso en los mejores campos, a veces se pierde el camino"
            </Typography>
          </Box>

          {/* Botones de acción */}
          <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                component={Link}
                to="/"
                variant="contained"
                color="primary"
                size="large"
                startIcon={<Home />}
                fullWidth
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: "1rem",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(46, 125, 50, 0.3)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Ir al Inicio
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                onClick={handleGoBack}
                variant="outlined"
                color="primary"
                size="large"
                startIcon={<ArrowBack />}
                fullWidth
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: "1rem",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Volver Atrás
              </Button>
            </Grid>
          </Grid>

          {/* Enlaces útiles */}
          <Box
            sx={{
              pt: 4,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                mb: 3,
              }}
            >
              ¿Necesitas ayuda? Aquí tienes algunos enlaces útiles:
            </Typography>
            
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Button
                  component={Link}
                  to="/about"
                  variant="text"
                  color="primary"
                  sx={{
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "transparent",
                      textDecoration: "underline",
                    },
                  }}
                >
                  Acerca de nosotros
                </Button>
              </Grid>
              <Grid item>
                <Button
                  component={Link}
                  to="/contact"
                  variant="text"
                  color="primary"
                  sx={{
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "transparent",
                      textDecoration: "underline",
                    },
                  }}
                >
                  Contacto
                </Button>
              </Grid>
              <Grid item>
                <Button
                  component={Link}
                  to="/login"
                  variant="text"
                  color="primary"
                  sx={{
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "transparent",
                      textDecoration: "underline",
                    },
                  }}
                >
                  Iniciar Sesión
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default NotFound;
