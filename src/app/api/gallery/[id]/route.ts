import { NextRequest, NextResponse } from "next/server";
import { store, checkAdmin } from "@/lib/server/store";
import type { GalleryItem } from "@/lib/types";

export const dynamic = "force-dynamic";

/** PUT /api/gallery/[id] — update title/category/order (admin) */
export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await ctx.params;
    const body = (await req.json()) as Partial<GalleryItem>;
    const patch: Partial<GalleryItem> = {};
    if (typeof body.title === "string") patch.title = body.title.trim();
    if (typeof body.category === "string") patch.category = body.category.trim() || "Campus";
    if (typeof body.src === "string" && body.src.trim()) patch.src = body.src.trim();
    if (Number.isFinite(body.order)) patch.order = Number(body.order);
    const item = await store.updateGalleryItem(id, patch);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ item });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Bad request" }, { status: 400 });
  }
}

/** DELETE /api/gallery/[id] — remove a photo (admin) */
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await ctx.params;
    const ok = await store.deleteGalleryItem(id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Bad request" }, { status: 400 });
  }
}
