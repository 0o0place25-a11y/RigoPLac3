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
        username TEXT UNIQUE,
        password TEXT
      )`);
      db.run(`CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        title TEXT,
        price REAL,
        city TEXT,
        category TEXT,
        image TEXT,
        description TEXT,
        condition TEXT
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
              image: "",
              description: "Bicicleta de montaña en excelente estado, perfecta para la ciudad. Incluye casco y candado.",
              condition: "Usado - Como nuevo"
            },
            {
              id: '2',
              title: "Silla gamer",
              price: 950,
              city: "Mixco",
              category: "Hogar",
              image: "",
              description: "Silla gamer reclinable con soporte lumbar. Muy cómoda para largas sesiones de trabajo o juego.",
              condition: "Usado - Buen estado"
            }
          ];

          const feed = [
            {
              id: '3',
              title: "Brownie casero",
              price: 15,
              city: "Guatemala",
              category: "Comida",
              image: "",
              description: "Brownies artesanales hechos con chocolate belga. Receta familiar transmitida por generaciones.",
              condition: "Nuevo"
            },
            {
              id: '4',
              title: "Arduino UNO",
              price: 180,
              city: "Mixco",
              category: "Tecnología",
              image: "",
              description: "Arduino UNO R3 original. Perfecto para proyectos de electrónica y robótica. Incluye cable USB.",
              condition: "Nuevo"
            },
            {
              id: '5',
              title: "Cojín artesanal",
              price: 90,
              city: "Guatemala",
              category: "Hogar",
              image: "",
              description: "Cojín decorativo hecho a mano con telas guatemaltecas. Diseño único y colorido.",
              condition: "Nuevo"
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
