const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const DBSOURCE = 'db.sqlite';

const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log('Connected to the SQLite database.');
    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync('password123', salt);
    db.run(`INSERT OR IGNORE INTO users (nombre_usuario, password_hash) VALUES (?, ?)`, ['testuser', password_hash], function(err) {
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id
        console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
  }
});