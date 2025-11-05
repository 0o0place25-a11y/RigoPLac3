const sqlite3 = require('sqlite3').verbose();

const DBSOURCE = 'db.sqlite';

const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log('Connected to the SQLite database.');
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre_usuario TEXT UNIQUE,
        password_hash TEXT,
        codigo_pin_hash TEXT
      )`);
      db.run(`CREATE TABLE IF NOT EXISTS products (
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
      )`, (err) => {
        if (err) {
          console.error(err.message);
        } else {
          // Seed products after table creation
          const mine = [
            {
              id: '1',
              title: "Bicicleta urbana",
              price: 650,
              city: "Guatemala",
              category: "Ropa",
              image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500",
              description: "Bicicleta de montaña en excelente estado, perfecta para la ciudad. Incluye casco y candado.",
              condition: "Usado - Como nuevo"
            },
            {
              id: '2',
              title: "Silla gamer",
              price: 950,
              city: "Mixco",
              category: "Hogar",
              image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=500",
              description: "Silla gamer reclinable con soporte lumbar. Muy cómoda para largas sesiones de trabajo o juego.",
              condition: "Usado - Buen estado"
            },
            {
              id: '20',
              title: "Laptop Dell Inspiron",
              price: 4500,
              city: "Guatemala",
              category: "Tecnología",
              image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500",
              description: "Laptop Dell Inspiron 15, Intel i5, 8GB RAM, 256GB SSD. Ideal para estudiantes.",
              condition: "Usado - Buen estado"
            },
            {
              id: '21',
              title: "Libros de Programación",
              price: 150,
              city: "Guatemala",
              category: "Servicios",
              image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500",
              description: "Colección de libros de programación: Java, Python, JavaScript. Perfectos para aprender.",
              condition: "Usado - Como nuevo"
            },
            {
              id: '22',
              title: "Cafetera Espresso",
              price: 850,
              city: "Mixco",
              category: "Hogar",
              image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500",
              description: "Cafetera espresso semi-automática. Prepara café como barista en casa.",
              condition: "Nuevo"
            }
          ];

          const feed = [
            {
              id: '3',
              title: "Brownie casero",
              price: 15,
              city: "Guatemala",
              category: "Comida",
              image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500",
              description: "Brownies artesanales hechos con chocolate belga. Receta familiar transmitida por generaciones.",
              condition: "Nuevo"
            },
            {
              id: '4',
              title: "Arduino UNO",
              price: 180,
              city: "Mixco",
              category: "Tecnología",
              image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=500",
              description: "Arduino UNO R3 original. Perfecto para proyectos de electrónica y robótica. Incluye cable USB.",
              condition: "Nuevo"
            },
            {
              id: '5',
              title: "Cojín artesanal",
              price: 90,
              city: "Guatemala",
              category: "Hogar",
              image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500",
              description: "Cojín decorativo hecho a mano con telas guatemaltecas. Diseño único y colorido.",
              condition: "Nuevo"
            },
            {
              id: '6',
              title: "Smartphone Samsung A54",
              price: 2200,
              city: "Guatemala",
              category: "Tecnología",
              image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
              description: "Samsung Galaxy A54, 128GB, en perfectas condiciones. Incluye cargador y funda protectora.",
              condition: "Usado - Como nuevo"
            },
            {
              id: '7',
              title: "Escritorio de madera",
              price: 1200,
              city: "Mixco",
              category: "Hogar",
              image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500",
              description: "Escritorio de madera maciza, ideal para estudio o trabajo remoto. Amplios cajones.",
              condition: "Usado - Buen estado"
            },
            {
              id: '8',
              title: "Auriculares Sony WH-1000XM4",
              price: 1800,
              city: "Guatemala",
              category: "Tecnología",
              image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500",
              description: "Auriculares premium con cancelación de ruido activa. Excelente calidad de sonido.",
              condition: "Usado - Como nuevo"
            },
            {
              id: '9',
              title: "Chamarra de cuero",
              price: 450,
              city: "Guatemala",
              category: "Ropa",
              image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
              description: "Chamarra de cuero genuino, talla M. Estilo casual, perfecta para el clima de Guatemala.",
              condition: "Usado - Como nuevo"
            },
            {
              id: '10',
              title: "Set de mancuernas",
              price: 350,
              city: "Mixco",
              category: "Hogar",
              image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500",
              description: "Set de mancuernas ajustables de 5kg a 25kg. Perfecto para gimnasio en casa.",
              condition: "Usado - Buen estado"
            },
            {
              id: '11',
              title: "Microondas Samsung",
              price: 550,
              city: "Guatemala",
              category: "Hogar",
              image: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=500",
              description: "Microondas Samsung de 1.1 pies cúbicos, múltiples funciones de cocción.",
              condition: "Usado - Como nuevo"
            },
            {
              id: '12',
              title: "Teclado mecánico RGB",
              price: 650,
              city: "Guatemala",
              category: "Tecnología",
              image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500",
              description: "Teclado mecánico gaming con iluminación RGB personalizable. Switches Blue.",
              condition: "Nuevo"
            },
            {
              id: '13',
              title: "Zapatillas Nike Air",
              price: 550,
              city: "Mixco",
              category: "Ropa",
              image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
              description: "Zapatillas Nike Air Max, talla 9, color negro. Poco uso, excelente condición.",
              condition: "Usado - Como nuevo"
            },
            {
              id: '14',
              title: "Plantas decorativas",
              price: 50,
              city: "Guatemala",
              category: "Hogar",
              image: "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=500",
              description: "Macetas con plantas suculentas. Perfectas para decorar tu espacio.",
              condition: "Nuevo"
            },
            {
              id: '15',
              title: "Monitor LG 24 pulgadas",
              price: 950,
              city: "Guatemala",
              category: "Tecnología",
              image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500",
              description: "Monitor LG Full HD 24 pulgadas, IPS, ideal para trabajo y gaming casual.",
              condition: "Usado - Buen estado"
            },
            {
              id: '16',
              title: "Mochila Jansport",
              price: 250,
              city: "Mixco",
              category: "Ropa",
              image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
              description: "Mochila Jansport clásica, amplia y cómoda. Ideal para universidad.",
              condition: "Usado - Buen estado"
            },
            {
              id: '17',
              title: "Pizza casera",
              price: 45,
              city: "Guatemala",
              category: "Comida",
              image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500",
              description: "Pizza artesanal con ingredientes frescos. Varios sabores disponibles.",
              condition: "Nuevo"
            },
            {
              id: '18',
              title: "Lámpara de escritorio LED",
              price: 180,
              city: "Guatemala",
              category: "Hogar",
              image: "https://images.unsplash.com/photo-1565894933654-d6c0d2ce7d3c?w=500",
              description: "Lámpara LED con brazo articulado, luz ajustable. Perfecta para estudiar.",
              condition: "Nuevo"
            },
            {
              id: '19',
              title: "Mouse Logitech MX Master",
              price: 450,
              city: "Mixco",
              category: "Tecnología",
              image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500",
              description: "Mouse ergonómico Logitech MX Master 3. Conexión Bluetooth y USB.",
              condition: "Usado - Como nuevo"
            }
          ];

          const all = [...mine, ...feed];

          const stmt = db.prepare('INSERT OR IGNORE INTO products (id, title, price, city, category, image, description, condition) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
          all.forEach(product => {
            stmt.run(product.id, product.title, product.price, product.city, product.category, product.image, product.description, product.condition);
          });
          stmt.finalize();
          console.log('Products seeded');
        }
      });
      db.run(`CREATE TABLE IF NOT EXISTS favorites (
        user_id INTEGER,
        product_id TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(product_id) REFERENCES products(id),
        PRIMARY KEY(user_id, product_id)
      )`);
    });
  }
});

module.exports = db;
