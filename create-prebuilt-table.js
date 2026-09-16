import mysql from 'mysql2/promise';
import 'dotenv/config';

async function createTable() {
  try {
    const pool = mysql.createPool({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'pc_build_db',
    });

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS prebuilt_pcs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        tag VARCHAR(100),
        description TEXT,
        price INT,
        cpu VARCHAR(255),
        gpu VARCHAR(255),
        ram VARCHAR(255),
        storage VARCHAR(255),
        image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await pool.query(createTableQuery);
    console.log('Table prebuilt_pcs created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating table:', error);
    process.exit(1);
  }
}

createTable();
