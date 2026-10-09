import { Check, ChevronRight, Heart, RotateCcw, Ruler, ShieldCheck, Truck } from "lucide-react";
import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { BuyBar } from "@/components/product/BuyBar";
import { Gallery } from "@/components/product/Gallery";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductReviews } from "@/components/product/ProductReviews";
import { SizeGuide } from "@/components/product/SizeGuide";
import { Accordion } from "@/components/ui/Accordion";
import { Stars } from "@/components/ui/Stars";
import { COLOURS, PRODUCTS, formatPrice, getColourways, getProduct, getRelated, type Product } from "@/data/products";
import { scrollBehavior } from "@/lib/motion";
import { useShop } from "@/lib/shop";
import { Meta } from "@/components/layout/Meta";

type Props = { slug: string };

export const getStaticPaths: GetStaticPaths = () => ({
  paths: PRODUCTS.map((p) => ({ params: { slug: p.slug } })),
  fallback: false,
});

/* Only the slug crosses the server boundary: the product (and its imported
   images) is looked up again on the page. */
export const getStaticProps: GetStaticProps<Props> = ({ params }) => ({
  props: { slug: String(params?.slug) },
});

const PERKS = [
  { Icon: Truck, text: "Free delivery over $150 · ships in 48 h" },
  { Icon: RotateCcw, text: "30-day free returns" },
  { Icon: ShieldCheck, text: "2-year warranty on seams and zips" },
];

const rise = (i: number) => ({ "--i": i }) as CSSProperties;

export default function ProductPage({ slug }: Props) {
  const product = getProduct(slug)!;
  // Keyed: moving to another colourway starts with a fresh size choice.
  return <ProductView key={product.id} product={product} />;
}

/* The card takes the jacket's colour. The gallery sticks on the left while
   the details scroll; reviews and related products follow on ink. */
