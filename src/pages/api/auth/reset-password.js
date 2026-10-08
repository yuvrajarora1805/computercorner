import pool from '@/utils/db';
import { hashPassword } from './signup';
import { sendPasswordChangeSuccessEmail } from '@/utils/mailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token and new password are required' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long' });
  }

  try {
    const now = Date.now();
    
    // Find user with a valid, unexpired token
    const [users] = await pool.query(
      'SELECT id, email, username FROM users WHERE reset_token = ? AND reset_token_expiry > ?',
      [token, now]
    );

    if (users.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid or expired password reset token. Please request a new one.' 
      });
    }

    const user = users[0];

    // Hash the new password using the app's native crypto utility
    const passwordHash = hashPassword(newPassword);

    // Update the password and invalidate the token immediately (One-Time Use)
    await pool.query(
      'UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
      [passwordHash, user.id]
    );

    // Send confirmation email asynchronously (fire-and-forget)
    sendPasswordChangeSuccessEmail({
      to: user.email,
      name: user.username || user.email.split('@')[0]
    }).catch(err => console.error('Failed to send password change success email:', err));

    return res.status(200).json({ message: 'Password has been successfully reset.' });

  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ error: 'Server error while resetting password' });
  }
}
