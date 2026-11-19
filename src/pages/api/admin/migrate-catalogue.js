import pool from '@/utils/db';
import fs from 'fs';
import path from 'path';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
  // Option 1: Direct username & password authentication via POST body or query
  const username = req.body?.username || req.query?.username;
  const password = req.body?.password || req.query?.password;

  const envAdminUser = process.env.ADMIN_USER || 'thecomputercorner@gmail.com';
  const envAdminPass = process.env.ADMIN_PASS || 'Thecomputercorner@2457';

  let isAuthorized = false;

  if (username === envAdminUser && password === envAdminPass) {
    isAuthorized = true;
  }

  // Option 2: Active Admin Session (if logged into /admin dashboard)
  if (!isAuthorized) {
    const session = await getServerSession(req, res, authOptions);
    if (session && session.user && session.user.role === 'admin') {
      isAuthorized = true;
    }
  }

  // Option 3: Fallback secret key query (?secret=Thecomputercorner@2457)
  if (!isAuthorized) {
    const secret = req.query.secret || req.body?.secret;
    if (secret === envAdminPass) {
      isAuthorized = true;
    }
  }

  if (!isAuthorized) {
    return res.status(401).json({ 
      error: 'Unauthorized: Invalid username, password, or admin session.',
      usage: 'Pass username & password in POST body, query string (?username=...&password=...), or login at /admin'
    });
  }

  try {
    const sqlPath = path.join(process.cwd(), 'sync_products.sql');
    if (!fs.existsSync(sqlPath)) {
      return res.status(404).json({ error: 'sync_products.sql not found on server' });
    }

    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Split into clear and insert statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    let executed = 0;
    for (const stmt of statements) {
      await pool.query(stmt);
      executed++;
    }

    const [countRows] = await pool.query('SELECT count(*) as total FROM products');

    return res.status(200).json({
      success: true,
      message: 'Successfully cleared old products and imported all 1,264 new catalogue products!',
      totalProductsInDB: countRows[0].total
    });
  } catch (error) {
    console.error('Migration error:', error);
    return res.status(500).json({ error: error.message });
  }
}
