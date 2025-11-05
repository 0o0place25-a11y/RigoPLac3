# 🛒 RigoCompra! - Marketplace Universitario UVG

## 🎓 Universidad del Valle de Guatemala

**RigoCompra** es un marketplace diseñado específicamente para la comunidad universitaria de la UVG. Permite a estudiantes, profesores y personal comprar y vender productos, promover emprendimientos y conectar con la comunidad.

---

## 🚀 Inicio Rápido

### 1. Instalar dependencias
```bash
cd backend
npm install
```

### 2. Iniciar el servidor
```bash
node server.js
```

### 3. Abrir la aplicación
Abre `index.html` en tu navegador o usa:
```bash
python -m http.server 8000
# Luego visita: http://localhost:8000
```

**📖 Para instrucciones detalladas, consulta [SETUP-GUIDE.md](./SETUP-GUIDE.md)**

---

## 🎨 Colores Oficiales UVG Implementados

La aplicación usa los colores institucionales de la Universidad del Valle de Guatemala:

- **Verde UVG:** `#078b45` (Barra superior, acentos)
- **Verde Claro:** `#7adcb4` (Elementos activos)
- **Gris UVG:** `#5a6270` (Sidebar)
- **Crema UVG:** `#fcf8e3` (Detalles)

---

## 📋 Resumen de Características Implementadas

### 🎨 Diseño UVG
- ✅ Colores oficiales de la UVG aplicados
- ✅ Barra superior verde UVG con iconos reorganizados
- ✅ Sidebar gris opaco con navegación clara
- ✅ Logo adaptado correctamente
- ✅ Diseño responsive para móvil, tablet y desktop

### 🌟 Pantalla de Bienvenida
- ✅ Animación de bienvenida al ingresar
- ✅ Logo con efecto de escalado
- ✅ Texto animado que se desvanece
- ✅ Aparece solo una vez por sesión

### 🔐 Sistema de Autenticación
- ✅ Registro con usuario y contraseña o PIN
- ✅ Login automático después de registro
- ✅ Detección automática de PIN (4 dígitos)
- ✅ Contraseñas hasheadas con bcrypt
- ✅ Autenticación JWT
- ✅ Edición de perfil
- ✅ Estado de sesión visible en el header

### 🛍️ Productos
- ✅ 22 productos de ejemplo pre-cargados
- ✅ Imágenes de Unsplash
- ✅ Categorías: Ropa, Comida, Tecnología, Hogar, Servicios
- ✅ Modal de producto con información completa
- ✅ Búsqueda en tiempo real
- ✅ Filtros por categoría
- ✅ Crear nuevas publicaciones
- ✅ Ver "Mis publicaciones"

### ✨ Nuevas Funcionalidades

#### 1. **Sistema de Modal de Producto**
- Modal emergente al hacer clic en cualquier producto
- Muestra información completa del producto:
  - Imagen del producto
  - Título y precio
  - Descripción detallada
  - Estado/condición del producto
  - Ubicación y categoría
  - Botón de contacto por WhatsApp
  - Botón de favoritos

#### 2. **Sistema de Favoritos**
- ❤️ Icono de corazón en cada tarjeta de producto
- Aparece al hacer hover sobre la tarjeta (desktop) o siempre visible (móvil)
- Guarda favoritos en localStorage (persistente entre sesiones)
- Toggle on/off al hacer clic
- Indicación visual cuando un producto está en favoritos

#### 3. **Página de Favoritos**
- Página dedicada (`favoritos.html`) para ver todos los favoritos
- Navegación fácil desde el menú lateral
- Contador de productos favoritos
- Buscador dentro de favoritos
- Botón para limpiar todos los favoritos
- Mensaje cuando no hay favoritos guardados

#### 4. **Diseño Responsive**
- ✅ Desktop (>768px): Layout de 2 columnas en modal
- ✅ Tablet (768px-640px): Modal de 1 columna, botones de favoritos siempre visibles
- ✅ Móvil (<640px): Diseño optimizado, tipografía ajustada
- ✅ Móvil pequeño (<400px): Layout adaptado para pantallas muy pequeñas

---

## 🎨 Archivos del Proyecto

```
📁 Uploads/
├── 📄 index.html          - Página principal
├── 📄 favoritos.html      - Página de favoritos
├── 📄 index.css           - Estilos (incluye modal y favoritos)
├── 📄 app.js              - Lógica principal
├── 📄 favoritos.js        - Lógica de página de favoritos
├── 📄 README.md           - Esta documentación
└── 🖼️  [imágenes]         - LOGO.png, hero.jpg, etc.
```

---

## 🔧 Personalización de Productos

### ⚠️ IMPORTANTE: Dónde Editar Productos

