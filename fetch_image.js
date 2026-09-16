const mysql = require('mysql2/promise');

(async () => {
  try {
    const res = await fetch('https://www.gigabyte.com/in/Graphics-Card/GV-N5090GAMING-OC-32GD');
    const html = await res.text();
    const match = html.match(/<meta property="og:image" content="([^"]+)"/);
    if (match) {
      const imgUrl = match[1];
      console.log('Found image URL:', imgUrl);
      const pool = mysql.createPool({
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'pc_build_db'
      });
      await pool.query('UPDATE products SET img = ? WHERE category = "gpu"', [imgUrl]);
      console.log('DB updated!');
    } else {
      console.log('og:image not found');
    }
  } catch(e) {
    console.error(e);
  }
  process.exit(0);
})();
