/*
 * Authentication and route‑protection middleware for Express.
 *
 * This module provides functions for verifying JSON Web Tokens (JWTs)
 * without relying on external libraries.  Tokens signed with the
 * HS256 algorithm (HMAC‑SHA256) can be decoded and verified by
 * computing the signature using the provided secret.  When valid,
 * the decoded payload is attached to `req.user` so that downstream
 * handlers can access user information.  A convenience middleware
 * `requireRole` is also exported to guard routes that require a
 * specific user role (e.g. "admin").
 *
 * Example usage in an Express application:
 *
 *   const express = require('express');
 *   const { authenticateJWT, requireRole } = require('./authMiddleware');
 *   const app = express();
 *
 *   const jwtSecret = process.env.JWT_SECRET || 'super‑secret';
 *
 *   // Protect all routes below this point and attach req.user
 *   app.use(authenticateJWT(jwtSecret));
 *
 *   // Example of protecting an admin route
 *   app.get('/admin', requireRole('admin'), (req, res) => {
 *     res.json({ message: `Hello, ${req.user.email} (admin)!` });
 *   });
 *
 *   app.listen(3000, () => console.log('Server running on 3000'));
 */

const crypto = require('crypto');

/**
 * Create a middleware function that verifies a JWT from the
 * Authorization header and attaches the decoded payload to req.user.
 *
 * The token must be provided in the format `Bearer <token>`.
 * Only tokens signed with HS256 are supported.  If the token is
 * invalid, expired, or missing, a 401 response is sent.
 *
 * @param {string} secret - Secret key used for verifying the token signature.
 * @returns {import('express').RequestHandler} Express middleware.
 */
function authenticateJWT(secret) {
  return function jwtMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader || typeof authHeader !== 'string') {
      return res.status(401).json({ message: 'Missing Authorization header' });
    }
    const parts = authHeader.trim().split(/\s+/);
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Invalid Authorization header format' });
    }
    const token = parts[1];
    let payload;
    try {
      payload = verifyToken(token, secret);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    // Check expiration if present (exp is in seconds since epoch)
    if (payload && typeof payload.exp === 'number') {
      const nowMs = Date.now();
      if (nowMs >= payload.exp * 1000) {
        return res.status(401).json({ message: 'Token expired' });
      }
    }
    // Attach decoded payload to req.user and proceed
    req.user = payload;
    return next();
  };
}

/**
 * Create a middleware that checks the role of the authenticated user.
 *
 * If `req.user.role` matches the required role, the request is
 * allowed to continue.  Otherwise, a 403 Forbidden response is sent.
 *
 * @param {string} role - Required role (e.g. 'admin').
 * @returns {import('express').RequestHandler} Express middleware.
 */
function requireRole(role) {
  return function roleMiddleware(req, res, next) {
    if (!req.user || typeof req.user.role !== 'string') {
      return res.status(403).json({ message: 'Forbidden: missing user role' });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Forbidden: insufficient privileges' });
    }
    return next();
  };
}

/**
 * Verify a JWT using HS256.
 *
 * Decodes the token header and payload, verifies the signature using
 * the provided secret, and returns the payload as an object.  If the
 * token is malformed, signed with an unsupported algorithm, or the
 * signature does not match, an error is thrown.
 *
 * @param {string} token - The JWT to verify.
 * @param {string} secret - Secret key used for verifying the HMAC signature.
 * @returns {Object} Decoded payload.
 */
function verifyToken(token, secret) {
  const segments = token.split('.');
  if (segments.length !== 3) {
    throw new Error('Token must have header, payload and signature');
  }
  const [encodedHeader, encodedPayload, encodedSignature] = segments;
  // Decode header and payload
  let header, payload;
  try {
    header = JSON.parse(base64UrlDecode(encodedHeader));
    payload = JSON.parse(base64UrlDecode(encodedPayload));
  } catch (err) {
    throw new Error('Invalid JSON in token');
  }
  // Ensure HS256 algorithm
  const alg = header.alg;
  if (alg !== 'HS256') {
    throw new Error(`Unsupported algorithm: ${alg}`);
  }
  // Reconstruct signing input and compute expected signature
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const hmac = crypto.createHmac('sha256', secret).update(signingInput).digest('base64');
  const expectedSignature = toBase64Url(hmac);
  // Constant‑time comparison to prevent timing attacks
  if (!timingSafeEqual(expectedSignature, encodedSignature)) {
    throw new Error('Signature verification failed');
  }
  return payload;
}

/**
 * Convert a base64 string to a base64url string by replacing
 * characters and stripping padding.
 *
 * @param {string} base64 - Standard base64 encoded string.
 * @returns {string} base64url encoded string.
 */
function toBase64Url(base64) {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Decode a base64url string into a UTF‑8 string.
 *
 * @param {string} str - Base64url encoded string.
 * @returns {string} Decoded UTF‑8 string.
 */
function base64UrlDecode(str) {
  // Replace url‑safe characters with base64 characters
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  // Pad with '=' to make the length a multiple of 4
  const pad = base64.length % 4;
  if (pad) {
    base64 += '='.repeat(4 - pad);
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

/**
 * Timing‑safe string comparison using crypto.timingSafeEqual.
 *
 * If the inputs have different lengths, the comparison fails early.
 *
 * @param {string} a - First string to compare.
 * @param {string} b - Second string to compare.
 * @returns {boolean} Whether the two strings are equal.
 */
function timingSafeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) {
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

module.exports = {
  authenticateJWT,
  requireRole,
  verifyToken,
  base64UrlDecode,
  toBase64Url,
  timingSafeEqual,
};