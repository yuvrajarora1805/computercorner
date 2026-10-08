import { sendCustomEmail } from '@/utils/mailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, name, subject, message, orderId } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await sendCustomEmail({ to, name: name || 'Customer', subject, message, orderId });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending custom email:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
