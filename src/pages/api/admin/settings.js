import pool from '@/utils/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== 'admin') {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT setting_key, setting_value FROM settings');
      const settings = {};
      rows.forEach(row => {
        settings[row.setting_key] = row.setting_value;
      });
      return res.status(200).json(settings);
    } catch (error) {
      return res.status(500).json({ error: 'Server error' });
    }
  } else if (req.method === 'POST') {
    const { storeName, contactEmail, announcementBanner } = req.body;
    try {
      // Upsert logic for safety
      const updateSetting = async (key, val) => {
        if (val !== undefined) {
          await pool.query(
            'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)',
            [key, val]
          );
        }
      };

      await updateSetting('storeName', storeName);
      await updateSetting('contactEmail', contactEmail);
      await updateSetting('announcementBanner', announcementBanner);
      
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