function ProductView({ product }: { product: Product }) {
  const { addToCart, wishlist, toggleWishlist } = useShop();
  const oneSize = product.sizes.length === 1;
  const [size, setSize] = useState<string | null>(oneSize ? product.sizes[0] : null);
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const sizesRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const liked = wishlist.includes(product.id);
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
  const colourways = getColourways(product);
  const related = getRelated(product, 4);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 2000);
    return () => clearTimeout(t);
  }, [added]);

  const add = () => {
    if (!size) {
      setSizeError(true);
      sizesRef.current?.scrollIntoView({ behavior: scrollBehavior(), block: "center" });
      sizesRef.current?.querySelector<HTMLButtonElement>("button:not(:disabled)")?.focus({ preventScroll: true });
      return;
    }
    addToCart(product.id, size);
    setAdded(true);
  };

  const ctaLabel = added ? "Added to bag" : `Add to bag · ${formatPrice(product.price)}`;

  return (
    <PageLayout
      theme={product.theme}
      after={
        <>
          <ProductReviews product={product} />
          <section className="jm-section jm-section--tight" aria-labelledby="jm-related-title">
            <header className="jm-section__head" data-reveal>
              <div>
                <p className="jm-eyebrow">Keep looking</p>
                <h2 className="jm-h2" id="jm-related-title">
                  You might <em>also like.</em>
                </h2>
              </div>
              <Link href="/products" className="jm-link">
                All products
              </Link>
            </header>
            <ul className="jm-related">
              {related.map((p, i) => (
                <li key={p.id} data-reveal style={rise(i)}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </section>
        </>
      }
    >
      <Meta title={`${product.name} — Jacket Masters`} description={product.description} />

      <div className="jm-pdp">
        <div className="jm-pdp__gallery jm-rise" style={rise(1)}>
          <Gallery product={product} />
        </div>

        <div className="jm-pdp__info">
          <nav className="jm-crumbs jm-rise" aria-label="Breadcrumb" style={rise(0)}>
            <Link href="/products">All products</Link>
            <ChevronRight size={12} strokeWidth={1.5} aria-hidden="true" />
            <Link href={{ pathname: "/products", query: { category: product.category } }}>{product.category}</Link>
            <ChevronRight size={12} strokeWidth={1.5} aria-hidden="true" />
            <span aria-current="page">{COLOURS[product.theme].name}</span>
          </nav>

          <div className="jm-pdp__titleblock jm-rise" style={rise(1)}>
            <p className="jm-eyebrow">
              {product.tagline}
              {product.badge && <span className="jm-chip">{product.badge}</span>}
            </p>
            <h1 className="jm-pdp__title">{product.name}</h1>
            <a href="#reviews" className="jm-pdp__rating">
              <Stars rating={product.rating} />
              <span>
                {product.rating} · {product.reviewCount} reviews
              </span>
            </a>
          </div>

          <p className="jm-price jm-pdp__price jm-rise" style={rise(2)}>
            <span className="jm-price__now">
              <span className="jm-sr-only">Now </span>
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <>
                <s className="jm-price__old">
                  <span className="jm-sr-only">was </span>
                  {formatPrice(product.oldPrice)}
                </s>
                <span className="jm-chip jm-chip--solid">−{discount}%</span>
              </>
            )}
          </p>

          <p className="jm-pdp__desc jm-rise" style={rise(3)}>
            {product.description}
          </p>

          {/* ---- Colour ---- */}
          <div className="jm-pdp__block jm-rise" style={rise(4)}>
            <p className="jm-pdp__label">
              Colour · <strong>{COLOURS[product.theme].name}</strong>
            </p>
            <ul className="jm-pdp__colours">
              {colourways.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/products/${c.slug}`}
                    scroll={false}
                    className="jm-pdp__colour"
                    style={{ background: COLOURS[c.theme].hex }}
                    aria-label={COLOURS[c.theme].name}
                    aria-current={c.id === product.id ? "true" : undefined}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* ---- Size ---- */}
          <div className="jm-pdp__block jm-rise" style={rise(5)} ref={sizesRef} data-error={sizeError}>
            <div className="jm-pdp__labelrow">
              <p className="jm-pdp__label" id="jm-pdp-size">
                Size{size && !oneSize && <> · <strong>{size}</strong></>}
              </p>
              {!oneSize && (
                <button type="button" className="jm-pdp__guide" onClick={() => setGuideOpen(true)}>
                  <Ruler size={14} strokeWidth={1.5} aria-hidden="true" /> Size guide
                </button>
              )}
            </div>
            <div className="jm-size__row jm-pdp__sizes" role="radiogroup" aria-labelledby="jm-pdp-size" aria-describedby={sizeError ? "jm-pdp-size-error" : undefined}>
              {product.sizes.map((s) => {
                const soldOut = product.soldOut?.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    role="radio"
                    aria-checked={size === s}
                    className="jm-size__opt"
                    disabled={soldOut}
                    aria-label={soldOut ? `${s}, sold out` : undefined}
                    onClick={() => {
                      setSize(s);
                      setSizeError(false);
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            {sizeError && (
              <p className="jm-pdp__error" id="jm-pdp-size-error" role="alert">
                Pick a size first.
              </p>
            )}
            {product.soldOut?.length ? (
              <p className="jm-pdp__note">Struck-through sizes are sold out. Restock expected within three weeks.</p>
            ) : null}
          </div>

          {/* ---- Buy ---- */}
          <div className="jm-pdp__cta jm-rise" style={rise(6)} ref={ctaRef}>
            <button type="button" className="jm-btn jm-pdp__add" data-added={added} onClick={add} aria-live="polite">
              {added && <Check size={14} strokeWidth={2} aria-hidden="true" />}
              {ctaLabel}
            </button>
            <button
              type="button"
              className="jm-icon-btn jm-pdp__like"
              aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={liked}
              onClick={() => toggleWishlist(product.id)}
            >
              <Heart size={18} strokeWidth={1.5} fill={liked ? "currentColor" : "none"} />
            </button>
          </div>

          <ul className="jm-pdp__perks jm-rise" style={rise(7)}>
            {PERKS.map(({ Icon, text }) => (
              <li key={text}>
                <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>

          <div className="jm-rise" style={rise(8)}>
            <Accordion
              defaultOpen="details"
              items={[
                {
                  id: "details",
                  title: "Details",
                  content: (
                    <ul>
                      {product.details.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  ),
                },
                {
                  id: "care",
                  title: "Material & care",
                  content: (
                    <>
                      <p>{product.material}</p>
                      <ul>
                        {product.care.map((c) => (
                          <li key={c}>{c}</li>
                        ))}
                      </ul>
                    </>
                  ),
                },
                {
                  id: "shipping",
                  title: "Shipping & returns",
                  content: (
                    <p>
                      Free standard delivery on orders over $150, otherwise $8. Orders placed before 2 pm ship the same
                      day and arrive in 2–3 working days across Europe. Not the one? Return it within 30 days, unworn,
                      with the tags on, and the label is on us.
                    </p>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>

      <SizeGuide open={guideOpen} onClose={() => setGuideOpen(false)} />
      <BuyBar product={product} watch={ctaRef} label={added ? "Added ✓" : "Add to bag"} onAdd={add} />
    </PageLayout>
  );
}
