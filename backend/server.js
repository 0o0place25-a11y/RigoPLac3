const express = require('express');
const cors = require('cors');
const db = require('./database.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Auth middleware
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: 'Token is not valid' });
  }
};

// Register
app.post('/api/auth/register', (req, res) => {
  const { nombre_usuario, password, codigo_pin } = req.body;
  if (!nombre_usuario || (!password && !codigo_pin)) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  const salt = bcrypt.genSaltSync(10);
  let password_hash = null;
  let codigo_pin_hash = null;

  if (password) {
    password_hash = bcrypt.hashSync(password, salt);
  }
  if (codigo_pin) {
    codigo_pin_hash = bcrypt.hashSync(codigo_pin, salt);
  }

  db.run('INSERT INTO users (nombre_usuario, password_hash, codigo_pin_hash) VALUES (?, ?, ?)', [nombre_usuario, password_hash, codigo_pin_hash], function(err) {
    if (err) {
      return res.status(400).json({ msg: 'Username already exists' });
    }
    res.json({
      user: {
        id: this.lastID,
        nombre_usuario: nombre_usuario
      }
    });
  });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { nombre_usuario, password, codigo_pin } = req.body;
  if (!nombre_usuario || (!password && !codigo_pin)) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  db.get('SELECT * FROM users WHERE nombre_usuario = ?', [nombre_usuario], (err, user) => {
    if (err || !user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    let isMatch = false;
    if (password && user.password_hash) {
      isMatch = bcrypt.compareSync(password, user.password_hash);
    } else if (codigo_pin && user.codigo_pin_hash) {
      isMatch = bcrypt.compareSync(codigo_pin, user.codigo_pin_hash);
    }

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: 3600 });
    res.json({
      token,
      user: {
        id: user.id,
        nombre_usuario: user.nombre_usuario
      }
    });
  });
});

// Products
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ msg: 'Error retrieving products' });
    }
    res.json(rows);
  });
});

app.get('/api/products/mine', auth, (req, res) => {
  db.all('SELECT * FROM products WHERE user_id = ?', [req.user.id], (err, rows) => {
    if (err) {
      return res.status(500).json({ msg: 'Error retrieving products' });
    }
    res.json(rows);
  });
});

app.post('/api/products', auth, (req, res) => {
  const { id, title, price, city, category, image, description, condition } = req.body;
  if (!id || !title || !price || !city || !category) {
    return res.status(400).json({ msg: 'Please enter all required fields' });
  }
  db.run('INSERT INTO products (id, title, price, city, category, image, description, condition, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, title, price, city, category, image, description, condition, req.user.id], function(err) {
    if (err) {
      return res.status(500).json({ msg: 'Error creating product' });
    }
    res.json({ id, title, price, city, category, image, description, condition });
  });
});

// Favorites
app.get('/api/favorites', auth, (req, res) => {
  db.all('SELECT product_id FROM favorites WHERE user_id = ?', [req.user.id], (err, rows) => {
    if (err) {
      return res.status(500).json({ msg: 'Error retrieving favorites' });
    }
    res.json(rows.map(row => row.product_id));
  });
});

app.post('/api/favorites', auth, (req, res) => {
  const { productId } = req.body;
  db.run('INSERT INTO favorites (user_id, product_id) VALUES (?, ?)', [req.user.id, productId], (err) => {
    if (err) {
      // If the favorite already exists, remove it
      db.run('DELETE FROM favorites WHERE user_id = ? AND product_id = ?', [req.user.id, productId]);
      return res.json({ msg: 'Favorite removed' });
    }
    return res.json({ msg: 'Favorite added' });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
