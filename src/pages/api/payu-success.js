import pool from '@/utils/db';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { status, txnid, amount, productinfo, firstname, email, hash, mihpayid } = req.body;
  
  const payuKey = process.env.PAYU_MERCHANT_KEY || 'gtKFFx';
  const payuSalt = process.env.PAYU_MERCHANT_SALT || 'eCwWELxi';

  const additionalCharges = req.body.additionalCharges;
  let hashString = '';
  
  if (additionalCharges) {
    hashString = `${additionalCharges}|${payuSalt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${payuKey}`;
  } else {
    hashString = `${payuSalt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${payuKey}`;
  }

  const generatedHash = crypto.createHash('sha512').update(hashString).digest('hex');
  const isValidHash = generatedHash === hash;

  if (status === 'success') {
    try {
      await pool.query(
        'UPDATE orders SET payment_status = ?, payu_mihpayid = ? WHERE id = ?',
        [isValidHash ? 'Success' : 'Success (Hash Mismatch)', mihpayid, txnid]
      );
    } catch (error) {
      console.error('DB Update Error:', error);
    }
    return res.redirect(302, `/order-success?payment_id=${mihpayid}`);
  }

  res.redirect(302, '/');
}
