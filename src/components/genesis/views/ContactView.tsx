"use client";

/* ContactView — #/contact — mission control contacts + message form */

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Facebook, Youtube, Send, CheckCircle2, ExternalLink, Loader2 } from "lucide-react";
import { SITE } from "@/lib/genesis/data";
import { submitInquiry } from "@/lib/press";
import { SplitText, Reveal, SectionHead, Anchor, TiltCard } from "../FX";

export default function ContactView() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState({ name: "", email: "", phone: "", text: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const res = await submitInquiry({
      kind: "contact",
      name: msg.name,
      email: msg.email,
      phone: msg.phone || undefined,
      subject: "Message from the site",
      message: msg.text,
    });
    setBusy(false);
    if (res.ok) setSent(true);
    else setErr(res.error ?? "Could not send — please try again.");
  };

  return (
    <main className="relative z-10">
      <section className="relative overflow-hidden pb-6 pt-40 nebula grain md:pt-48">
        <div aria-hidden className="aurora" />
        <div className="relative mx-auto max-w-7xl px-5 md:px-10">
          <Reveal y={12}>
            <p className="font-mono2 text-[11px] uppercase tracking-[0.35em] text-white/50">
              <Anchor to="/" className="transition-colors hover:text-gold-2">Home</Anchor>
              <span className="mx-2 text-gold">/</span>
              <span className="text-gold-2">Contact</span>
            </p>
          </Reveal>
          <h1 className="font-display mt-6 text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl">
            <SplitText text="Talk to" className="block" letterClassName="text-cosmic-gradient" />
            <SplitText text="the school" delay={0.3} className="block text-ink" />
          </h1>
          <Reveal delay={0.4}>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-dim md:text-base">
              Questions about Genesis 2026, admissions, hostels or the clubs? The
              school office answers Saturday to Thursday — and the fair info desk
              answers everything else.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          {/* contact cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Phone, title: "Phone", lines: [SITE.phone, SITE.phone2], href: `tel:${SITE.phone.replace(/-/g, "")}`, cta: "Call now" },
              { icon: Mail, title: "Email", lines: [SITE.email], href: `mailto:${SITE.email}`, cta: "Write to us" },
              { icon: MapPin, title: "Campus", lines: ["School College Para,", "Kalai Sadar, Joypurhat"], href: `https://www.google.com/maps/search/?api=1&query=${SITE.mapQuery}`, cta: "Open map", ext: true },
              { icon: Clock, title: "Office hours", lines: ["Sat – Thu", "8:00 AM – 5:00 PM"], href: undefined, cta: undefined },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 0.08}>
                <TiltCard className="panel h-full rounded-3xl p-7">
                  <span className="glass flex h-12 w-12 items-center justify-center rounded-2xl text-gold-2">
                    <c.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="font-display mt-5 text-lg font-semibold text-ink">{c.title}</h3>
                  <div className="mt-2 space-y-0.5">
                    {c.lines.map((l) => (
                      <p key={l} className="text-sm text-dim">{l}</p>
                    ))}
                  </div>
                  {c.href && (
                    <a
                      href={c.href}
                      target={c.ext ? "_blank" : undefined}
                      rel={c.ext ? "noreferrer" : undefined}
                      data-cursor="link"
                      className="font-display mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-gold-2 transition-colors hover:text-gold"
                    >
                      {c.cta} <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    </a>
                  )}
                </TiltCard>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 grid gap-10 lg:grid-cols-2">
            {/* form */}
            <div>
              <SectionHead eyebrow="Send a transmission" title="Drop us a message" />
              {sent ? (
                <div className="glass-gold pop-in mt-10 flex items-start gap-4 rounded-3xl p-8">
                  <CheckCircle2 className="h-7 w-7 shrink-0 text-gold-2" aria-hidden />
                  <div>
                    <h3 className="font-display text-xl font-semibold text-ink">Transmission received.</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">
                      Thanks, {msg.name.split(" ")[0] || "friend"} — for anything urgent,
                      calling the office is still the fastest route across the galaxy.
                    </p>
                    <button
                      onClick={() => { setSent(false); setMsg({ name: "", email: "", phone: "", text: "" }); }}
                      className="font-display mt-4 text-sm font-medium text-gold-2 hover:underline"
                      data-cursor="link"
                    >
                      Write another
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={submit} className="panel mt-10 space-y-5 rounded-3xl p-7 md:p-8">
                  <label className="block">
                    <span className="font-mono2 mb-2 block text-[10px] uppercase tracking-[0.25em] text-white/50">Your name</span>
                    <input
                      className="field" required placeholder="e.g. Md. Rakib Hasan"
                      value={msg.name} onChange={(e) => setMsg({ ...msg, name: e.target.value })}
                    />
                  </label>
                  <label className="block">
                    <span className="font-mono2 mb-2 block text-[10px] uppercase tracking-[0.25em] text-white/50">Email</span>
                    <input
                      className="field" required type="email" placeholder="you@example.com" inputMode="email"
                      value={msg.email} onChange={(e) => setMsg({ ...msg, email: e.target.value })}
                    />
                  </label>
                  <label className="block">
                    <span className="font-mono2 mb-2 block text-[10px] uppercase tracking-[0.25em] text-white/50">Phone (optional)</span>
                    <input
                      className="field" placeholder="01XXXXXXXXX" inputMode="tel"
                      value={msg.phone} onChange={(e) => setMsg({ ...msg, phone: e.target.value })}
                    />
                  </label>
                  <label className="block">
                    <span className="font-mono2 mb-2 block text-[10px] uppercase tracking-[0.25em] text-white/50">Message</span>
                    <textarea
                      className="field min-h-32" required placeholder="Ask about the fair, clubs, admission, or send a story tip…"
                      value={msg.text} onChange={(e) => setMsg({ ...msg, text: e.target.value })}
                    />
                  </label>
                  {err && <p className="text-[13px] text-red-400">{err}</p>}
                  <button type="submit" disabled={busy} className="btn-gold disabled:opacity-60" data-cursor="link">
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
                    {busy ? "Sending…" : "Send message"}
                  </button>
                </form>
              )}
            </div>

            {/* socials + official */}
            <div className="space-y-5">
              <Reveal delay={0.15}>
                <div className="panel rounded-3xl p-7 md:p-8">
                  <h3 className="font-display text-lg font-semibold text-ink">Follow the fair</h3>
                  <p className="mt-2 text-sm text-dim">
                    Announcements, results bulletins and live moments — straight from campus.
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <a
                      href={SITE.facebook} target="_blank" rel="noreferrer" data-cursor="link"
                      className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:border-gold/40 hover:bg-gold/5"
                    >
                      <span className="glass flex h-11 w-11 items-center justify-center rounded-full text-gold-2 transition-transform group-hover:scale-110">
                        <Facebook className="h-5 w-5" aria-hidden />
                      </span>
                      <span>
                        <span className="font-display block text-sm font-semibold text-ink">Facebook</span>
                        <span className="block text-xs text-white/50">@omarkgschool</span>
                      </span>
                    </a>
                    <a
                      href={SITE.youtube} target="_blank" rel="noreferrer" data-cursor="link"
                      className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:border-gold/40 hover:bg-gold/5"
                    >
                      <span className="glass flex h-11 w-11 items-center justify-center rounded-full text-gold-2 transition-transform group-hover:scale-110">
                        <Youtube className="h-5 w-5" aria-hidden />
                      </span>
                      <span>
                        <span className="font-display block text-sm font-semibold text-ink">YouTube</span>
                        <span className="block text-xs text-white/50">Omar Kindergarten School</span>
                      </span>
                    </a>
                  </div>
                  <div className="hairline my-7" />
                  <div className="flex flex-wrap gap-3">
                    <a href={SITE.mainSite} target="_blank" rel="noreferrer" className="chip hover:border-gold/50 hover:text-gold-2" data-cursor="link">
                      Main school site <ExternalLink className="h-3 w-3" aria-hidden />
                    </a>
                    <a href={SITE.scienceHub} target="_blank" rel="noreferrer" className="chip hover:border-gold/50 hover:text-gold-2" data-cursor="link">
                      OKGS science hub <ExternalLink className="h-3 w-3" aria-hidden />
                    </a>
                    <Anchor to="/about" className="chip hover:border-gold/50 hover:text-gold-2" onClick={() => {}}>
                      About the school
                    </Anchor>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.25}>
                <div className="relative overflow-hidden rounded-3xl border border-white/10">
                  <img src="https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/real/campus-1.jpg" alt="The school building in Kalai" className="h-64 w-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="font-display text-lg font-semibold text-ink">See you at the office.</p>
                    <p className="text-sm text-white/60">{FAIR_DATE_LABEL} · {SITE.address}</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const FAIR_DATE_LABEL = "20 – 21 November 2026";
