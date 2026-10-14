require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function main() {
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT || 3306,
  });

  try {
    console.log("Checking if columns exist...");
    const [columns] = await pool.query(`SHOW COLUMNS FROM users LIKE 'phone'`);
    if (columns.length === 0) {
      console.log("Adding columns to users table...");
      await pool.query(`
        ALTER TABLE users 
        ADD COLUMN phone VARCHAR(20),
        ADD COLUMN address TEXT,
        ADD COLUMN city VARCHAR(100),
        ADD COLUMN state VARCHAR(100),
        ADD COLUMN pincode VARCHAR(20)
      `);
      console.log("Columns added successfully!");
    } else {
      console.log("Columns already exist.");
    }
  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    await pool.end();
  }
}

main();
