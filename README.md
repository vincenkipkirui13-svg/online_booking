# SafariLine — Kenya Bus Booking

A mobile-first intercity bus booking website for a single transport operator, built with Next.js, PostgreSQL and Prisma. Vercel is the intended hosting platform.

## Current state

- Responsive passenger-facing booking homepage and sample route search.
- Initial PostgreSQL/Prisma data model for routes, buses, trips, bookings and payments.
- Database-backed trip search and booking API scaffolding.
- Manual M-Pesa payment configuration for Paybill or Till number.
- Customers will pay in the M-Pesa app/SIM Toolkit, then submit the transaction code for verification.

**Not ready for real bookings yet:** displayed routes, fares, departure times and seat counts are sample data. Database setup, real trip/seat inventory, secure admin tools, payment verification and ticket delivery must be completed before launch.

## Payment flow

1. Customer selects a trip and requests seats.
2. Website displays the configured Paybill or Till number and payment instructions.
3. Customer pays manually through M-Pesa and enters the M-Pesa transaction code.
4. The booking stays **PENDING_PAYMENT** until the business verifies the payment against its M-Pesa statement/portal or a trusted Safaricom C2B confirmation integration.
5. Only after verification should an authorized server-side action mark the payment successful and confirm the booking.

Never confirm a ticket solely because a customer typed a transaction code. Do not ask for or collect the customer's M-Pesa PIN. Do not store card details; card payments are not part of the current plan.

Safaricom's official C2B API can send notifications for successful payments to Paybill or Till numbers if the business is eligible and completes the integration: https://developer.safaricom.co.ke/apis/CustomerToBusiness

## Stack

- Next.js App Router, React and TypeScript
- PostgreSQL and Prisma
- Vercel hosting

## Local setup

Requirements: Node.js 20.9+ (Node 22 recommended) and npm.

```bash
npm install
cp .env.example .env
npm run dev
```

Set a real PostgreSQL `DATABASE_URL` before running migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

## Vercel deployment

1. Import `vincenkipkirui13-svg/online_booking` into Vercel.
2. Select the Next.js framework preset and `main` branch.
3. Attach managed PostgreSQL and configure `DATABASE_URL`.
4. Configure `MPESA_PAYMENT_TYPE`, and either `MPESA_PAYBILL_NUMBER` or `MPESA_TILL_NUMBER`; set `MPESA_ACCOUNT_NAME` if useful.
5. Deploy and test on a preview URL before attaching a custom domain.

## Before accepting real bookings

- [ ] Configure the actual business name, customer support contacts and payment instructions.
- [ ] Add actual routes, bus seat layouts, fares and departure schedules.
- [ ] Connect the public search UI to database trip search.
- [ ] Finish atomic seat reservation/expiry and retry-safe conflict handling.
- [ ] Implement protected admin login and role checks.
- [ ] Finish booking creation and the customer transaction-code submission UI.
- [ ] Implement manual reconciliation and/or Safaricom C2B confirmation callbacks.
- [ ] Confirm payment and issue tickets only after server-side verification.
- [ ] Add ticket delivery, cancellation/refund policy, rate limiting, audit logs and monitoring.
- [ ] Test simultaneous seat selection, duplicate receipts, failed/unverified payments and expired holds.

## Security

- Never commit `.env` or private keys.
- Use HTTPS in production.
- Keep admin routes private and enforce authorization on the server.
- Treat customer-submitted transaction codes as claims, not proof of payment.
