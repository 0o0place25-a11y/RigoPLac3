/**
 * DB-FUNCTIONS.JS
 * Funciones para manejo de base de datos
 * Este archivo contiene funciones reutilizables para operaciones CRUD
 * Requerido por el catedrático para demostrar uso de funciones en base de datos
 */

const db = require('./database');

// ========================================
// FUNCIONES DE USUARIOS / USER FUNCTIONS
// ========================================

/**
 * Buscar usuario por nombre de usuario
 * @param {string} nombre_usuario - Nombre de usuario a buscar
 * @returns {Promise} - Promesa que resuelve con el usuario encontrado
 */
function findUserByUsername(nombre_usuario) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE nombre_usuario = ?', [nombre_usuario], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

/**
 * Buscar usuario por ID
 * @param {number} id - ID del usuario
 * @returns {Promise} - Promesa que resuelve con el usuario encontrado
 */
function findUserById(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

/**
 * Crear nuevo usuario
 * @param {string} nombre_usuario - Nombre de usuario
 * @param {string} password_hash - Hash de la contraseña
 * @param {string} codigo_pin_hash - Hash del PIN
 * @returns {Promise} - Promesa que resuelve con el ID del nuevo usuario
 */
function createUser(nombre_usuario, password_hash, codigo_pin_hash) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (nombre_usuario, password_hash, codigo_pin_hash) VALUES (?, ?, ?)',
      [nombre_usuario, password_hash, codigo_pin_hash],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
}

/**
 * Actualizar información de usuario
 * @param {number} id - ID del usuario
 * @param {string} nombre_usuario - Nuevo nombre de usuario
 * @param {string} password_hash - Nuevo hash de contraseña (opcional)
 * @param {string} codigo_pin_hash - Nuevo hash de PIN (opcional)
 * @returns {Promise} - Promesa que resuelve cuando se actualiza
 */
function updateUser(id, nombre_usuario, password_hash, codigo_pin_hash) {
  return new Promise((resolve, reject) => {
    let query = 'UPDATE users SET nombre_usuario = ?';
    const params = [nombre_usuario];

    if (password_hash) {
      query += ', password_hash = ?';
      params.push(password_hash);
    }

    if (codigo_pin_hash) {
      query += ', codigo_pin_hash = ?';
      params.push(codigo_pin_hash);
    }

    query += ' WHERE id = ?';
    params.push(id);

    db.run(query, params, function(err) {
      if (err) reject(err);
      else resolve(this.changes);
    });
  });
}

/**
 * Eliminar usuario
 * @param {number} id - ID del usuario a eliminar
 * @returns {Promise} - Promesa que resuelve cuando se elimina
 */
function deleteUser(id) {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
      if (err) reject(err);
      else resolve(this.changes);
    });
  });
}

// ========================================
// FUNCIONES DE PRODUCTOS / PRODUCT FUNCTIONS
// ========================================

/**
 * Obtener todos los productos
 * @returns {Promise} - Promesa que resuelve con array de productos
 */
function getAllProducts() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

/**
 * Buscar producto por ID
 * @param {string} id - ID del producto
 * @returns {Promise} - Promesa que resuelve con el producto encontrado
 */
