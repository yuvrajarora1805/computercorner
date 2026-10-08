-- Run this script on your production MySQL server to update the database schema for the new features.

-- 1. Add Profile Fields to Users Table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS state VARCHAR(100),
ADD COLUMN IF NOT EXISTS pincode VARCHAR(20);

-- 2. Add Password Reset Fields to Users Table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255) NULL, 
ADD COLUMN IF NOT EXISTS reset_token_expiry BIGINT NULL;
