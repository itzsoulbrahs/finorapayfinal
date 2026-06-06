import { neon } from '@neondatabase/serverless';
import jwt from 'jsonwebtoken';

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL not set');
  }

  return neon(process.env.DATABASE_URL);
}

export function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export function verifyToken(req) {
  const auth = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '').trim();

  if (!token) {
    throw new Error('No token');
  }

  return jwt.verify(token, process.env.JWT_SECRET);
}

export function requireAuth(req, res) {
  try {
    verifyToken(req);
    return true;
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
}
