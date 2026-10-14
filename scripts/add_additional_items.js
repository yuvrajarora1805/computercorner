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
    const [columns] = await pool.query(`SHOW COLUMNS FROM prebuilt_pcs LIKE 'additional_items'`);
    if (columns.length === 0) {
      console.log("Adding additional_items column to prebuilt_pcs...");
      await pool.query(`ALTER TABLE prebuilt_pcs ADD COLUMN additional_items JSON`);
      console.log("Column added successfully!");
    } else {
      console.log("Column already exists.");
    }
  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    await pool.end();
  }
}

main();
