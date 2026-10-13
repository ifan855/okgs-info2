import { NextRequest, NextResponse } from "next/server";
import { store, checkAdmin } from "@/lib/server/store";
import type { Submission } from "@/lib/types";

export const dynamic = "force-dynamic";

/** GET /api/submissions — inbox (admin) */
export async function GET(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const submissions = await store.listSubmissions();
  return NextResponse.json({ submissions }, { headers: { "cache-control": "no-store" } });
}

/** POST /api/submissions — public: contact / register / tip */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<Submission>;
    if (!body.name?.trim() || !body.message?.trim() || !body.email?.trim()) {
      return NextResponse.json({ error: "name, email and message are required" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) {
      return NextResponse.json({ error: "Please provide a valid email address" }, { status: 400 });
    }
    const submission: Submission = {
      id: `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      kind: body.kind ?? "contact",
      name: body.name.trim().slice(0, 120),
      email: body.email.trim().slice(0, 160),
      phone: body.phone?.trim().slice(0, 40) || undefined,
      subject: (body.subject ?? "").trim().slice(0, 200) || "General enquiry",
      message: body.message.trim().slice(0, 4000),
      status: "new",
      extra: body.extra ?? {},
      createdAt: new Date().toISOString(),
    };
    const created = await store.createSubmission(submission);
    return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Bad request" }, { status: 400 });
  }
}
