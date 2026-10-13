import { NextRequest, NextResponse } from "next/server";
import { store, checkAdmin, isNeonMode } from "@/lib/server/store";
import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

/** GET /api/posts?category=&tag=&q=&scope=&limit=&drafts=1 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const posts = await store.listPosts({
    category: sp.get("category") ?? undefined,
    tag: sp.get("tag") ?? undefined,
    q: sp.get("q") ?? undefined,
    scope: sp.get("scope") ?? undefined,
    includeDrafts: sp.get("drafts") === "1",
    limit: sp.get("limit") ? Number(sp.get("limit")) : undefined,
  });
  return NextResponse.json(
    { posts, backend: isNeonMode() ? "neon" : "mock" },
    { headers: { "cache-control": "no-store" } },
  );
}

/** POST /api/posts — create (admin) */
export async function POST(req: NextRequest) {
  if (!(await checkAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = (await req.json()) as Partial<Post>;
    if (!body.title || !body.slug) {
      return NextResponse.json({ error: "title and slug are required" }, { status: 400 });
    }
    const slug = body.slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const existing = await store.getPost(slug, true);
    if (existing) return NextResponse.json({ error: "A post with this slug already exists" }, { status: 409 });

    const post: Post = {
      id: `p-${Date.now().toString(36)}`,
      slug,
      title: body.title,
      deck: body.deck ?? "",
      body: Array.isArray(body.body) ? body.body : body.body ? String(body.body).split(/\n\n+/).filter(Boolean) : [],
      category: body.category ?? "News",
      tags: body.tags ?? [],
      author: body.author ?? "OKGS Press Desk",
      role: body.role ?? "Newsroom",
      date: body.date ?? new Date().toISOString(),
      cover: body.cover,
      featured: body.featured ?? false,
      published: body.published ?? true,
      scope: body.scope ?? "both",
    };
    const created = await store.createPost(post);
    return NextResponse.json({ post: created }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Bad request" }, { status: 400 });
  }
}
