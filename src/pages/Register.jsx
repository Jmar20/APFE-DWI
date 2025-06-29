import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  Divider,
  Link as MuiLink,
  FormControlLabel,
  Checkbox,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { PersonAdd, Email, Lock, Person } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { validatePassword, validateName, validateEmail } from "../utils/validation";
import PasswordStrengthIndicator from "../components/PasswordStrengthIndicator";

const Register = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [showAlert, setShowAlert] = useState({ show: false, type: "", message: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    const nameError = validateName(formData.name);
    if (nameError) {
      newErrors.name = nameError;
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "El correo electrónico no es válido";
    }

    // Validar contraseña
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0]; // Mostrar el primer error
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    // Validar términos
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Debes aceptar los términos y condiciones";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setShowAlert({
        show: true,
        type: "error",
        message: "Por favor, corrige los errores en el formulario",
      });
      return;
    }

    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      
      setShowAlert({
        show: true,
        type: "success",
        message: "¡Registro exitoso! Redirigiendo...",
      });
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      setShowAlert({
        show: true,
        type: "error",
        message: error.message || "Error al registrar usuario",
      });
    } finally {
      setLoading(false);
    }
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
      <Container
        maxWidth="md"
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
        {/* Alerta */}
        {showAlert.show && (
          <Alert 
            severity={showAlert.type} 
            sx={{ mb: 4 }}
            onClose={() => setShowAlert({ show: false, type: "", message: "" })}
          >
            {showAlert.message}
          </Alert>
        )}

        {/* Formulario de registro */}
        <Paper
          elevation={6}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          {/* Título */}
          <Typography
            variant="h3"
            component="h1"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: "bold",
              mb: 2,
            }}
          >
            Crear Cuenta
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              mb: 4,
            }}
          >
            Únete a nuestra plataforma agrícola
          </Typography>

          {/* Formulario */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              textAlign: "left",
            }}
          >
            {/* Nombre */}
            <TextField
              name="name"
              label="Nombre completo"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
              error={!!errors.name}
              helperText={errors.name}
              disabled={loading}
              InputProps={{
                startAdornment: <Person sx={{ mr: 1, color: theme.palette.primary.main }} />,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            {/* Email */}
            <TextField
              name="email"
              label="Correo electrónico"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              error={!!errors.email}
              helperText={errors.email}
              autoComplete="email"
              disabled={loading}
              InputProps={{
                startAdornment: <Email sx={{ mr: 1, color: theme.palette.primary.main }} />,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            {/* Contraseñas */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="password"
                  label="Contraseña"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password}
                  autoComplete="new-password"
                  disabled={loading}
                  InputProps={{
                    startAdornment: <Lock sx={{ mr: 1, color: theme.palette.primary.main }} />,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
                <PasswordStrengthIndicator password={formData.password} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="confirmPassword"
                  label="Confirmar contraseña"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  fullWidth
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  autoComplete="new-password"
                  disabled={loading}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
            </Grid>

            {/* Términos y condiciones */}
            <FormControlLabel
              control={
                <Checkbox
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  color="primary"
                  disabled={loading}
                />
              }
              label={
                <Typography variant="body2">
                  Acepto los{" "}
                  <MuiLink
                    href="#"
                    sx={{
                      color: theme.palette.primary.main,
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    términos y condiciones
                  </MuiLink>{" "}
                  y la{" "}
                  <MuiLink
                    href="#"
                    sx={{
                      color: theme.palette.primary.main,
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    política de privacidad
                  </MuiLink>
                </Typography>
              }
              sx={{
                alignItems: "flex-start",
                "& .MuiFormControlLabel-label": {
                  mt: 0.5,
                },
              }}
            />
            {errors.acceptTerms && (
              <Typography color="error" variant="caption">
                {errors.acceptTerms}
              </Typography>
            )}

            {/* Botón de registro */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAdd />}
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontSize: "1.1rem",
                "&:hover": {
                  transform: loading ? "none" : "translateY(-2px)",
                  boxShadow: loading ? "none" : "0 6px 20px rgba(46, 125, 50, 0.3)",
                },
                transition: "all 0.3s ease",
              }}
            >
              {loading ? "Creando cuenta..." : "Crear Cuenta"}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Login */}
          <Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              ¿Ya tienes una cuenta?
            </Typography>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              color="primary"
              sx={{
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                },
                transition: "all 0.3s ease",
              }}
            >
              Iniciar Sesión
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
