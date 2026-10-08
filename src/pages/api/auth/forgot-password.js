import pool from '@/utils/db';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/utils/mailer';

// In-memory rate limiter to prevent email bombing
const rateLimits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const limit = 3; // Max 3 requests per 15 mins per IP
  
  const attempts = rateLimits.get(ip) || [];
  const recent = attempts.filter(t => now - t < windowMs);
  
  if (recent.length >= limit) return true;
  
  recent.push(now);
  rateLimits.set(ip, recent);
  return false;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const { email } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  try {
    const [users] = await pool.query('SELECT id, username, email FROM users WHERE email = ?', [email.toLowerCase()]);

    if (users.length === 0) {
      return res.status(404).json({ error: 'No account found with that email address.' });
    }

    const user = users[0];
    
    // Generate a cryptographically secure random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes from now

    // Save token to database
    await pool.query(
      'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?',
      [resetToken, resetTokenExpiry, user.id]
    );

    // Construct reset link
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const host = req.headers.host || 'localhost:3000';
    const resetLink = `${protocol}://${host}/reset-password?token=${resetToken}`;

    // Send email asynchronously
    sendPasswordResetEmail({
      to: user.email,
      name: user.username || user.email.split('@')[0],
      resetLink
    }).catch(err => console.error('Failed to send reset email:', err));

    return res.status(200).json({ 
      message: 'Password reset link has been sent to your email.' 
    });

  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ error: 'Server error while processing request' });
  }
}
