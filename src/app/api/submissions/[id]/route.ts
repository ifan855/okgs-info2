import { NextRequest, NextResponse } from "next/server";
import { store, checkAdmin } from "@/lib/server/store";
import type { Submission } from "@/lib/types";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/** PATCH /api/submissions/[id] — update status (admin) */
export async function PATCH(req: NextRequest, ctx: Ctx) {
  if (!(await checkAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  try {
    const body = (await req.json()) as { status?: Submission["status"] };
    if (!body.status || !["new", "read", "archived"].includes(body.status)) {
      return NextResponse.json({ error: "status must be new | read | archived" }, { status: 400 });
    }
    const updated = await store.updateSubmissionStatus(id, body.status);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ submission: updated });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Bad request" }, { status: 400 });
  }
}
