import pool from '@/utils/db';
import crypto from 'crypto';
import { sendWelcomeEmail } from '@/utils/mailer';

// Basic utility to hash passwords
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

// Simple in-memory rate limiter for signup: max 5 attempts per IP per 10 minutes
const signupAttempts = new Map();
function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const limit = 5;
  const attempts = signupAttempts.get(ip) || [];
  const recent = attempts.filter(t => now - t < windowMs);
  if (recent.length >= limit) return true;
  recent.push(now);
  signupAttempts.set(ip, recent);
  return false;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limit by IP
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Please provide username, email, and password.' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  // Validate username (alphanumeric + underscores only, 3-30 chars)
  if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
    return res.status(400).json({ error: 'Username must be 3-30 characters and contain only letters, numbers, or underscores.' });
  }

  // Enforce password strength: min 8 chars, at least one letter and one number
  if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters and include letters and numbers.' });
  }

  try {
    // Check if user already exists
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ error: 'User with this email already exists.' });
    }

    // Hash password and insert
    const passwordHash = hashPassword(password);
    await pool.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [username, email, passwordHash, 'user']
    );

    // Send welcome email (non-blocking)
    sendWelcomeEmail({ to: email, name: username }).catch(err => console.error('Welcome email failed:', err));

    res.status(201).json({ success: true, message: 'User created successfully' });

  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ error: 'Server error during signup' });
  }
}
