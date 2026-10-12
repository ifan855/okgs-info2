import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OKGS Genesis 2026 — Exploring the Universe of Science",
  description:
    "OKGS Genesis 2026 is the annual science fair of Omar Kindergarten School & Omar Garden Academy, Kalai, Joypurhat. 20–21 November 2026 · models, robotics, science olympiad, Big Idea Pitch, debate, posters and code — free entry for all.",
  keywords: [
    "OKGS", "Genesis 2026", "science fair", "Omar Kindergarten School",
    "Omar Garden Academy", "Kalai", "Joypurhat", "school science fair Bangladesh",
  ],
  authors: [{ name: "Omar Kindergarten School & Omar Garden Academy" }],
  icons: { icon: "/favicon.png" },
  openGraph: {
    title: "OKGS Genesis 2026 — Exploring the Universe of Science",
    description:
      "The annual science fair of OKGS, Kalai, Joypurhat. 20–21 November 2026. Free registration & free entry.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#04070f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* paint the right edition before first frame (no flash, no hydration mismatch) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var m=localStorage.getItem('okgs_mode');if(m==='normal'||m==='fair'){document.documentElement.setAttribute('data-mode',m);document.documentElement.style.colorScheme=m==='fair'?'dark':'light';}}catch(e){}`,
          }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