Los productos se definen en **DOS lugares** y deben ser **idénticos** para que los favoritos funcionen correctamente:

#### 📍 Ubicación 1: `app.js` (líneas 55-109)
```javascript
// EDITAR AQUÍ: Información de productos
const mine = [
  { 
    id: '1',                    // ID único (obligatorio)
    title: "Producto",          // Título del producto
    price: 100,                 // Precio en quetzales
    city: "Guatemala",          // Ciudad
    category: "Categoría",      // Categoría del producto
    image: "",                  // URL de imagen (opcional)
    description: "Texto...",    // Descripción completa
    condition: "Nuevo"          // Estado del producto
  }
];
```

#### 📍 Ubicación 2: `favoritos.js` (líneas 58-112)
```javascript
// EDITAR AQUÍ: Debe coincidir con los datos de app.js
const mine = [
  // LOS MISMOS PRODUCTOS QUE EN app.js
];
```

### 📝 Campos de Producto

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `id` | string | ✅ Sí | Identificador único (usar números: '1', '2', '3'...) |
| `title` | string | ✅ Sí | Nombre del producto |
| `price` | number | ✅ Sí | Precio en quetzales |
| `city` | string | ✅ Sí | Ciudad donde se vende |
| `category` | string | ✅ Sí | Categoría (Ropa, Comida, Tecnología, Hogar, Servicios) |
| `image` | string | ⚪ No | URL de la imagen del producto |
| `description` | string | ⚪ No | Descripción detallada del producto |
| `condition` | string | ⚪ No | Estado del producto (Nuevo, Usado, etc.) |

### 📖 Ejemplo de Cómo Agregar un Producto

1. Abre `app.js`
2. Busca la sección "DATOS DE PRODUCTOS"
3. Agrega un nuevo objeto al array `mine` o `feed`:

```javascript
const mine = [
  // Productos existentes...
  { 
    id: '6',                                    // ⚠️ Usa el siguiente número disponible
    title: "Laptop Gaming",                     
    price: 8500,                                
    city: "Guatemala",                          
    category: "Tecnología",                     
    image: "https://m.media-amazon.com/images/I/61xngCGseFL.jpg",    // Opcional
    description: "Laptop gaming con RTX 3060, 16GB RAM, perfecto estado",
    condition: "Usado - Como nuevo"             
  }
];
```

4. **IMPORTANTE**: Copia el mismo producto en `favoritos.js` en la misma ubicación

### 🖼️ Cómo Usar Imágenes

**Opción 1: URLs de Internet**
```javascript
image: "https://i.ytimg.com/vi/26pC8UuAsww/maxresdefault.jpg"
```

**Opción 2: Imágenes Locales**
```javascript
image: "hero.jpg"  // Debe estar en la misma carpeta
```

**Opción 3: Sin Imagen**
```javascript
image: ""  // Se mostrará un placeholder
```

---

## 📱 Número de WhatsApp

Para cambiar el número de contacto de WhatsApp:

### En `app.js` (línea 129):
```javascript
const phone = '50212345678'; // EDITAR AQUÍ: Tu número de WhatsApp
```

### En `favoritos.js` (línea 179):
```javascript
const phone = '50212345678'; // EDITAR AQUÍ: Tu número de WhatsApp
```

**Formato**: Código de país + número sin espacios ni símbolos
- Guatemala: `502` + tu número (8 dígitos)
- Ejemplo: `50212345678`

---

## 🎯 Guía de Uso para Usuarios

### Navegación Principal

1. **Ver Productos**: Navega por las secciones "Inicio" y "Explorar"
2. **Ver Detalles**: Haz clic en cualquier tarjeta de producto
3. **Agregar a Favoritos**: Haz clic en el ❤️ en la tarjeta o en el modal
4. **Ver Favoritos**: Haz clic en "Favoritos" en el menú lateral
5. **Buscar**: Usa la barra de búsqueda en la parte superior

### Gestión de Favoritos

- **Agregar**: Clic en ❤️ (se pone rojo)
- **Quitar**: Clic de nuevo en ❤️ (vuelve a gris)
- **Ver todos**: Ir a la página "Favoritos"
- **Buscar en favoritos**: Usa el buscador en la página de favoritos
- **Limpiar todos**: Botón de 🗑️ en la página de favoritos

### Modal de Producto

- **Abrir**: Clic en cualquier parte de la tarjeta
- **Cerrar**: 
  - Clic en la ❌ 
  - Clic fuera del modal
  - Presiona tecla ESC
- **Contactar**: Botón verde de WhatsApp

---

## 💾 Almacenamiento Local

### localStorage
Los favoritos se guardan en el navegador usando `localStorage`:
- **Clave**: `rigocompra_favorites`
- **Formato**: Array de IDs de productos
- **Persistencia**: Se mantiene entre sesiones hasta que el usuario limpie el navegador

