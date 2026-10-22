import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const receiptSchema = z.object({
  transactionCode: z.string().trim().toUpperCase().regex(/^[A-Z0-9]{8,12}$/, "Enter the M-Pesa transaction code shown in your confirmation message.")
});

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ reference: string }> }
) {
  const { reference } = await context.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = receiptSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid M-Pesa transaction code.", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { reference },
      include: { payments: { where: { status: "PENDING" }, select: { id: true, amountKes: true, customerTransactionCode: true } } }
    });
    if (!booking) return NextResponse.json({ error: "Booking reference was not found." }, { status: 404 });
    if (booking.status !== "PENDING_PAYMENT") {
      return NextResponse.json({ error: "This booking is no longer awaiting payment." }, { status: 409 });
    }
    if (booking.holdExpiresAt && booking.holdExpiresAt <= new Date()) {
      return NextResponse.json({ error: "The temporary seat hold has expired. Please search and book again." }, { status: 410 });
    }
    if (!booking.payments.length) {
      return NextResponse.json({ error: "No pending payment record exists for this booking." }, { status: 409 });
    }

    const payment = booking.payments[0];
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        customerTransactionCode: parsed.data.transactionCode,
        paymentSubmittedAt: new Date(),
        status: "PROCESSING"
      }
    });

    return NextResponse.json({
      reference: booking.reference,
      amountKes: payment.amountKes,
      paymentStatus: "PROCESSING",
      bookingStatus: "PENDING_PAYMENT",
      message: "Your M-Pesa code has been submitted for verification. Your ticket is not confirmed yet."
    }, { status: 202 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "This M-Pesa transaction code has already been submitted. Contact support if you believe this is a mistake." }, { status: 409 });
    }
    console.error("M-Pesa receipt submission failed", error);
    return NextResponse.json({ error: "Could not submit the payment code right now. Please try again." }, { status: 503 });
  }
}
