import NextAuth from "next-auth";

import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import pool from "@/utils/db";
import crypto from "crypto";

function verifyPassword(password, storedHash) {
  const [salt, hash] = storedHash.split(':');
  const verifyHashNew = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  const verifyHashOld = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verifyHashNew || hash === verifyHashOld;
}

const providers = [];

// Only add Google/Github providers if the environment variables are set


if (process.env.GOOGLE_ID && process.env.GOOGLE_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    })
  );
}

// Credentials Provider for both Admin and a fallback Test User
providers.push(
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      username: { label: "Email / Username", type: "text", placeholder: "Email or admin" },
      password: { label: "Password", type: "password", placeholder: "password" }
    },
    async authorize(credentials, req) {
      const adminUser = process.env.ADMIN_USER;
      const adminPass = process.env.ADMIN_PASS;

      // 1. Check for Admin Login (only if explicit env vars are set)
      if (adminUser && adminPass && credentials.username === adminUser && credentials.password === adminPass) {
        return { id: "1", name: "Admin", email: adminUser, role: "admin" };
      }

      // 2. Database User Login
      if (credentials.username && credentials.password) {
        try {
          // Check if table exists implicitly by querying
          const [users] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [credentials.username]
          );

          if (users.length > 0) {
            const user = users[0];
            const isValid = verifyPassword(credentials.password, user.password_hash);
            
            if (isValid) {
              return { 
                id: user.id.toString(), 
                name: user.username, 
                email: user.email, 
                role: user.role || "user" 
              };
            }
          }
        } catch (dbError) {
          console.error("DB Error during auth:", dbError);
        }
      }

      return null;
    }
  })
);

export const authOptions = {
  providers,
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60, // 2 hours
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === 'google') {
        try {
          await pool.query(
            'INSERT IGNORE INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [user.name, user.email, 'GOOGLE_AUTH', 'user']
          );
        } catch (e) {
          console.error("Failed to auto-create google user", e);
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    }
  },
};

export default NextAuth(authOptions);
