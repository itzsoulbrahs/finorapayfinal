import { cors, getDb, requireAuth } from './_lib.js';

export default async function handler(req, res) {
  cors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!requireAuth(req, res)) {
    return;
  }

  const sql = getDb();

  if (req.method === 'GET') {
    const rows = await sql`SELECT * FROM forms ORDER BY created_at DESC`;
    return res.json(rows);
  }

  if (req.method === 'POST') {
    const { company, slug, product, amount, currency, logo, qr, telegram, email } = req.body || {};

    if (!company || !slug || !product || !amount || !qr) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existing = await sql`SELECT id FROM forms WHERE slug = ${slug}`;
    if (existing.length) {
      return res.status(409).json({ error: 'Slug already taken' });
    }

    const [row] = await sql`
      INSERT INTO forms (company, slug, product, amount, currency, logo, qr, telegram, email)
      VALUES (${company}, ${slug}, ${product}, ${Number(amount)}, ${currency || 'INR'}, ${logo || ''}, ${qr}, ${telegram || ''}, ${email || ''})
      RETURNING *
    `;

    return res.status(201).json(row);
  }

  if (req.method === 'PUT') {
    const { id } = req.query;
    const { company, slug, product, amount, currency, logo, qr, telegram, email } = req.body || {};

    if (!id) {
      return res.status(400).json({ error: 'ID required' });
    }

    if (!company || !slug || !product || !amount || !qr) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existing = await sql`SELECT id FROM forms WHERE slug = ${slug} AND id != ${id}`;
    if (existing.length) {
      return res.status(409).json({ error: 'Slug already taken' });
    }

    const [row] = await sql`
      UPDATE forms
      SET
        company = ${company},
        slug = ${slug},
        product = ${product},
        amount = ${Number(amount)},
        currency = ${currency || 'INR'},
        logo = ${logo || ''},
        qr = ${qr},
        telegram = ${telegram || ''},
        email = ${email || ''}
      WHERE id = ${id}
      RETURNING *
    `;

    if (!row) {
      return res.status(404).json({ error: 'Form not found' });
    }

    return res.json(row);
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'ID required' });
    }

    await sql`DELETE FROM forms WHERE id = ${id}`;
    return res.json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
