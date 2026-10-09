import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SHOWCASE_FLAVORS } from "@/data/products";
import { Meta } from "@/components/layout/Meta";

/* A full-screen card where the jacket stands in for the 0. Clicking it tries
   the next colourway, and the card's gradient blends along. */
export default function NotFound() {
  const [i, setI] = useState(0);
  const flavor = SHOWCASE_FLAVORS[i];
  const next = () => setI((n) => (n + 1) % SHOWCASE_FLAVORS.length);

  return (
    <>
      <Meta title="Page not found — Jacket Masters">
        <meta name="robots" content="noindex" />
      </Meta>
      <div className="jm-card" data-theme={flavor.key}>
        <div className="jm-card__inner jm-page">
          <SiteHeader />
          <main className="jm-404" id="main">
            <h1 className="jm-404__code">
              <span className="jm-sr-only">Error 404</span>
              <span aria-hidden="true">4</span>
              <button type="button" className="jm-404__zero" onClick={next} aria-label="Try another colour">
                {SHOWCASE_FLAVORS.map((f, n) => (
                  <span key={f.id} className="jm-404__jacket" data-active={n === i}>
                    <Image src={f.image} alt="" fill priority={n === 0} sizes="40vw" />
                  </span>
                ))}
              </button>
              <span aria-hidden="true">4</span>
            </h1>
            <p className="jm-404__title jm-rise" style={{ "--i": 2 } as CSSProperties}>
              This page went out in the cold.
            </p>
            <p className="jm-404__lead jm-rise" style={{ "--i": 3 } as CSSProperties}>
              The link may be old or mistyped. While you&apos;re here, tap the jacket: it comes in four colours.
            </p>
            <div className="jm-404__actions jm-rise" style={{ "--i": 4 } as CSSProperties}>
              <Link href="/" className="jm-btn">
                Back to home <ArrowRight size={12} strokeWidth={1.5} />
              </Link>
              <Link href="/products" className="jm-link">
                Shop all products
              </Link>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