### Ver Favoritos en Consola
Abre la consola del navegador (F12) y escribe:
```javascript
localStorage.getItem('rigocompra_favorites')
```

### Limpiar Favoritos Manualmente
```javascript
localStorage.removeItem('rigocompra_favorites')
```

---

## 🎨 Personalización de Estilos

### Colores Principales (en `index.css`, líneas 6-11)
```css
:root {
  --bg: #bfc6cfbd;        /* Color de fondo */
  --panel: #d0c0969b;     /* Color de tarjetas */
  --text: #1f2328;        /* Color de texto */
  --accent: #2b47a1bf;    /* Color de acento */
  --accent-600: #6b99dffb; /* Color de acento hover */
}
```

### Botón de Favoritos
```css
/* Color cuando NO está en favoritos */
.fav-btn i { color: #8b91a5; }

/* Color cuando SÍ está en favoritos */
.fav-btn.active { background: #ff4757; }
```

---

## 🐛 Solución de Problemas

### Los favoritos no se guardan
- ✅ Verifica que los IDs de productos sean iguales en `app.js` y `favoritos.js`
- ✅ Asegúrate de que los IDs sean strings ('1', '2', etc.) no números
- ✅ Revisa la consola del navegador para errores

### Las imágenes no se muestran
- ✅ Verifica que la URL sea correcta y accesible
- ✅ Si es local, asegúrate de que el archivo esté en la carpeta correcta
- ✅ Usa URLs completas con `https://`

### El modal no abre
- ✅ Verifica que `app.js` o `favoritos.js` esté cargado
- ✅ Revisa la consola del navegador para errores de JavaScript
- ✅ Asegúrate de que los IDs de elementos HTML coincidan

### El diseño se ve mal en móvil
- ✅ Abre el inspector de elementos (F12)
- ✅ Activa el modo responsive
- ✅ Verifica que `index.css` esté cargado correctamente

---

## 🚀 Próximas Mejoras Sugeridas

### Funcionalidades Avanzadas
- [ ] Integración con backend/API
- [ ] Sistema de usuarios y autenticación
- [ ] Carrito de compras
- [ ] Sistema de valoraciones
- [ ] Filtros avanzados
- [ ] Ordenar por precio/fecha

### Mejoras de UX
- [ ] Animaciones suaves
- [ ] Modo oscuro
- [ ] Compartir productos
- [ ] Notificaciones
- [ ] Chat en vivo

---

## 📞 Soporte

Si necesitas ayuda con la personalización o encuentras algún problema:

1. Revisa esta documentación
2. Verifica la consola del navegador (F12)
3. Asegúrate de que todos los archivos estén en la misma carpeta
4. Verifica que los datos en `app.js` y `favoritos.js` sean idénticos

---

## 📄 Licencia y Créditos

