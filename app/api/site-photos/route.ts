import { list } from "@vercel/blob";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const result = await list({ prefix: "prestige/" });
    const photos = result.blobs
      .filter((blob) => /\.(jpe?g|png|webp|avif)$/i.test(blob.pathname))
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
      .map((blob) => ({ url: blob.url, pathname: blob.pathname }));
    return NextResponse.json({ photos });
  } catch {
    return NextResponse.json({ photos: [] });
  }
}
