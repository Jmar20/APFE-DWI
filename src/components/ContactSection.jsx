import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Send, LocationOn, Phone, Email, Schedule } from "@mui/icons-material";

const ContactSection = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Función para validar el formulario
  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Ingresa un correo electrónico válido";
    }

    // Validar teléfono
    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es requerido";
    } else {
      const phoneRegex = /^[+]?[\d\s\-()]{9,}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = "Ingresa un número de teléfono válido";
      }
    }

    // Validar mensaje
    if (!formData.message.trim()) {
      newErrors.message = "El mensaje es requerido";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "El mensaje debe tener al menos 10 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar el formulario
    if (!validateForm()) {
      return;
    }

    // Aquí iría la lógica para enviar el formulario
    console.log("Form data:", formData);
    setShowAlert(true);

    // Hacer scroll al mensaje de éxito
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);

    // Ocultar alerta después de 5 segundos
    setTimeout(() => setShowAlert(false), 5000);

    // Limpiar formulario
    setFormData({ name: "", email: "", phone: "", message: "" });
    setErrors({});
  };

  return (
    <Box
      sx={{
        pt: { xs: 8, sm: 10 }, // Espacio para el header fijo
        pb: { xs: 4, md: 6 },
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
        {/* Alerta de éxito */}
        {showAlert && (
          <Alert severity="success" sx={{ mb: 4 }}>
            ¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo
            pronto.
          </Alert>
        )}

        {/* Título */}
        <Typography
          variant="h2"
          component="h1"
          sx={{
            color: theme.palette.primary.main,
            fontWeight: "bold",
            mb: { xs: 4, md: 6 },
            textAlign: "center",
            fontSize: { xs: "2.5rem", md: "3.75rem" },
          }}
        >
          Contacto
        </Typography>

        {/* Container principal con el estilo del wireframe */}
        <Box
          sx={{
            maxWidth: "1200px", // Ancho más coherente
            mx: "auto",
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            backgroundColor: "white",
          }}
        >
          <Grid container sx={{ minHeight: "600px", alignItems: "stretch" }}>
            {/* Lado izquierdo - Nuestros Datos (Fondo verde) */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                backgroundColor: theme.palette.primary.dark,
                color: "white",
                p: { xs: 4, md: 6 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  mb: 4,
                  color: "white",
                }}
              >
                Nuestros Datos
              </Typography>

              {/* Línea decorativa */}
              <Box
                sx={{
                  width: "250px",
                  height: "2px",
                  backgroundColor: "white",
                  mb: 6,
                }}
              />

              {/* Información de contacto */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <LocationOn
                    sx={{
                      fontSize: 24,
                      color: "white",
                      mr: 3,
                      flexShrink: 0,
                    }}
                  />
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{ color: "white", lineHeight: 1.6 }}
                    >
                      Av. Cuba 152 - Of. 321
                      <br />
                      Edificio San Cristóbal
                      <br />
                      Jesús María, Lima
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Phone
                    sx={{
                      fontSize: 24,
                      color: "white",
                      mr: 3,
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="body1" sx={{ color: "white" }}>
                    +51 987 654 321
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Email
                    sx={{
                      fontSize: 24,
                      color: "white",
                      mr: 3,
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="body1" sx={{ color: "white" }}>
                    hola@agrope.pe
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Schedule
                    sx={{
                      fontSize: 24,
                      color: "white",
                      mr: 3,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{ color: "white", lineHeight: 1.6 }}
                  >
                    Lunes - Viernes
                    <br />
                    9:00 - 18:00
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Lado derecho - Formulario (Fondo blanco) */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                backgroundColor: "white",
                p: { xs: 4, md: 6 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  color: theme.palette.text.primary,
                }}
              >
                Escríbenos
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  mb: 4,
                }}
              >
                Completa los siguientes datos:
              </Typography>

              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                      mb: 1,
                      color: theme.palette.text.primary,
                    }}
                  >
                    Nombres y Apellidos
                  </Typography>
                  <TextField
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    fullWidth
                    variant="outlined"
                    error={!!errors.name}
                    helperText={errors.name}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1,
                        "& input": {
                          py: 1,
                        },
                      },
                    }}
                  />
                </Box>

                {/* Fila con dos columnas: Email y Teléfono */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "bold",
                        mb: 1,
                        color: theme.palette.text.primary,
                      }}
                    >
                      Correo electrónico
                    </Typography>
                    <TextField
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      fullWidth
                      variant="outlined"
                      error={!!errors.email}
                      helperText={errors.email}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 1,
                          "& input": {
                            py: 1,
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "bold",
                        mb: 1,
                        color: theme.palette.text.primary,
                      }}
                    >
                      Teléfono
                    </Typography>
                    <TextField
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      fullWidth
                      variant="outlined"
                      error={!!errors.phone}
                      helperText={errors.phone}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 1,
                          "& input": {
                            py: 1,
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                      mb: 1,
                      color: theme.palette.text.primary,
                    }}
                  >
                    Mensaje
                  </Typography>
                  <TextField
                    name="message"
                    multiline
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    fullWidth
                    variant="outlined"
                    error={!!errors.message}
                    helperText={errors.message}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1,
                        "& textarea": {
                          py: 1,
                        },
                      },
                    }}
                  />
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  endIcon={<Send />}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    px: 4,
                    borderRadius: 1,
                    alignSelf: "flex-start",
                    backgroundColor: theme.palette.primary.dark,
                    "&:hover": {
                      backgroundColor: theme.palette.primary.main,
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Enviar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default ContactSection;
