# 🚀 Guía de Instalación y Uso - RigoCompra

## 📋 Tabla de Contenidos
1. [Requisitos](#requisitos)
2. [Instalación](#instalación)
3. [Configuración](#configuración)
4. [Ejecución](#ejecución)
5. [Uso de la Aplicación](#uso-de-la-aplicación)
6. [Características Implementadas](#características-implementadas)
7. [Estructura del Proyecto](#estructura-del-proyecto)
8. [Solución de Problemas](#solución-de-problemas)

---

## 📦 Requisitos

- **Node.js** v14 o superior
- **npm** v6 o superior
- Navegador web moderno (Chrome, Firefox, Safari, Edge)

Para verificar si tienes Node.js instalado:
```bash
node --version
npm --version
```

---

## 🔧 Instalación

### Paso 1: Clonar o descargar el repositorio

```bash
cd rigocompra
```

### Paso 2: Instalar dependencias del backend

```bash
cd backend
npm install
cd ..
```

Las dependencias instaladas incluyen:
- `express` - Framework web
- `sqlite3` - Base de datos
- `bcryptjs` - Encriptación de contraseñas
- `jsonwebtoken` - Autenticación JWT
- `cors` - Manejo de CORS

---

## ⚙️ Configuración

### Colores UVG Implementados

La aplicación usa los colores oficiales de la Universidad del Valle de Guatemala:

- **Verde UVG:** `#078b45` (color principal)
- **Verde Claro:** `#7adcb4` (acentos)
- **Gris UVG:** `#5a6270` (sidebar)
- **Crema UVG:** `#fcf8e3` (detalles)

### Base de Datos

La base de datos SQLite se crea automáticamente al iniciar el servidor backend por primera vez. Incluye:

- **Tabla users:** Usuarios del sistema
- **Tabla products:** Productos publicados (22 productos de ejemplo pre-cargados)
- **Tabla favorites:** Favoritos de los usuarios

---

## 🚀 Ejecución

### Método 1: Ejecución Manual (Recomendado)

#### 1. Iniciar el Backend

```bash
cd backend
node server.js
```

Deberías ver:
```
Server started on port 5000
Connected to the SQLite database.
Products seeded
```

#### 2. Abrir la Aplicación

Abre `index.html` directamente en tu navegador o usa un servidor estático:

```bash
# Usando Python
python -m http.server 8000

# Usando Node.js http-server
npx http-server -p 8000
```

Luego abre: `http://localhost:8000`

---

## 💡 Uso de la Aplicación

### 1. Pantalla de Bienvenida

Al abrir la aplicación por primera vez, verás una pantalla de bienvenida con el logo de RigoCompra que se desvanece después de 3 segundos. Esta pantalla solo aparece una vez por sesión.

### 2. Registro de Usuario

Para usar todas las funcionalidades, debes registrarte:

1. Haz clic en el icono de **Perfil** (usuario) en la barra verde superior
2. Haz clic en "**Regístrate**"
3. Ingresa un nombre de usuario
4. Elige el método de autenticación:
   - **Contraseña:** Para una contraseña tradicional
   - **PIN:** Para un PIN de 4 dígitos (más rápido para UVG)
5. Completa el campo correspondiente
6. Haz clic en "**Registrarse**"

**Ejemplo de registro con PIN:**
- Usuario: `juan23`
- Método: PIN
- PIN: `1234`

### 3. Iniciar Sesión

1. Haz clic en el icono de **Perfil**
2. Ingresa tu nombre de usuario
3. Ingresa tu contraseña o PIN
4. La aplicación detecta automáticamente si es PIN (4 dígitos) o contraseña

### 4. Navegación

La aplicación tiene dos barras de navegación:

#### Barra Superior (Verde UVG)
- **Búsqueda:** Busca productos por título, descripción o ciudad
- **Lista:** Cambia vista de lista (funcionalidad futura)
- **Panel:** Vista de panel (funcionalidad futura)
- **Perfil:** Accede a tu perfil y opciones

#### Sidebar (Gris UVG)
Secciones disponibles:
- 🏠 **Inicio:** Productos principales
- 🧭 **Explorar:** Todos los productos con filtros por categoría
- ✏️ **Crear publicación:** Publica nuevos productos
- 📁 **Mis publicaciones:** Tus productos publicados
- 💬 **Mensajes:** Contacto por WhatsApp
- ❤️ **Favoritos:** Productos guardados
- ⭐ **Emprendimientos:** Lista de emprendimientos destacados
- 📅 **Ferias y eventos:** Eventos de emprendimiento UVG
- 🚪 **Salir:** Cerrar sesión

### 5. Explorar Productos

#### Ver Productos
- Los productos se muestran en tarjetas con imagen, título, precio y ubicación
- **Hover sobre tarjeta:** Aparece el botón de favoritos ❤️
- **Clic en tarjeta:** Abre modal con información completa

#### Filtrar por Categoría
1. Ve a la sección "**Explorar**"
2. Usa los chips en la parte superior:
   - Todos
   - Ropa
   - Comida
   - Tecnología
   - Hogar
   - Servicios

#### Buscar Productos
Usa la barra de búsqueda en la parte superior para buscar por:
- Título del producto
- Descripción
- Ciudad

### 6. Agregar a Favoritos

Hay dos formas de agregar favoritos:

1. **Desde la tarjeta:**
   - Pasa el mouse sobre la tarjeta
   - Haz clic en el icono de corazón ❤️

2. **Desde el modal:**
   - Abre el producto
   - Haz clic en el botón de corazón en la esquina superior derecha

Los favoritos se guardan en la base de datos y persisten entre sesiones.

### 7. Ver Favoritos

1. Haz clic en "**Favoritos**" en el sidebar
2. Verás todos tus productos favoritos
3. Puedes buscar dentro de tus favoritos
4. Haz clic en cualquier producto para ver detalles

### 8. Crear Publicación

1. Inicia sesión (requerido)
2. Haz clic en "**Crear publicación**" en el sidebar
3. Completa el formulario:
   - **Título:** Nombre del producto (requerido)
   - **Precio:** Precio en quetzales (requerido)
   - **Ciudad:** Ubicación (requerido)
   - **Categoría:** Selecciona una categoría (requerido)
   - **URL de imagen:** Link de imagen (opcional)
   - **Descripción:** Descripción detallada (opcional)
4. Haz clic en "**Publicar**"

El producto aparecerá inmediatamente en "Mis publicaciones" y en las secciones principales.

### 9. Mis Publicaciones

- Ve a "**Mis publicaciones**" para ver solo tus productos
- Estos productos también aparecen en "**Inicio**" bajo "Publicado por ti"

### 10. Contactar Vendedor

Para contactar al vendedor de un producto:

1. Abre el modal del producto
2. Haz clic en "**Contactar vendedor**"
3. Se abrirá WhatsApp con un mensaje pre-escrito

**Nota:** El número de WhatsApp es configurable en `app.js` línea 107 y `favoritos.js` línea 78.

### 11. Editar Perfil

1. Haz clic en tu icono de perfil
2. Selecciona "**Editar Perfil**"
3. Puedes cambiar:
   - Nombre de usuario
   - Contraseña o PIN
4. Guarda los cambios

### 12. Cerrar Sesión

- Opción 1: Haz clic en "**Salir**" en el sidebar
- Opción 2: Haz clic en tu perfil y selecciona "Salir"

---

## ✨ Características Implementadas

### 🎨 Diseño UVG
- ✅ Colores oficiales de la Universidad del Valle de Guatemala
- ✅ Barra superior verde UVG (#078b45)
- ✅ Sidebar gris opaco (#5a6270)
- ✅ Logo adaptado y posicionado correctamente
- ✅ Iconos reorganizados en la topbar

### 🌟 Funcionalidades Principales
- ✅ Sistema de autenticación (usuario + contraseña o PIN)
- ✅ Registro e inicio de sesión
- ✅ Pantalla de bienvenida con animación de desvanecimiento
- ✅ 22 productos de ejemplo con imágenes
- ✅ Sistema de favoritos con persistencia en DB
- ✅ Búsqueda de productos en tiempo real
- ✅ Filtros por categoría
- ✅ Modal de producto con información completa
- ✅ Crear, ver y gestionar publicaciones
- ✅ Dropdown de perfil funcional
- ✅ Integración con WhatsApp
- ✅ Diseño responsive (móvil, tablet, desktop)

### 🗄️ Base de Datos
- ✅ SQLite con 3 tablas (users, products, favorites)
- ✅ 30+ funciones de base de datos documentadas
- ✅ Operaciones CRUD completas
- ✅ Relaciones con Foreign Keys
- ✅ Funciones reutilizables en `db-functions.js`

### 🔐 Seguridad
- ✅ Contraseñas hasheadas con bcrypt
- ✅ Autenticación JWT
- ✅ Validación de entrada
- ✅ Prevención de SQL injection con prepared statements

---

## 📁 Estructura del Proyecto

```
rigocompra/
├── index.html              # Página principal
├── favoritos.html          # Página de favoritos
├── index.css               # Estilos con colores UVG
├── app.js                  # Lógica principal del frontend
├── favoritos.js            # Lógica de favoritos
├── LOGO.png                # Logo de RigoCompra
├── README.md               # Documentación general
├── SETUP-GUIDE.md          # Esta guía
├── DB-FUNCTIONS-GUIDE.md   # Guía de funciones de DB
│
└── backend/
    ├── server.js           # Servidor Express
    ├── database.js         # Configuración de SQLite
    ├── db-functions.js     # Funciones de base de datos
    ├── package.json        # Dependencias
    └── db.sqlite          # Base de datos (se crea automáticamente)
```

---

## 🐛 Solución de Problemas

### El backend no inicia

**Problema:** Error al ejecutar `node server.js`

**Solución:**
```bash
cd backend
npm install
node server.js
```

### No aparecen productos

**Problema:** La página se carga pero no hay productos

**Soluciones:**
1. Verifica que el backend esté corriendo en puerto 5000
2. Abre la consola del navegador (F12) y busca errores de CORS
3. Verifica que la URL de la API en `app.js` sea correcta:
   ```javascript
   const API_URL = 'http://localhost:5000/api';
   ```

### Error de CORS

**Problema:** `Access to fetch at 'http://localhost:5000/api/products' from origin 'null' has been blocked by CORS`

**Solución:** Asegúrate de que el backend tenga CORS habilitado. En `server.js` debe haber:
```javascript
const cors = require('cors');
app.use(cors());
```

### No puedo iniciar sesión

**Problema:** Error al iniciar sesión

**Soluciones:**
1. Verifica que te hayas registrado primero
2. Asegúrate de que el backend esté corriendo
3. Para PIN, usa exactamente 4 dígitos
4. El usuario es case-sensitive

### La pantalla de bienvenida no desaparece

**Solución:** Limpia el sessionStorage y recarga la página:
```javascript
// En la consola del navegador (F12)
sessionStorage.clear();
location.reload();
```

### Las imágenes no cargan

**Problema:** Las imágenes de productos no se ven

**Soluciones:**
1. Verifica tu conexión a internet (las imágenes vienen de Unsplash)
2. Si una imagen específica no carga, la URL puede estar rota
3. Los productos sin imagen muestran un placeholder automáticamente

### Error: Cannot find module 'sqlite3'

**Solución:**
```bash
cd backend
npm install sqlite3 --build-from-source
```

---

## 🔄 Actualizar Productos

Para agregar más productos, edita `backend/database.js` en las líneas 34-258 y reinicia el servidor.

---

## 📞 Configurar WhatsApp

Para cambiar el número de WhatsApp:

1. **En app.js (línea 107):**
   ```javascript
   const phone = '502XXXXXXXX'; // Tu número con código de país
   ```

2. **En favoritos.js (línea 78):**
   ```javascript
   const phone = '502XXXXXXXX'; // El mismo número
   ```

Formato: Código de país + número (sin espacios ni símbolos)
- Ejemplo Guatemala: `50212345678`

---

## 🎓 Funciones de Base de Datos

Para aprender a usar las funciones de base de datos, consulta:
- **`DB-FUNCTIONS-GUIDE.md`** - Guía completa con ejemplos
- **`backend/db-functions.js`** - Código fuente documentado

---

## 📊 Categorías Disponibles

1. **Ropa** - Prendas de vestir, zapatos, accesorios
2. **Comida** - Alimentos, bebidas, productos comestibles
3. **Tecnología** - Electrónicos, gadgets, computadoras
4. **Hogar** - Muebles, decoración, electrodomésticos
5. **Servicios** - Tutorías, servicios, otros

---

## 🚀 Siguientes Pasos (Opcional)

Para expandir la aplicación:

1. **Agregar imágenes locales:** Coloca imágenes en una carpeta `/images`
2. **Modo oscuro:** Implementar toggle de tema
3. **Notificaciones:** Sistema de notificaciones push
4. **Chat en vivo:** Integrar chat entre usuarios
5. **Valoraciones:** Sistema de ratings para productos
6. **Deploy:** Subir a Vercel, Netlify o Heroku

---

## 📝 Créditos

- **Proyecto:** RigoCompra - Marketplace Universitario UVG
- **Colores:** Universidad del Valle de Guatemala
- **Iconos:** Boxicons (https://boxicons.com)
- **Imágenes:** Unsplash (https://unsplash.com)
- **Stack:** HTML5, CSS3, JavaScript, Node.js, Express, SQLite

---

## 📄 Licencia

Este proyecto fue desarrollado con fines educativos para la Universidad del Valle de Guatemala.

---

**¡Listo para usar RigoCompra! 🎉**

Si tienes problemas, revisa:
1. Esta guía de configuración
2. La guía de funciones de base de datos (DB-FUNCTIONS-GUIDE.md)
3. El README.md principal
4. La consola del navegador (F12) para ver errores

---

**Última actualización:** Noviembre 2025
