import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "online-booking",
    databaseConfigured: Boolean(process.env.DATABASE_URL),
    timestamp: new Date().toISOString()
  });
}
