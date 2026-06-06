import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('Set DATABASE_URL before running this script.');
  process.exit(1);
}

const sql = neon(databaseUrl);

async function main() {
  console.log('Creating Neon tables...');

  await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`;

  await sql`
    CREATE TABLE IF NOT EXISTS forms (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      company TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      product TEXT NOT NULL,
      amount NUMERIC NOT NULL,
      currency TEXT NOT NULL DEFAULT 'INR',
      logo TEXT DEFAULT '',
      qr TEXT NOT NULL,
      telegram TEXT DEFAULT '',
      email TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS submissions (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      form_id TEXT NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  const existing = await sql`SELECT id FROM forms WHERE slug = 'paymentpage1'`;
  if (!existing.length) {
    await sql`
      INSERT INTO forms (company, slug, product, amount, currency, logo, qr, telegram, email)
      VALUES (
        'Cyameta',
        'paymentpage1',
        'DE40 Scalper EA',
        4606,
        'INR',
        '',
        'https://res.cloudinary.com/ddhmtzdhi/image/upload/v1779784574/WhatsApp_Image_2026-05-26_at_1.51.15_PM_i6oaxn.jpg',
        '@Webenoid',
        'smartexpertadvisor1@gmail.com'
      )
    `;
  }

  console.log('Database setup complete.');
}

main().catch((error) => {
  console.error('Database setup failed:', error.message);
  process.exit(1);
});
