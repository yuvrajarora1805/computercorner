const mysql = require('mysql2/promise');

(async () => {
  try {
    const pool = mysql.createPool({
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'pc_build_db'
    });
    
    // Delete old dummy GPUs
    await pool.query('DELETE FROM products WHERE category = "gpu"');
    
    // Insert new GIGABYTE RTX 5090
    const gpu = {
      name: 'GIGABYTE GeForce RTX 5090 GAMING OC 32GD',
      category: 'gpu',
      price: 180000,
      img: 'https://www.gigabyte.com/in/Graphics-Card/GV-N5090GAMING-OC-32GD',
      status: 'In Stock',
      rating: 5,
      description: 'GeForce RTX 5090',
      keyFeature: '32GB GDDR7',
      individualRating: 5
    };
    
    const _id = Math.random().toString(36).substring(7);
    await pool.query(
      'INSERT INTO products (_id, name, category, price, img, status, rating, description, keyFeature, individualRating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
      [_id, gpu.name, gpu.category, gpu.price, gpu.img, gpu.status, gpu.rating, gpu.description, gpu.keyFeature, gpu.individualRating]
    );
    
    console.log('Added GIGABYTE 5090');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
