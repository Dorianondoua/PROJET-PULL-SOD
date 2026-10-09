import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { COLOURS, PRODUCTS, type Flavor } from "@/data/products";

const STORY: { theme: Flavor; mood: string }[] = [
  { theme: "noir", mood: "Goes with everything, catches every light." },
  { theme: "gris", mood: "Bright without being loud. Winter, but clean." },
  { theme: "rouge", mood: "Made to be seen from across the street." },
  { theme: "orange", mood: "For the days that need a little more fire." },
];

/* Four colour panels side by side; the one you point at (or focus, or tap)
   opens up and shows its jacket. Under 760px they stack. */
export function ColourStory() {
  const [open, setOpen] = useState<Flavor>("rouge");

  return (
    <section className="jm-section" aria-labelledby="jm-colour-title">
      <header className="jm-section__head" data-reveal>
        <div>
          <p className="jm-eyebrow">Colour story</p>
          <h2 className="jm-h2" id="jm-colour-title">
            Four colours,
            <br />
            <em>one attitude.</em>
          </h2>
        </div>
      </header>

      <div className="jm-swatches" data-reveal>
        {STORY.map(({ theme, mood }) => {
          const colour = COLOURS[theme];
          const jacket = PRODUCTS.find((p) => p.model === "Cropped Puffer" && p.theme === theme)!;
          const count = PRODUCTS.filter((p) => p.theme === theme).length;
          const isOpen = open === theme;
          return (
            <div
              key={theme}
              className="jm-swatch"
              data-theme={theme}
              data-open={isOpen}
              onMouseEnter={() => setOpen(theme)}
              /* Touch has no hover: a tap anywhere on a closed panel opens it.
                 Keyboard users get the same through the toggle button. */
              onClick={() => setOpen(theme)}
            >
              <button
                type="button"
                className="jm-swatch__toggle"
                aria-expanded={isOpen}
                aria-controls={`jm-swatch-${theme}`}
                onClick={() => setOpen(theme)}
                onFocus={() => setOpen(theme)}
              >
                <span className="jm-swatch__dot" style={{ background: colour.hex }} />
                <span className="jm-swatch__name">{colour.name}</span>
              </button>
              <div className="jm-swatch__body" id={`jm-swatch-${theme}`}>
                <span className="jm-swatch__img">
                  <Image src={jacket.image} alt={jacket.name} fill sizes="(max-width: 760px) 80vw, 40vw" />
                </span>
                <div className="jm-swatch__text">
                  <p className="jm-swatch__mood">{mood}</p>
                  <Link
                    href={{ pathname: "/products", query: { colour: theme } }}
                    className="jm-btn"
                    tabIndex={isOpen ? undefined : -1}
                  >
                    Shop {colour.name} · {count} pieces <ArrowRight size={12} strokeWidth={1.5} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
