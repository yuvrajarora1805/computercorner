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
    await pool.query(`
      CREATE TABLE IF NOT EXISTS settings (
        setting_key VARCHAR(50) PRIMARY KEY,
        setting_value TEXT
      )
    `);
    
    // Insert defaults
    await pool.query(`INSERT IGNORE INTO settings (setting_key, setting_value) VALUES ('storeName', 'The Computer Corner')`);
    await pool.query(`INSERT IGNORE INTO settings (setting_key, setting_value) VALUES ('contactEmail', 'support@computercorner.com')`);
    await pool.query(`INSERT IGNORE INTO settings (setting_key, setting_value) VALUES ('announcementBanner', 'PC prices will rise in JULY 2026 due to AI component scarcity. Order your PC now')`);

    console.log("Settings table created successfully!");
  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    await pool.end();
  }
}

main();
