# 📚 Guía de Funciones de Base de Datos - RigoCompra

## 📌 Introducción

Este documento describe todas las funciones disponibles para el manejo de la base de datos SQLite en RigoCompra. Estas funciones fueron implementadas según los requerimientos del catedrático para demostrar el uso correcto de funciones en operaciones de base de datos.

## 🗄️ Estructura de la Base de Datos

### Tablas

#### 1. **users** (Usuarios)
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre_usuario TEXT UNIQUE,
  password_hash TEXT,
  codigo_pin_hash TEXT
)
```

#### 2. **products** (Productos)
```sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  title TEXT,
  price REAL,
  city TEXT,
  category TEXT,
  image TEXT,
  description TEXT,
  condition TEXT,
  user_id INTEGER,
  FOREIGN KEY(user_id) REFERENCES users(id)
)
```

#### 3. **favorites** (Favoritos)
```sql
CREATE TABLE favorites (
  user_id INTEGER,
  product_id TEXT,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(product_id) REFERENCES products(id),
  PRIMARY KEY(user_id, product_id)
)
```

## 🔧 Funciones Disponibles

### 👤 Funciones de Usuarios

#### `findUserByUsername(nombre_usuario)`
Busca un usuario por su nombre de usuario.

**Parámetros:**
- `nombre_usuario` (string): Nombre de usuario a buscar

**Retorna:** Promise que resuelve con el objeto usuario o null

**Ejemplo:**
```javascript
const user = await findUserByUsername('juan123');
console.log(user); // { id: 1, nombre_usuario: 'juan123', ... }
```

---

#### `findUserById(id)`
Busca un usuario por su ID.

**Parámetros:**
- `id` (number): ID del usuario

**Retorna:** Promise que resuelve con el objeto usuario o null

**Ejemplo:**
```javascript
const user = await findUserById(1);
console.log(user);
```

---

#### `createUser(nombre_usuario, password_hash, codigo_pin_hash)`
Crea un nuevo usuario en la base de datos.

**Parámetros:**
- `nombre_usuario` (string): Nombre de usuario único
- `password_hash` (string): Hash de la contraseña (opcional)
- `codigo_pin_hash` (string): Hash del PIN (opcional)

**Retorna:** Promise que resuelve con el ID del nuevo usuario

**Ejemplo:**
```javascript
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync('miPassword123', salt);
const userId = await createUser('juan123', hash, null);
console.log(`Usuario creado con ID: ${userId}`);
```

---

#### `updateUser(id, nombre_usuario, password_hash, codigo_pin_hash)`
Actualiza la información de un usuario existente.

**Parámetros:**
- `id` (number): ID del usuario
- `nombre_usuario` (string): Nuevo nombre de usuario
- `password_hash` (string): Nuevo hash de contraseña (opcional)
- `codigo_pin_hash` (string): Nuevo hash de PIN (opcional)

**Retorna:** Promise que resuelve con el número de filas actualizadas

**Ejemplo:**
```javascript
const changes = await updateUser(1, 'juan_nuevo', null, pinHash);
console.log(`${changes} filas actualizadas`);
```

---

#### `deleteUser(id)`
Elimina un usuario de la base de datos.

**Parámetros:**
- `id` (number): ID del usuario a eliminar

**Retorna:** Promise que resuelve con el número de filas eliminadas

**Ejemplo:**
```javascript
const changes = await deleteUser(5);
console.log(`Usuario eliminado`);
```

---

### 🛍️ Funciones de Productos

#### `getAllProducts()`
Obtiene todos los productos de la base de datos.

**Retorna:** Promise que resuelve con array de productos

**Ejemplo:**
```javascript
const products = await getAllProducts();
console.log(`Total de productos: ${products.length}`);
```

---

#### `findProductById(id)`
Busca un producto específico por su ID.

**Parámetros:**
- `id` (string): ID del producto

**Retorna:** Promise que resuelve con el objeto producto o null

**Ejemplo:**
```javascript
const product = await findProductById('123');
console.log(product.title);
```

---

#### `getProductsByUser(user_id)`
Obtiene todos los productos publicados por un usuario específico.

**Parámetros:**
- `user_id` (number): ID del usuario

**Retorna:** Promise que resuelve con array de productos

**Ejemplo:**
```javascript
const myProducts = await getProductsByUser(1);
console.log(`Tienes ${myProducts.length} productos publicados`);
```

---

#### `getProductsByCategory(category)`
Filtra productos por categoría.

**Parámetros:**
- `category` (string): Categoría a filtrar (Ropa, Comida, Tecnología, Hogar, Servicios)

**Retorna:** Promise que resuelve con array de productos

**Ejemplo:**
```javascript
const techProducts = await getProductsByCategory('Tecnología');
console.log(`Productos de tecnología: ${techProducts.length}`);
```

---

#### `searchProducts(searchTerm)`
Busca productos por término de búsqueda en título, descripción o ciudad.

**Parámetros:**
- `searchTerm` (string): Término de búsqueda

**Retorna:** Promise que resuelve con array de productos coincidentes

**Ejemplo:**
```javascript
const results = await searchProducts('laptop');
console.log(`Se encontraron ${results.length} resultados`);
```

---

#### `createProduct(product)`
Crea un nuevo producto en la base de datos.

**Parámetros:**
- `product` (object): Objeto con datos del producto
  ```javascript
  {
    id: string,           // ID único del producto
    title: string,        // Título del producto
    price: number,        // Precio en quetzales
    city: string,         // Ciudad
    category: string,     // Categoría
    image: string,        // URL de imagen (opcional)
    description: string,  // Descripción (opcional)
    condition: string,    // Condición del producto (opcional)
    user_id: number       // ID del usuario que publica
  }
  ```

**Retorna:** Promise que resuelve con el ID del producto creado

**Ejemplo:**
```javascript
const newProduct = {
  id: crypto.randomUUID(),
  title: 'iPhone 13',
  price: 5000,
  city: 'Guatemala',
  category: 'Tecnología',
  image: 'https://example.com/iphone.jpg',
  description: 'iPhone 13 en perfectas condiciones',
  condition: 'Usado - Como nuevo',
  user_id: 1
};

