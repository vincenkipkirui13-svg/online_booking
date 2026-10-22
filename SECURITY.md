# Security and production readiness

- Never commit live M-Pesa, card-provider, database, or admin secrets.
- The homepage currently uses local sample schedules for visual demonstration; connect it to the database trip-search API before launch.
- The booking API creates a temporary ten-minute seat hold. A payment provider integration must be implemented before a booking can be confirmed.
- Seat conflict checks run in a serializable transaction. Test concurrent requests for the same seat and handle database serialization conflicts safely before launch.
- A browser redirect, client-supplied payment status, or initial STK Push acknowledgement is not proof of payment.
- Payment callbacks must be validated, idempotent, and checked against expected amount, booking and provider transaction identifiers.
- Implement server-side admin authentication and authorization before exposing route, bus, trip, or booking management endpoints.
- Add rate limiting, abuse protection, monitoring, and a tested cancellation/refund policy before public launch.
