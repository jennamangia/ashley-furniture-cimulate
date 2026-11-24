import { useEffect, useRef, useState, type ReactNode } from "react";
import { account } from "@/config/accounts";

import { Button } from "@/components/ui/button";
import { ChevronDown, Search, X, ZoomIn } from "lucide-react";
import astro from "@/assets/characters/astro-trim.png";

const a = account;
const queries = a.queries.map(({ query }) => query);

export function useReveal() {
  useEffect(() => {
    const show = (el: Element) => el.classList.add("in");
    if (typeof IntersectionObserver === "undefined") {
      document.querySelectorAll(".reveal").forEach(show);
      return;
    }
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            show(e.target);
            io.unobserve(e.target);
          }
        }),
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    );
    const watch = () =>
      document.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));
    // Backstop when the browser throttles observers (embedded or background previews):
    // reveal anything already above the bottom of the viewport.
    const check = () =>
      document.querySelectorAll(".reveal:not(.in)").forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) show(el);
      });
    watch();
    check();
    // Sections re-rendered or remounted after mount (hot updates, keyed tab changes) get new nodes.
    const mo = new MutationObserver(() => {
      watch();
      check();
    });
    mo.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);
}

function Eyebrow({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return <p className={`eyebrow mb-5 ${dark ? "text-sky" : "text-primary"}`}>{children}</p>;
}

function Typewriter({ phrases }: { phrases: string[] }) {
  const [i, setI] = useState(0);
  const [n, setN] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;
    const full = phrases[i] ?? "";
    const t = setTimeout(
      () => {
        if (!del && n < full.length) setN(n + 1);
        else if (!del) setDel(true);
        else if (n > 0) setN(n - 1);
        else {
          setDel(false);
          setI((i + 1) % phrases.length);
        }
      },
      !del && n === full.length ? 1800 : del ? 22 : 55,
    );
    return () => clearTimeout(t);
  }, [n, del, i, phrases]);
  return (
    <span>
      <span className="hidden motion-reduce:inline">{phrases[0]}</span>
      <span className="motion-reduce:hidden">
        {(phrases[i] ?? "").slice(0, Math.max(n, 1))}
        <span className="animate-blink ml-0.5 inline-block h-6 w-0.5 translate-y-1 bg-primary" />
      </span>
    </span>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function Cloud({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="-4 -4 136 80"
      aria-hidden
      className={`overflow-visible ${className}`}
      fill="currentColor"
    >
      <path d="M28 70a24 24 0 0 1-2-47.9A30 30 0 0 1 82 16a22 22 0 0 1 30 22A16 16 0 0 1 110 70Z" />
    </svg>
  );
}

/** Approved Salesforce character artwork, shown at its natural proportions on a transparent background. */
export function Mascot({ name, className = "" }: { name: "Astro"; className?: string }) {
  return (
    <img
      data-mascot={name}
      src={astro}
      alt={`Salesforce ${name}`}
      className={`h-auto w-full object-contain drop-shadow-[0_24px_40px_rgba(3,45,96,0.35)] ${className}`}
    />
  );
}

/* 1 — Hero */
export function Hero({ setActive }: { setActive: (index: number) => void }) {
  const [selected, setSelected] = useState("");
  return (
    <section className="bg-hero relative flex min-h-[88svh] items-center overflow-hidden text-navy-foreground">
      <Cloud className="pointer-events-none absolute -left-16 top-16 w-72 text-sky/10" />
      <Cloud className="pointer-events-none absolute right-10 top-10 w-40 text-sky/15" />
      <Cloud className="pointer-events-none absolute -bottom-10 right-1/3 w-96 text-primary/20" />
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-6 py-24 lg:grid-cols-[1.25fr_1fr]">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-sky/30 bg-navy/40 px-4 py-1.5 text-xs font-bold text-sky">
            <Cloud className="w-5" /> Agentic Commerce Search <span aria-hidden="true">|</span>
            <span className="font-medium">Salesforce</span>
          </span>
          <p className="eyebrow mt-6 text-sky">Ashley Furniture × Agentic Commerce Search</p>
          <h1 className="mt-4 text-[clamp(1.875rem,4.2vw,3.75rem)] font-semibold leading-[1.08] text-balance">
            Ashley Knows How to Furnish a Home.{" "}
            <span className="text-sky">
              Agentic Commerce Search Understands What Shoppers Are Trying to Create.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-navy-muted md:text-xl">
            From finding the perfect recliner to furnishing an entire room, discover how AI-native
            search connects shopper intent with relevant products.
          </p>
          <div className="relative mt-10 flex max-w-xl items-center gap-3 rounded-2xl bg-card px-6 py-4 text-lg text-card-foreground shadow-glow focus-within:ring-2 focus-within:ring-sky">
            <span className="text-primary">
              <SearchIcon />
            </span>
            <div className="min-w-0 flex-1 truncate" aria-hidden="true">
              {selected || <Typewriter phrases={queries} />}
            </div>
            <ChevronDown className="size-5 shrink-0 text-primary" aria-hidden="true" />
            <select
              aria-label="Explore a furniture search"
              value={selected}
              className="absolute inset-0 size-full cursor-pointer rounded-2xl opacity-0"
              onChange={(event) => {
                const query = event.target.value;
                setSelected(query);
                setActive(queries.indexOf(query));
                document.getElementById("today")?.scrollIntoView();
              }}
            >
              <option value="" disabled>
                Choose a search query
              </option>
              {queries.map((query) => (
                <option key={query}>{query}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="relative z-10 mx-auto w-full max-w-[15rem] sm:max-w-sm">
          <div className="rounded-[2rem] border border-sky/20 bg-navy/40 p-6 shadow-glow backdrop-blur">
            <div className="relative">
              <Cloud className="pointer-events-none absolute inset-x-6 bottom-2 text-sky/15" />
              <Mascot name="Astro" className="animate-float relative" />
            </div>
          </div>
        </div>
      </div>
      <a
        href="#today"
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-xs text-navy-muted"
      >
        <span className="flex h-9 w-5 justify-center rounded-full border border-navy-muted pt-1.5">
          <span className="animate-scrolldot h-1.5 w-1 rounded-full bg-navy-muted" />
        </span>
        Scroll
      </a>
    </section>
  );
}

function QueryTabs({ active, setActive }: { active: number; setActive: (i: number) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {a.queries.map((q, i) => (
        <Button
          key={q.id}
          onClick={() => setActive(i)}
          aria-pressed={i === active}
          className={`h-auto whitespace-normal rounded-full border px-4 py-2 text-sm font-medium transition-all ${
            i === active
              ? "border-primary bg-primary text-primary-foreground shadow-glow"
              : "border-border bg-card text-muted-foreground hover:border-primary hover:text-foreground"
          }`}
        >
          “{q.query}”
        </Button>
      ))}
    </div>
  );
}

export function Lightbox({
  src,
  onClose,
  label = "Enlarged search screenshot",
  alt = "Original full-size search screenshot",
}: {
  src: string | null;
  onClose: () => void;
  label?: string;
  alt?: string;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!src) return;
    const previous = document.activeElement;
    closeRef.current?.focus();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        e.preventDefault();
        closeRef.current?.focus();
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = old;
      window.removeEventListener("keydown", key);
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [src, onClose]);
  if (!src) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-auto bg-navy/95 p-4 md:p-10"
    >
      <img
        src={src}
        alt={alt}
        className="mx-auto block h-auto min-w-[720px] max-w-none rounded-lg md:max-w-full"
        onClick={(e) => e.stopPropagation()}
      />
      <Button
        ref={closeRef}
        aria-label="Close enlarged screenshot"
        onClick={onClose}
        size="icon"
        className="fixed right-6 top-6"
      >
        <X />
      </Button>
    </div>
  );
}

function EvidenceImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  if (failedSrc === src)
    return (
      <span
        role="status"
        className="flex min-h-64 items-center justify-center bg-muted p-10 text-center text-sm text-muted-foreground"
      >
        Original screenshot awaiting file upload.
      </span>
    );
  return <img src={src} alt={alt} className={className} onError={() => setFailedSrc(src)} />;
}

function Screenshot({
  src,
  label,
  alt,
  observation,
  onZoom,
}: {
  src: string;
  label: string;
  alt: string;
  observation: string;
  onZoom: () => void;
}) {
  return (
    <figure className="min-w-0 overflow-hidden rounded-2xl border bg-card shadow-soft">
      <figcaption className="border-b bg-card px-5 py-3">
        <h4 className="font-display font-semibold">{label}</h4>
        <p className="text-sm text-muted-foreground">{observation}</p>
      </figcaption>
      <button
        type="button"
        onClick={onZoom}
        aria-label={`Enlarge ${label} search screenshot`}
        className="relative block w-full cursor-zoom-in bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
      >
        <EvidenceImage
          src={src}
          alt={alt}
          className="mx-auto block h-96 w-full object-contain object-top sm:h-[29rem]"
        />
        <span className="flex items-center justify-end gap-2 border-t bg-card px-4 py-3 text-sm font-semibold text-primary">
          <ZoomIn className="size-4" aria-hidden="true" /> Enlarge
        </span>
      </button>
    </figure>
  );
}

export function SearchComparison({
  active,
  setActive,
}: {
  active: number;
  setActive: (i: number) => void;
}) {
  const [zoom, setZoom] = useState<{ src: string; alt: string } | null>(null);
  const q = a.queries[active];
  if (!q) return null;

  const evidence = [
    { label: "Ashley Furniture", src: q.screenshot, observation: q.ashley },
    {
      label: "Living Spaces using Agentic Commerce Search",
      src: q.livingSpacesScreenshot,
      observation: q.livingSpaces,
    },
  ];

  return (
    <section id="today" className="bg-secondary py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal max-w-4xl">
          <Eyebrow>Observed search experiences</Eyebrow>
          <h2 className="text-4xl font-semibold md:text-6xl">
            Same Search. <span className="text-gradient">Different Understanding.</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Explore how shopper intent shapes product discovery across real furniture-shopping
            searches.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            These captures reflect each retailer’s assortment and search experience at the time of
            capture.
          </p>
        </div>
        <div className="reveal mt-8">
          <QueryTabs active={active} setActive={setActive} />
        </div>
        <div key={q.id} className="mt-8 motion-safe:animate-in motion-safe:fade-in">
          <div className="rounded-2xl bg-navy p-6 text-navy-foreground">
            <p className="flex items-center gap-2 text-sm font-semibold text-sky">
              <Search className="size-4 shrink-0" aria-hidden="true" /> “{q.query}”
            </p>
            <h3 className="mt-2 text-2xl font-semibold">{q.heading}</h3>
            <p className="mt-2 max-w-4xl text-navy-muted">{q.context}</p>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {evidence.map(({ label, src, observation }) => {
              const alt = `${label} search results for “${q.query}”`;
              return (
                <Screenshot
                  key={label}
                  src={src}
                  label={label}
                  alt={alt}
                  observation={observation}
                  onZoom={() => setZoom({ src, alt })}
                />
              );
            })}
          </div>
          <div className="mt-5 rounded-2xl border border-primary/20 bg-card p-6 shadow-soft">
            <p className="text-lg font-semibold text-primary">{q.takeaway}</p>
            <p className="mt-2 text-muted-foreground">{q.insight}</p>
          </div>
        </div>
      </div>
      <Lightbox
        src={zoom?.src ?? null}
        alt={zoom?.alt ?? "Original full-size search screenshot"}
        onClose={() => setZoom(null)}
      />
    </section>
  );
}

export function Business() {
  return (
    <section id="outcomes" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal">
          <Eyebrow>Customer success metrics</Eyebrow>
          <h2 className="text-4xl font-semibold md:text-5xl">
            Better Discovery. Measurable Business Impact.
          </h2>
        </div>
        <div className="reveal mt-10 grid grid-cols-2 gap-4 lg:grid-cols-3">
          {a.outcomes.map((m) => (
            <article key={m.label} className="rounded-2xl border bg-card p-4 shadow-soft sm:p-6">
              <p className="mb-3 text-xs font-bold text-muted-foreground">
                {m.scenario ? "Illustrative improvement scenario" : "Reported customer outcome"}
              </p>
              <p className="font-display text-4xl font-semibold text-primary md:text-5xl">
                {m.value}
              </p>
              <p className="mt-3 text-sm font-semibold">{m.label}</p>
            </article>
          ))}
        </div>
        <p className="mt-5 max-w-4xl text-xs leading-relaxed text-muted-foreground">
          Reported customer outcomes are from existing Agentic Commerce Search customer-success
          materials; individual results vary. The +7% conversion and +5% search RPV figures are
          illustrative Ashley improvement scenarios, not measured results or validated benchmarks
          against Constructor.
        </p>
      </div>
    </section>
  );
}

/* 6 — Proof */
export function Proof() {
  const [zoom, setZoom] = useState<string | null>(null);
  return (
    <section id="customers" className="bg-secondary py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal max-w-4xl">
          <Eyebrow>Real customer search examples</Eyebrow>
          <h2 className="text-4xl font-semibold md:text-5xl">
            Different Shoppers. Different Intentions. One Smarter Search.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            From specialized terminology to personal style and shopping occasions, Agentic Commerce
            Search understands what shoppers actually mean.
          </p>
        </div>
        <div className="mt-12 grid gap-x-8 gap-y-12 lg:grid-cols-3 lg:gap-y-0">
          {a.customerExamples.map((c) => (
            <article
              key={c.name}
              className="reveal min-w-0 lg:grid lg:grid-rows-subgrid lg:row-span-5"
            >
              <p className="text-xl font-bold">{c.name}</p>
              <h3 className="min-h-16 pt-3 text-lg font-semibold">“{c.query}”</h3>
              <div className="flex pt-4">
                <Button
                  variant="ghost"
                  onClick={() => setZoom(c.screenshot)}
                  aria-label={`Enlarge ${c.name} search screenshot`}
                  className="relative flex h-auto w-full items-center justify-center rounded-lg border bg-card p-0"
                >
                  <span className="relative block w-full">
                    <EvidenceImage
                      src={c.screenshot}
                      alt={`${c.name} original search results for ${c.query}`}
                      className="block h-auto w-full object-contain"
                    />
                    <span className="absolute bottom-3 right-3 rounded-md bg-primary p-2 text-primary-foreground">
                      <ZoomIn />
                    </span>
                  </span>
                </Button>
              </div>
              <p className="pt-5 text-sm leading-relaxed text-muted-foreground">{c.explanation}</p>
              <p className="pt-4 text-sm font-semibold text-primary">{c.takeaway}</p>
            </article>
          ))}
        </div>
      </div>
      <Lightbox src={zoom} onClose={() => setZoom(null)} />
    </section>
  );
}

/* 7 — Close */
export function Closing() {
  return (
    <section className="relative overflow-hidden bg-navy py-28 text-navy-foreground md:py-36">
      <Cloud className="pointer-events-none absolute -left-20 bottom-0 w-96 text-primary/25" />
      <Cloud className="pointer-events-none absolute right-0 top-10 w-64 text-sky/10" />
      <div className="reveal relative mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-[1fr_260px]">
        <div>
          <h2 className="text-4xl font-semibold leading-[1.08] md:text-6xl">
            Ashley understands furniture. Agentic Commerce Search understands the shopper’s mission.
          </h2>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed md:text-xl">
            Help shoppers turn the room they have in mind into furniture they can explore and choose
            with confidence.
          </p>
          <p className="mt-10 text-sm font-semibold text-navy-muted">
            Agentic Commerce Search <span aria-hidden="true">|</span> Salesforce
          </p>
        </div>
        <div className="relative mx-auto w-56 md:w-64">
          <Cloud className="pointer-events-none absolute inset-x-0 bottom-0 text-sky/15" />
          <Mascot name="Astro" className="animate-float relative" />
        </div>
      </div>
    </section>
  );
}
