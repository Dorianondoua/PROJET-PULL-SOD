import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { PRODUCTS, type Category, type Flavor } from "@/data/products";

type Tile = { category: Category; theme: Flavor; covers: number[]; area: string };

/* One tile per category, each on the colour of its cover jacket.
   `area` places it in the bento grid (see .jm-bento in home.css). */
const TILES: Tile[] = [
  { category: "Cropped puffers", theme: "rouge", covers: [3], area: "cropped" },
  { category: "Long coats", theme: "gris", covers: [6], area: "long" },
  { category: "Hooded puffers", theme: "orange", covers: [7], area: "hooded" },
  { category: "Vests", theme: "noir", covers: [9], area: "vests" },
  { category: "Accessories", theme: "noir", covers: [11, 12], area: "acc" },
];

const byId = (id: number) => PRODUCTS.find((p) => p.id === id)!;

export function ShopByCut() {
  return (
    <section className="jm-section" aria-labelledby="jm-cut-title">
      <header className="jm-section__head" data-reveal>
        <div>
          <p className="jm-eyebrow">The collection</p>
          <h2 className="jm-h2" id="jm-cut-title">
            Shop by cut
          </h2>
        </div>
        <Link href="/products" className="jm-link">
          See all {PRODUCTS.length} pieces <ArrowUpRight size={14} strokeWidth={1.5} />
        </Link>
      </header>

      <ul className="jm-bento">
        {TILES.map((t, i) => {
          const count = PRODUCTS.filter((p) => p.category === t.category).length;
          return (
            <li key={t.category} className={`jm-bento__cell jm-bento__cell--${t.area}`} data-reveal style={{ "--i": i } as CSSProperties}>
              <Link
                href={{ pathname: "/products", query: { category: t.category } }}
                className="jm-bento__tile"
                data-theme={t.theme}
              >
                <span className="jm-bento__imgs">
                  {t.covers.map((id) => (
                    <span key={id} className="jm-bento__img">
                      <Image src={byId(id).image} alt="" fill sizes="(max-width: 760px) 50vw, 33vw" />
                    </span>
                  ))}
                </span>
                <span className="jm-bento__label">
                  <span className="jm-bento__name">{t.category}</span>
                  <span className="jm-bento__count">
                    {count} {count > 1 ? "pieces" : "piece"}
                  </span>
                </span>
                <span className="jm-bento__arrow" aria-hidden="true">
                  <ArrowUpRight size={16} strokeWidth={1.5} />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