const productId = await createProduct(newProduct);
console.log(`Producto creado: ${productId}`);
```

---

#### `updateProduct(id, updates)`
Actualiza campos de un producto existente.

**Parámetros:**
- `id` (string): ID del producto
- `updates` (object): Objeto con campos a actualizar

**Retorna:** Promise que resuelve con el número de filas actualizadas

**Ejemplo:**
```javascript
const changes = await updateProduct('123', {
  price: 4500,
  condition: 'Usado - Buen estado'
});
console.log(`Producto actualizado`);
```

---

#### `deleteProduct(id)`
Elimina un producto de la base de datos.

**Parámetros:**
- `id` (string): ID del producto a eliminar

**Retorna:** Promise que resuelve con el número de filas eliminadas

**Ejemplo:**
```javascript
await deleteProduct('123');
console.log(`Producto eliminado`);
```

---

### ❤️ Funciones de Favoritos

#### `getUserFavorites(user_id)`
Obtiene los IDs de productos favoritos de un usuario.

**Parámetros:**
- `user_id` (number): ID del usuario

**Retorna:** Promise que resuelve con array de product IDs

**Ejemplo:**
```javascript
const favorites = await getUserFavorites(1);
console.log(`Tienes ${favorites.length} favoritos`);
```

---

#### `addToFavorites(user_id, product_id)`
Agrega un producto a los favoritos del usuario.

**Parámetros:**
- `user_id` (number): ID del usuario
- `product_id` (string): ID del producto

**Retorna:** Promise que resuelve con true

**Ejemplo:**
```javascript
await addToFavorites(1, '123');
console.log(`Producto agregado a favoritos`);
```

---

#### `removeFromFavorites(user_id, product_id)`
Quita un producto de los favoritos del usuario.

**Parámetros:**
- `user_id` (number): ID del usuario
- `product_id` (string): ID del producto

**Retorna:** Promise que resuelve con el número de filas eliminadas

**Ejemplo:**
```javascript
await removeFromFavorites(1, '123');
console.log(`Producto quitado de favoritos`);
```

---

#### `isFavorite(user_id, product_id)`
Verifica si un producto está en los favoritos del usuario.

**Parámetros:**
- `user_id` (number): ID del usuario
- `product_id` (string): ID del producto

**Retorna:** Promise que resuelve con boolean

**Ejemplo:**
```javascript
const isFav = await isFavorite(1, '123');
if (isFav) {
  console.log('Este producto está en tus favoritos');
}
```

---

#### `getFavoriteProducts(user_id)`
Obtiene información completa de los productos favoritos del usuario.

**Parámetros:**
- `user_id` (number): ID del usuario

**Retorna:** Promise que resuelve con array de productos completos

**Ejemplo:**
```javascript
const favoriteProducts = await getFavoriteProducts(1);
favoriteProducts.forEach(p => {
  console.log(`${p.title} - Q${p.price}`);
});
```

---

### 📊 Funciones de Estadísticas

#### `countProducts()`
Cuenta el total de productos en la base de datos.

**Retorna:** Promise que resuelve con el número total de productos

**Ejemplo:**
```javascript
const total = await countProducts();
console.log(`Total de productos: ${total}`);
```

---

#### `countProductsByUser(user_id)`
Cuenta los productos publicados por un usuario específico.

**Parámetros:**
- `user_id` (number): ID del usuario

**Retorna:** Promise que resuelve con el número de productos del usuario

**Ejemplo:**
```javascript
const count = await countProductsByUser(1);
console.log(`Has publicado ${count} productos`);
```

---

#### `getRecentProducts(limit)`
Obtiene los productos más recientes.

**Parámetros:**
- `limit` (number): Número de productos a retornar (default: 10)

**Retorna:** Promise que resuelve con array de productos

**Ejemplo:**
```javascript
const recent = await getRecentProducts(5);
console.log('Últimos 5 productos:');
recent.forEach(p => console.log(p.title));
```

---

## 💻 Uso en el Servidor

Las funciones están exportadas desde `db-functions.js` y se pueden usar en el servidor:

```javascript
const dbFunctions = require('./db-functions');

