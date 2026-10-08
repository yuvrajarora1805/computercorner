import pool from '@/utils/db'; 
import Razorpay from 'razorpay';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

// Simple in-memory rate limiter for order creation
const orderAttempts = new Map();
function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const limit = 5;
  const attempts = orderAttempts.get(ip) || [];
  const recent = attempts.filter(t => now - t < windowMs);
  if (recent.length >= limit) return true;
  recent.push(now);
  orderAttempts.set(ip, recent);
  return false;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limit by IP
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized. Please log in to create an order." });
  }

  const { amount, user, items } = req.body;

  if (amount === undefined || amount === null || !user || !items || items.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Basic input validation
  if (typeof amount !== 'number' || typeof user.email !== 'string' || typeof user.address !== 'string' || typeof user.city !== 'string' || typeof user.state !== 'string' || typeof user.pincode !== 'string') {
    return res.status(400).json({ error: 'Invalid input data types' });
  }

  // Ensure users cannot spoof another user's email unless they are an admin
  if (user.email !== session.user.email && session.user.role !== 'admin') {
     return res.status(403).json({ error: 'Email mismatch. Cannot create order for another user.' });
  }

  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const shippingAddress = `${user.address}, ${user.city}, ${user.state} - ${user.pincode}`;

    if (amount === 0) {
      const orderId = 'free_' + Date.now();
      
      try {
        await pool.query(`
          CREATE TABLE IF NOT EXISTS orders (
            id VARCHAR(255) PRIMARY KEY,
            user_email VARCHAR(255) NOT NULL,
            user_phone VARCHAR(50),
            total_amount DECIMAL(10,2) NOT NULL,
            shipping_address TEXT NOT NULL,
            razorpay_order_id VARCHAR(255),
            razorpay_payment_id VARCHAR(255),
            razorpay_signature VARCHAR(255),
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
          `INSERT INTO orders (id, user_email, user_phone, total_amount, shipping_address, razorpay_order_id, payment_status, order_status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [orderId, user.email, user.phone || 'N/A', amount, shippingAddress, orderId, 'Completed', 'Processing']
        );

        for (const item of items) {
          const price = Number(String(item.price).replace(/,/g, ''));
          await pool.query(
            `INSERT INTO order_items (order_id, product_id, quantity, price)
             VALUES (?, ?, ?, ?)`,
            [orderId, item._id.toString(), item.cartQuantity || 1, price]
          );
        }
      } catch (dbError) {
        console.error('Database Error on free order:', dbError);
      }

      return res.status(200).json({
        id: orderId,
        currency: "INR",
        amount: 0,
        isFree: true
      });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: 'receipt_' + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).json({ error: 'Failed to create Razorpay order' });
    }

    const orderId = order.id;
    
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS orders (
          id VARCHAR(255) PRIMARY KEY,
          user_email VARCHAR(255) NOT NULL,
          user_phone VARCHAR(50),
          total_amount DECIMAL(10,2) NOT NULL,
          shipping_address TEXT NOT NULL,
          razorpay_order_id VARCHAR(255),
          razorpay_payment_id VARCHAR(255),
          razorpay_signature VARCHAR(255),
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
        `INSERT INTO orders (id, user_email, user_phone, total_amount, shipping_address, razorpay_order_id, payment_status, order_status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [orderId, user.email, user.phone || 'N/A', amount, shippingAddress, orderId, 'Pending', 'Pending Payment']
      );

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

    res.status(200).json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      key: process.env.RAZORPAY_KEY_ID,
      name: user.name || 'Customer',
      email: user.email || 'customer@example.com',
      phone: user.phone || '9999999999',
    });

  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ error: 'Server error while creating order' });
  }
}
