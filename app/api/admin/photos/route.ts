import { NextRequest, NextResponse } from "next/server";
import { list, put } from "@vercel/blob";
import { isAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  try {
    const result = await list({ prefix: "prestige/" });
    return NextResponse.json({ photos: result.blobs.map((blob) => ({ url: blob.url, pathname: blob.pathname, uploadedAt: blob.uploadedAt })) });
  } catch {
    return NextResponse.json({ error: "Photo storage is not ready. Check the Vercel Blob connection." }, { status: 503 });
  }
}
export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  try {
    const data = await request.formData();
    const files = data.getAll("photos").filter((item): item is File => item instanceof File);
    if (!files.length) return NextResponse.json({ error: "Choose at least one photo." }, { status: 400 });
    if (files.length > 10) return NextResponse.json({ error: "Upload up to 10 photos at a time." }, { status: 400 });
    const uploaded = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
      if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: "Each photo must be 8 MB or smaller." }, { status: 413 });
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-100) || "photo.jpg";
      const blob = await put("prestige/" + Date.now() + "-" + safeName, file, { access: "public", addRandomSuffix: true });
      uploaded.push({ url: blob.url, pathname: blob.pathname });
    }
    return NextResponse.json({ uploaded });
  } catch {
    return NextResponse.json({ error: "Upload failed. Confirm the Vercel Blob store is connected to this project." }, { status: 503 });
  }
}
