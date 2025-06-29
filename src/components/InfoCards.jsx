import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  useTheme,
} from "@mui/material";
import {
  Grass as SiembrasIcon,
  Agriculture as CosechasIcon,
  TrendingUp as RendimientoIcon,
  Visibility,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const InfoCards = () => {
  const theme = useTheme();

  // Datos de las tarjetas informativas
  const cardsData = [
    {
      title: "Siembras",
      icon: (
        <SiembrasIcon
          sx={{ fontSize: 48, color: theme.palette.primary.main }}
        />
      ),
      description:
        "Planifica y optimiza tus siembras con herramientas digitales avanzadas. Controla fechas, variedades y técnicas para maximizar tu producción agrícola.",
      color: theme.palette.primary.main,
    },
    {
      title: "Cosechas",
      icon: (
        <CosechasIcon
          sx={{ fontSize: 48, color: theme.palette.secondary.main }}
        />
      ),
      description:
        "Gestiona eficientemente tus cosechas con seguimiento en tiempo real. Registra cantidades, calidad y optimiza los tiempos de recolección.",
      color: theme.palette.secondary.main,
    },
    {
      title: "Rendimiento",
      icon: <RendimientoIcon sx={{ fontSize: 48, color: "#f57c00" }} />,
      description:
        "Analiza el rendimiento de tus cultivos con reportes detallados y estadísticas. Toma decisiones informadas para mejorar tu productividad.",
      color: "#f57c00",
    },
  ];

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: theme.palette.background.default,
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
        {/* Título de la sección */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: "bold",
              mb: 2,
            }}
          >
            Nuestros Servicios
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            Descubre las herramientas que AgroPE pone a tu disposición para
            revolucionar tu agricultura
          </Typography>
        </Box>

        {/* Grid de tarjetas */}
        <Grid container spacing={4}>
          {cardsData.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                  border: `2px solid transparent`,
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                    border: `2px solid ${card.color}`,
                  },
                }}
              >
                <CardContent
                  sx={{
                    flexGrow: 1,
                    textAlign: "center",
                    p: 4,
                  }}
                >
                  {/* Ícono */}
                  <Box sx={{ mb: 3 }}>{card.icon}</Box>

                  {/* Título */}
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      fontWeight: "bold",
                      mb: 2,
                      color: card.color,
                    }}
                  >
                    {card.title}
                  </Typography>

                  {/* Descripción */}
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.text.secondary,
                      lineHeight: 1.6,
                    }}
                  >
                    {card.description}
                  </Typography>
                </CardContent>

                {/* Botón de acción */}
                <CardActions sx={{ p: 3, pt: 0, justifyContent: "center" }}>
                  <Button
                    component={Link}
                    to="/about"
                    variant="outlined"
                    endIcon={<Visibility />}
                    sx={{
                      borderColor: card.color,
                      color: card.color,
                      fontWeight: "bold",
                      borderRadius: 2,
                      px: 3,
                      textDecoration: "none",
                      "&:hover": {
                        backgroundColor: card.color,
                        color: "white",
                        transform: "scale(1.05)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Ver más
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default InfoCards;
