/*
 * Pruebas unitarias para UserDAO
 *
 * Estas pruebas validan los métodos createUser, findByEmail y verifyPassword.
 * Se utilizan las aserciones estándar de Node (assert) para comprobar que
 * las funciones se comportan correctamente.  Ejecuta este archivo con
 * `node userDAO.test.js` para ver los resultados.
 */

const assert = require('assert');
const { UserDAO } = require('./userDAO');

async function runTests() {
  const dao = new UserDAO();

  // Prueba: crear usuario nuevo
  const userData = await dao.createUser('test@example.com', 'Password123', { nombre: 'Test' });
  assert.strictEqual(userData.email, 'test@example.com');
  assert.strictEqual(userData.nombre, 'Test');
  assert.strictEqual(userData.passwordHash, undefined);
  assert.strictEqual(userData.salt, undefined);

  // Prueba: buscar usuario existente
  const found = dao.findByEmail('test@example.com');
  assert.ok(found, 'El usuario debería existir');
  assert.strictEqual(found.email, 'test@example.com');
  assert.ok(found.passwordHash, 'El usuario debería tener passwordHash');

  // Prueba: verificar contraseña correcta
  const isValid = await dao.verifyPassword('test@example.com', 'Password123');
  assert.strictEqual(isValid, true, 'La contraseña debería ser válida');

  // Prueba: contraseña incorrecta
  const isInvalid = await dao.verifyPassword('test@example.com', 'WrongPassword');
  assert.strictEqual(isInvalid, false, 'La contraseña debería ser inválida');

  // Prueba: crear usuario duplicado debe fallar
  let errorCaught = false;
  try {
    await dao.createUser('test@example.com', 'AnotherPass');
  } catch (err) {
    errorCaught = true;
    assert.strictEqual(err.message, 'El usuario ya existe');
  }
  assert.ok(errorCaught, 'Debería lanzar un error al crear un usuario duplicado');

  console.log('Todas las pruebas pasaron');
}

runTests().catch((err) => {
  console.error('Error en pruebas:', err);
  process.exit(1);
});