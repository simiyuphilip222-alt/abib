# ABIB Store — Upgraded Project

This project was upgraded to include:
- Tailwind CSS scaffolding (install dependencies then run `npx tailwindcss init -p`)
- Hidden admin login (POST to /api/admin/auth checks ADMIN_PASSWORD env var)
- Simple product API (in-memory for starter) at /api/products
- Payment placeholders for Stripe and M-Pesa (implement keys in .env.local)

## Quick start
1. Unzip and `cd` into project
2. Create `.env.local` from `.env.example` and set ADMIN_PASSWORD
3. Install packages:
   ```
   npm install
   ```
4. Run dev:
   ```
   npm run dev
   ```

## Notes on Payments
- Stripe: add `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, then implement the create-checkout-session API.
- M-Pesa: will require server-side OAuth with consumer key/secret; we added placeholders in `.env.example`.

## Deploying to Vercel
- Push to GitHub, connect Vercel, add environment variables in Vercel dashboard (ADMIN_PASSWORD, STRIPE keys, SUPABASE keys).
