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
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ArrowBack, Login as LoginIcon } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showAlert, setShowAlert] = useState({ show: false, type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El correo electrónico no es válido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
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
      await login(formData);
      setShowAlert({
        show: true,
        type: "success",
        message: "¡Inicio de sesión exitoso! Redirigiendo...",
      });
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      setShowAlert({
        show: true,
        type: "error",
        message: error.message || "Error al iniciar sesión",
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
        maxWidth="sm"
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
        {/* Botón de regreso */}
        {/* <Button
          component={Link}
          to="/"
          startIcon={<ArrowBack />}
          sx={{ mb: 4 }}
        >
          Volver al inicio
        </Button> */}

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

        {/* Formulario de login */}
        <Paper
          elevation={6}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          {/* Logo y título */}
          <Typography
            variant="h3"
            component="h1"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: "bold",
              mb: 2,
            }}
          >
            Iniciar Sesión
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
            <TextField
              name="email"
              label="Correo electrónico"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              autoComplete="email"
              error={!!errors.email}
              helperText={errors.email}
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            <TextField
              name="password"
              label="Contraseña"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password}
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
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
              {loading ? "Iniciando sesión..." : "Ingresar"}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Registro */}
          <Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              ¿No tienes una cuenta?
            </Typography>
            <Button
              component={Link}
              to="/register"
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
              Crear cuenta
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
