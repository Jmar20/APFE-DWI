import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  useScrollTrigger,
  Slide,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import { Person, ExitToApp } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

// Componente para ocultar header al hacer scroll - Versión simplificada
function HideOnScroll({ children }) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      <div>{children}</div>
    </Slide>
  );
}

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  // Escuchar eventos de actualización de perfil para forzar re-render
  React.useEffect(() => {
    const handleProfileUpdate = () => {
      console.log('🔄 Header detectó actualización de perfil, forzando re-render...');
      forceUpdate();
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  // Función para manejar navegación inteligente
  const handleNavigation = (path) => {
    if (location.pathname === path) {
      // Si ya estamos en la página, hacer scroll al top
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    // Si no estamos en la página, React Router se encargará de la navegación
  };

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileOpen = () => {
    navigate('/profile');
    handleUserMenuClose();
  };

  const handleProfileClose = () => {
    // Ya no es necesario este método, pero lo mantenemos por compatibilidad
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    // Redirigir al login después de cerrar sesión
    navigate('/login');
  };

  // Enlaces de navegación - Dashboard solo para usuarios autenticados
  const getNavLinks = () => {
    const baseLinks = [
      { label: "Inicio", path: "/" },
      { label: "Conócenos", path: "/about" },
      { label: "Contacto", path: "/contact" },
    ];
    
    // Solo agregar Dashboard si el usuario está autenticado
    if (isAuthenticated) {
      baseLinks.push({ label: "Dashboard", path: "/dashboard" });
    }
    
    return baseLinks;
  };

  const navLinks = getNavLinks();

  return (
    <HideOnScroll>
      <AppBar position="fixed" elevation={2}>
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
          <Toolbar disableGutters>
            {/* Logo y nombre */}
            <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
              <AgricultureIcon sx={{ mr: 1, fontSize: 32 }} />
              <Typography
                variant="h5"
                component={Link}
                to="/"
                sx={{
                  fontWeight: "bold",
                  color: "inherit",
                  textDecoration: "none",
                  "&:hover": {
                    opacity: 0.8,
                  },
                }}
              >
                AgroPE
              </Typography>
            </Box>

            {/* Enlaces de navegación - desktop */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 2,
                alignItems: "center",
              }}
            >
              {navLinks.map((link) => (
                <Button
                  key={link.path}
                  component={Link}
                  to={link.path}
                  color="inherit"
                  onClick={() => handleNavigation(link.path)}
                  sx={{
                    fontWeight:
                      location.pathname === link.path ? "bold" : "normal",
                    borderBottom:
                      location.pathname === link.path
                        ? "2px solid white"
                        : "none",
                    borderRadius: 0,
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  {link.label}
                </Button>
              ))}

              {/* Botones de autenticación o perfil */}
              {isAuthenticated ? (
                // Usuario autenticado - mostrar perfil
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" } }}>
                    ¡Hola, {user?.name || user?.nombre || 'Usuario'}!
                  </Typography>
                  <Button
                    onClick={handleUserMenuOpen}
                    sx={{
                      minWidth: "auto",
                      p: 1,
                      borderRadius: "50%",
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "secondary.main",
                        width: 32,
                        height: 32,
                        fontSize: "1rem",
                      }}
                    >
                      <Person />
                    </Avatar>
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleUserMenuClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <MenuItem onClick={handleProfileOpen}>
                      <Person sx={{ mr: 1 }} />
                      Mi Perfil
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <ExitToApp sx={{ mr: 1 }} />
                      Cerrar Sesión
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                // Usuario no autenticado - mostrar botón de login
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  color="secondary"
                  sx={{
                    ml: 2,
                    fontWeight: "bold",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Acceder
                </Button>
              )}
            </Box>

            {/* Enlaces de navegación - mobile */}
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                gap: 1,
                alignItems: "center",
              }}
            >
              {navLinks.map((link) => (
                <Button
                  key={link.path}
                  component={Link}
                  to={link.path}
                  color="inherit"
                  size="small"
                  onClick={() => handleNavigation(link.path)}
                  sx={{
                    minWidth: "auto",
                    fontSize: "0.8rem",
                    fontWeight:
                      location.pathname === link.path ? "bold" : "normal",
                  }}
                >
                  {link.label}
                </Button>
              ))}

              {isAuthenticated ? (
                // Usuario autenticado - mostrar solo avatar
                <Button
                  onClick={handleUserMenuOpen}
                  sx={{
                    minWidth: "auto",
                    p: 0.5,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "secondary.main",
                      width: 28,
                      height: 28,
                      fontSize: "0.8rem",
                    }}
                  >
                    <Person />
                  </Avatar>
                </Button>
              ) : (
                // Usuario no autenticado - mostrar botón de login
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  color="secondary"
                  size="small"
                  sx={{ ml: 1, fontSize: "0.7rem" }}
                >
                  Login
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
};

export default Header;