// Ejemplo en una ruta de Express
app.get('/api/products/search', async (req, res) => {
  try {
    const { q } = req.query;
    const results = await dbFunctions.searchProducts(q);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 🔐 Seguridad

### Hashing de Contraseñas y PINs

Siempre usa bcrypt para hashear contraseñas y PINs:

```javascript
const bcrypt = require('bcryptjs');

// Crear hash
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync('miPassword', salt);

// Verificar
const isValid = bcrypt.compareSync('miPassword', hash);
```

### Validación de Entrada

Siempre valida los datos antes de pasarlos a las funciones:

```javascript
if (!nombre_usuario || !password) {
  return res.status(400).json({ error: 'Campos requeridos' });
}

if (nombre_usuario.length < 3) {
  return res.status(400).json({ error: 'Username muy corto' });
}
```

## 📖 Ejemplos Completos

### Ejemplo 1: Registro de Usuario
```javascript
const { createUser } = require('./db-functions');
const bcrypt = require('bcryptjs');

async function registerUser(username, password) {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const userId = await createUser(username, hash, null);
    console.log(`Usuario ${username} creado con ID: ${userId}`);
    return userId;
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
}
```

### Ejemplo 2: Buscar Productos de un Usuario
```javascript
const { getProductsByUser, countProductsByUser } = require('./db-functions');

async function getUserProductsInfo(userId) {
  try {
    const products = await getProductsByUser(userId);
    const count = await countProductsByUser(userId);

    console.log(`Usuario tiene ${count} productos:`);
    products.forEach(p => {
      console.log(`- ${p.title}: Q${p.price}`);
    });

    return { products, count };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

### Ejemplo 3: Sistema de Favoritos
```javascript
const { addToFavorites, isFavorite, getFavoriteProducts } = require('./db-functions');

async function toggleFavorite(userId, productId) {
  try {
    const isCurrentlyFav = await isFavorite(userId, productId);

    if (isCurrentlyFav) {
      await removeFromFavorites(userId, productId);
      console.log('Producto quitado de favoritos');
    } else {
      await addToFavorites(userId, productId);
      console.log('Producto agregado a favoritos');
    }

    // Mostrar todos los favoritos
    const favorites = await getFavoriteProducts(userId);
    console.log(`Ahora tienes ${favorites.length} favoritos`);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

## 📝 Notas Importantes

1. **Todas las funciones retornan Promises** - Usa `async/await` o `.then()/.catch()`

2. **Manejo de errores** - Siempre usa try/catch o .catch() para manejar errores

3. **IDs únicos** - Los productos usan UUIDs generados con `crypto.randomUUID()`

4. **Foreign Keys** - La base de datos mantiene integridad referencial automáticamente

5. **Transacciones** - Para operaciones complejas, considera usar transacciones SQLite

## 🎓 Conceptos Demostrados

Estas funciones demuestran:
- ✅ Uso de callbacks y Promises
- ✅ Patrón de diseño Repository
- ✅ Separación de concerns (lógica de DB separada del servidor)
- ✅ Reutilización de código
- ✅ Documentación completa
- ✅ Manejo de errores
- ✅ Operaciones CRUD completas
- ✅ Queries complejas con JOINs
- ✅ Parámetros preparados para prevenir SQL injection

---

**Desarrollado para:** RigoCompra - Marketplace UVG
**Archivo:** `backend/db-functions.js`
**Última actualización:** Noviembre 2025
