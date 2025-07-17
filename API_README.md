# Configuración de API - Frontend React

## Configuración Actual

El frontend está configurado para conectarse con tu backend local en `http://localhost:8081`.

### Archivos de Configuración

1. **`.env.local`** - Variables de entorno para desarrollo local
```
VITE_API_BASE_URL=http://localhost:8081/api/v1
```

2. **`src/config/index.js`** - Configuración principal
```javascript
API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api/v1'
```

3. **`src/services/api.js`** - Cliente Axios configurado
- Interceptors para manejo de errores
- Headers automáticos
- Base URL configurada

## Servicios Disponibles

### CultivoService (`src/services/cultivoService.js`)

```javascript
import { cultivoService } from '../services';

// Obtener cultivos por usuario
const cultivos = await cultivoService.obtenerPorUsuario(usuarioId);

// Obtener cultivos por parcela
const cultivos = await cultivoService.obtenerPorParcela(parcelaId);

// Registrar nuevo cultivo
const nuevoCultivo = await cultivoService.registrar({
  nombre: 'Tomate',
  variedad: 'Cherry',
  fechaPlantacion: '2025-01-15',
  fechaCosechaEstimada: '2025-04-15',
  estado: 'PLANTADO',
  parcelaId: 1
});

// Registrar actividad en cultivo
const actividad = await cultivoService.registrarActividad(cultivoId, {
  tipo: 'RIEGO',
  descripcion: 'Riego por goteo',
  fecha: '2025-01-16'
});

// Obtener actividades de un cultivo
const actividades = await cultivoService.obtenerActividades(cultivoId);
```

## Endpoints del Backend

### Cultivos
- `GET /api/v1/gestioncultivo/cultivos/usuario/{id}` - Obtener cultivos por usuario
- `GET /api/v1/gestioncultivo/cultivos/parcela/{id}` - Obtener cultivos por parcela
- `POST /api/v1/gestioncultivo/cultivos` - Crear nuevo cultivo
- `POST /api/v1/gestioncultivo/cultivos/{id}/actividades` - Registrar actividad
- `GET /api/v1/gestioncultivo/cultivos/{id}/actividades` - Obtener actividades

### Autenticación
- `POST /api/v1/auth/registro` - Registro de usuario

## Ejemplo de Uso en Componente

```jsx
import React, { useState, useEffect } from 'react';
import { cultivoService } from '../services';

const MiComponente = () => {
  const [cultivos, setCultivos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cargarCultivos = async (usuarioId) => {
    setLoading(true);
    try {
      const response = await cultivoService.obtenerPorUsuario(usuarioId);
      setCultivos(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCultivos(1); // ID del usuario
  }, []);

  return (
    <div>
      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error}</p>}
      {cultivos.map(cultivo => (
        <div key={cultivo.id}>
          <h3>{cultivo.nombre}</h3>
          <p>Variedad: {cultivo.variedad}</p>
          <p>Estado: {cultivo.estado}</p>
        </div>
      ))}
    </div>
  );
};
```

## Componente de Ejemplo

Visita `/ejemplo-cultivos` en tu aplicación para ver un ejemplo funcional de cómo consumir la API.

## Debugging

1. **Verificar Backend**: Asegúrate de que tu backend esté corriendo en `http://localhost:8081`
2. **Consola del Navegador**: Abre F12 para ver logs y errores
3. **Network Tab**: Revisa las peticiones HTTP en las herramientas de desarrollador
4. **CORS**: Si hay errores de CORS, configura tu backend para permitir requests desde `http://localhost:5173`

## Manejo de Errores

El `api.js` incluye interceptors que:
- Manejan errores 401 (no autorizado)
- Limpian datos de autenticación cuando es necesario
- Proporcionan mensajes de error consistentes

## Configuración de CORS en Backend

Tu backend debe permitir requests desde:
```
http://localhost:5173
```

Ejemplo de configuración CORS en Spring Boot:
```java
@CrossOrigin(origins = "http://localhost:5173")
```

## Próximos Pasos

1. Asegúrate de que tu backend esté corriendo
2. Visita `/ejemplo-cultivos` para probar la conexión
3. Revisa la consola para cualquier error
4. Adapta los servicios según tus necesidades específicas
