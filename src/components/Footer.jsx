import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
  Divider,
  useTheme,
  Alert,
} from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Agriculture as LogoIcon,
  Phone,
  Email,
  LocationOn,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Send,
} from "@mui/icons-material";

const Footer = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Función para validar email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      return "El correo electrónico es requerido";
    } else if (!emailRegex.test(email)) {
      return "Ingresa un correo electrónico válido";
    }
    return "";
  };

  // Manejar envío del newsletter
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();

    // Validar email
    const error = validateEmail(email);
    setEmailError(error);

    if (error) {
      return; // No enviar si hay error
    }

    // Aquí iría la lógica para enviar el email
    console.log("Newsletter email:", email);

    // Mostrar mensaje de éxito
    setShowSuccess(true);
    setEmail("");
    setEmailError("");

    // Ocultar mensaje después de 4 segundos
    setTimeout(() => setShowSuccess(false), 4000);
  };

  // Manejar cambio en el input de email
  const handleEmailChange = (e) => {
    setEmail(e.target.value);

    // Limpiar error cuando el usuario empieza a escribir
    if (emailError) {
      setEmailError("");
    }
  };

  // Manejar navegación al inicio
  const handleGoToHome = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      // Si ya estamos en home, solo hacer scroll al top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Si estamos en otra página, navegar a home
      navigate("/");
    }
  };

  // Manejar navegación a About
  const handleGoToAbout = (e) => {
    e.preventDefault();
    if (location.pathname === "/about") {
      // Si ya estamos en about, solo hacer scroll al top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Si estamos en otra página, navegar a about
      navigate("/about");
    }
  };

  // Manejar navegación a Contact
  const handleGoToContact = (e) => {
    e.preventDefault();
    if (location.pathname === "/contact") {
      // Si ya estamos en contact, solo hacer scroll al top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Si estamos en otra página, navegar a contact
      navigate("/contact");
    }
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.grey[900],
        color: "white",
        pt: 6, // Solo padding-top, sin padding-bottom
        mt: "auto",
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
        {/* Mensaje de éxito del newsletter */}
        {showSuccess && (
          <Alert
            severity="success"
            sx={{
              mb: 4,
              backgroundColor: "rgba(46, 125, 50, 0.1)",
              color: theme.palette.success.light,
              "& .MuiAlert-icon": {
                color: theme.palette.success.light,
              },
              border: `1px solid ${theme.palette.success.light}`,
            }}
          >
            ¡Perfecto! Te has suscrito exitosamente a nuestro newsletter.
            Recibirás las últimas novedades en tu email.
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Columna 1: Logo y contacto */}
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              {/* Logo y nombre */}
              <Box
                component="a"
                href="/"
                onClick={handleGoToHome}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 3,
                  textDecoration: "none",
                  color: "inherit",
                  cursor: "pointer",
                  "&:hover": {
                    opacity: 0.8,
                  },
                  transition: "opacity 0.3s ease",
                }}
              >
                <LogoIcon
                  sx={{
                    fontSize: 32,
                    color: theme.palette.primary.light,
                    mr: 1,
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    color: theme.palette.primary.light,
                  }}
                >
                  AgroPE
                </Typography>
              </Box>

              {/* Información de contacto */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Phone
                    sx={{
                      fontSize: 20,
                      mr: 1,
                      color: theme.palette.primary.light,
                    }}
                  />
                  <Typography variant="body1">+51 987 654 321</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Email
                    sx={{
                      fontSize: 20,
                      mr: 1,
                      color: theme.palette.primary.light,
                    }}
                  />
                  <Typography variant="body1">hola@agrope.pe</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                  <LocationOn
                    sx={{
                      fontSize: 20,
                      mr: 1,
                      mt: 0.5,
                      color: theme.palette.primary.light,
                    }}
                  />
                  <Typography variant="body1">
                    Av. Cuba 152 - Of. 321
                    <br />
                    Edificio San Cristóbal
                    <br />
                    Jesús María, Lima
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Columna 2: Enlaces */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                mb: 3,
                color: theme.palette.primary.light,
              }}
            >
              Enlaces
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography
                component="a"
                href="/"
                onClick={handleGoToHome}
                variant="body1"
                sx={{
                  color: "inherit",
                  textDecoration: "none",
                  cursor: "pointer",
                  "&:hover": {
                    color: theme.palette.primary.light,
                    textDecoration: "underline",
                  },
                  transition: "color 0.3s ease",
                }}
              >
                Inicio
              </Typography>
              <Typography
                component="a"
                href="/about"
                onClick={handleGoToAbout}
                variant="body1"
                sx={{
                  color: "inherit",
                  textDecoration: "none",
                  cursor: "pointer",
                  "&:hover": {
                    color: theme.palette.primary.light,
                    textDecoration: "underline",
                  },
                  transition: "color 0.3s ease",
                }}
              >
                Conócenos
              </Typography>
              <Typography
                component="a"
                href="/contact"
                onClick={handleGoToContact}
                variant="body1"
                sx={{
                  color: "inherit",
                  textDecoration: "none",
                  cursor: "pointer",
                  "&:hover": {
                    color: theme.palette.primary.light,
                    textDecoration: "underline",
                  },
                  transition: "color 0.3s ease",
                }}
              >
                Contacto
              </Typography>
              <Typography
                component={Link}
                to="/login"
                variant="body1"
                sx={{
                  color: "inherit",
                  textDecoration: "none",
                  "&:hover": {
                    color: theme.palette.primary.light,
                    textDecoration: "underline",
                  },
                  transition: "color 0.3s ease",
                }}
              >
                Iniciar Sesión
              </Typography>
            </Box>
          </Grid>

          {/* Columna 3: Newsletter */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                mb: 3,
                color: theme.palette.primary.light,
              }}
            >
              Suscríbete
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
              Ingresa tu email y recibe novedades sobre agricultura digital y
              nuevas funcionalidades.
            </Typography>

            {/* Formulario de newsletter */}
            <Box
              component="form"
              onSubmit={handleNewsletterSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                type="email"
                placeholder="tu-email@email.com"
                value={email}
                onChange={handleEmailChange}
                size="small"
                error={!!emailError}
                helperText={emailError}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    "& fieldset": {
                      borderColor: emailError
                        ? theme.palette.error.main
                        : "rgba(255, 255, 255, 0.3)",
                    },
                    "&:hover fieldset": {
                      borderColor: emailError
                        ? theme.palette.error.main
                        : "rgba(255, 255, 255, 0.5)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: emailError
                        ? theme.palette.error.main
                        : theme.palette.primary.light,
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    color: "white",
                    "&::placeholder": {
                      color: "rgba(255, 255, 255, 0.7)",
                    },
                  },
                  "& .MuiFormHelperText-root": {
                    color: theme.palette.error.light,
                    backgroundColor: "transparent",
                    margin: "4px 0 0 0",
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                endIcon={<Send />}
                sx={{
                  alignSelf: "flex-start",
                  "&:hover": {
                    transform: "translateY(-2px)",
                  },
                  transition: "transform 0.3s ease",
                }}
              >
                Enviar
              </Button>
            </Box>
          </Grid>

          {/* Columna 4: Redes sociales */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                mb: 3,
                color: theme.palette.primary.light,
              }}
            >
              Nuestras Redes
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
              Síguenos en nuestras redes sociales para estar al día con las
              últimas noticias y consejos agrícolas.
            </Typography>

            {/* Iconos de redes sociales */}
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <IconButton
                sx={{
                  backgroundColor: "#1877f2",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#166fe5",
                    transform: "translateY(-3px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                sx={{
                  backgroundColor: "#1da1f2",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#0d8bd9",
                    transform: "translateY(-3px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <Twitter />
              </IconButton>
              <IconButton
                sx={{
                  backgroundColor: "#e4405f",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#d62976",
                    transform: "translateY(-3px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                sx={{
                  backgroundColor: "#0077b5",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#005885",
                    transform: "translateY(-3px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Divider */}
        <Divider sx={{ my: 4, backgroundColor: "rgba(255, 255, 255, 0.2)" }} />

        {/* Copyright */}
        <Box
          sx={{
            textAlign: "center",
            py: 2,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            ©2025 - AgroPE | Derechos Reservados
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
