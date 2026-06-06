CREATE EXTENSION IF NOT EXISTS pgcrypto;

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
);

CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  form_id TEXT NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
