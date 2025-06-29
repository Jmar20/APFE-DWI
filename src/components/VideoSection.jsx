import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  PlayArrow,
  Info,
  Login,
  Rocket,
  ArrowForward,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const VideoSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: theme.palette.grey[50],
        position: "relative",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          px: {
            xs: 2,
            sm: 3,
            md: 4,
            lg: 8, // Para laptop (1200px-1535px) - más padding
            xl: 3, // Para monitor grande (1536px+) - padding normal
          },
        }}
      >
        <Grid container spacing={6} alignItems="stretch">
          {/* Video embebido - lado izquierdo en desktop */}
          <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
            <Box
              sx={{
                position: "relative",
                paddingBottom: "56.25%", // Aspect ratio 16:9
                height: 0,
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                backgroundColor: theme.palette.grey[900],
                "&:hover": {
                  transform: "scale(1.02)",
                },
                transition: "transform 0.3s ease",
              }}
            >
              {/* Video de YouTube embebido */}
              <iframe
                src="https://www.youtube.com/embed/Kztxwbbf-ps?si=YkMHKwPi6oOVeBix"
                title="AgroPE - Gestión de Cultivos"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                  borderRadius: "12px",
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />

              {/* Overlay con botón de play (opcional) */}
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  display: "none", // Oculto por defecto, se puede mostrar si no hay video
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{
                    borderRadius: "50%",
                    width: 80,
                    height: 80,
                    minWidth: "auto",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                  }}
                >
                  <PlayArrow sx={{ fontSize: 40 }} />
                </Button>
              </Box>
            </Box>

            {/* Información adicional del video */}
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  fontStyle: "italic",
                }}
              >
                Descubre cómo AgroPE está transformando la agricultura peruana
              </Typography>
            </Box>
          </Grid>

          {/* Contenido de texto - lado derecho en desktop */}
          <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
            <Box
              sx={{
                textAlign: { xs: "center", md: "left" },
                pl: { md: 4 },
              }}
            >
              {/* Título de la sección */}
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: "bold",
                  mb: 3,
                  lineHeight: 1.2,
                }}
              >
                Optimice la gestión de su ciclo de cultivo
              </Typography>

              {/* Descripción */}
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  mb: 4,
                  lineHeight: 1.7,
                  fontSize: "1.1rem",
                }}
              >
                Con AgroPE, lleve el control completo de sus actividades
                agrícolas desde la planificación hasta la cosecha.
              </Typography>

              {/* Botón de acción */}
              <Button
                component={Link}
                to="/login"
                variant="contained"
                color="primary"
                size="large"
                startIcon={<Rocket />}
                sx={{
                  fontSize: "1.1rem",
                  py: 1.5,
                  px: 4,
                  borderRadius: 3,
                  textDecoration: "none",
                  boxShadow: "0 6px 20px rgba(46, 125, 50, 0.3)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(46, 125, 50, 0.4)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Empezar
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default VideoSection;
