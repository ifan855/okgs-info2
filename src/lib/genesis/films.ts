import type { Film } from "@/lib/types";

/* ============================================================
   THE FILM DESK — real school footage, cut for the web.
   Hosted on Cloudinary (cloud tt7oyjd1) — never committed to git.
   · odyssey-montage-v7      → the FAIR hero loop, every cut verified
                              frame-by-frame against the source
                              (aerial → billboard → gate → a model
                              house → the turbine table → the stalls
                              → THE PRIZE SHOWCASE, a genuine ~7s
                              like the original sequence: unveiling
                              + confetti → the crowd → prize giving
                              on stage → the trophies → the winners
                              → a long dissolve into the principal's
                              FULL 0:26 take → the speakers → the
                              roar → the school drone glide from the
                              warm-greeting clip, fading out)
                              — no flash mob, no Ayman Sadiq; his
                              only home is the normal cut.
                              Re-cut? upload a -v8 public id and bump these consts.
   · school-days-montage-v7  → the NORMAL hero loop, natural speed
                              (the school drone gliding, smooth →
                              corridor line → handwriting → art →
                              craft → puzzle → scouts → ONE good
                              Ayman Sadiq shot, held → the same
                              warm-greeting drone glide again,
                              fading away — the loop closes on the
                              shot it opened with)
                              — no flash mob, no crowd-roar scene,
                              no Odyssey outro drone.
   · film-*                 → the watchable films below
   Every frame is the school's own footage — no stock anywhere.
   ============================================================ */

export const HERO_MONTAGE = "https://res.cloudinary.com/tt7oyjd1/video/upload/okgs/film/odyssey-montage-v7.mp4";
export const HERO_MONTAGE_POSTER = "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/film/poster-odyssey-v7.jpg";
export const SCHOOL_MONTAGE = "https://res.cloudinary.com/tt7oyjd1/video/upload/okgs/film/school-days-montage-v7.mp4";
export const SCHOOL_MONTAGE_POSTER = "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/film/poster-school-days-v7.jpg";

export const FILMS: Film[] = [
  {
    id: "odyssey",
    src: "https://res.cloudinary.com/tt7oyjd1/video/upload/okgs/film/film-odyssey.mp4",
    poster: "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/film/poster-film-odyssey.jpg",
    title: "OKGS Odyssey — the 5th Science Fair",
    caption: "The drone opens over Kalai, the crowd takes the field, the plaques line the stage. Nineteen minutes of the fair compressed into two — this is the film the whole campus still quotes.",
    edition: "both",
    length: "1:55",
    featured: true,
  },
  {
    id: "scout",
    src: "https://res.cloudinary.com/tt7oyjd1/video/upload/okgs/film/film-scout.mp4",
    poster: "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/film/poster-film-scout.jpg",
    title: "Scout display — 26 March",
    caption: "Drums, flags and the parade on the big field for the Independence Day display. The scout troop marches the way it drills — loud and in step.",
    captionBn: "মহান শহীদ ও জাতীয় দিবস ২০২৬ — স্কাউট প্রদর্শনী",
    edition: "both",
    length: "1:20",
  },
  {
    id: "flashmob",
    src: "https://res.cloudinary.com/tt7oyjd1/video/upload/okgs/film/film-flashmob.mp4",
    poster: "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/film/poster-film-flashmob.jpg",
    title: "Flash mob — ART Odyssey stage",
    caption: "Two performers, one purple stage and a courtyard that stopped to watch. The ART Odyssey flash mob, filmed in one take.",
    edition: "both",
    length: "1:01",
  },
  {
    id: "greeting",
    src: "https://res.cloudinary.com/tt7oyjd1/video/upload/okgs/film/film-greeting.mp4",
    poster: "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/film/poster-film-greeting.jpg",
    title: "A simple greeting, a warm smile",
    caption: "The gate opens, the line forms, and the morning greeting round begins — the smallest habit on the timetable and the one that sets the whole day.",
    edition: "normal",
    length: "1:15",
  },
  {
    id: "handwriting",
    src: "https://res.cloudinary.com/tt7oyjd1/video/upload/okgs/film/film-handwriting.mp4",
    poster: "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/film/poster-film-handwriting.jpg",
    title: "The handwriting class",
    caption: "Sundor hater lekha — the special handwriting hour, pencil grip by pencil grip.",
    captionBn: "সুন্দর হাতের লেখার বিশেষ ক্লাস",
    edition: "normal",
    length: "0:34",
  },
  {
    id: "craft",
    src: "https://res.cloudinary.com/tt7oyjd1/video/upload/okgs/film/film-craft.mp4",
    poster: "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/film/poster-film-craft.jpg",
    title: "Making things with glue and paper",
    caption: "Kle diye bivinno jinish toiri — the craft period, where the classroom turns into a workshop.",
    captionBn: "ক্লে দিয়ে বিভিন্ন ধরনের জিনিস তৈরি",
    edition: "normal",
    length: "0:33",
  },
  {
    id: "art",
    src: "https://res.cloudinary.com/tt7oyjd1/video/upload/okgs/film/film-art.mp4",
    poster: "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/film/poster-film-art.jpg",
    title: "Wall painting — the art period",
    caption: "Red boards, orange boards, brushes too big for small hands — the art class paints the corridor bright.",
    edition: "normal",
    length: "0:44",
  },
  {
    id: "puzzle",
    src: "https://res.cloudinary.com/tt7oyjd1/video/upload/okgs/film/film-puzzle.mp4",
    poster: "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/film/poster-film-puzzle.jpg",
    title: "The puzzle hour",
    caption: "Class two versus a floor puzzle — logic, teamwork and one triumphant final piece.",
    edition: "normal",
    length: "0:22",
  },
];

export function filmsForEdition(isFair: boolean): Film[] {
  return FILMS.filter((f) => f.edition === "both" || (isFair ? f.edition === "fair" : f.edition === "normal"));
}
