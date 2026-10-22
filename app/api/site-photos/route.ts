import { list } from "@vercel/blob";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const result = await list({ prefix: "prestige/" });
    const photos = result.blobs
      .filter((blob) => /\.(jpe?g|png|webp|avif|gif)$/i.test(blob.pathname))
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
      .map((blob) => ({ url: blob.url, pathname: blob.pathname, slot: blob.pathname.split("/")[1] || "gallery" }));
    const firstFor = (slot: string) => photos.find((photo) => photo.slot === slot)?.url || null;
    const legacyHero = photos.find((photo) => photo.pathname.split("/").length === 2)?.url || null;
    return NextResponse.json({
      photos,
      slots: {
        hero: firstFor("hero") || legacyHero,
        "route-nakuru": firstFor("route-nakuru"),
        "route-eldoret": firstFor("route-eldoret"),
        "route-mombasa": firstFor("route-mombasa")
      }
    });
  } catch {
    return NextResponse.json({ photos: [], slots: {} });
  }
}
