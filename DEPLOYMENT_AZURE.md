# Migración a Azure - Instrucciones de Deployment

## Configuración completada:

1. ✅ **URL del API actualizada**: Ahora apunta a `https://pap-dwi-c7gjfrg4hdhfhug9.brazilsouth-01.azurewebsites.net/api/v1`
2. ✅ **Variables de entorno configuradas**: 
   - `.env.development`: Para desarrollo local (localhost:8080)
   - `.env.production`: Para producción (Azure)
   - `.env`: Configuración general/fallback

## Pasos para completar la migración:

### 1. Actualizar CORS en el Backend
El backend actualmente permite requests desde `https://victorious-coast-0693bca10.1.azurestaticapps.net`.
Necesitas actualizar el archivo `backend/src/main/java/org/utp/pydwi/CorsConfig.java` para incluir la URL donde vas a desplegar tu frontend.

### 2. Build para producción
```bash
# En el directorio frontend/
npm run build
```

### 3. Deployment del Frontend
Dependiendo de dónde vayas a desplegar tu frontend:

#### Opción A: Azure Static Web Apps
- Sube el contenido de la carpeta `dist/` a Azure Static Web Apps
- Configura la URL en el CORS del backend

#### Opción B: Otro servicio (Netlify, Vercel, etc.)
- Sigue las instrucciones del servicio elegido
- Asegúrate de configurar las variables de entorno de producción

### 4. Variables de entorno importantes:
- `VITE_API_BASE_URL`: URL base de tu API en Azure
- `VITE_APP_ENV`: Entorno (development/production)

### 5. Verificación post-deployment:
1. Verificar que las requests lleguen al backend en Azure
2. Comprobar que la autenticación funcione correctamente
3. Verificar que las cookies se manejen apropiadamente con HTTPS
4. Comprobar que no hay errores de CORS

## Comandos útiles:

```bash
# Desarrollo local (usa localhost:8080)
npm run dev

# Build para producción (usa Azure)
npm run build

# Preview del build de producción
npm run preview
```

## Notas importantes:
- El backend está en: `https://pap-dwi-c7gjfrg4hdhfhug9.brazilsouth-01.azurewebsites.net`
- Se habilitó `withCredentials: true` para manejar cookies en requests cross-origin
- La autenticación se maneja mediante Bearer tokens en localStorage
