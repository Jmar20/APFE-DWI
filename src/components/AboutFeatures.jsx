import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  useTheme,
} from "@mui/material";
import { ConnectedTv, Nature, Engineering } from "@mui/icons-material";

const AboutFeatures = () => {
  const theme = useTheme();

  // Datos de las características
  const featuresData = [
    {
      title: "Campo Conectado",
      icon: (
        <ConnectedTv sx={{ fontSize: 48, color: theme.palette.primary.main }} />
      ),
      description:
        "Conectamos el campo tradicional con la tecnología moderna, permitiendo a los agricultores acceder a herramientas digitales desde cualquier lugar.",
      color: theme.palette.primary.main,
    },
    {
      title: "Sostenibilidad Activa",
      icon: (
        <Nature sx={{ fontSize: 48, color: theme.palette.secondary.main }} />
      ),
      description:
        "Promovemos prácticas agrícolas sostenibles que cuidan el medio ambiente mientras maximizan la productividad de los cultivos.",
      color: theme.palette.secondary.main,
    },
    {
      title: "Raíces Tecnológicas",
      icon: <Engineering sx={{ fontSize: 48, color: "#f57c00" }} />,
      description:
        "Combinamos la sabiduría ancestral agrícola con las últimas innovaciones tecnológicas para crear soluciones efectivas y accesibles.",
      color: "#f57c00",
    },
  ];

  return (
    <Box
      sx={{
        pt: { xs: 4, md: 6 }, // Menos padding superior
        pb: { xs: 4, md: 6 }, // Menos padding inferior también
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          px: {
            xs: 2,
            sm: 3,
            md: 4,
            lg: 8,
            xl: 3,
          },
        }}
      >
        {/* Título de la sección */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: "bold",
              mb: 3,
            }}
          >
            Nuestros Valores
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            Los pilares fundamentales que guían nuestro trabajo y compromiso con
            la agricultura peruana
          </Typography>
        </Box>

        {/* Grid de características */}
        <Grid container spacing={4}>
          {featuresData.map((feature, index) => (
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
                    border: `2px solid ${feature.color}`,
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
                  <Box sx={{ mb: 3 }}>{feature.icon}</Box>

                  {/* Título */}
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      fontWeight: "bold",
                      mb: 2,
                      color: feature.color,
                    }}
                  >
                    {feature.title}
                  </Typography>

                  {/* Descripción */}
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.text.secondary,
                      lineHeight: 1.6,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutFeatures;
