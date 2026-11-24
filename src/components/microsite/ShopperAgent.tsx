import { useEffect, useRef, useState } from "react";
import { MessageCircle, Pause, Play, RotateCcw, X, ZoomIn } from "lucide-react";
import { ProductCarousel } from "./ProductCarousel";
import { Lightbox } from "./Sections";

const [productPage] = Object.values(
  import.meta.glob<string>("/src/assets/ashley/altari-pdp.{png,jpg,jpeg}", {
    eager: true,
    import: "default",
    query: "?url",
  }),
);
const sofaImage = productPage ?? "/images/ashley/altari-room.webp";
const sofaAlt = productPage
  ? "Ashley Furniture Altari Sofa product page with the product gallery, price and color options."
  : "Ashley Furniture’s Altari Sofa in Slate in a furnished living room.";

const exchanges = [
  {
    question: "I’m looking at this sofa, but I’m not sure it’ll work in my living room.",
    answer:
      "I can help you think through that! Do you know roughly how much space you have available and whether you’re looking for something compact or more spacious?",
  },
  {
    question: "It’s a smaller apartment, and I want something comfortable but not overwhelming.",
    answer:
      "For a smaller living room, I’d consider the sofa’s overall width, depth, and how much walking space you’ll have around it. A streamlined silhouette can help keep the room feeling open.",
  },
  {
    question: "Do you have anything similar that might work better?",
    answer:
      "Here are a few styles worth exploring if you want a similar look with a different size or silhouette.",
    recommendations: true,
  },
  {
    question: "What else would go with it?",
    answer:
      "A compact coffee table or a coordinating accent chair could help complete the room without making it feel crowded. I’d start with pieces that complement the sofa’s shape and finish.",
  },
];

const openingPause = 600;
const autoplayDelay = 1000;
const visibilityThreshold = 0.5;
const messages = exchanges.flatMap(({ question, answer, recommendations }) => [
  { speaker: "Shopper" as const, text: question, pause: 1800, recommendations: false },
  {
    speaker: "Shopper Agent" as const,
    text: answer,
    pause: recommendations ? 8500 : 5500,
    recommendations,
  },
]);

function ChatBubble({ speaker, text }: { speaker: "Shopper" | "Shopper Agent"; text: string }) {
  const shopper = speaker === "Shopper";

  return (
    <p
      className={`w-fit max-w-[92%] rounded-2xl p-3 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:duration-300 ${
        shopper ? "ml-auto rounded-tr-sm bg-secondary" : "rounded-tl-sm bg-muted"
      }`}
    >
      <span className="sr-only">{speaker}: </span>
      {text}
    </p>
  );
}

