import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Stars } from "@/components/ui/Stars";
import { PRODUCTS } from "@/data/products";
import { REVIEWS } from "@/data/reviews";

const total = PRODUCTS.reduce((s, p) => s + p.reviewCount, 0);
const average = PRODUCTS.reduce((s, p) => s + p.rating * p.reviewCount, 0) / total;

const dateFmt = new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" });

/* Score on the left, a masonry of review cards on the right. */
export function Reviews() {
  return (
    <section className="jm-section jm-reviews" aria-labelledby="jm-reviews-title">
      <header className="jm-reviews__score" data-reveal>
        <p className="jm-eyebrow">Reviews</p>
        <h2 className="jm-h2" id="jm-reviews-title">
          Worn, loved,
          <br />
          <em>reviewed.</em>
        </h2>
        <p className="jm-reviews__big">
          {average.toFixed(1)}
          <span>/5</span>
        </p>
        <Stars rating={average} size={18} />
        <p className="jm-section__lead">From {total.toLocaleString("en-GB")} verified buyers across Europe.</p>
      </header>

      <ul className="jm-reviews__list">
        {REVIEWS.slice(0, 6).map((r, i) => {
          const product = PRODUCTS.find((p) => p.id === r.productId)!;
          return (
            <li key={r.id} className="jm-review" data-reveal style={{ "--i": i % 2 } as CSSProperties}>
              <Stars rating={r.rating} />
              <h3 className="jm-review__title">“{r.title}”</h3>
              <p className="jm-review__text">{r.text}</p>
              <footer className="jm-review__foot">
                <span>
                  <strong>{r.author}</strong> · {r.city}
                  <br />
                  <span className="jm-review__meta">
                    Size {r.size} · {dateFmt.format(new Date(r.date))}
                  </span>
                </span>
                <Link href={`/products/${product.slug}`} className="jm-review__product" data-theme={product.theme}>
                  <span className="jm-review__thumb">
                    <Image src={product.image} alt="" fill sizes="44px" />
                  </span>
                  <span className="jm-sr-only">{product.name}</span>
                </Link>
              </footer>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
