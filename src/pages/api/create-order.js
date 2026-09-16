import pool from '@/utils/db'; 
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, user, items } = req.body;

  if (!amount || !user || !items || items.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const payuKey = process.env.PAYU_MERCHANT_KEY || 'gtKFFx';
    const payuSalt = process.env.PAYU_MERCHANT_SALT || 'eCwWELxi';
    
    // 1. Generate unique txnid
    const txnid = 'TXN-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    
    const productinfo = 'PC Build Purchase';
    const firstname = user.name || 'Customer';
    const email = user.email || 'customer@example.com';
    const phone = user.phone || '9999999999';

    // 2. Compute PayU Hash
    // format: key|txnid|amount|productinfo|firstname|email|||||||||||salt
    const hashString = `${payuKey}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${payuSalt}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    // 3. Save Order to Database
    const orderId = txnid; // using txnid as order id
    const shippingAddress = `${user.address}, ${user.city}, ${user.state} - ${user.pincode}`;
    
    try {
      // Create tables if they don't exist
      await pool.query(`
        CREATE TABLE IF NOT EXISTS orders (
          id VARCHAR(255) PRIMARY KEY,
          user_email VARCHAR(255) NOT NULL,
          total_amount DECIMAL(10,2) NOT NULL,
          shipping_address TEXT NOT NULL,
          payu_txnid VARCHAR(255),
          payu_mihpayid VARCHAR(255),
          payment_status VARCHAR(50) DEFAULT 'Pending',
          order_status VARCHAR(50) DEFAULT 'Processing',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS order_items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          order_id VARCHAR(255) NOT NULL,
          product_id VARCHAR(255) NOT NULL,
          quantity INT NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
        )
      `);

      await pool.query(
        `INSERT INTO orders (id, user_email, user_phone, total_amount, shipping_address, payu_txnid, payment_status, order_status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [orderId, user.email, user.phone || 'N/A', amount, shippingAddress, txnid, 'Pending', 'Received']
      );

      // 4. Save Order Items
      for (const item of items) {
        const price = Number(String(item.price).replace(/,/g, ''));
        await pool.query(
          `INSERT INTO order_items (order_id, product_id, quantity, price)
           VALUES (?, ?, ?, ?)`,
          [orderId, item._id.toString(), item.cartQuantity || 1, price]
        );
      }
    } catch (dbError) {
      console.error('Database Error:', dbError);
    }

    const host = req.headers.host;
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const baseUrl = `${protocol}://${host}`;

    // Return the PayU parameters to frontend
    res.status(200).json({
      key: payuKey,
      txnid: txnid,
      amount: amount,
      productinfo: productinfo,
      firstname: firstname,
      email: email,
      phone: phone,
      hash: hash,
      surl: `${baseUrl}/api/payu-success`,
      furl: `${baseUrl}/api/payu-failure`,
      service_provider: 'payu_paisa'
    });

  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ error: 'Server error while creating order', details: error.message });
  }
}
