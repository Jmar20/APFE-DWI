# AgroPE - Plataforma Agrícola Digital

Una plataforma web moderna desarrollada con **React + Vite** y **Material UI**, diseñada específicamente para pequeños agricultores peruanos.

## 🚀 Características

- **Vite**: Build tool súper rápido y moderno
- **Diseño Responsive**: Adaptado para móviles, laptops, monitores y Smart TVs
- **Navegación Intuitiva**: React Router para navegación fluida
- **Interfaz Moderna**: Material UI con tema personalizado agrícola
- **Componentes Modulares**: Arquitectura escalable y mantenible

## 🛠️ Tecnologías Utilizadas

- **React 19**: Framework principal
- **Vite 7**: Build tool ultrarrápido
- **Material UI 5**: Biblioteca de componentes
- **React Router 6**: Enrutamiento
- **Emotion**: Styling engine para MUI

## 📋 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Header.jsx      # Header fijo con navegación
│   ├── HeroSection.jsx # Sección principal
│   ├── InfoCards.jsx   # Tarjetas de servicios
│   ├── Testimonials.jsx # Slider de testimonios
│   ├── VideoSection.jsx # Sección con video
│   └── Footer.jsx      # Footer con enlaces y contacto
├── pages/              # Páginas principales
│   ├── HomePage.jsx    # Página de inicio
│   ├── About.jsx       # Página "Conócenos"
│   ├── Contact.jsx     # Página de contacto
│   └── Login.jsx       # Página de login
├── App.jsx             # Componente principal
└── main.jsx            # Punto de entrada (Vite)
```

## 🎨 Componentes Principales

### Header

- AppBar fijo con navegación responsiva
- Enlaces a todas las secciones
- Botón destacado de "Iniciar Sesión"

### HeroSection

- Título principal "AgroPE"
- Subtítulo descriptivo
- Botón de llamada a la acción
- Imagen representativa

### InfoCards

- Tres tarjetas: Siembras, Cosechas, Rendimiento
- Grid responsivo (xs=12, sm=6, md=4)
- Iconos de Material UI
- Botones "Ver más" con animaciones

### Testimonials

- Slider con navegación por flechas
- Testimonios de agricultores
- Indicadores de posición
- Animaciones suaves

### VideoSection

- Video embebido de YouTube
- Texto informativo con lista de beneficios
- Layout de dos columnas responsivo
- Estadísticas adicionales

### Footer

- Cuatro columnas de información
- Formulario de newsletter
- Enlaces de navegación
- Redes sociales
- Copyright

## 🚀 Instalación y Ejecución

1. **Instalar dependencias:**

   ```bash
   npm install
   ```

2. **Ejecutar en modo desarrollo:**

   ```bash
   npm run dev
   ```

3. **Construir para producción:**

   ```bash
   npm run build
   ```

4. **Preview de la build:**
   ```bash
   npm run preview
   ```

## ⚡ Ventajas de Vite

- **Inicio súper rápido**: ~100ms vs ~5-10s
- **Hot Module Replacement**: Instantáneo
- **Build optimizado**: 2-3x más rápido que Create React App
- **Menor bundle**: Tamaño final optimizado
- **ES Modules nativos**: Tecnología moderna

## 📱 Responsive Design

El proyecto está optimizado para:

- **Móviles** (xs): < 600px
- **Tablets** (sm): 600px - 900px
- **Laptops 14"** (md): 900px - 1200px
- **Monitores 24"** (lg): 1200px - 1536px
- **Smart TVs** (xl): > 1536px

## 🎨 Tema y Colores

- **Verde Agrícola**: #2e7d32 (Primary)
- **Color Tierra**: #8d6e63 (Secondary)
- **Fondo**: #fafafa
- **Texto**: #2e2e2e

## 📄 Páginas Disponibles

- `/` - Página de inicio
- `/about` - Información sobre la empresa
- `/contact` - Formulario de contacto
- `/login` - Página de autenticación

## 🧩 Funcionalidades

- Navegación fluida entre páginas
- Formularios funcionales con validación
- Slider de testimonios interactivo
- Animaciones y transiciones suaves
- Newsletter subscription
- Responsive design completo

## 🔧 Personalización

### Cambiar Colores del Tema

Edita el archivo `src/App.jsx` en la sección `createTheme()`:

```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: "#tu-color-primario",
    },
    secondary: {
      main: "#tu-color-secundario",
    },
  },
});
```

### Agregar Nuevos Componentes

1. Crea el componente en `src/components/`
2. Importa y usa en las páginas necesarias
3. Mantén la estructura modular

## 🌟 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build para producción
- `npm run preview` - Preview de la build
- `npm run lint` - Linter ESLint

## 📞 Soporte

Para soporte técnico, contacta a:

- **Email**: lu.a.tru.sul@gmail.com
- **Teléfono**: +51 937 094 291

## 📝 Changelog Reciente

### v1.0 - Refactorización Completa (28 Jun 2025)

**✅ Mejoras Implementadas:**

- Refactorización completa de About.jsx con componentes modulares
- Formulario de contacto con validación robusta y scroll-to-success
- Newsletter en Footer con validación de email y feedback temporal
- Header y Footer centralizados en App.jsx
- Navegación mejorada con scroll-to-top en páginas actuales
- Consistencia visual y de padding en todas las páginas
- Arquitectura de componentes escalable y mantenible

**🛠️ Componentes Nuevos:**

- `ContactSection.jsx` - Formulario con validación completa
- `AboutHero.jsx` - Hero section de la página About
- `ContentBlocks.jsx` - Bloques de contenido modulares
- `AboutFeatures.jsx` - Features específicas de About
- `TeamSection.jsx` - Sección del equipo con perfiles

**🎯 Funcionalidades:**

- Validación de formularios en tiempo real
- Mensajes de éxito temporales
- Responsive design optimizado
- Experiencia de usuario consistente

---
