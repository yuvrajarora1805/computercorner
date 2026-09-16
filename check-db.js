const mysql = require('mysql2/promise');

async function check() {
  try {
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'pc_build_db',
    });
    
    // Check if column exists
    const [cols] = await pool.query("SHOW COLUMNS FROM orders LIKE 'user_phone'");
    if (cols.length === 0) {
      console.log('Column does not exist. Adding it...');
      await pool.query("ALTER TABLE orders ADD COLUMN user_phone VARCHAR(50) DEFAULT 'N/A'");
      console.log('Column added successfully.');
    } else {
      console.log('Column already exists.');
    }
  } catch (e) {
    console.error('Error:', e);
  }
  process.exit();
}
check();
