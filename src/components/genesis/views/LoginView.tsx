"use client";

/* LoginView — #/register — the fair portal's sign-in page.
   DELIBERATELY non-functional: the fields and button are a
   placeholder for the portal that opens with the fair. */

import { useState } from "react";
import { Lock, LogIn, ArrowLeft } from "lucide-react";
import { SITE, CLUBS } from "@/lib/genesis/data";
import { useMode } from "@/lib/press";
import { SplitText, Reveal, Anchor, StarDots } from "../FX";

export default function LoginView() {
  const { fairName } = useMode();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  return (
    <main className="relative z-10">
      <section className="relative flex min-h-[92svh] items-center overflow-hidden nebula grain pb-20 pt-36">
        <div aria-hidden className="aurora" />
        <StarDots count={26} />

        <div className="relative mx-auto w-full max-w-md px-5 md:px-10">
          <Reveal y={14}>
            <Anchor
              to="/"
              className="font-mono2 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-white/50 transition-colors hover:text-gold-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Home
            </Anchor>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="panel mt-6 rounded-[2rem] p-8 md:p-10">
              <span className="glass mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-gold-2">
                <Lock className="h-6 w-6" aria-hidden />
              </span>
              <h1 className="font-display mt-6 text-center text-3xl font-bold leading-tight text-ink md:text-4xl">
                <SplitText text="Fair portal" className="block" />
              </h1>
              <p className="mt-3 text-center text-sm leading-relaxed text-white/60">
                Sign-in for participants, judges and crew of {fairName}. The portal opens soon —
                these doors are placeholders for now.
              </p>

              <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label htmlFor="login-email" className="mb-1.5 block text-xs font-medium text-white/55">
                    Email or crew ID
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@okgs.info"
                    className="field"
                    autoComplete="off"
                  />
                </div>
                <div>
                  <label htmlFor="login-pass" className="mb-1.5 block text-xs font-medium text-white/55">
                    Password
                  </label>
                  <input
                    id="login-pass"
                    type="password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    placeholder="••••••••"
                    className="field"
                    autoComplete="off"
                  />
                </div>
                <button
                  type="submit"
                  disabled
                  className="btn-gold mt-2 w-full justify-center opacity-55"
                  title="The portal opens soon"
                >
                  <LogIn className="h-4 w-4" aria-hidden /> Continue
                </button>
              </form>

              <p className="mt-5 text-center text-xs text-white/40">
                No account yet? Your club signs members up in person — see the{" "}
                <Anchor to="/clubs" className="text-gold-2 underline decoration-dotted underline-offset-4">
                  five clubs
                </Anchor>{" "}
                or call {SITE.phone}.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <p className="font-mono2 mt-8 text-center text-[10px] uppercase tracking-[0.3em] text-white/35">
              {CLUBS.length} clubs · 7 arenas · 2 days · one universe
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
