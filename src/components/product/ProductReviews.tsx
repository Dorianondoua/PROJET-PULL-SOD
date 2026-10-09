import { PenLine } from "lucide-react";
import type { CSSProperties } from "react";
import { Stars } from "@/components/ui/Stars";
import { COLOURS, PRODUCTS, getColourways, type Product } from "@/data/products";
import { REVIEWS, reviewsFor } from "@/data/reviews";

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

/** Mock star distribution (5★ → 1★, in %) consistent with the average. */
function distribution(rating: number) {
  const five = Math.min(0.95, Math.max(0.3, 0.55 + (rating - 4.5) * 0.9));
  const rest = 1 - five;
  return [five, rest * 0.72, rest * 0.17, rest * 0.06, rest * 0.05].map((v) => Math.round(v * 100));
}

/* Where the fit sits between "runs small" (0) and "runs large" (1). */
const FIT: Record<string, { pos: number; label: string }> = {
  "Hooded puffers": { pos: 0.72, label: "Roomy, as designed" },
  default: { pos: 0.5, label: "True to size" },
};

/* Score, distribution and fit on the left; reviews on the right. Reviews of
   the other colourways of the same model fill in when this one has few. */
export function ProductReviews({ product }: { product: Product }) {
  const siblings = getColourways(product).filter((p) => p.id !== product.id);
  const pool = [...reviewsFor(product.id), ...siblings.flatMap((p) => reviewsFor(p.id))];
  const list = (pool.length ? pool : REVIEWS).slice(0, 4);
  const dist = distribution(product.rating);
  const fit = FIT[product.category] ?? FIT.default;

  return (
    <section className="jm-section jm-pdp-reviews" id="reviews" aria-labelledby="jm-pdp-reviews-title">
      <header className="jm-pdp-reviews__score" data-reveal>
        <p className="jm-eyebrow">Reviews</p>
        <h2 className="jm-h2" id="jm-pdp-reviews-title">
          What buyers <em>say.</em>
        </h2>
        <div className="jm-pdp-reviews__big">
          <span>{product.rating.toFixed(1)}</span>
          <span>
            <Stars rating={product.rating} size={16} />
            <small>{product.reviewCount} reviews</small>
          </span>
        </div>

        <ul className="jm-bars" aria-label="Rating distribution">
          {dist.map((pct, i) => (
            <li key={i}>
              <span>{5 - i}★</span>
              <span className="jm-bars__track">
                <span className="jm-bars__fill" style={{ "--w": `${pct}%` } as CSSProperties} />
              </span>
              <span>{pct}%</span>
            </li>
          ))}
        </ul>

        <div className="jm-fit">
          <p className="jm-fit__label">
            Fit · <strong>{fit.label}</strong>
          </p>
          <div className="jm-fit__track" role="img" aria-label={`Fit: ${fit.label}`}>
            <span className="jm-fit__dot" style={{ left: `${fit.pos * 100}%` }} />
          </div>
          <p className="jm-fit__ends" aria-hidden="true">
            <span>Runs small</span>
            <span>Runs large</span>
          </p>
        </div>

        <button type="button" className="jm-btn jm-btn--ghost">
          <PenLine size={14} strokeWidth={1.5} aria-hidden="true" /> Write a review
        </button>
      </header>

      <ul className="jm-pdp-reviews__list">
        {list.map((r, i) => {
          const bought = PRODUCTS.find((p) => p.id === r.productId)!;
          return (
            <li key={r.id} className="jm-review" data-reveal style={{ "--i": i } as CSSProperties}>
              <Stars rating={r.rating} />
              <h3 className="jm-review__title">“{r.title}”</h3>
              <p className="jm-review__text">{r.text}</p>
              <footer className="jm-review__foot">
                <span>
                  <strong>{r.author}</strong> · {r.city}
                  <br />
                  <span className="jm-review__meta">
                    Verified buyer · Size {r.size}
                    {bought.id !== product.id && ` · Bought in ${COLOURS[bought.theme].name}`}
                  </span>
                </span>
                <span className="jm-review__meta">{dateFmt.format(new Date(r.date))}</span>
              </footer>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
