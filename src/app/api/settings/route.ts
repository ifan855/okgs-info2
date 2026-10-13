import { NextRequest, NextResponse } from "next/server";
import { store, checkAdmin, isNeonMode } from "@/lib/server/store";
import type { Settings } from "@/lib/types";

export const dynamic = "force-dynamic";

/** GET /api/settings — current site mode + fair identity (public) */
export async function GET() {
  const settings = await store.getSettings();
  return NextResponse.json(
    { settings, backend: isNeonMode() ? "neon" : "mock" },
    { headers: { "cache-control": "no-store" } },
  );
}

/** PUT /api/settings — toggle mode / rename the fair etc. (admin) */
export async function PUT(req: NextRequest) {
  if (!(await checkAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = (await req.json()) as Partial<Settings>;
    if (body.mode && body.mode !== "fair" && body.mode !== "normal") {
      return NextResponse.json({ error: "mode must be 'fair' or 'normal'" }, { status: 400 });
    }
    const patch: Partial<Settings> = {};
    if (typeof body.mode === "string") patch.mode = body.mode;
    if (typeof body.banner === "string") patch.banner = body.banner;
    if (typeof body.fairName === "string") {
      const name = body.fairName.trim();
      if (!name) return NextResponse.json({ error: "Fair name cannot be empty" }, { status: 400 });
      if (name.length > 80) return NextResponse.json({ error: "Fair name is too long (max 80)" }, { status: 400 });
      patch.fairName = name;
    }
    if (typeof body.fairTagline === "string") {
      const tag = body.fairTagline.trim();
      if (tag.length > 120) return NextResponse.json({ error: "Tagline is too long (max 120)" }, { status: 400 });
      patch.fairTagline = tag;
    }
    const settings = await store.updateSettings(patch);
    return NextResponse.json({ settings });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Bad request" }, { status: 400 });
  }
}
