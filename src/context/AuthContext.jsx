import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Solo verificar si hay un token guardado sin validar con el backend
    const checkAuthStatus = () => {
      try {
        const token = authService.getToken();
        const userData = authService.getUserData();
        
        if (token && userData) {
          setIsAuthenticated(true);
          setUser(userData);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.log('Error al verificar autenticación:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      const userData = authService.getUserData();
      
      console.log('🎯 Login completado - datos del usuario:', userData);
      
      setIsAuthenticated(true);
      setUser(userData);
      
      return response;
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      const userDataStored = authService.getUserData();
      
      setIsAuthenticated(true);
      setUser(userDataStored);
      
      // 🚀 NUEVO: Pequeño delay para permitir sincronización del backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 🚀 NUEVO: Disparar evento global para que los componentes se actualicen
      window.dispatchEvent(new CustomEvent('userRegistered', { 
        detail: { userId: userDataStored?.userId } 
      }));
      
      return response;
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUser = (updatedUserData) => {
    console.log('🔄 Actualizando contexto de usuario:', updatedUserData);
    
    // Actualizar estado del contexto
    setUser(updatedUserData);
    
    // Actualizar también el localStorage para persistencia
    try {
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
      console.log('✅ Datos de usuario actualizados en contexto y localStorage');
    } catch (error) {
      console.error('❌ Error al actualizar localStorage:', error);
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