function findProductById(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

/**
 * Obtener productos por usuario
 * @param {number} user_id - ID del usuario
 * @returns {Promise} - Promesa que resuelve con array de productos
 */
function getProductsByUser(user_id) {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM products WHERE user_id = ?', [user_id], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

/**
 * Obtener productos por categoría
 * @param {string} category - Categoría a filtrar
 * @returns {Promise} - Promesa que resuelve con array de productos
 */
function getProductsByCategory(category) {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM products WHERE category = ?', [category], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

/**
 * Buscar productos por término de búsqueda
 * @param {string} searchTerm - Término de búsqueda
 * @returns {Promise} - Promesa que resuelve con array de productos
 */
function searchProducts(searchTerm) {
  return new Promise((resolve, reject) => {
    const term = `%${searchTerm}%`;
    db.all(
      'SELECT * FROM products WHERE title LIKE ? OR description LIKE ? OR city LIKE ?',
      [term, term, term],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}

/**
 * Crear nuevo producto
 * @param {Object} product - Objeto con datos del producto
 * @returns {Promise} - Promesa que resuelve cuando se crea
 */
function createProduct(product) {
  return new Promise((resolve, reject) => {
    const { id, title, price, city, category, image, description, condition, user_id } = product;
    db.run(
      'INSERT INTO products (id, title, price, city, category, image, description, condition, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, title, price, city, category, image, description, condition, user_id],
      function(err) {
        if (err) reject(err);
        else resolve(id);
      }
    );
  });
}

/**
 * Actualizar producto
 * @param {string} id - ID del producto
 * @param {Object} updates - Objeto con campos a actualizar
 * @returns {Promise} - Promesa que resuelve cuando se actualiza
 */
function updateProduct(id, updates) {
  return new Promise((resolve, reject) => {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map(field => `${field} = ?`).join(', ');

    db.run(
      `UPDATE products SET ${setClause} WHERE id = ?`,
      [...values, id],
      function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      }
    );
  });
}

/**
 * Eliminar producto
 * @param {string} id - ID del producto a eliminar
 * @returns {Promise} - Promesa que resuelve cuando se elimina
 */
function deleteProduct(id) {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
      if (err) reject(err);
      else resolve(this.changes);
    });
  });
}

// ========================================
// FUNCIONES DE FAVORITOS / FAVORITES FUNCTIONS
// ========================================

/**
 * Obtener favoritos de un usuario
 * @param {number} user_id - ID del usuario
 * @returns {Promise} - Promesa que resuelve con array de product_ids
 */
function getUserFavorites(user_id) {
  return new Promise((resolve, reject) => {
    db.all('SELECT product_id FROM favorites WHERE user_id = ?', [user_id], (err, rows) => {
      if (err) reject(err);
      else resolve(rows.map(row => row.product_id));
    });
  });
}

/**
 * Agregar producto a favoritos
 * @param {number} user_id - ID del usuario
 * @param {string} product_id - ID del producto
 * @returns {Promise} - Promesa que resuelve cuando se agrega
 */
function addToFavorites(user_id, product_id) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO favorites (user_id, product_id) VALUES (?, ?)', [user_id, product_id], function(err) {
      if (err) reject(err);
      else resolve(true);
    });
  });
}

/**
 * Quitar producto de favoritos
 * @param {number} user_id - ID del usuario
 * @param {string} product_id - ID del producto
 * @returns {Promise} - Promesa que resuelve cuando se elimina
 */
function removeFromFavorites(user_id, product_id) {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM favorites WHERE user_id = ? AND product_id = ?', [user_id, product_id], function(err) {
      if (err) reject(err);
      else resolve(this.changes);
    });
  });
}

/**
 * Verificar si un producto está en favoritos
 * @param {number} user_id - ID del usuario
 * @param {string} product_id - ID del producto
 * @returns {Promise} - Promesa que resuelve con boolean
 */
function isFavorite(user_id, product_id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM favorites WHERE user_id = ? AND product_id = ?', [user_id, product_id], (err, row) => {
      if (err) reject(err);
      else resolve(!!row);
    });
  });
}

/**
 * Obtener productos favoritos con información completa
 * @param {number} user_id - ID del usuario
 * @returns {Promise} - Promesa que resuelve con array de productos
 */
function getFavoriteProducts(user_id) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT p.* FROM products p
       INNER JOIN favorites f ON p.id = f.product_id
       WHERE f.user_id = ?`,
      [user_id],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}

// ========================================
// FUNCIONES DE ESTADÍSTICAS / STATISTICS FUNCTIONS
// ========================================

/**
 * Contar total de productos
 * @returns {Promise} - Promesa que resuelve con el conteo
 */
function countProducts() {
  return new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) as count FROM products', [], (err, row) => {
      if (err) reject(err);
      else resolve(row.count);
    });
  });
}

/**
 * Contar productos por usuario
 * @param {number} user_id - ID del usuario
 * @returns {Promise} - Promesa que resuelve con el conteo
 */
function countProductsByUser(user_id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) as count FROM products WHERE user_id = ?', [user_id], (err, row) => {
      if (err) reject(err);
      else resolve(row.count);
    });
  });
}

/**
 * Obtener productos más recientes
 * @param {number} limit - Número de productos a retornar
 * @returns {Promise} - Promesa que resuelve con array de productos
 */
function getRecentProducts(limit = 10) {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM products ORDER BY id DESC LIMIT ?', [limit], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Exportar todas las funciones
module.exports = {
  // User functions
  findUserByUsername,
  findUserById,
  createUser,
  updateUser,
  deleteUser,

  // Product functions
  getAllProducts,
  findProductById,
  getProductsByUser,
  getProductsByCategory,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,

  // Favorites functions
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
  getFavoriteProducts,

  // Statistics functions
  countProducts,
  countProductsByUser,
  getRecentProducts
};
