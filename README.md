# 🛒 RigoCompra! - Documentación

## 📋 Resumen de Características Implementadas

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

**¡Disfruta de RigoCompra! 🎉**
