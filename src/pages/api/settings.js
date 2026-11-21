import pool from '@/utils/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    // Auto-create table if it does not exist yet
    await pool.query(`
      CREATE TABLE IF NOT EXISTS settings (
        setting_key VARCHAR(50) PRIMARY KEY,
        setting_value TEXT
      )
    `);

    const [rows] = await pool.query('SELECT setting_key, setting_value FROM settings');
    const settings = {
      announcementBanner: 'Welcome to The Computer Corner - Premium Custom PC Builds & Components',
      storeName: 'The Computer Corner',
      contactEmail: 'support@thecomputercorner.org',
      deliveryCharge: '0',
      freeDeliveryThreshold: '0'
    };

    rows.forEach(row => {
      settings[row.setting_key] = row.setting_value;
    });

    res.status(200).json(settings);
  } catch (error) {
    console.error("Settings GET error:", error);
    // Return sensible fallback rather than crashing with 500
    res.status(200).json({
      announcementBanner: '',
      storeName: 'The Computer Corner',
      deliveryCharge: '0',
      freeDeliveryThreshold: '0'
    });
  }
}
