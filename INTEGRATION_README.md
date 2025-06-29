# AgroPE - Frontend

Sistema web para gestión agrícola desarrollado con React y Material-UI.

## 🚀 Características

- ✅ **Autenticación completa** (Login/Register)
- ✅ **Validación avanzada de formularios**
- ✅ **Dashboard para usuarios autenticados**
- ✅ **Indicador de fortaleza de contraseña**
- ✅ **Rutas protegidas**
- ✅ **Manejo de estados con Context API**
- ✅ **Diseño responsive con Material-UI**
- ✅ **Integración con backend Spring Boot**

## 🛠️ Tecnologías

- **React 19** - Framework principal
- **Material-UI v5** - Componentes y diseño
- **React Router v6** - Navegación
- **Axios** - Peticiones HTTP
- **Vite** - Build tool

## 📋 Requisitos Previos

- Node.js >= 16
- npm o yarn
- Backend Spring Boot corriendo en puerto 8080

## 🔧 Instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno (opcional):**
   ```bash
   # Crear archivo .env en la raíz del proyecto
   VITE_API_BASE_URL=http://localhost:8080/api/v1
   ```

3. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

4. **Construir para producción:**
   ```bash
   npm run build
   ```

## 🔐 Funcionalidades de Autenticación

### Registro
- **Validaciones incluidas:**
  - Nombre: mínimo 2 caracteres
  - Email: formato válido
  - Contraseña: mínimo 6 caracteres, debe contener mayúscula, minúscula y número
  - Confirmación de contraseña
  - Aceptación de términos y condiciones

### Login
- **Validaciones incluidas:**
  - Email obligatorio y formato válido
  - Contraseña obligatoria
  - Manejo de errores del servidor

### Características de Seguridad
- Tokens JWT almacenados en localStorage
- Interceptors de Axios para manejo automático de tokens
- Logout automático en caso de token expirado
- Rutas protegidas que requieren autenticación

## 🎨 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── ProtectedRoute.jsx
│   └── PasswordStrengthIndicator.jsx
├── context/            # Context API para estado global
│   └── AuthContext.jsx
├── pages/              # Páginas principales
│   ├── HomePage.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   └── NotFound.jsx
├── services/           # Servicios para API
│   ├── api.js
│   └── authService.js
├── utils/              # Utilidades y helpers
│   └── validation.js
├── config/             # Configuración
│   └── index.js
└── App.jsx             # Componente principal
```

## 🔌 Integración con Backend

El frontend está configurado para conectarse con el backend Spring Boot que incluye:

### Endpoints disponibles:
- `POST /api/v1/auth/registro` - Registro de usuarios
- `POST /api/v1/auth/login` - Inicio de sesión
- `POST /api/v1/auth/verify` - Verificación de token

### Estructura de datos esperada:

**Registro:**
```json
{
  "nombre": "string",
  "email": "string",
  "password": "string",
  "rol": "AGRICULTOR"
}
```

**Login:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Respuesta exitosa:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 🎯 Validaciones Implementadas

### Contraseñas
- Mínimo 6 caracteres
- Al menos una letra mayúscula
- Al menos una letra minúscula
- Al menos un número
- Indicador visual de fortaleza

### Emails
- Formato válido con regex
- Campo obligatorio

### Nombres
- Mínimo 2 caracteres
- Máximo 50 caracteres
- Solo letras y espacios

## 🚦 Estados de la Aplicación

- **Loading**: Durante peticiones al servidor
- **Error**: Manejo de errores con alertas
- **Success**: Confirmaciones de acciones exitosas
- **Authenticated/Unauthenticated**: Estados de autenticación

## 📱 Diseño Responsive

- **Mobile First**: Optimizado para dispositivos móviles
- **Breakpoints Material-UI**: xs, sm, md, lg, xl
- **Navegación adaptativa**: Menús diferentes para desktop/mobile

## 🔄 Flujo de Usuario

1. **Usuario no autenticado**: Ve homepage, puede ir a login/register
2. **Registro exitoso**: Redirige automáticamente al dashboard
3. **Login exitoso**: Redirige al dashboard
4. **Dashboard**: Área protegida con funcionalidades del usuario
5. **Logout**: Limpia estado y redirige al homepage

## 🐛 Manejo de Errores

- **Errores de validación**: Se muestran en tiempo real
- **Errores de servidor**: Alertas con mensajes específicos
- **Errores de red**: Mensajes genéricos amigables
- **Token expirado**: Logout automático y redirección

## 🎨 Tema y Estilo

- **Colores principales**: Verde agrícola (#2e7d32) y marrón tierra (#8d6e63)
- **Tipografía**: Roboto
- **Efectos**: Sombras suaves, transiciones, hover effects
- **Accesibilidad**: Contrastes adecuados, navegación por teclado

## 📝 Próximas Características

- [ ] Recuperación de contraseña
- [ ] Perfil de usuario editable
- [ ] Gestión de cultivos
- [ ] Notificaciones en tiempo real
- [ ] Modo oscuro
- [ ] Internacionalización

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request
