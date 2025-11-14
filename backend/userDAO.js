// UserDAO: DAO POO de usuarios con PBKDF2 seguro y persistencia localStorage

(function () {
  function toB64(uint8) {
    return btoa(String.fromCharCode.apply(null, uint8));
  }
  function fromB64(b64) {
    const binStr = atob(b64);
    const arr = new Uint8Array(binStr.length);
    for (let i = 0; i < binStr.length; ++i) arr[i] = binStr.charCodeAt(i);
    return arr;
  }
  function hexToUint8(hex) {
    if (!hex) return new Uint8Array();
    const arr = new Uint8Array(hex.length / 2);
    for (let i = 0; i < arr.length; ++i)
      arr[i] = parseInt(hex.substr(i * 2, 2), 16);
    return arr;
  }

  class UserDAO {
    constructor() {
      this.users = new Map();
      this.loadFromLocalStorage();
    }

    generateSalt(len = 16) {
      const arr = new Uint8Array(len);
      window.crypto.getRandomValues(arr);
      return arr;
    }

    async pbkdf2(plain, salt, iterations = 150000, keyLen = 32, hash = "SHA-256") {
      const enc = new TextEncoder();
      const passwordKey = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(plain),
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"]
      );
      const params = {
        name: "PBKDF2",
        salt: salt,
        iterations: iterations,
        hash: hash,
      };
      const derivedBits = await window.crypto.subtle.deriveBits(params, passwordKey, keyLen * 8);
      return new Uint8Array(derivedBits);
    }

    async createUser(email, password, extra = {}) {
      if (!email || !password) throw new Error("Email y contraseña requeridos");
      if (typeof email !== "string" || typeof password !== "string")
        throw new Error("Email y contraseña deben ser texto");
      email = email.trim().toLowerCase();
      if (this.users.has(email)) throw new Error("El email ya está registrado");
      const salt = this.generateSalt(16);
      const passwordHash = await this.pbkdf2(password, salt);
      const user = {
        email,
        passwordHash: toB64(passwordHash),
        salt: toB64(salt),
        role: extra.role || "user",
        createdAt: new Date().toISOString()
      };
      this.users.set(email, user);
      this.saveToLocalStorage();
      return user;
    }

    findByEmail(email) {
      if (!email) return undefined;
      return this.users.get(email.trim().toLowerCase());
    }

    async verifyPassword(email, plain) {
      const user = this.findByEmail(email);
      if (!user) return false;
      const salt = fromB64(user.salt);
      const expected = fromB64(user.passwordHash);
      const candidateHash = await this.pbkdf2(plain, salt);
      if (candidateHash.length !== expected.length) return false;
      // Comparación tiempo constante
      let diff = 0;
      for (let i = 0; i < expected.length; ++i)
        diff |= (candidateHash[i] ^ expected[i]);
      return diff === 0;
    }

    listUsers() {
      return Array.from(this.users.values());
    }

    deleteUser(email) {
      email = (email || '').trim().toLowerCase();
      const res = this.users.delete(email);
      if (res) this.saveToLocalStorage();
      return res;
    }

    saveToLocalStorage() {
      try {
        localStorage.setItem('rigocompra_users', JSON.stringify([...this.users.entries()]));
      } catch (e) { /* silent */ }
    }

    loadFromLocalStorage() {
      try {
        const raw = localStorage.getItem('rigocompra_users');
        if (raw) {
          const arr = JSON.parse(raw);
          this.users = new Map();
          if (Array.isArray(arr)) {
            for (const [email, user] of arr) {
              if (user && typeof user.email === "string" && user.passwordHash && user.salt) {
                this.users.set(email, user);
              }
            }
          }
        }
      } catch (e) {
        this.users = new Map();
      }
    }
  }

  window.UserDAO = UserDAO;
})();
