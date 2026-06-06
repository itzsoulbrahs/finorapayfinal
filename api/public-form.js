import { cors, getDb } from './_lib.js';

export default async function handler(req, res) {
  cors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { slug } = req.query;
  if (!slug) {
    return res.status(400).json({ error: 'slug required' });
  }

  const sql = getDb();
  const [row] = await sql`SELECT * FROM forms WHERE slug = ${slug}`;

  if (!row) {
    return res.status(404).json({ error: 'Form not found' });
  }

  return res.json(row);
}
