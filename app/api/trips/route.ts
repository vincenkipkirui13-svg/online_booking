import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const from = params.get("from")?.trim();
  const to = params.get("to")?.trim();
  const date = params.get("date");
  const passengers = Number(params.get("passengers") ?? "1");

  if (!from || !to || from.toLowerCase() === to.toLowerCase()) {
    return NextResponse.json({ error: "Choose a departure and a different destination." }, { status: 400 });
  }
  if (!Number.isInteger(passengers) || passengers < 1 || passengers > 6) {
    return NextResponse.json({ error: "Passenger count must be between 1 and 6." }, { status: 400 });
  }

  let start: Date | undefined;
  let end: Date | undefined;
  if (date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) {
      return NextResponse.json({ error: "Use a valid travel date in YYYY-MM-DD format." }, { status: 400 });
    }
    start = new Date(date + "T00:00:00+03:00");
    end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  }

  try {
    const now = new Date();
    const trips = await prisma.trip.findMany({
      where: {
        status: "SCHEDULED",
        departureAt: { gte: start ?? now, ...(end ? { lt: end } : {}) },
        route: { active: true, origin: { equals: from, mode: "insensitive" }, destination: { equals: to, mode: "insensitive" } },
        bus: { active: true }
      },
      include: {
        route: true,
        bus: { select: { id: true, name: true, seatCapacity: true } },
        bookings: {
          where: { OR: [
            { status: "CONFIRMED" },
            { status: "PENDING_PAYMENT", holdExpiresAt: { gt: now } }
          ] },
          select: { seatNumbers: true }
        }
      },
      orderBy: { departureAt: "asc" },
      take: 50
    });

    const available = trips.map(({ bookings, ...trip }) => {
      const occupied = new Set(bookings.flatMap((booking) => booking.seatNumbers));
      const availableSeats = Math.max(0, trip.bus.seatCapacity - occupied.size);
      return { ...trip, availableSeats, canFitPassengers: availableSeats >= passengers };
    }).filter((trip) => trip.canFitPassengers);

    return NextResponse.json({ trips: available, count: available.length });
  } catch (error) {
    console.error("Trip search failed", error);
    return NextResponse.json({ error: "Trip search is temporarily unavailable. Please try again." }, { status: 503 });
  }
}
