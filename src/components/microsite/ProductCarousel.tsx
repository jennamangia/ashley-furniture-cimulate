import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const products = [
  { name: "Altari Loveseat", image: "altari-loveseat", handle: "altari_loveseat/8721335.html" },
  { name: "Darcy Sofa", image: "darcy-sofa", handle: "darcy_sofa/7500538.html" },
  { name: "Mahoney Sofa", image: "mahoney-sofa", handle: "mahoney_sofa/3100438.html" },
];

export function ProductCarousel() {
  const track = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  function move(direction: -1 | 1) {
    const card = track.current?.firstElementChild;
    if (!card) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.current?.scrollBy({
      left: direction * (card.clientWidth + 8),
      behavior: reduceMotion ? "instant" : "smooth",
    });
  }

  return (
    <div className="min-w-0 rounded-xl border border-border bg-white p-2.5">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p id="sofa-recommendations-heading" className="text-xs font-semibold">
          Explore sofas and loveseats
        </p>
        <div className="flex gap-1">
          <button
            type="button"
            aria-label="Previous product"
            aria-controls="sofa-recommendations"
            disabled={edges.start}
            onClick={() => move(-1)}
            className="rounded p-1 text-primary hover:bg-secondary disabled:opacity-40"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next product"
            aria-controls="sofa-recommendations"
            disabled={edges.end}
            onClick={() => move(1)}
            className="rounded p-1 text-primary hover:bg-secondary disabled:opacity-40"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      <ul
        id="sofa-recommendations"
        ref={track}
        aria-labelledby="sofa-recommendations-heading"
        className="flex w-full min-w-0 snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain pb-2"
        onScroll={(event) => {
          const { scrollLeft, scrollWidth, clientWidth } = event.currentTarget;
          setEdges({ start: scrollLeft <= 1, end: scrollLeft + clientWidth >= scrollWidth - 1 });
        }}
      >
        {products.map(({ name, image, handle }) => (
          <li
            key={handle}
            className="w-30 shrink-0 snap-start overflow-hidden rounded-lg border border-border"
          >
            <a
              href={`https://www.ashleyfurniture.com/p/${handle}`}
              target="_blank"
              rel="noreferrer"
              className="block h-full hover:bg-muted focus-visible:-outline-offset-2"
            >
              <img
                src={`/images/ashley/${image}.webp`}
                alt=""
                width={400}
                height={400}
                className="aspect-square w-full bg-muted object-contain"
              />
              <span className="block p-2 text-xs leading-snug font-semibold">{name}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
