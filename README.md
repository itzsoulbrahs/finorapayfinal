# FinoraPay / Cyameta Payment Gateway

This project is a Vercel-friendly payment form app backed by Neon Postgres.

## What it does

- Admin login with a password hash
- Create, edit, and delete payment forms
- Public payment pages by slug
- Save customer payment submissions to Neon

## Local setup

1. Install dependencies:

   `npm install`

2. Create `.env.local` from `.env.example`

3. Generate your admin password hash:

   `node scripts/gen-hash.js "your-password"`

4. Put the generated hash into `.env.local` as `ADMIN_PASSWORD_HASH`

5. Add your Neon connection string as `DATABASE_URL`

6. Add a random secret as `JWT_SECRET`

7. Create the database tables:

   `npm run setup-db`

8. Start locally:

   `npm run dev`

## Vercel deploy

Add these environment variables in Vercel:

- `DATABASE_URL`
- `JWT_SECRET`
- `ADMIN_PASSWORD_HASH`

Then deploy normally with Vercel.

## Main routes

- `/#dashboard` admin dashboard
- `/#paymentpage1` example public payment page
- `/api/login`
- `/api/forms`
- `/api/public-form`
- `/api/submissions`
