import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Chip,
  Divider
} from '@mui/material';
import { ExpandMore, Refresh } from '@mui/icons-material';
import { authService } from '../services/authService';
import cookieUtils from '../utils/cookieUtils';

const CookieDebugger = ({ isDevelopment = true }) => {
  const [cookieInfo, setCookieInfo] = useState({});
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const refreshCookieInfo = () => {
    const info = authService.getCookieInfo();
    setCookieInfo(info);
    setLastUpdate(new Date());
    console.log('Cookie Debug Info:', info);
  };

  useEffect(() => {
    refreshCookieInfo();
    
    // Actualizar cada 5 segundos en desarrollo
    const interval = setInterval(refreshCookieInfo, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Solo mostrar en desarrollo
  if (!isDevelopment) {
    return null;
  }

  return (
    <Box sx={{ position: 'fixed', bottom: 16, right: 16, width: 350, zIndex: 9999 }}>
      <Paper elevation={8} sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
            🍪 Cookie Debugger
          </Typography>
          <Button
            size="small"
            onClick={refreshCookieInfo}
            startIcon={<Refresh />}
            variant="outlined"
          >
            Refresh
          </Button>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
          Última actualización: {lastUpdate.toLocaleTimeString()}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Chip 
            label={cookieInfo.hasCookies ? `${Object.keys(cookieInfo.allCookies || {}).length} cookies` : 'JWT en localStorage'} 
            color={authService.isAuthenticated() ? 'success' : 'error'}
            size="small"
            sx={{ mr: 1 }}
          />
          <Chip 
            label={localStorage.getItem('authToken') ? 'JWT Token ✓' : 'Sin JWT Token'} 
            color={localStorage.getItem('authToken') ? 'success' : 'warning'}
            size="small"
            sx={{ mr: 1 }}
          />
          <Chip 
            label={cookieInfo.sessionId ? 'Session ID' : 'Sin Session Cookie'} 
            color={cookieInfo.sessionId ? 'success' : 'default'}
            size="small"
          />
        </Box>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="body2">Ver detalles</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Estado del sistema:
              </Typography>
              {Object.keys(cookieInfo.allCookies || {}).length > 0 ? (
                <>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    Cookies disponibles:
                  </Typography>
                  {Object.entries(cookieInfo.allCookies || {}).map(([name, value]) => (
                    <Box key={name} sx={{ mb: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {name}:
                      </Typography>
                      <Typography variant="caption" sx={{ ml: 1, wordBreak: 'break-all' }}>
                        {value}
                      </Typography>
                    </Box>
                  ))}
                </>
              ) : (
                <Typography variant="caption" color="text.secondary">
                  ✓ Sistema usando JWT en localStorage (implementación estándar)
                </Typography>
              )}

              <Divider sx={{ my: 1 }} />

              <Typography variant="subtitle2" gutterBottom>
                LocalStorage:
              </Typography>
              <Typography variant="caption">
                authToken: {localStorage.getItem('authToken') ? '✓' : '✗'}
              </Typography>
              <br />
              <Typography variant="caption">
                userData: {localStorage.getItem('userData') ? '✓' : '✗'}
              </Typography>

              <Divider sx={{ my: 1 }} />

              <Typography variant="subtitle2" gutterBottom>
                Estado de autenticación:
              </Typography>
              <Typography variant="caption">
                isAuthenticated: {authService.isAuthenticated() ? '✓' : '✗'}
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Paper>
    </Box>
  );
};

export default CookieDebugger;
