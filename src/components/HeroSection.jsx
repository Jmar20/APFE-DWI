import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import { KeyboardArrowDown } from "@mui/icons-material";

const HeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Función para hacer scroll suave a la siguiente sección
  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: `linear-gradient(135deg, ${theme.palette.primary.light}20 0%, ${theme.palette.secondary.light}20 100%)`,
        position: "relative",
        overflow: "hidden",
        pt: 8, // Espacio para el header fijo
      }}
    >
      {/* Patrón de fondo decorativo */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${theme.palette.primary.main.replace(
            "#",
            ""
          )}' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          zIndex: 0,
        }}
      />

      <Container
        maxWidth="xl"
        sx={{
          position: "relative",
          zIndex: 1,
          px: {
            xs: 2,
            sm: 3,
            md: 4,
            lg: 8, // Para laptop (1200px-1535px) - más padding
            xl: 3, // Para monitor grande (1536px+) - padding normal
          },
        }}
      >
        <Grid container spacing={4} alignItems="center">
          {/* Contenido principal */}
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
              {/* Título principal */}
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: "bold",
                  mb: 2,
                  textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                AgroPE
              </Typography>

              {/* Subtítulo */}
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  color: theme.palette.text.primary,
                  mb: 4,
                  lineHeight: 1.6,
                  fontWeight: 400,
                  maxWidth: "600px",
                  mx: { xs: "auto", md: 0 },
                }}
              >
                Una plataforma digital integral adaptada a las <br />
                necesidades de los pequeños agricultores peruanos.
              </Typography>

              {/* Botón de acción */}
              <Button
                component={Link}
                to="/about"
                variant="contained"
                color="primary"
                size="large"
                startIcon={<InfoIcon />}
                sx={{
                  fontSize: "1.1rem",
                  py: 1.5,
                  px: 4,
                  borderRadius: 3,
                  boxShadow: "0 6px 20px rgba(46, 125, 50, 0.3)",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 8px 25px rgba(46, 125, 50, 0.4)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Conócenos
              </Button>
            </Box>
          </Grid>

          {/* Imagen representativa */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", md: "flex-end" }, // Centrado en mobile, alineado a la derecha en desktop
                alignItems: "center",
              }}
            >
              <Box
                component="img"
                src="https://cdn.www.gob.pe/uploads/document/file/2490389/shutterstock_389753290.jpg.jpg"
                alt="Plataforma AgroPE - Agricultura Digital"
                sx={{
                  width: "100%",
                  maxWidth: { xs: 400, md: "none" }, // Sin límite en desktop, limitado en mobile
                  height: "auto",
                  borderRadius: 4,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                  transition: "transform 0.3s ease",
                }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Flecha de scroll hacia abajo */}
        <Box
          sx={{
            position: "absolute",
            bottom: {
              md: -50, // Para laptop (1280px) - como tienes ahora
              lg: -50, // Para monitores 24" (1920px) - más abajo
              xl: -90, // Para monitores grandes - aún más abajo
            },
            left: "50%",
            transform: "translateX(-50%)",
            display: { xs: "none", md: "block" },
            zIndex: 10,
          }}
        >
          <IconButton
            onClick={scrollToNextSection}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: "white",
              width: 50,
              height: 50,
              boxShadow: "0 4px 12px rgba(46, 125, 50, 0.3)",
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
                transform: "scale(1.1)",
                boxShadow: "0 6px 16px rgba(46, 125, 50, 0.4)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <KeyboardArrowDown sx={{ fontSize: 28 }} />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
