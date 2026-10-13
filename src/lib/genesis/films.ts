import type { Film } from "@/lib/types";

/* ============================================================
   THE FILM DESK — real school footage, cut for the web.
   Eight films live in /media/film (H.264 mp4, faststart):
   · odyssey-montage  → the fair hero's quick-cut opening loop
   · gate-morning     → the normal-mode hero's morning loop
   · film-*           → the watchable films below
   Every frame is the school's own footage — no stock anywhere.
   ============================================================ */

export const HERO_MONTAGE = "/media/film/odyssey-montage.mp4";
export const HERO_MONTAGE_POSTER = "/media/film/poster-odyssey.jpg";
export const GATE_LOOP = "/media/film/gate-morning.mp4";

export const FILMS: Film[] = [
  {
    id: "odyssey",
    src: "/media/film/film-odyssey.mp4",
    poster: "/media/film/poster-film-odyssey.jpg",
    title: "OKGS Odyssey — the 5th Science Fair",
    caption: "The drone opens over Kalai, the crowd takes the field, the plaques line the stage. Nineteen minutes of the fair compressed into two — this is the film the whole campus still quotes.",
    edition: "both",
    length: "1:55",
    featured: true,
  },
  {
    id: "scout",
    src: "/media/film/film-scout.mp4",
    poster: "/media/film/poster-film-scout.jpg",
    title: "Scout display — 26 March",
    caption: "Drums, flags and the parade on the big field for the Independence Day display. The scout troop marches the way it drills — loud and in step.",
    captionBn: "মহান শহীদ ও জাতীয় দিবস ২০২৬ — স্কাউট প্রদর্শনী",
    edition: "both",
    length: "1:20",
  },
  {
    id: "flashmob",
    src: "/media/film/film-flashmob.mp4",
    poster: "/media/film/poster-film-flashmob.jpg",
    title: "Flash mob — ART Odyssey stage",
    caption: "Two performers, one purple stage and a courtyard that stopped to watch. The ART Odyssey flash mob, filmed in one take.",
    edition: "both",
    length: "1:01",
  },
  {
    id: "greeting",
    src: "/media/film/film-greeting.mp4",
    poster: "/media/film/poster-film-greeting.jpg",
    title: "A simple greeting, a warm smile",
    caption: "The gate opens, the line forms, and the morning greeting round begins — the smallest habit on the timetable and the one that sets the whole day.",
    edition: "normal",
    length: "1:15",
  },
  {
    id: "handwriting",
    src: "/media/film/film-handwriting.mp4",
    poster: "/media/film/poster-film-handwriting.jpg",
    title: "The handwriting class",
    caption: "Sundor hater lekha — the special handwriting hour, pencil grip by pencil grip.",
    captionBn: "সুন্দর হাতের লেখার বিশেষ ক্লাস",
    edition: "normal",
    length: "0:34",
  },
  {
    id: "craft",
    src: "/media/film/film-craft.mp4",
    poster: "/media/film/poster-film-craft.jpg",
    title: "Making things with glue and paper",
    caption: "Kle diye bivinno jinish toiri — the craft period, where the classroom turns into a workshop.",
    captionBn: "ক্লে দিয়ে বিভিন্ন ধরনের জিনিস তৈরি",
    edition: "normal",
    length: "0:33",
  },
  {
    id: "art",
    src: "/media/film/film-art.mp4",
    poster: "/media/film/poster-film-art.jpg",
    title: "Wall painting — the art period",
    caption: "Red boards, orange boards, brushes too big for small hands — the art class paints the corridor bright.",
    edition: "normal",
    length: "0:44",
  },
  {
    id: "puzzle",
    src: "/media/film/film-puzzle.mp4",
    poster: "/media/film/poster-film-puzzle.jpg",
    title: "The puzzle hour",
    caption: "Class two versus a floor puzzle — logic, teamwork and one triumphant final piece.",
    edition: "normal",
    length: "0:22",
  },
];

export function filmsForEdition(isFair: boolean): Film[] {
  return FILMS.filter((f) => f.edition === "both" || (isFair ? f.edition === "fair" : f.edition === "normal"));
}
