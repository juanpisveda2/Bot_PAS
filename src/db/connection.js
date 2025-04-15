require('dotenv').config(); // 👈 esto va siempre al principio

const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT, // 👈 asegurate de incluir esto también si usás un puerto custom
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Error al conectar con MySQL:', err.message);
  } else {
    console.log('✅ Conectado a MySQL con éxito');
  }
});

module.exports = connection;
