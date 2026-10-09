import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS } from "@/data/products";

const left = PRODUCTS.find((p) => p.id === 4)!;
const right = PRODUCTS.find((p) => p.id === 1)!;

/* Last word before the footer: a red card with two jackets floating either side.
   The secondary link defaults to the story page; the story page itself points elsewhere. */
export function CtaBand({ secondary = { href: "/about", label: "Our story" } }: { secondary?: { href: string; label: string } }) {
  return (
    <section className="jm-section jm-section--tight">
      <div className="jm-cta" data-theme="rouge" data-reveal>
        <span className="jm-cta__jacket jm-cta__jacket--left" aria-hidden="true">
          <Image src={left.image} alt="" fill sizes="30vw" />
        </span>
        <span className="jm-cta__jacket jm-cta__jacket--right" aria-hidden="true">
          <Image src={right.image} alt="" fill sizes="30vw" />
        </span>
        <div className="jm-cta__copy">
          <p className="jm-eyebrow">Ready when you are</p>
          <h2 className="jm-h2">
            Find the one that
            <br />
            <em>sounds like you.</em>
          </h2>
          <div className="jm-cta__actions">
            <Link href="/products" className="jm-btn">
              Shop all products <ArrowRight size={12} strokeWidth={1.5} />
            </Link>
            <Link href={secondary.href} className="jm-link">
              {secondary.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
