/* ============================================================
   OKGS — shared data types (client + server)
   ============================================================ */

export type SiteMode = "fair" | "normal";

export type PostCategory =
  | "Press Release"
  | "News"
  | "Notice"
  | "Feature"
  | "Club"
  | "Sports"
  | "Achievement";

export interface Post {
  id: string;
  slug: string;
  title: string;
  deck: string; // standfirst / lede
  body: string[]; // paragraphs
  category: PostCategory;
  tags: string[];
  author: string;
  role: string;
  date: string; // ISO
  cover?: string;
  featured: boolean;
  published: boolean;
  /** fair → only science-fair mode · normal → only normal mode · both → always */
  scope: "both" | "fair" | "normal";
}

export interface Settings {
  mode: SiteMode;
  updatedAt: string;
  /** optional masthead message shown under the paper/hero band */
  banner?: string;
  /** the science fair's main name — always rendered before the colon */
  fairName: string;
  /** the science fair's tagline — always rendered after the colon */
  fairTagline: string;
}

/**
 * The fair's full display title. The main name and the tagline are
 * ALWAYS combined with a colon — e.g.
 *   "OKGS GENESIS 2026: Exploring the Universe of Science"
 */
export function fairTitle(s: Pick<Settings, "fairName" | "fairTagline">): string {
  const name = (s.fairName ?? "").trim() || "OKGS GENESIS 2026";
  const tag = (s.fairTagline ?? "").trim();
  return tag ? `${name}: ${tag}` : name;
}

export interface GalleryItem {
  id: string;
  src: string;
  title: string;
  category: string;
  /** image (default) · video — src is an mp4, poster is its still frame */
  kind?: "image" | "video";
  /** still frame shown before a video item plays */
  poster?: string;
  /** lower shows first */
  order: number;
}

export type SubmissionKind = "contact" | "register" | "tip";
export type SubmissionStatus = "new" | "read" | "archived";

export interface Film {
  id: string;
  src: string;
  poster: string;
  title: string;
  caption: string;
  captionBn?: string;
  /** where the film belongs in the two editions */
  edition: "fair" | "normal" | "both";
  length: string;
  featured?: boolean;
}

export interface Submission {
  id: string;
  kind: SubmissionKind;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: SubmissionStatus;
  extra?: Record<string, string>;
  createdAt: string;
}

export interface ApiError {
  error: string;
}
