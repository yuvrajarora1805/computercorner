import pool from '@/utils/db';
import crypto from 'crypto';
import { sendOrderConfirmationEmail } from '@/utils/mailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      // Update order status in the database
      let order = null;
      try {
        await pool.query(
          `UPDATE orders SET payment_status = ?, order_status = ?, razorpay_payment_id = ? WHERE razorpay_order_id = ?`,
          ['Completed', 'Received', razorpay_payment_id, razorpay_order_id]
        );

        // Fetch order details for confirmation email
        const [orders] = await pool.query(
          `SELECT o.*, oi.product_id, oi.quantity, oi.price, p.name as product_name
           FROM orders o
           LEFT JOIN order_items oi ON o.id = oi.order_id
           LEFT JOIN products p ON oi.product_id = p._id
           WHERE o.razorpay_order_id = ?`,
          [razorpay_order_id]
        );
        order = orders;
      } catch (dbError) {
        console.error('Failed to update order in DB:', dbError);
      }

      // Send confirmation email (non-blocking — don't fail the response if email fails)
      if (order && order.length > 0) {
        const firstRow = order[0];
        const items = order.map(row => ({
          name: row.product_name || 'PC Component',
          price: row.price,
          cartQuantity: row.quantity,
        }));

        sendOrderConfirmationEmail({
          to: firstRow.user_email,
          name: firstRow.user_email.split('@')[0],
          orderId: razorpay_order_id,
          items,
          totalAmount: firstRow.total_amount,
          shippingAddress: firstRow.shipping_address || 'N/A',
        }).catch(err => console.error('Email send failed:', err));
      }

      return res.status(200).json({ message: 'Payment verified successfully' });
    } else {
      return res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Verify Payment Error:', error);
    res.status(500).json({ error: 'Server error while verifying payment' });
  }
}
