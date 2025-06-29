import React from "react";
import { Box, Container, Typography, Grid, useTheme } from "@mui/material";

const ContentBlocks = () => {
  const theme = useTheme();

  return (
    <>
      {/* Primer bloque de contenido - Nuestra Misión */}
      <Box
        sx={{
          pt: { xs: 8, md: 12 },
          pb: { xs: 4, md: 6 }, // Menos padding inferior
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
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://portal.andina.pe/EDPFotografia3/thumbnail/2022/04/11/000860248M.jpg"
                alt="Misión AgroPE"
                sx={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 4,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography
                  variant="h3"
                  component="h2"
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: "bold",
                    mb: 3,
                  }}
                >
                  Nuestra Misión
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: theme.palette.text.primary,
                    fontSize: "1.1rem",
                    lineHeight: 1.7,
                    mb: 3,
                  }}
                >
                  En AgroPE, nos dedicamos a empoderar a los pequeños
                  agricultores peruanos con tecnología digital innovadora.
                  Nuestra plataforma integral está diseñada específicamente para
                  las necesidades únicas del sector agrícola peruano.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "1rem",
                    lineHeight: 1.6,
                  }}
                >
                  Creemos que la tecnología debe ser accesible, práctica y
                  adaptada a la realidad de nuestros agricultores, respetando
                  sus tradiciones mientras los impulsa hacia el futuro.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Segundo bloque de contenido - Nuestra Visión */}
      <Box
        sx={{
          pt: { xs: 4, md: 6 }, // Menos padding superior
          pb: { xs: 4, md: 6 }, // Menos padding inferior
          backgroundColor: theme.palette.grey[50],
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
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6} sx={{ order: { xs: 2, md: 1 } }}>
              <Box>
                <Typography
                  variant="h3"
                  component="h2"
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: "bold",
                    mb: 3,
                  }}
                >
                  Nuestra Visión
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: theme.palette.text.primary,
                    fontSize: "1.1rem",
                    lineHeight: 1.7,
                    mb: 3,
                  }}
                >
                  Visualizamos un futuro donde la tecnología y la tradición
                  agrícola se unen para crear un sector más productivo,
                  sostenible y próspero para todos los agricultores del Perú.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "1rem",
                    lineHeight: 1.6,
                  }}
                >
                  Aspiramos a ser la plataforma líder en digitalización agrícola
                  en América Latina, contribuyendo al desarrollo rural y la
                  seguridad alimentaria de nuestro país.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ order: { xs: 1, md: 2 } }}>
              <Box
                component="img"
                src="https://economica.pe/wp-content/uploads/2018/03/05.03.18.jpg"
                alt="Visión AgroPE"
                sx={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 4,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default ContentBlocks;
