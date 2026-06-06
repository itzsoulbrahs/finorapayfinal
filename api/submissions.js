import { cors, getDb, requireAuth } from './_lib.js';

export default async function handler(req, res) {
  cors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const sql = getDb();

  if (req.method === 'POST') {
    const { form_id, name, email, phone } = req.body || {};

    if (!form_id || !name || !email || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [row] = await sql`
      INSERT INTO submissions (form_id, name, email, phone)
      VALUES (${form_id}, ${name}, ${email}, ${phone})
      RETURNING *
    `;

    return res.status(201).json(row);
  }

  if (req.method === 'GET') {
    if (!requireAuth(req, res)) {
      return;
    }

    const { form_id } = req.query;
    const rows = form_id
      ? await sql`SELECT * FROM submissions WHERE form_id = ${form_id} ORDER BY created_at DESC`
      : await sql`
          SELECT s.*, f.company, f.product
          FROM submissions s
          LEFT JOIN forms f ON f.id = s.form_id
          ORDER BY s.created_at DESC
        `;

    return res.json(rows);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
