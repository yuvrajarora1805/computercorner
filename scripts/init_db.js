const mysql = require('mysql2/promise');

async function initDB() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || ''
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.MYSQL_DATABASE || 'pc_build_db'}\`;`);
    console.log('Database pc_build_db created or already exists.');

    await connection.query(`USE \`${process.env.MYSQL_DATABASE || 'pc_build_db'}\`;`);

    const createProductsTableQuery = `
      CREATE TABLE IF NOT EXISTS products (
        _id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        price VARCHAR(50) NOT NULL,
        img TEXT,
        status VARCHAR(50) DEFAULT 'In Stock',
        rating VARCHAR(10) DEFAULT '0',
        description TEXT,
        keyFeature TEXT,
        individualRating VARCHAR(10) DEFAULT '0'
      );
    `;

    await connection.query(createProductsTableQuery);
    console.log('Products table created or already exists.');

    const createOrdersTableQuery = `
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(255) PRIMARY KEY,
        user_email VARCHAR(255) NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        payment_status VARCHAR(50) DEFAULT 'Pending',
        order_status VARCHAR(50) DEFAULT 'Processing',
        shipping_address TEXT,
        razorpay_order_id VARCHAR(255),
        razorpay_payment_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await connection.query(createOrdersTableQuery);
    console.log('Orders table created or already exists.');

    const createOrderItemsTableQuery = `
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id VARCHAR(255) NOT NULL,
        product_id VARCHAR(255) NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(_id) ON DELETE CASCADE
      );
    `;
    await connection.query(createOrderItemsTableQuery);
    console.log('Order Items table created or already exists.');
    
    // Check if empty, maybe seed from vercel api
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM products');
    if (rows[0].count === 0) {
      console.log('Fetching initial products from vercel API to seed...');
      const res = await fetch("https://pc-cloud-server.vercel.app/products");
      const data = await res.json();
      if (data && data.data && data.data.length > 0) {
        for (const product of data.data) {
          const { _id, name, category, price, img, status, rating, description, keyFeature, individualRating } = product;
          await connection.query(`
            INSERT INTO products (_id, name, category, price, img, status, rating, description, keyFeature, individualRating)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [_id || Math.random().toString(36).substring(7), name, category, price, img || '', status || 'In Stock', rating || '5', description || '', keyFeature || '', individualRating || '5']);
        }
        console.log(`Seeded ${data.data.length} products.`);
      }
    }

    await connection.end();
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}

initDB();
