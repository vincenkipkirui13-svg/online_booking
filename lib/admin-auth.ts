import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

const COOKIE = "prestige_admin_session";
function signature(value: string) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not configured");
  return createHmac("sha256", secret).update(value).digest("hex");
}
export function createAdminSession() {
  const expires = String(Date.now() + 8 * 60 * 60 * 1000);
  return expires + "." + signature(expires);
}
export function isAdminRequest(request: NextRequest) {
  try {
    const value = request.cookies.get(COOKIE)?.value || "";
    const [expires, supplied] = value.split(".");
    if (!expires || !supplied || Number(expires) < Date.now()) return false;
    const expected = signature(expires);
    const a = Buffer.from(supplied);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch { return false; }
}
export const adminCookieName = COOKIE;
