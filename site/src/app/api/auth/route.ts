import { NextRequest, NextResponse } from "next/server";
import { ADMIN_KEY } from "@/lib/server/store";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth — mock sign-in for the admin studio.
 * { key: "…" } → { ok: true, token: <admin key echo> }
 * In production, swap this for a real auth provider — every
 * mutating endpoint already validates the x-admin-key header.
 */
export async function POST(req: NextRequest) {
  try {
    const { key } = (await req.json()) as { key?: string };
    if (!key || key !== ADMIN_KEY) {
      return NextResponse.json({ ok: false, error: "Invalid access key" }, { status: 401 });
    }
    return NextResponse.json({ ok: true, token: ADMIN_KEY, role: "editor" });
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}
