import pool from '@/utils/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { razorpay_order_id } = req.body;

  if (!razorpay_order_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [result] = await pool.query(
      `UPDATE orders SET payment_status = 'Failed', order_status = 'Cancelled' WHERE razorpay_order_id = ? AND user_email = ?`,
      [razorpay_order_id, session.user.email]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found or unauthorized' });
    }

    return res.status(200).json({ message: 'Order marked as cancelled' });
  } catch (error) {
    console.error('Cancel Payment Error:', error);
    res.status(500).json({ error: 'Server error while cancelling payment' });
  }
}
