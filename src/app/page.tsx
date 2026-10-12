"use client";

/* ============================================================
   OKGS — single entry point
   One codebase, two editions: Science Fair mode (deep space)
   and Normal mode (the school's own landing theme).
   Grand Overture opening · starfield + cursor FX (fair) ·
   page-wipe router.
   Routes (hash): / · /press · /press/[slug] · /genesis ·
                  /clubs · /clubs/[slug] · /gallery · /about ·
                  /register (fair sign-in stub) · /contact · /admin
   ============================================================ */

import { useEffect, useRef, useState } from "react";
import { useHashRoute, routeSegments, scrollToTop } from "@/lib/genesis/router";
import { ModeProvider, useMode } from "@/lib/press";
import Overture from "@/components/genesis/Overture";
import Starfield from "@/components/genesis/Starfield";
import CursorFX from "@/components/genesis/CursorFX";
import Navbar from "@/components/genesis/Navbar";
import Footer from "@/components/genesis/Footer";
import HomeView from "@/components/genesis/views/HomeView";
import FairView from "@/components/genesis/views/FairView";
import ClubsView from "@/components/genesis/views/ClubsView";
import ClubPageView from "@/components/genesis/views/ClubPageView";
import AboutView from "@/components/genesis/views/AboutView";
import GalleryView from "@/components/genesis/views/GalleryView";
import LoginView from "@/components/genesis/views/LoginView";
import ContactView from "@/components/genesis/views/ContactView";
import PressView from "@/components/genesis/views/PressView";
import ArticleView from "@/components/genesis/views/ArticleView";
import AdminView from "@/components/genesis/views/AdminView";

function NotFoundView() {
  return (
    <main className="relative z-10 flex min-h-[75vh] flex-col items-center justify-center px-6 pt-32 text-center">
      <span className="text-outline-gold font-display text-8xl font-bold">404</span>
      <h1 className="font-display mt-6 text-3xl font-bold text-ink">Page not found</h1>
      <p className="mt-4 max-w-md text-dim">
        This page drifted out of orbit. Head back to the front page or browse the clubs.
      </p>
      <a href="#/" className="btn-gold mt-8">
        Return home
      </a>
    </main>
  );
}

function Shell() {
  const { route } = useHashRoute();
  const { isFair } = useMode();
  const [booted, setBooted] = useState(false);
  const [wipe, setWipe] = useState(false);
  const prevRoute = useRef(route);

  /* run the Overture once per session */
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      if (sessionStorage.getItem("okgs_booted") === "1") setBooted(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  /* page-wipe on route change */
  useEffect(() => {
    if (route === prevRoute.current) return;
    prevRoute.current = route;
    let t = 0;
    const raf = requestAnimationFrame(() => {
      setWipe(true);
      t = window.setTimeout(() => setWipe(false), 720);
      scrollToTop();
    });
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, [route]);

  /* deep-link anchors like /genesis#arenas */
  useEffect(() => {
    const anchor = route.split("#")[1];
    if (!anchor) return;
    const t = window.setTimeout(() => {
      document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 900);
    return () => window.clearTimeout(t);
  }, [route]);

  const segs = routeSegments(route);
  const viewKey = segs.join("/") || "home";
  const isAdmin = segs[0] === "admin";

  const [head, sub] = segs;
  const view =
    !head ? (
      <HomeView />
    ) : head === "press" ? (
      sub ? <ArticleView slug={sub} /> : <PressView />
    ) : head === "genesis" ? (
      isFair ? <FairView /> : <NotFoundView />
    ) : head === "clubs" ? (
      sub ? <ClubPageView slug={sub} /> : <ClubsView />
    ) : head === "about" ? (
      <AboutView />
    ) : head === "gallery" ? (
      <GalleryView />
    ) : head === "register" ? (
      isFair ? <LoginView /> : <NotFoundView />
    ) : head === "contact" ? (
      <ContactView />
    ) : head === "admin" ? (
      <AdminView />
    ) : (
      <NotFoundView />
    );

  return (
    <div className="relative min-h-screen bg-void text-ink">
      {!isFair && !isAdmin ? null : <Starfield />}
      {!isAdmin && <CursorFX />}

      {/* the grand opening (once per session) */}
      {!booted && (
        <Overture
          onDone={() => {
            sessionStorage.setItem("okgs_booted", "1");
            setBooted(true);
          }}
        />
      )}

      {/* content renders beneath; revealed as the Overture parts */}
      <div
        className="relative flex min-h-screen flex-col"
        aria-hidden={!booted}
        style={{
          opacity: booted ? 1 : 0,
          transition: "opacity 0.5s ease-out 0.15s",
        }}
      >
        {!isAdmin && (
          <Navbar route={segs[0] ? `/${segs[0]}${segs[1] ? `/${segs[1]}` : ""}` : "/"} />
        )}
        <div key={viewKey} className="view-in flex-1">
          {view}
        </div>
        {!isAdmin && <Footer />}
      </div>

      {/* route-change comet wipe */}
      {wipe && (
        <div className="gen-wipe pointer-events-none fixed inset-0 z-[85]">
          <div
            className="gen-wipe-seam absolute left-0 top-1/2 h-px w-full"
            style={{
              background: isFair
                ? "linear-gradient(90deg, transparent, #a9f5e8, #f0b429, transparent)"
                : "linear-gradient(90deg, transparent, rgba(30,122,76,0.8), transparent)",
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <ModeProvider>
      <Shell />
    </ModeProvider>
  );
}
