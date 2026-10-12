"use client";

/* IconFor — maps string icon names from data.ts to lucide components */

import {
  FlaskConical, BookOpen, Code2, Trophy, Mic, Orbit, Bot, Brain,
  Lightbulb, Palette, Bus, ShieldCheck, Home, Monitor, LibraryBig,
  UtensilsCrossed, type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  flask: FlaskConical,
  book: BookOpen,
  code: Code2,
  trophy: Trophy,
  mic: Mic,
  orbit: Orbit,
  bot: Bot,
  brain: Brain,
  lightbulb: Lightbulb,
  palette: Palette,
  bus: Bus,
  shield: ShieldCheck,
  home: Home,
  monitor: Monitor,
  library: LibraryBig,
  utensils: UtensilsCrossed,
};

export default function IconFor({ name, className = "" }: { name: string; className?: string }) {
  const Cmp = MAP[name] ?? Orbit;
  return <Cmp className={className} aria-hidden />;
}
