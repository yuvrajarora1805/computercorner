import pool from '@/utils/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const limit = parseInt(req.query.limit) || 5;
    
    const [orders] = await pool.query(
      'SELECT id, user_email, user_phone, total_amount, payment_status, order_status, shipping_address, created_at FROM orders ORDER BY created_at DESC LIMIT ?',
      [limit]
    );

    res.status(200).json(orders);

  } catch (error) {
    console.error('Error fetching recent orders:', error);
    // Return empty array if table doesn't exist yet
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return res.status(200).json([]);
    }
    res.status(500).json({ error: 'Server error while fetching recent orders' });
  }
}
