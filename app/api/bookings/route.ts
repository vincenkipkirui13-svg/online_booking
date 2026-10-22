import { randomBytes } from "node:crypto";
import { BookingStatus, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const bookingSchema = z.object({
  tripId: z.string().min(1).max(100),
  passengerName: z.string().trim().min(2).max(100),
  passengerPhone: z.string().trim().regex(/^(?:\+?254|0)[17]\d{8}$/, "Enter a valid Kenyan mobile number."),
  passengerEmail: z.union([z.string().trim().email().max(200), z.literal("")]).optional(),
  seatNumbers: z.array(z.string().trim().regex(/^\d{1,2}$/)).min(1).max(6),
  paymentMethod: z.literal("MPESA").default("MPESA")
}).superRefine((value, context) => {
  if (new Set(value.seatNumbers).size !== value.seatNumbers.length) {
    context.addIssue({ code: "custom", path: ["seatNumbers"], message: "Each passenger must have a different seat." });
  }
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the booking details.", details: parsed.error.flatten() }, { status: 400 });
  }

  const input = parsed.data;
  const holdExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  const reference = "SL" + Date.now().toString(36).toUpperCase() + randomBytes(3).toString("hex").toUpperCase();

  try {
    const booking = await prisma.$transaction(async (tx) => {
      const trip = await tx.trip.findFirst({
        where: { id: input.tripId, status: "SCHEDULED", departureAt: { gt: new Date() }, route: { active: true }, bus: { active: true } },
        include: { bus: true }
      });
      if (!trip) throw new Error("TRIP_UNAVAILABLE");

      if (input.seatNumbers.some((seat) => Number(seat) < 1 || Number(seat) > trip.bus.seatCapacity)) {
        throw new Error("INVALID_SEAT");
      }

      const occupiedBookings = await tx.booking.findMany({
        where: {
          tripId: trip.id,
          OR: [
            { status: BookingStatus.CONFIRMED },
            { status: BookingStatus.PENDING_PAYMENT, holdExpiresAt: { gt: new Date() } }
          ]
        },
        select: { seatNumbers: true }
      });
      const occupied = new Set(occupiedBookings.flatMap((item) => item.seatNumbers));
      if (input.seatNumbers.some((seat) => occupied.has(seat))) throw new Error("SEAT_UNAVAILABLE");

      return tx.booking.create({
        data: {
          reference,
          tripId: trip.id,
          passengerName: input.passengerName,
          passengerPhone: input.passengerPhone.replace(/^\+/, ""),
          passengerEmail: input.passengerEmail || null,
          seatNumbers: input.seatNumbers,
          passengerCount: input.seatNumbers.length,
          totalKes: trip.fareKes * input.seatNumbers.length,
          status: BookingStatus.PENDING_PAYMENT,
          holdExpiresAt,
          payments: {
            create: {
              method: "MPESA",
              amountKes: trip.fareKes * input.seatNumbers.length,
              status: "PENDING"
            }
          }
        },
        select: {
          id: true, reference: true, passengerName: true, passengerPhone: true,
          seatNumbers: true, passengerCount: true, totalKes: true, status: true, holdExpiresAt: true
        }
      });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, timeout: 10000 });

    return NextResponse.json({
      booking,
      message: "Seats are held temporarily. Payment integration must verify payment before this booking can be confirmed."
    }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "TRIP_UNAVAILABLE") return NextResponse.json({ error: "This trip is no longer available." }, { status: 409 });
    if (message === "INVALID_SEAT") return NextResponse.json({ error: "One or more seat numbers are invalid for this bus." }, { status: 400 });
    if (message === "SEAT_UNAVAILABLE") return NextResponse.json({ error: "One or more selected seats have already been taken. Please choose different seats." }, { status: 409 });
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
      return NextResponse.json({ error: "Another booking was made at the same time. Please refresh and try again." }, { status: 409 });
    }
    console.error("Booking creation failed", error);
    return NextResponse.json({ error: "Booking service is not ready. Check the database configuration and try again." }, { status: 503 });
  }
}
