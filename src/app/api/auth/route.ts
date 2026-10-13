import { NextRequest, NextResponse } from "next/server";
import { store, checkAdmin } from "@/lib/server/store";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth — admin sign-in.
 * { key: "…" } → verifies against the password hash stored in the
 * database (seed: genesis2026). The key itself is echoed back and
 * used as the x-admin-key header on every mutating request.
 */
export async function POST(req: NextRequest) {
  try {
    const { key } = (await req.json()) as { key?: string };
    if (!key || !(await store.verifyAdminPassword(key))) {
      return NextResponse.json({ ok: false, error: "Incorrect password" }, { status: 401 });
    }
    return NextResponse.json({ ok: true, token: key, role: "editor" });
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}

/**
 * PUT /api/auth — rotate the admin password (signed in).
 * { currentKey, newKey } + x-admin-key header → new hash stored in the DB.
 */
export async function PUT(req: NextRequest) {
  try {
    const { currentKey, newKey } = (await req.json()) as { currentKey?: string; newKey?: string };
    if (!newKey || newKey.length < 6) {
      return NextResponse.json({ ok: false, error: "New password must be at least 6 characters" }, { status: 400 });
    }
    const signedIn = await checkAdmin(req);
    if (!signedIn) {
      return NextResponse.json({ ok: false, error: "Sign in first" }, { status: 401 });
    }
    const ok = await store.changeAdminPassword(currentKey ?? "", newKey);
    if (!ok) {
      return NextResponse.json({ ok: false, error: "Current password is incorrect" }, { status: 403 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}
