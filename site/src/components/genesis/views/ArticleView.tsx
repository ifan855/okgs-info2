"use client";

/* ArticleView — #/press/[slug] — a single story.
   Editorial typography (Newsreader serif), standfirst, meta,
   cover art, drop-cap body, pull quote, related stories. */

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Clock, Mail } from "lucide-react";
import { useMode, fetchPost, fetchPosts, formatDate } from "@/lib/press";
import type { Post } from "@/lib/types";
import { SITE } from "@/lib/genesis/data";
import { Reveal, TiltCard, Anchor } from "../FX";

export default function ArticleView({ slug }: { slug: string }) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const raf = requestAnimationFrame(() => {
      setLoading(true);
      fetchPost(slug).then((p) => {
        if (alive) {
          setPost(p);
          setLoading(false);
        }
      });
    });
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="relative z-10 mx-auto max-w-4xl px-5 pb-24 pt-48 md:px-10">
        <div className="h-10 w-2/3 animate-pulse rounded bg-white/10" />
        <div className="mt-6 h-24 w-full animate-pulse rounded bg-white/10" />
        <div className="mt-10 h-64 w-full animate-pulse rounded bg-white/10" />
      </main>
    );
  }

  if (!post) {
    return (
      <main className="relative z-10 flex min-h-[70vh] flex-col items-center justify-center px-6 pt-32 text-center">
        <span className="text-outline-gold font-editorial text-7xl font-semibold">404</span>
        <h1 className="font-editorial mt-6 text-3xl font-semibold text-ink md:text-4xl">Story not found</h1>
        <p className="mt-4 max-w-md text-dim">
          This piece is not in the archive — it may have been unpublished or renamed.
        </p>
        <Anchor to="/press" className="btn-gold mt-8" onClick={() => {}}>
          <ArrowLeft className="h-4 w-4" aria-hidden /> Back to the newsroom
        </Anchor>
      </main>
    );
  }

  const readMins = Math.max(2, Math.round(post.body.join(" ").split(/\s+/).length / 200));

  return (
    <main className="relative z-10">
      <article className="relative overflow-hidden pb-10 pt-40 md:pt-48">
        <div aria-hidden className="absolute inset-0" style={{
          background: "radial-gradient(46% 40% at 16% 6%, rgba(240,180,41,0.07), transparent 70%)",
        }} />
        <div className="relative mx-auto max-w-4xl px-5 md:px-10">
          <Reveal>
            <Anchor
              to="/press"
              className="font-mono2 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-white/50 transition-colors hover:text-gold-2"
              onClick={() => {}}
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Newsroom
            </Anchor>
          </Reveal>

          {/* kicker + title */}
          <div className="mt-10">
            <Reveal>
              <div className="flex flex-wrap items-center gap-3">
                <span className="eyebrow !tracking-[0.3em]">{post.category}</span>
                <span className="font-mono2 flex items-center gap-2 text-[11px] text-white/45">
                  <Clock className="h-3.5 w-3.5" aria-hidden /> {readMins} min read
                </span>
              </div>
            </Reveal>
            <h1 className="font-editorial mt-6 text-4xl font-semibold leading-[1.06] text-ink md:text-[3.4rem]">
              <span className="gen-rise block" style={{ animationDelay: "0.1s", animationDuration: "0.9s" }}>
                {post.title}
              </span>
            </h1>
            <Reveal delay={0.25}>
              <p className="font-editorial mt-7 max-w-2xl text-lg italic leading-relaxed text-white/65 md:text-xl">
                {post.deck}
              </p>
            </Reveal>
            <Reveal delay={0.35}>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-white/8 py-4 text-[13px] text-white/55">
                <span>
                  By <strong className="font-semibold text-ink">{post.author}</strong> · {post.role}
                </span>
                <span>{formatDate(post.date)}</span>
                <span className="font-mono2 hidden text-[10px] uppercase tracking-[0.24em] text-white/35 sm:inline">
                  OKGS Press Bureau
                </span>
              </div>
            </Reveal>
          </div>

          {/* cover */}
          {post.cover && (
            <Reveal delay={0.4}>
              <figure className="mt-10">
                <div className="overflow-hidden rounded-[1.75rem] border border-white/10">
                  <img src={post.cover} alt="" className="h-64 w-full object-cover md:h-[420px]" />
                </div>
              </figure>
            </Reveal>
          )}

          {/* body */}
          <div className="mt-12 max-w-[680px]">
            {post.body.map((para, i) => (
              <Reveal key={i} delay={0.05 * i}>
                <p className={`mb-7 text-[16.5px] leading-[1.85] text-white/75 md:text-[17.5px] ${i === 0 ? "first-letter:font-editorial first-letter:float-left first-letter:mr-3 first-letter:text-6xl first-letter:font-semibold first-letter:leading-[0.85] first-letter:text-gold-2" : ""}`}>
                  {para}
                </p>
                {i === 1 && post.tags.length > 0 && (
                  <blockquote className="my-10 border-l-2 border-gold/70 pl-6">
                    <p className="font-editorial text-xl italic leading-relaxed text-white/80 md:text-2xl">
                      {post.tags[0]} — that is the thread running through everything the
                      bureau files from this campus.
                    </p>
                  </blockquote>
                )}
              </Reveal>
            ))}

            {/* tags */}
            {post.tags.length > 0 && (
              <Reveal>
                <div className="mt-10 flex flex-wrap gap-2">
                  {post.tags.map((t) => (
                    <span key={t} className="chip">#{t}</span>
                  ))}
                </div>
              </Reveal>
            )}

            {/* corrections line */}
            <Reveal delay={0.1}>
              <p className="mt-12 border-t border-white/8 pt-6 text-[13px] italic leading-relaxed text-white/45">
                Spotted an error? The bureau corrects the record — write to{" "}
                <a href={`mailto:${SITE.email}`} className="text-gold-2 underline-offset-4 hover:underline">
                  {SITE.email}
                </a>{" "}
                with the page and the line.
              </p>
            </Reveal>
          </div>
        </div>
      </article>

      {/* related */}
      <RelatedPosts slug={slug} />
    </main>
  );
}

