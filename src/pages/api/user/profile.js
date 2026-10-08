import pool from '@/utils/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const email = session.user.email;

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT phone, address, city, state, pincode FROM users WHERE email = ?', [email]);
      if (rows.length > 0) {
        return res.status(200).json(rows[0]);
      }
      return res.status(404).json({ error: "User not found" });
    } catch (error) {
      console.error("Error fetching profile:", error);
      return res.status(500).json({ error: "Server error" });
    }
  } else if (req.method === 'PUT') {
    try {
      const { phone, address, city, state, pincode } = req.body;
      
      // We do an UPDATE instead of an INSERT because the user row should already exist.
      // If it doesn't exist, this won't do anything (which we handle below).
      const [result] = await pool.query(
        'UPDATE users SET phone=?, address=?, city=?, state=?, pincode=? WHERE email=?',
        [phone || '', address || '', city || '', state || '', pincode || '', email]
      );
      
      if (result.affectedRows === 0) {
        // If the user doesn't exist in the DB (e.g. Google Sign in didn't sync them), create them!
        await pool.query(
          'INSERT INTO users (username, email, role, phone, address, city, state, pincode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [session.user.name || email.split('@')[0], email, 'user', phone || '', address || '', city || '', state || '', pincode || '']
        );
      }
      
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error updating profile:", error);
      return res.status(500).json({ error: "Server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
