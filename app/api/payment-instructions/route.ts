import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const type = process.env.MPESA_PAYMENT_TYPE === "TILL" ? "TILL" : "PAYBILL";
  const number = type === "TILL"
    ? process.env.MPESA_TILL_NUMBER?.trim()
    : process.env.MPESA_PAYBILL_NUMBER?.trim();

  return NextResponse.json({
    method: "MPESA",
    type,
    number: number || null,
    accountName: process.env.MPESA_ACCOUNT_NAME?.trim() || null,
    configured: Boolean(number),
    instructions: type === "TILL"
      ? ["Open M-Pesa", "Choose Lipa na M-Pesa / Buy Goods", "Enter the Till number shown", "Enter the exact booking amount and complete payment", "Keep the M-Pesa confirmation code"]
      : ["Open M-Pesa", "Choose Lipa na M-Pesa / Pay Bill", "Enter the Paybill number shown", "Use your booking reference as the account number if the business confirms this setup", "Enter the exact booking amount and complete payment", "Keep the M-Pesa confirmation code"]
  });
}
