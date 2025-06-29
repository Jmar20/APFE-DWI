import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  ArrowBackIos,
  ArrowForwardIos,
  FormatQuote,
} from "@mui/icons-material";

const Testimonials = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Datos de testimonios
  const testimonials = [
    {
      name: "Jhovan Tomasevich",
      location: "Cusco, Perú",
      text: "AgroPE ha transformado completamente la manera en que gestiono mis cultivos. Ahora puedo planificar mejor mis siembras y he aumentado mi producción en un 30%. Es una herramienta indispensable para cualquier agricultor moderno.",
      avatar:
        "https://revistareview.pe/storage/2022/02/Jhovan-Tomasevich-1365x2048.jpg",
      rating: 5,
    },
    {
      name: "Leslie Shaw",
      location: "Arequipa, Perú",
      text: "Gracias a AgroPE, pude optimizar mis cosechas y reducir las pérdidas. La plataforma es muy fácil de usar y me ayuda a tomar decisiones informadas sobre mis cultivos. Recomiendo esta herramienta a todos mis colegas.",
      avatar:
        "https://scontent.flim10-1.fna.fbcdn.net/v/t1.6435-9/118401680_3383449935011456_2459635630583357079_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=0b6b33&_nc_eui2=AeENE8zK2Dj4p1hGZy24XM2TfeQ5pYEWC-x95DmlgRYL7IEINmfcJIeursT5DSrFYTs&_nc_ohc=cnVleivT9BkQ7kNvwE2jRRO&_nc_oc=Adna3x9Nf-bf4t2yhdHjZOVk34NcPa_hj6YCqF9_1yN9QBnwF8-BBAEdj4lZpCfdGmHBlj-mAdDC3TadYVNgxpCg&_nc_zt=23&_nc_ht=scontent.flim10-1.fna&_nc_gid=Wj6okS1G0uzGbHepnSM6uQ&oh=00_AfNCKnQecnLu_HuPjYkMSON1v9FOKA63TI-fWAeNM6JPeA&oe=6887F38F",
      rating: 5,
    },
    {
      name: "Marcello Motta",
      location: "Piura, Perú",
      text: "Como pequeño agricultor, AgroPE me ha dado acceso a tecnología que antes parecía inalcanzable. Ahora puedo competir en el mercado con mayor confianza y mis ingresos han mejorado significativamente.",
      avatar:
        "https://diariocorreo.pe/resizer/e4BUu8lytArFZdw5yC44qBTqueY=/1200x1200/smart/filters:format(jpeg):quality(75)/arc-anglerfish-arc2-prod-elcomercio.s3.amazonaws.com/public/DBCFA4YZOZHTNFZAVFFQWQ2YO4.jpg",
      rating: 5,
    },
  ];

  // Función para navegar a testimonios
  const nextTestimonial = () => {
    setCurrentTestimonial((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: theme.palette.background.paper,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Patrón de fondo */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${theme.palette.primary.main.replace(
            "#",
            ""
          )}' fill-opacity='0.03'%3E%3Cpath d='M20 20c0 0 8-8 8-8s8 8 8 8-8 8-8 8-8-8-8-8'/%3E%3C/g%3E%3C/svg%3E")`,
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
            Testimonios
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: 600,
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            Conoce las experiencias de nuestros agricultores y cómo AgroPE ha
            impactado sus vidas
          </Typography>
        </Box>

        {/* Slider de testimonios */}
        <Box sx={{ position: "relative", maxWidth: 800, mx: "auto" }}>
          {/* Botón anterior */}
          <IconButton
            onClick={prevTestimonial}
            sx={{
              position: "absolute",
              left: { xs: 10, md: -60 },
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: theme.palette.primary.main,
              color: "white",
              zIndex: 2,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
                transform: "translateY(-50%) scale(1.1)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <ArrowBackIos />
          </IconButton>

          {/* Botón siguiente */}
          <IconButton
            onClick={nextTestimonial}
            sx={{
              position: "absolute",
              right: { xs: 10, md: -60 },
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: theme.palette.primary.main,
              color: "white",
              zIndex: 2,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
                transform: "translateY(-50%) scale(1.1)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <ArrowForwardIos />
          </IconButton>

          {/* Tarjeta de testimonio */}
          <Card
            sx={{
              p: 4,
              borderRadius: 4,
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              textAlign: "center",
              minHeight: 300,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, #f8f9fa 100%)`,
            }}
          >
            <CardContent>
              {/* Ícono de comillas */}
              <FormatQuote
                sx={{
                  fontSize: 48,
                  color: theme.palette.primary.main,
                  opacity: 0.3,
                  mb: 2,
                }}
              />

              {/* Texto del testimonio */}
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1rem", md: "1.2rem" },
                  lineHeight: 1.7,
                  color: theme.palette.text.primary,
                  mb: 4,
                  fontStyle: "italic",
                  maxWidth: 600,
                  mx: "auto",
                }}
              >
                "{testimonials[currentTestimonial].text}"
              </Typography>

              {/* Avatar y información del cliente */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                <Avatar
                  src={testimonials[currentTestimonial].avatar}
                  alt={testimonials[currentTestimonial].name}
                  sx={{
                    width: 60,
                    height: 60,
                    border: `3px solid ${theme.palette.primary.main}`,
                  }}
                />
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.primary.main,
                    }}
                  >
                    {testimonials[currentTestimonial].name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {testimonials[currentTestimonial].location}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Indicadores de testimonios */}
          <Box
            sx={{ display: "flex", justifyContent: "center", mt: 3, gap: 1 }}
          >
            {testimonials.map((_, index) => (
              <Box
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor:
                    index === currentTestimonial
                      ? theme.palette.primary.main
                      : theme.palette.grey[300],
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.2)",
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Testimonials;
