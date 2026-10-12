"use client";

import { useEffect, useState, useCallback } from "react";

/**
 * Minimal hash router — works everywhere (preview panel, static hosting,
 * any subfolder) because every route lives under `/`.
 * Routes look like:  #/ , #/genesis , #/clubs/alssm ...
 */
export function useHashRoute() {
  const read = () => {
    const h = window.location.hash.replace(/^#/, "");
    return h === "" ? "/" : h;
  };
  const [route, setRoute] = useState("/");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setRoute(read());
      setReady(true);
    });
    const onChange = () => setRoute(read());
    window.addEventListener("hashchange", onChange);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("hashchange", onChange);
    };
  }, []);

  const navigate = useCallback((to: string) => {
    const target = to.startsWith("#") ? to : `#${to}`;
    if (window.location.hash === target) {
      setRoute(read());
    } else {
      window.location.hash = target;
    }
  }, []);

  return { route, navigate, ready };
}

export function navigateTo(to: string) {
  window.location.hash = to.startsWith("#") ? to : `#${to}`;
}

/** Parse "#/clubs/alssm" → ["clubs","alssm"] */
export function routeSegments(route: string): string[] {
  return route.split("?")[0].split("/").filter(Boolean);
}

/** Scroll to top (or to element anchor within page) after route change */
export function scrollToTop(smooth = false) {
  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
  });
}