function RelatedPosts({ slug }: { slug: string }) {
  const { mode } = useMode();
  const [related, setRelated] = useState<Post[]>([]);

  useEffect(() => {
    let alive = true;
    fetchPosts({ limit: 7 }, mode).then((ps) => {
      if (alive) setRelated(ps.filter((p) => p.slug !== slug).slice(0, 3));
    });
    return () => {
      alive = false;
    };
  }, [mode, slug]);

  if (related.length === 0) return null;

  return (
    <section className="relative z-10 pb-28 pt-6">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="hairline" />
        <div className="mt-12 flex items-end justify-between gap-6">
          <h2 className="font-editorial text-3xl font-semibold text-ink">More from the bureau</h2>
          <Anchor to="/press" className="font-mono2 hidden items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-gold-2 sm:inline-flex" onClick={() => {}}>
            All stories <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Anchor>
        </div>
        <div className="mt-9 grid gap-6 md:grid-cols-3">
          {related.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.1}>
              <Anchor to={`/press/${p.slug}`} className="block h-full" onClick={() => {}}>
                <TiltCard max={5} className="panel flex h-full flex-col overflow-hidden rounded-3xl transition-colors duration-500 hover:border-gold/40">
                  {p.cover && (
                    <div className="h-40 overflow-hidden">
                      <img src={p.cover} alt="" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <span className="eyebrow !text-[9px] !tracking-[0.26em]">{p.category}</span>
                    <h3 className="font-editorial mt-3 text-lg font-semibold leading-snug text-ink md:text-xl">{p.title}</h3>
                    <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-white/55">{p.deck}</p>
                    <span className="mt-auto pt-4 text-[11px] text-white/40">{formatDate(p.date)}</span>
                  </div>
                </TiltCard>
              </Anchor>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <div className="panel mt-12 flex flex-col items-center justify-between gap-5 rounded-3xl p-8 text-center md:flex-row md:text-left">
            <div>
              <h3 className="font-editorial text-xl font-semibold text-ink">Get the bureau in your inbox</h3>
              <p className="mt-1.5 text-sm text-white/55">
                Stories, notices and fair bulletins — write to us and we will add you to the readers' list.
              </p>
            </div>
            <Anchor to="/contact" className="btn-gold shrink-0" onClick={() => {}}>
              <Mail className="h-4 w-4" aria-hidden /> Contact the desk
            </Anchor>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
