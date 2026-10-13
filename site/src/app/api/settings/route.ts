import { NextRequest, NextResponse } from "next/server";
import { store, checkAdmin, isNeonMode } from "@/lib/server/store";
import type { Settings } from "@/lib/types";

export const dynamic = "force-dynamic";

/** GET /api/settings — current site mode */
export async function GET() {
  const settings = await store.getSettings();
  return NextResponse.json(
    { settings, backend: isNeonMode() ? "neon" : "mock" },
    { headers: { "cache-control": "no-store" } },
  );
}

/** PUT /api/settings — toggle mode etc. (admin) */
export async function PUT(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = (await req.json()) as Partial<Settings>;
    if (body.mode && body.mode !== "fair" && body.mode !== "normal") {
      return NextResponse.json({ error: "mode must be 'fair' or 'normal'" }, { status: 400 });
    }
    const settings = await store.updateSettings(body);
    return NextResponse.json({ settings });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Bad request" }, { status: 400 });
  }
}
