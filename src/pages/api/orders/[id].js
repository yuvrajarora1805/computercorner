import pool from '@/utils/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Missing order ID' });
    }

    // 1. Verify the order belongs to the user (or admin)
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orders[0];

    if (order.user_email !== session.user.email && session.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden. You do not own this order.' });
    }

    // 2. Fetch the order items joined with the product data
    // Assuming product_id in order_items is a string that corresponds to _id in products table
    // or we just fetch the order items and then fetch products separately if they are in MongoDB/another table.
    // Wait, products are in `products` table in MySQL now. Let's do a JOIN.
    const [items] = await pool.query(
      `SELECT oi.quantity, oi.price, p.name as name, p.img as img, p.category 
       FROM order_items oi 
       LEFT JOIN products p ON oi.product_id = p._id 
       WHERE oi.order_id = ?`,
      [id]
    );

    res.status(200).json({
      order,
      items
    });

  } catch (error) {
    console.error('Failed to fetch order details:', error);
    res.status(500).json({ error: 'Server error while fetching order details' });
  }
}
