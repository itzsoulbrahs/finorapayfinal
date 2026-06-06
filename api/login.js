import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cors } from './_lib.js';

export default async function handler(req, res) {
  cors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body || {};
  if (!password) {
    return res.status(400).json({ error: 'Password required' });
  }

  if (!process.env.ADMIN_PASSWORD_HASH || !process.env.JWT_SECRET) {
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  const valid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
  if (!valid) {
    return res.status(401).json({ error: 'Incorrect password' });
  }

  const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, {
    expiresIn: '12h'
  });

  return res.json({ token });
}
