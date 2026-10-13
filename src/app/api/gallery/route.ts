import { NextRequest, NextResponse } from "next/server";
import { store, checkAdmin } from "@/lib/server/store";
import type { GalleryItem } from "@/lib/types";

export const dynamic = "force-dynamic";

/** GET /api/gallery — the curated public gallery, in order */
export async function GET() {
  const gallery = await store.listGallery();
  return NextResponse.json(
    { gallery },
    { headers: { "cache-control": "no-store" } },
  );
}

/** POST /api/gallery — add a photo (admin) */
export async function POST(req: NextRequest) {
  if (!(await checkAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = (await req.json()) as Partial<GalleryItem>;
    const src = (body.src ?? "").trim();
    if (!src) return NextResponse.json({ error: "src is required" }, { status: 400 });
    const all = await store.listGallery();
    const kind = body.kind === "video" ? "video" : "image";
    const item: GalleryItem = {
      id: `g-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      src,
      title: (body.title ?? "").trim(),
      category: (body.category ?? "Campus").trim() || "Campus",
      order: Number.isFinite(body.order) ? Number(body.order) : all.length + 1,
      kind,
      poster: (body.poster ?? "").trim() || undefined,
    };
    const created = await store.createGalleryItem(item);
    return NextResponse.json({ item: created }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Bad request" }, { status: 400 });
  }
}
