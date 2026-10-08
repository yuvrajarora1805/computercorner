const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env' });

async function main() {
  console.log('Connecting to database using Next.js credentials...');
  
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'db',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'pc_build_db',
  });

  try {
    console.log('Successfully connected! Applying updates...');
    
    // Add Profile Fields
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
      ADD COLUMN IF NOT EXISTS address TEXT,
      ADD COLUMN IF NOT EXISTS city VARCHAR(100),
      ADD COLUMN IF NOT EXISTS state VARCHAR(100),
      ADD COLUMN IF NOT EXISTS pincode VARCHAR(20);
    `);
    console.log('Profile fields checked/added.');

    // Add Reset Password Fields
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255) NULL, 
      ADD COLUMN IF NOT EXISTS reset_token_expiry BIGINT NULL;
    `);
    console.log('Password reset fields checked/added.');

    console.log('✅ Database schema update fully complete!');
  } catch (error) {
    console.error('❌ Error updating database:', error);
  } finally {
    await pool.end();
  }
}

main();
