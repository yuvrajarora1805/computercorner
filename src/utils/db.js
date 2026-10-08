import mysql from 'mysql2/promise';

let pool;

if (process.env.NODE_ENV === 'production') {
  pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'pc_build_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
} else {
  if (!global.__dbPool) {
    global.__dbPool = mysql.createPool({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'pc_build_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
  pool = global.__dbPool;
}

export default pool;
