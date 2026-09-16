import pool from '@/utils/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      // Create orders table implicitly if it doesn't exist
      const [orders] = await pool.query(
        'SELECT * FROM orders WHERE user_email = ? ORDER BY created_at DESC',
        [session.user.email]
      );

      res.status(200).json(orders);
    } catch (error) {
      // If table doesn't exist, it will throw an error, which we catch and return empty array
      console.error('Failed to fetch orders:', error);
      res.status(200).json([]);
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
