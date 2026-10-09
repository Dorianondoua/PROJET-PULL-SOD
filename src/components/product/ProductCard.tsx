import { Heart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { COLOURS, formatPrice, getColourways, type Product } from "@/data/products";
import { useShop } from "@/lib/shop";

/* Catalogue card. The media sits on the product's own colour; hovering swaps
   to the back view (when there is one) and slides up a quick-add size row.
   Name, price, colourway dots and rating sit below on the page background. */
export function ProductCard({ product: p, priority = false }: { product: Product; priority?: boolean }) {
  const { addToCart, wishlist, toggleWishlist } = useShop();
  const [added, setAdded] = useState<string | null>(null);
  const liked = wishlist.includes(p.id);
  const href = `/products/${p.slug}`;
  const back = p.gallery[0];
  const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  const colourways = getColourways(p);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(null), 1600);
    return () => clearTimeout(t);
  }, [added]);

  return (
    <article className="jm-pcard">
      <div className="jm-pcard__media" data-theme={p.theme} data-has-back={Boolean(back)}>
        {/* Duplicate of the title link for pointer users; keyboard and screen
            readers use the title link only. */}
        <Link href={href} className="jm-pcard__imglink" tabIndex={-1} aria-hidden="true">
          {/* Same view-transition-name as the product page stage: the photo morphs between the two. */}
          <span className="jm-pcard__img jm-pcard__img--front" style={{ viewTransitionName: `jm-product-${p.id}` }}>
            <Image src={p.image} alt="" fill priority={priority} sizes="(max-width: 560px) 50vw, (max-width: 1100px) 33vw, 25vw" />
          </span>
          {back && (
            <span className="jm-pcard__img jm-pcard__img--back">
              <Image src={back} alt="" fill sizes="(max-width: 560px) 50vw, (max-width: 1100px) 33vw, 25vw" />
            </span>
          )}
        </Link>

        <div className="jm-pcard__badges">
          {p.badge && <span className="jm-chip">{p.badge}</span>}
          {discount > 0 && <span className="jm-chip jm-chip--solid">−{discount}%</span>}
        </div>

        <button
          type="button"
          className="jm-icon-btn jm-pcard__like"
          aria-label={liked ? `Remove ${p.name} from wishlist` : `Add ${p.name} to wishlist`}
          aria-pressed={liked}
          onClick={() => toggleWishlist(p.id)}
        >
          <Heart size={16} strokeWidth={1.5} fill={liked ? "currentColor" : "none"} />
        </button>

        <div className="jm-pcard__quick">
          <span className="jm-pcard__quick-label" aria-live="polite">
            {added ? `Added to bag · ${added}` : "Quick add"}
          </span>
          <div className="jm-pcard__sizes">
            {p.sizes.map((s) => {
              const soldOut = p.soldOut?.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  className="jm-pcard__size"
                  disabled={soldOut}
                  aria-label={soldOut ? `Size ${s}, sold out` : `Add ${p.name}, size ${s}, to bag`}
                  onClick={() => {
                    addToCart(p.id, s);
                    setAdded(s);
                  }}
                >
                  {s === "One size" ? "Add to bag" : s}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="jm-pcard__body">
        <div className="jm-pcard__row">
          <h3 className="jm-pcard__name">
            <Link href={href}>{p.name}</Link>
          </h3>
          <p className="jm-pcard__price">
            <span className="jm-sr-only">{p.oldPrice ? "Now " : "Price "}</span>
            {formatPrice(p.price)}
            {p.oldPrice && (
              <s>
                <span className="jm-sr-only">was </span>
                {formatPrice(p.oldPrice)}
              </s>
            )}
          </p>
        </div>
        <p className="jm-pcard__sub">{p.tagline}</p>
        <div className="jm-pcard__row">
          <ul className="jm-pcard__dots" aria-label="Colours">
            {colourways.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/products/${c.slug}`}
                  className="jm-pcard__dot"
                  style={{ background: COLOURS[c.theme].hex }}
                  aria-label={COLOURS[c.theme].name}
                  aria-current={c.id === p.id ? "true" : undefined}
                />
              </li>
            ))}
          </ul>
          <span className="jm-pcard__rating">
            <Star size={12} strokeWidth={1.5} fill="currentColor" aria-hidden="true" />
            <span className="jm-sr-only">Rated </span>
            {p.rating}
            <span className="jm-pcard__reviews">({p.reviewCount})</span>
          </span>
        </div>
      </div>
    </article>
  );
}
