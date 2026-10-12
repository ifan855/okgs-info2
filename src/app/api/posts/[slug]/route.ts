import { NextRequest, NextResponse } from "next/server";
import { store, checkAdmin } from "@/lib/server/store";
import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ slug: string }> };

/** GET /api/posts/[slug] */
export async function GET(req: NextRequest, ctx: Ctx) {
  const { slug } = await ctx.params;
  const drafts = req.nextUrl.searchParams.get("drafts") === "1";
  const post = await store.getPost(slug, drafts);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ post }, { headers: { "cache-control": "no-store" } });
}

/** PUT /api/posts/[slug] — update (admin) */
export async function PUT(req: NextRequest, ctx: Ctx) {
  if (!(await checkAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { slug } = await ctx.params;
  try {
    const body = (await req.json()) as Partial<Post> & { body?: string[] | string };
    if (typeof body.body === "string") {
      body.body = body.body.split(/\n\n+/).filter(Boolean);
    }
    const updated = await store.updatePost(slug, body);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ post: updated });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Bad request" }, { status: 400 });
  }
}

/** DELETE /api/posts/[slug] — delete (admin) */
export async function DELETE(req: NextRequest, ctx: Ctx) {
  if (!(await checkAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { slug } = await ctx.params;
  const ok = await store.deletePost(slug);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
