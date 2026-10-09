import Image from "next/image";
import { useState, type KeyboardEvent, type PointerEvent } from "react";
import type { Product } from "@/data/products";

const VIEW_LABELS = ["Front", "Back", "Side", "Detail"];

/* Product views: thumbnails on the side (tabs), the floating stage on the
   right. With a mouse, hovering the stage zooms 1.8x towards the cursor. */
export function Gallery({ product }: { product: Product }) {
  const shots = [product.image, ...product.gallery];
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const multi = shots.length > 1;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--zx", `${((e.clientX - r.left) / r.width) * 100}%`);
    e.currentTarget.style.setProperty("--zy", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  // Arrow keys move between the view tabs, as the tabs pattern expects.
  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const dir = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!dir) return;
    e.preventDefault();
    const next = (active + dir + shots.length) % shots.length;
    setActive(next);
    (e.currentTarget.children[next] as HTMLElement | undefined)?.focus();
  };

  return (
    <div className="jm-gallery" data-multi={multi}>
      {multi && (
        <div className="jm-gallery__thumbs" role="tablist" aria-label="Product views" aria-orientation="vertical" onKeyDown={onTabKey}>
          {shots.map((s, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              id={`jm-view-${i}`}
              aria-selected={i === active}
              aria-controls="jm-gallery-stage"
              tabIndex={i === active ? 0 : -1}
              className="jm-gallery__thumb"
              onClick={() => setActive(i)}
            >
              <Image src={s} alt="" fill sizes="80px" />
              <span className="jm-sr-only">{VIEW_LABELS[i]} view</span>
            </button>
          ))}
        </div>
      )}

      <div
        id="jm-gallery-stage"
        role={multi ? "tabpanel" : undefined}
        aria-labelledby={multi ? `jm-view-${active}` : undefined}
        className="jm-gallery__stage"
        data-zoom={zoom}
        onPointerEnter={(e) => e.pointerType === "mouse" && setZoom(true)}
        onPointerLeave={() => setZoom(false)}
        onPointerMove={onMove}
      >
        <div className="jm-stage__figure">
          <div className="jm-stage__slot">
            <div className="jm-float">
              {/* Keyed so a new view re-mounts and plays the swap-in animation. */}
              <div
                key={active}
                className="jm-stage__item jm-gallery__shot"
                style={active === 0 ? { viewTransitionName: `jm-product-${product.id}` } : undefined}
              >
                <Image
                  src={shots[active]}
                  alt={`${product.name}, ${VIEW_LABELS[active].toLowerCase()} view`}
                  priority
                  fill
                  sizes="(max-width: 900px) 90vw, 600px"
                />
              </div>
            </div>
            <div className="jm-stage__shadow" />
          </div>
        </div>
        <p className="jm-gallery__hint" aria-hidden="true">
          Hover to zoom
        </p>
      </div>
    </div>
  );
}
