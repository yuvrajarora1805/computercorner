import pool from '@/utils/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || session.user.role !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized. Admin access required.' });
    }

    const { id, order_status } = req.body;

    if (!id || !order_status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [result] = await pool.query(
      'UPDATE orders SET order_status = ? WHERE id = ?',
      [order_status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({ success: true, message: 'Order status updated' });
  } catch (error) {
    console.error('Failed to update order status:', error);
    res.status(500).json({ error: 'Server error while updating order' });
  }
}
