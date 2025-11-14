/*
 * User Data Access Object (DAO)
 *
 * Este módulo implementa un DAO simple para gestionar usuarios.  En lugar de
 * utilizar una base de datos real, mantiene los usuarios en memoria mediante
 * un mapa.  Se utiliza el módulo built‑in `crypto` de Node para generar
 * un hash seguro de la contraseña y una sal aleatoria.  Aunque el README
 * del repositorio menciona bcrypt, la red no está disponible para instalar
 * dependencias externas, por lo que se opta por la función `scrypt` de
 * Node.js que también es apropiada para almacenar contraseñas de forma
 * segura.
 */

const crypto = require('crypto');

/**
 * Genera una sal aleatoria y calcula un hash de contraseña usando scrypt.
 *
 * @param {string} password La contraseña en texto plano.
 * @returns {Promise<{salt: string, hash: string}>} Un objeto con la sal y el hash.
 */
async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const keyLen = 64;
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, keyLen, (err, derivedKey) => {
      if (err) return reject(err);
      resolve({ salt, hash: derivedKey.toString('hex') });
    });
  });
}

/**
 * Verifica una contraseña comparando el hash calculado con el hash almacenado.
 *
 * @param {string} password Contraseña en texto plano proporcionada por el usuario.
 * @param {string} salt Sal almacenada con el usuario.
 * @param {string} hash Hash almacenado con el usuario.
 * @returns {Promise<boolean>} true si la contraseña es válida, en caso contrario false.
 */
async function verifyPassword(password, salt, hash) {
  const keyLen = 64;
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, keyLen, (err, derivedKey) => {
      if (err) return reject(err);
      const newHash = derivedKey.toString('hex');
      resolve(crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(newHash, 'hex')));
    });
  });
}

/**
 * Clase UserDAO: gestiona usuarios en memoria con métodos de creación,
 * consulta y verificación de credenciales.
 */
class UserDAO {
  constructor() {
    // Mapa de usuarios indexado por email
    this.users = new Map();
  }

  /**
   * Crea un nuevo usuario.  Lanza un error si ya existe el email.
   *
   * @param {string} email Correo del nuevo usuario.
   * @param {string} password Contraseña en texto plano.
   * @param {object} [extra={}] Campos adicionales a almacenar en el usuario.
   * @returns {Promise<object>} Objeto de usuario almacenado (sin contraseña en texto).
   */
  async createUser(email, password, extra = {}) {
    if (this.users.has(email)) {
      throw new Error('El usuario ya existe');
    }
    const { salt, hash } = await hashPassword(password);
    const user = { email, salt, passwordHash: hash, ...extra };
    this.users.set(email, user);
    return { ...user, passwordHash: undefined, salt: undefined };
  }

  /**
   * Busca un usuario por email.
   *
   * @param {string} email Correo a buscar.
   * @returns {object|undefined} Objeto de usuario o undefined si no existe.
   */
  findByEmail(email) {
    return this.users.get(email);
  }

  /**
   * Verifica la contraseña de un usuario.  Devuelve true si coincide.
   *
   * @param {string} email Correo del usuario.
   * @param {string} password Contraseña en texto plano proporcionada por el usuario.
   * @returns {Promise<boolean>} true si la contraseña es válida.
   */
  async verifyPassword(email, password) {
    const user = this.users.get(email);
    if (!user) return false;
    return await verifyPassword(password, user.salt, user.passwordHash);
  }
}

module.exports = { UserDAO, hashPassword, verifyPassword };
