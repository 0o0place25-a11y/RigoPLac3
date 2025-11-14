/*
 * Basic tests for authMiddleware.js
 *
 * These tests verify that the middleware correctly decodes JWTs,
 * attaches the user to the request object, enforces expiration and
 * role checks, and rejects invalid tokens.  To run the tests, use
 * `node authMiddleware.test.js` from the project root.  Successful
 * execution will print messages indicating each test has passed.
 */

const assert = require('assert');
const crypto = require('crypto');

const {
  authenticateJWT,
  requireRole,
  verifyToken,
  toBase64Url,
} = require('./authMiddleware');

// Helper to create a signed JWT using HS256 for testing
function createToken(payload, secret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = toBase64Url(Buffer.from(JSON.stringify(header)).toString('base64'));
  const encodedPayload = toBase64Url(Buffer.from(JSON.stringify(payload)).toString('base64'));
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto.createHmac('sha256', secret).update(signingInput).digest('base64');
  const encodedSig = toBase64Url(signature);
  return `${encodedHeader}.${encodedPayload}.${encodedSig}`;
}

// Test secret
const secret = 'test-secret';

// Create a valid token with future expiration
const validPayload = {
  email: 'user@example.com',
  role: 'admin',
  exp: Math.floor(Date.now() / 1000) + 3600, // expires in 1 hour
};
const validToken = createToken(validPayload, secret);

// Create an expired token
const expiredPayload = {
  email: 'user@example.com',
  role: 'admin',
  exp: Math.floor(Date.now() / 1000) - 3600, // expired 1 hour ago
};
const expiredToken = createToken(expiredPayload, secret);

// Test verifyToken directly
(() => {
  const decoded = verifyToken(validToken, secret);
  assert.strictEqual(decoded.email, validPayload.email, 'verifyToken should decode the email');
  assert.strictEqual(decoded.role, validPayload.role, 'verifyToken should decode the role');
  console.log('✅ verifyToken decodes valid token correctly');
})();

// Test middleware attach user on valid token
(() => {
  const middleware = authenticateJWT(secret);
  const req = { headers: { Authorization: `Bearer ${validToken}` } };
  // Minimal response mock
  const res = {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(obj) { this.body = obj; return this; },
  };
  let nextCalled = false;
  middleware(req, res, () => { nextCalled = true; });
  assert.strictEqual(nextCalled, true, 'authenticateJWT should call next() for valid token');
  assert(req.user, 'authenticateJWT should attach user');
  assert.strictEqual(req.user.email, validPayload.email, 'req.user.email matches payload');
  console.log('✅ authenticateJWT attaches user and calls next for valid token');
})();

// Test middleware rejects expired token
(() => {
  const middleware = authenticateJWT(secret);
  const req = { headers: { authorization: `Bearer ${expiredToken}` } };
  const res = {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(obj) { this.body = obj; return this; },
  };
  middleware(req, res, () => {});
  assert.strictEqual(res.statusCode, 401, 'authenticateJWT should return 401 for expired token');
  console.log('✅ authenticateJWT rejects expired token');
})();

// Test requireRole allows admin
(() => {
  const middleware = requireRole('admin');
  const req = { user: { role: 'admin' } };
  const res = {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(obj) { this.body = obj; return this; },
  };
  let nextCalled = false;
  middleware(req, res, () => { nextCalled = true; });
  assert.strictEqual(nextCalled, true, 'requireRole should call next() when role matches');
  console.log('✅ requireRole allows matching role');
})();

// Test requireRole rejects other role
(() => {
  const middleware = requireRole('admin');
  const req = { user: { role: 'user' } };
  const res = {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(obj) { this.body = obj; return this; },
  };
  middleware(req, res, () => {});
  assert.strictEqual(res.statusCode, 403, 'requireRole should return 403 when role does not match');
  console.log('✅ requireRole rejects non‑matching role');
})();