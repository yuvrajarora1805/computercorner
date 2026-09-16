import pool from '@/utils/db';

export default async function handler(req, res) {
  try {
    await pool.query("ALTER TABLE orders ADD COLUMN user_phone VARCHAR(50) DEFAULT 'N/A'");
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(200).json({ success: false, error: e.message }); // Might fail if exists, which is fine
  }
}
