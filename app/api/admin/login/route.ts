import { NextRequest, NextResponse } from "next/server";
import { adminCookieName, createAdminSession } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  let body: { username?: string; password?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) return NextResponse.json({ error: "Admin credentials are not configured." }, { status: 503 });
  if (body.username !== username || body.password !== password) {
    return NextResponse.json({ error: "Incorrect username or password." }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookieName, createAdminSession(), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict",
    path: "/", maxAge: 8 * 60 * 60
  });
  return response;
}
