# SafariLine — Kenya Bus Booking

A mobile-first intercity bus booking website built with Next.js for a single transport operator. The intended production platform is Vercel with managed PostgreSQL.

## Current state

The repository now contains the first UI and architecture scaffold:
- Responsive passenger-facing landing page and trip-search preview.
- Sample route cards and example schedules to demonstrate the experience.
- Passenger details preview and M-Pesa/card payment selection UI.
- Initial PostgreSQL/Prisma data model for routes, buses, trips, bookings and payments.
- Environment variable template with payment secrets kept server-side.

**Important:** This is a development preview, not a live booking or payment service. Displayed routes, fares, times and seat counts are sample data. No seat is reserved, no ticket is issued and no payment is collected yet. Connect the database, live trip inventory, seat locking, authentication and verified payment callbacks before taking real bookings.

## Stack

- Next.js App Router + React + TypeScript
- PostgreSQL + Prisma
- Vercel hosting
- Safaricom Daraja for M-Pesa STK Push
- Card payments provider (Paystack is the initial intended option)

## Local setup

Requirements: Node.js 20.9+ (Node 22 recommended) and npm.

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:3000.

To configure PostgreSQL and generate the client:

```bash
# Set DATABASE_URL in .env first
npx prisma generate
npx prisma migrate dev --name init
```

Do not run migrations until a valid PostgreSQL database is available.

## Deploy to Vercel

1. Import `vincenkipkirui13-svg/online_booking` from GitHub into Vercel.
2. Select the Next.js framework preset and the `main` branch.
3. Add environment variables in Vercel Project Settings → Environment Variables.
4. Attach a managed PostgreSQL database and set `DATABASE_URL`.
5. Deploy, then test the preview URL before attaching a custom domain.

Vercel's Next.js support provides framework-aware deployments and API routes. Environment variables are configured per project/environment and require a redeployment to take effect.

## Payment safety checklist

### M-Pesa
- Create a Daraja application and test in sandbox first.
- Keep consumer key, consumer secret, passkey and callback secrets on the server only.
- Initiate STK Push from a server route; do not mark a booking paid from the initial STK response.
- Verify the signed/expected callback shape, result code, amount, shortcode and transaction reference.
- Handle duplicate callbacks idempotently and reconcile missed callbacks before confirming tickets.
- Use the production callback URL and approved live credentials only after business onboarding.

Official portal: https://developer.safaricom.co.ke/apis/GettingStarted

### Card payments
- Use a provider-hosted/secure checkout flow and server-side transaction verification.
- Never trust a client redirect alone as proof of payment.
- Confirm a booking only after a verified provider webhook or server-side verification.
- Never store card numbers or CVV in this application.

## Before accepting real bookings

- [ ] Confirm business/brand name, support contacts and ticket terms.
- [ ] Configure actual routes, fares, vehicles, seat maps and departure schedules.
- [ ] Implement database-backed trip search and atomic seat inventory/temporary holds.
- [ ] Implement customer booking creation, reference generation and ticket delivery.
- [ ] Implement protected admin login and role checks.
- [ ] Implement Daraja STK Push and verified callbacks.
- [ ] Implement card checkout and server-side payment verification.
- [ ] Add rate limiting, validation, audit logs, monitoring and privacy/retention rules.
- [ ] Test duplicate-seat race conditions, duplicate callbacks, failed payments, refunds and cancellations.
- [ ] Run production readiness checks and test with a small controlled release.

## Security notes

- Never commit `.env` or live API keys.
- Use HTTPS in production.
- Keep admin routes private and enforce authorization on the server.
- Treat payment callbacks as untrusted until validated.
- A booking is not confirmed until payment is verified and seat inventory is secured.
