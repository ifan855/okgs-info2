"use client";

/* RegisterView — #/register — free registration form.
   Posts to the site's data API (mock backend / Neon Postgres);
   keeps a local manifest copy and celebrates with a success
   sequence. Falls back gracefully offline. */

import { useState } from "react";
import { Rocket, Check, PartyPopper, Info, Phone, CalendarClock, Loader2 } from "lucide-react";
import { ARENAS, FAIR, SITE } from "@/lib/genesis/data";
import { submitInquiry } from "@/lib/press";
import { SplitText, Scramble, Reveal, SectionHead, Anchor } from "../FX";

const CLASSES = [
  "Play", "Nursery", "KG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
  "Class 6", "Class 7", "Class 8", "Class 9", "Class 10",
];

interface FormState {
  name: string;
  className: string;
  roll: string;
  phone: string;
  email: string;
  arena: string;
  team: string;
  project: string;
}

const EMPTY: FormState = {
  name: "", className: "", roll: "", phone: "", email: "", arena: "", team: "", project: "",
};

export default function RegisterView() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const set = (k: keyof FormState) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) errs.name = "Your name is required";
    if (!form.className) errs.className = "Pick your class";
    if (!form.roll.trim()) errs.roll = "Roll number required";
    if (!/^01\d{9}$/.test(form.phone.replace(/[\s-]/g, ""))) errs.phone = "Enter an 11-digit BD phone (01XXXXXXXXX)";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs.email = "Enter a valid email";
    if (!form.arena) errs.arena = "Choose an arena";
    if (!form.project.trim()) errs.project = "Give your project a title";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setBusy(true);
    setErr("");
    const res = await submitInquiry({
      kind: "register",
      name: form.name,
      email: form.email,
      phone: form.phone,
      subject: `Genesis registration — ${form.arena}`,
      message: `Project: ${form.project}. Team: ${form.team || "solo"}. Class ${form.className}, roll ${form.roll}.`,
      extra: {
        arena: form.arena,
        class: form.className,
        roll: form.roll,
        team: form.team || "solo",
        project: form.project,
      },
    });
    setBusy(false);
    if (!res.ok) {
      setErr(res.error ?? "Could not submit — please try again.");
      return;
    }
    try {
      const key = "genesis2026_registrations";
      const all = JSON.parse(localStorage.getItem(key) || "[]");
      all.push({ ...form, id: `GEN-${Date.now().toString(36).toUpperCase()}`, at: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(all));
    } catch { /* storage unavailable — still show success */ }
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="relative z-10">
      <section className="relative overflow-hidden pb-8 pt-40 nebula grain md:pt-48">
        <div aria-hidden className="absolute inset-0">
          <img src="/media/gallery-rocket.png" alt="" className="h-full w-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-void/85 via-void/60 to-void" />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 md:px-10">
          <Reveal y={12}>
            <p className="font-mono2 text-[11px] uppercase tracking-[0.35em] text-white/50">
              <Anchor to="/genesis" className="transition-colors hover:text-gold-2">Genesis 2026</Anchor>
              <span className="mx-2 text-gold">/</span>
              <span className="text-gold-2">Registration</span>
            </p>
          </Reveal>
          <h1 className="font-display mt-6 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            <SplitText text="Board your" className="block text-ink" />
            <SplitText text="mission" delay={0.28} className="block" letterClassName="text-gold-gradient" />
          </h1>
          <Reveal delay={0.45} className="mt-6 flex flex-wrap gap-3">
            <span className="chip"><CalendarClock className="h-3.5 w-3.5 text-gold" aria-hidden /> Deadline · {FAIR.regDeadline}</span>
            <span className="chip"><Rocket className="h-3.5 w-3.5 text-gold" aria-hidden /> Free · {FAIR.datesLabel}</span>
          </Reveal>
        </div>
      </section>

      <section className="relative pb-24 pt-10 md:pb-32">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
            {/* form / success */}
            <div>
              {done ? (
                  <div
                    key="success"
                    className="glass-gold pop-in relative overflow-hidden rounded-[2rem] p-10 text-center md:p-14"
                  >
                    <span
                      className="pop-in mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold text-void shadow-[0_0_50px_rgba(240,180,41,0.6)]"
                      style={{ animationDelay: "0.25s" }}
                    >
                      <Check className="h-9 w-9" strokeWidth={3} aria-hidden />
                    </span>
                    <h2 className="font-display mt-7 text-3xl font-bold text-ink md:text-4xl">
                      You&apos;re on the launch manifest!
                    </h2>
                    <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
                      Welcome aboard, <span className="font-semibold text-gold-2">{form.name.split(" ")[0]}</span>.
                      Your entry for <span className="text-ink">{form.project}</span> in{" "}
                      <span className="text-ink">{form.arena}</span> is recorded on this
                      device. Confirm with your class teacher or the school office to
                      lock your slot.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                      <Anchor to="/genesis" className="btn-gold" onClick={() => {}}>
                        Back to the fair programme
                      </Anchor>
                      <button
                        onClick={() => { setDone(false); setForm(EMPTY); }}
                        className="btn-ghost"
                        data-cursor="link"
                      >
                        Register another project
                      </button>
                    </div>
                  </div>
                ) : (
                  <form
                    key="form"
                    onSubmit={submit}
                    noValidate
                    className="view-in panel rounded-[2rem] p-7 md:p-10"
                  >
                    <Scramble text="CREW APPLICATION — GENESIS 2026" className="eyebrow" />
                    <div className="mt-8 grid gap-5 sm:grid-cols-2">
                      <Field label="Full name" error={errors.name}>
                        <input className="field" placeholder="e.g. Ayesha Siddika" value={form.name} onChange={set("name")} />
                      </Field>
                      <div className="grid grid-cols-2 gap-5">
                        <Field label="Class" error={errors.className}>
                          <select className="field" value={form.className} onChange={set("className")}>
                            <option value="">Select…</option>
                            {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </Field>
                        <Field label="Roll no." error={errors.roll}>
                          <input className="field" placeholder="e.g. 24" value={form.roll} onChange={set("roll")} />
                        </Field>
                      </div>
                      <Field label="Guardian's phone" error={errors.phone}>
                        <input className="field" placeholder="01XXXXXXXXX" inputMode="tel" value={form.phone} onChange={set("phone")} />
                      </Field>
                      <Field label="Email" error={errors.email}>
                        <input className="field" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} />
                      </Field>
                      <Field label="Choose your arena" error={errors.arena}>
                        <select className="field" value={form.arena} onChange={set("arena")}>
                          <option value="">Select an arena…</option>
                          {ARENAS.map((a) => <option key={a.id} value={a.name}>{a.name}</option>)}
                        </select>
                      </Field>
                      <Field label="Team members (optional)">
                        <input className="field" placeholder="e.g. Rafi, Nusrat, Tanvir" value={form.team} onChange={set("team")} />
                      </Field>
                      <Field label="Project title" error={errors.project} className="sm:col-span-2">
                        <input
                          className="field"
                          placeholder="e.g. Smart solar-powered irrigation model"
                          value={form.project}
                          onChange={set("project")}
                        />
                      </Field>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-between gap-5">
                      <button type="submit" disabled={busy} className="btn-gold disabled:opacity-60" data-cursor="link">
                        {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Rocket className="h-4 w-4" aria-hidden />}
                        {busy ? "Filing your entry…" : "Submit registration"}
                      </button>
                      {err ? <p className="text-[13px] text-red-400">{err}</p> : <p className="text-xs text-white/45">Registration is 100% free.</p>}
                    </div>
                  </form>
                )}
            </div>

            {/* side info */}
            <div className="space-y-5">
              <Reveal delay={0.15}>
                <div className="panel rounded-3xl p-7">
                  <div className="flex items-center gap-3">
                    <Info className="h-5 w-5 text-gold" aria-hidden />
                    <h3 className="font-display text-lg font-semibold text-ink">How it works</h3>
                  </div>
                  <ol className="mt-5 space-y-4 text-sm leading-relaxed text-dim">
                    <li className="flex gap-3"><span className="font-mono2 text-gold">01</span> Fill the crew application — two minutes, no fee.</li>
                    <li className="flex gap-3"><span className="font-mono2 text-gold">02</span> Your entry lands straight in the fair office&apos;s inbox — and a copy is saved on this device.</li>
                    <li className="flex gap-3"><span className="font-mono2 text-gold">03</span> Confirm with your class teacher or the school office before {FAIR.regDeadline}.</li>
                    <li className="flex gap-3"><span className="font-mono2 text-gold">04</span> Show up on 20 November with your project. Ignition at 9 AM.</li>
                  </ol>
                </div>
              </Reveal>

              <Reveal delay={0.25}>
                <div className="glass-gold rounded-3xl p-7">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gold-2" aria-hidden />
                    <h3 className="font-display text-lg font-semibold text-ink">Need a hand?</h3>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-white/70">
                    Call the school office at{" "}
                    <a href={`tel:${SITE.phone.replace(/-/g, "")}`} className="font-medium text-gold-2 hover:underline" data-cursor="link">
                      {SITE.phone}
                    </a>{" "}
                    or the admissions line{" "}
                    <a href={`tel:${SITE.phoneAdmission.replace(/-/g, "")}`} className="font-medium text-gold-2 hover:underline" data-cursor="link">
                      {SITE.phoneAdmission}
                    </a>{" "}
                    — Sat–Thu, 8 AM to 5 PM.
                  </p>
                  <p className="font-bangla mt-3 text-sm text-white/55">
                    অফিস চলবে শনি–বৃহস্পতি, সকাল ৮টা – বিকেল ৫টা।
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.35}>
                <div className="panel rounded-3xl p-7">
                  <div className="flex items-center gap-3">
                    <PartyPopper className="h-5 w-5 text-gold" aria-hidden />
                    <h3 className="font-display text-lg font-semibold text-ink">Visitors</h3>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-dim">
                    Not competing? You don&apos;t need any registration — walk in both
                    days, 9 AM to 5 PM, and tour the arenas, stage shows and galleries.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({
  label, error, children, className = "",
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="font-mono2 mb-2 block text-[10px] uppercase tracking-[0.25em] text-white/50">
        {label}
      </span>
      {children}
      {error && (
        <span className="mt-1.5 block text-xs font-medium text-red-400">{error}</span>
      )}
    </label>
  );
}