export function ShopperAgent() {
  const [open, setOpen] = useState(true);
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [inView, setInView] = useState<boolean | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const remainingPause = useRef<number | null>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const transcript = useRef<HTMLDivElement>(null);
  const following = useRef(true);
  const lastTop = useRef(0);
  const complete = visibleMessages === messages.length;
  const active = open && playing && inView !== false && !zoom && !complete;
  const typing = active && messages[visibleMessages - 1]?.speaker === "Shopper";

  useEffect(() => {
    const demo = panel.current;
    if (!demo || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries.at(-1);
        if (entry)
          setInView(entry.isIntersecting && entry.intersectionRatio >= visibilityThreshold);
      },
      { threshold: visibilityThreshold },
    );
    observer.observe(demo);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || !open || zoom || started.current) return;
    const motion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (motion?.matches) return;

    const timer = window.setTimeout(() => {
      if (started.current || motion?.matches) return;
      started.current = true;
      setVisibleMessages(1);
      setPlaying(true);
    }, autoplayDelay);
    return () => window.clearTimeout(timer);
  }, [inView, open, zoom]);

  useEffect(() => {
    if (!active) return;
    const delay = remainingPause.current ?? messages[visibleMessages - 1]?.pause ?? openingPause;
    const deadline = Date.now() + delay;
    let fired = false;
    const timer = window.setTimeout(() => {
      fired = true;
      remainingPause.current = null;
      setVisibleMessages((count) => count + 1);
    }, delay);
    return () => {
      window.clearTimeout(timer);
      if (!fired) remainingPause.current = Math.max(0, deadline - Date.now());
    };
  }, [visibleMessages, active]);

  useEffect(() => {
    const log = transcript.current;
    if (!open || !log || !following.current) return;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    log.scrollTo?.({
      top: log.scrollHeight,
      behavior: reduceMotion ? "instant" : "smooth",
    });
  }, [open, visibleMessages, typing]);

  return (
    <section id="shopper-agent" className="mx-auto max-w-7xl px-6 py-24">
      <div className="reveal max-w-4xl">
        <h2 className="text-4xl font-semibold md:text-5xl">
          Finding the Right Furniture Is Just the Beginning.{" "}
          <span className="text-gradient">Shopper Agent Helps Them Choose It.</span>
        </h2>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
          Help shoppers think through fit, compare styles, and find coordinating pieces directly in
          the storefront.
        </p>
      </div>
      <figure className="reveal mt-10 overflow-hidden rounded-2xl border bg-card shadow-soft">
        <figcaption className="border-b bg-secondary px-4 py-3 text-sm font-semibold text-primary sm:px-6">
          Illustrative Shopper Agent experience
          <span className="mt-1 block text-xs font-medium text-muted-foreground sm:ml-3 sm:mt-0 sm:inline">
            {productPage
              ? "Scripted demonstration on a captured Ashley product page"
              : "Scripted demonstration with authentic Ashley product photography"}
          </span>
        </figcaption>
        <div
          className={
            productPage
              ? "bg-white"
              : "grid grid-cols-1 items-start lg:grid-cols-[minmax(0,1fr)_22rem]"
          }
        >
          <div>
            <img
              src={sofaImage}
              alt={sofaAlt}
              width={productPage ? 2137 : 1440}
              height={productPage ? 1323 : 960}
              className="block h-auto w-full"
              loading="lazy"
            />
          </div>
          <div
            className={
              productPage
                ? "relative z-10 min-w-0 px-4 pb-4 lg:ml-auto lg:-mt-28 lg:w-[22rem]"
                : "min-w-0 self-stretch border-t bg-muted p-4 lg:border-l lg:border-t-0"
            }
          >
            <div
              id="sofa-conversation"
              ref={panel}
              hidden={!open}
              className="overflow-hidden rounded-2xl border border-border bg-white text-foreground shadow-soft"
            >
              <header className="flex items-center gap-3 bg-navy px-4 py-3 text-white">
                <MessageCircle className="size-5 shrink-0" aria-hidden="true" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold">Ask about this sofa</h3>
                  <p className="text-xs text-white/90">Shopper Agent</p>
                </div>
                <button
                  ref={close}
                  type="button"
                  aria-label="Close Shopper Agent"
                  onClick={() => {
                    setOpen(false);
                    requestAnimationFrame(() => launcher.current?.focus());
                  }}
                  className="rounded-full p-2 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </header>
              <div
                id="sofa-transcript"
                ref={transcript}
                role="log"
                aria-label="Sofa conversation history"
                aria-relevant="additions"
                tabIndex={0}
                onScroll={(event) => {
                  if (!open) return;
                  const log = event.currentTarget;
                  const atBottom = log.scrollHeight - log.clientHeight - log.scrollTop <= 12;
                  if (atBottom || log.scrollTop < lastTop.current) following.current = atBottom;
                  lastTop.current = log.scrollTop;
                }}
                className="h-[min(22rem,60svh)] space-y-3 overflow-y-auto overscroll-contain px-4 py-4 text-sm leading-relaxed [overflow-anchor:none] [scrollbar-gutter:stable] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary lg:h-[26rem]"
              >
                {!visibleMessages && !playing && (
                  <p className="rounded-xl bg-muted p-4">
                    Watch a shopper consider how this sofa could fit in a smaller living room.
                  </p>
                )}
                {messages.slice(0, visibleMessages).map(({ speaker, text, recommendations }) => (
                  <div key={text} className="space-y-2">
                    <ChatBubble speaker={speaker} text={text} />
                    {recommendations && <ProductCarousel />}
                  </div>
                ))}
                {typing && (
                  <div
                    aria-hidden="true"
                    className="flex w-fit gap-1 rounded-2xl bg-muted px-3 py-3"
                  >
                    {[0, 1, 2].map((dot) => (
                      <span
                        key={dot}
                        style={{ animationDelay: `${dot * 120}ms` }}
                        className="size-1.5 rounded-full bg-navy/60 motion-safe:animate-bounce"
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="border-t border-border px-4 py-3">
                <button
                  type="button"
                  onClick={() => {
                    started.current = true;
                    if (complete) {
                      following.current = true;
                      lastTop.current = 0;
                      transcript.current?.scrollTo?.({ top: 0, behavior: "instant" });
                      setVisibleMessages(0);
                      setPlaying(true);
                    } else {
                      setPlaying((active) => !active);
                    }
                  }}
                  aria-controls="sofa-transcript"
                  className="inline-flex min-h-10 max-w-full items-center gap-2 rounded-xl border border-primary/30 px-3 py-2 text-left text-xs font-semibold text-primary hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {complete ? (
                    <RotateCcw className="size-4" aria-hidden="true" />
                  ) : playing ? (
                    <Pause className="size-4" aria-hidden="true" />
                  ) : (
                    <Play className="size-4" aria-hidden="true" />
                  )}
                  {complete
                    ? "Replay conversation"
                    : playing
                      ? "Pause conversation"
                      : visibleMessages
                        ? "Resume conversation"
                        : "Play conversation"}
                </button>
              </div>
            </div>
            {!open && (
              <button
                ref={launcher}
                type="button"
                aria-expanded={open}
                aria-controls="sofa-conversation"
                onClick={() => {
                  setOpen(true);
                  if (!started.current) {
                    started.current = true;
                    setPlaying(true);
                  }
                  requestAnimationFrame(() => close.current?.focus());
                }}
                className="ml-auto flex items-center gap-2 rounded-full bg-navy px-4 py-3 text-sm font-semibold text-white hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <MessageCircle className="size-4" aria-hidden="true" /> Ask about this sofa
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3">
          <div>
            <p className="font-display font-semibold">Altari Sofa</p>
            <a
              href="https://www.ashleyfurniture.com/p/altari_sofa/8721338.html"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-primary hover:underline"
            >
              View product on Ashley
            </a>
          </div>
          <button
            type="button"
            onClick={() => setZoom(true)}
            className="inline-flex items-center gap-2 rounded px-1 py-1 text-sm font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <ZoomIn className="size-4" aria-hidden="true" /> Enlarge product image
          </button>
        </div>
      </figure>
      <Lightbox
        src={zoom ? sofaImage : null}
        onClose={() => setZoom(false)}
        label="Enlarged Ashley product image"
        alt={sofaAlt}
      />
    </section>
  );
}