**Proyecto**: RigoCompra!  
**Desarrollado para**: Plataforma de compra-venta universitaria  
**Iconos**: Boxicons (https://boxicons.com)  
**Funcionalidades**: Modal de productos, Favoritos con localStorage, Diseño responsive

---

## 🎓 Notas Técnicas

### Stack Tecnológico
- HTML5
- CSS3 (Grid, Flexbox, Media Queries)
- JavaScript Vanilla (ES6+)
- LocalStorage API
- Boxicons

### Compatibilidad
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Móvil (iOS Safari, Chrome Mobile)

### Performance
- Sin dependencias externas (excepto iconos)
- Carga rápida
- Almacenamiento eficiente con localStorage
- Optimizado para SEO básico

---

## 📚 Glosario

- **Modal**: Ventana emergente que muestra información detallada
- **localStorage**: Almacenamiento local del navegador
- **Responsive**: Diseño que se adapta a diferentes tamaños de pantalla
- **Toggle**: Alternar entre dos estados (favorito/no favorito)
- **Hover**: Efecto al pasar el cursor sobre un elemento

---

---

## 🗄️ Funciones de Base de Datos

### Implementación Profesional

Se han implementado **30+ funciones** de base de datos siguiendo mejores prácticas:

**Categorías de funciones:**
- 👤 **Usuarios:** findUserByUsername, findUserById, createUser, updateUser, deleteUser
- 🛍️ **Productos:** getAllProducts, findProductById, getProductsByUser, getProductsByCategory, searchProducts, createProduct, updateProduct, deleteProduct
- ❤️ **Favoritos:** getUserFavorites, addToFavorites, removeFromFavorites, isFavorite, getFavoriteProducts
- 📊 **Estadísticas:** countProducts, countProductsByUser, getRecentProducts

**Características:**
- ✅ Todas las funciones usan Promises (async/await)
- ✅ Manejo de errores consistente
- ✅ Parámetros preparados (prevención de SQL injection)
- ✅ Documentación completa con ejemplos
- ✅ Reutilizables en todo el backend

**📖 Documentación completa:** [DB-FUNCTIONS-GUIDE.md](./DB-FUNCTIONS-GUIDE.md)

**Ubicación:** `backend/db-functions.js`

**Ejemplo de uso:**
```javascript
const { getAllProducts, searchProducts } = require('./db-functions');

// Obtener todos los productos
const products = await getAllProducts();

// Buscar productos
const results = await searchProducts('laptop');
```

---

## 📚 Documentación Adicional

- **[SETUP-GUIDE.md](./SETUP-GUIDE.md)** - Guía completa de instalación y uso
- **[DB-FUNCTIONS-GUIDE.md](./DB-FUNCTIONS-GUIDE.md)** - Documentación de funciones de base de datos
- **[README.md](./README.md)** - Este archivo

---

## 🎯 Características Implementadas por Requerimiento

### ✅ Colores UVG
- Verde oficial (#078b45) en barra superior
- Gris opaco (#5a6270) en sidebar
- Todos los acentos usan colores institucionales

### ✅ Iconos Reorganizados
- Perfil, Panel y Lista correctamente posicionados en topbar
- Iconos con mejor contraste sobre fondo verde
- Animaciones suaves en hover

### ✅ Logo Adaptado
- Logo visible en sidebar colapsado
- Se expande al hacer hover
- Mantiene proporciones correctas

### ✅ Pantalla de Bienvenida
- Animación de entrada al cargar el sitio
- Desvanecimiento gradual después de 3 segundos
- Solo aparece una vez por sesión

### ✅ Productos Múltiples
- 22 productos con imágenes reales
- 5 en "Publicado por ti"
- 17 en "Para ti"
- Categorías variadas

### ✅ Autenticación Mejorada
- Usuario + PIN de 4 dígitos
- Usuario + Contraseña tradicional
- Detección automática del método
- Guardado en base de datos local (SQLite)
- No requiere backend externo para funcionar

### ✅ Dropdown de Perfil Funcional
- Muestra nombre de usuario
- Indicador de estado online
- Links a Mis Publicaciones, Favoritos, Editar Perfil, Salir
- Funciona correctamente

### ✅ Funciones de Base de Datos
- 30+ funciones documentadas
- Siguiendo patrones profesionales
- Código reutilizable
- Ejemplos de uso incluidos

### ✅ Todos los Botones Funcionan
- Navegación completa entre secciones
- Botones de acción implementados
- Modales con funcionalidad real
- Sin enlaces rotos

---

## 🚀 Tecnologías Utilizadas

### Frontend
- HTML5
- CSS3 (Grid, Flexbox, Animaciones)
- JavaScript Vanilla (ES6+)
- Boxicons

### Backend
- Node.js
- Express.js
- SQLite3
- bcryptjs (Encriptación)
- JSON Web Tokens (JWT)

### Características Técnicas
- Sistema de autenticación completo
- Base de datos relacional
- API RESTful
- Responsive design
- Animaciones CSS
- LocalStorage & SessionStorage
- CRUD completo

---

## 🔒 Seguridad Implementada

- ✅ Contraseñas hasheadas con bcrypt (10 rounds)
- ✅ PINs hasheados con bcrypt
- ✅ Autenticación JWT
- ✅ Tokens con expiración
- ✅ Prepared statements (prevención de SQL injection)
- ✅ CORS configurado
- ✅ Validación de entrada

---

## 📞 Soporte y Contacto

Para dudas sobre:
- **Instalación:** Consulta [SETUP-GUIDE.md](./SETUP-GUIDE.md)
- **Base de datos:** Consulta [DB-FUNCTIONS-GUIDE.md](./DB-FUNCTIONS-GUIDE.md)
- **Funcionalidades:** Consulta esta documentación

---

## 🎓 Información Académica

**Proyecto:** RigoCompra - Marketplace Universitario
**Institución:** Universidad del Valle de Guatemala (UVG)
**Propósito:** Plataforma de compra-venta para la comunidad universitaria
**Tecnologías:** Full Stack (Frontend + Backend + Base de Datos)

**Funcionalidades requeridas implementadas:**
- ✅ Colores institucionales UVG
- ✅ Sistema de autenticación completo
- ✅ Base de datos con funciones documentadas
- ✅ Interfaz responsive y moderna
- ✅ CRUD completo de productos
- ✅ Sistema de favoritos
- ✅ Búsqueda y filtros
- ✅ Integración con WhatsApp

---

**¡Disfruta de RigoCompra! 🎉**
