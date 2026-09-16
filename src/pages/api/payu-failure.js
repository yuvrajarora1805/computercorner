import pool from '@/utils/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { status, txnid, mihpayid } = req.body;
  
  try {
    await pool.query(
      'UPDATE orders SET payment_status = ?, payu_mihpayid = ? WHERE id = ?',
      ['Failed', mihpayid, txnid]
    );
  } catch (error) {
    console.error('DB Update Error:', error);
  }

  // Redirect to order failed page
  res.redirect(302, `/order-failure`);
}
