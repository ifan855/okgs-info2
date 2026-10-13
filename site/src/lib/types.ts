/* ============================================================
   OKGS PRESS — shared data types (client + server)
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
}

export type SubmissionKind = "contact" | "register" | "tip";
export type SubmissionStatus = "new" | "read" | "archived";

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
