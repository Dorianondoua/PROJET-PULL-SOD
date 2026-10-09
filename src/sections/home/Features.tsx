import { Feather, RotateCcw, Scissors, Sparkles } from "lucide-react";
import type { CSSProperties } from "react";

const FEATURES = [
  {
    Icon: Sparkles,
    title: "Gloss that lasts",
    text: "A lacquered finish bonded to recycled nylon. It shrugs off rain and keeps its shine, wear after wear.",
  },
  {
    Icon: Feather,
    title: "Warm, not heavy",
    text: "650 fill-power, responsibly sourced down. Full winter warmth in a jacket that weighs 620 g.",
  },
  {
    Icon: Scissors,
    title: "Cut to crop",
    text: "Patterned on the waist, not the hips, for a sharp line over high-waisted everything.",
  },
  {
    Icon: RotateCcw,
    title: "30-day free returns",
    text: "Shipped in 48 hours across Europe. Changed your mind? Send it back, on us.",
  },
];

/* Sticky statement on the left, four numbered arguments on the right. */
export function Features() {
  return (
    <section className="jm-section jm-features" aria-labelledby="jm-features-title">
      <header className="jm-features__head" data-reveal>
        <p className="jm-eyebrow">Why it works</p>
        <h2 className="jm-h2" id="jm-features-title">
          Built for the cold.
          <br />
          <em>Designed to be seen.</em>
        </h2>
        <p className="jm-section__lead">
          Every Jacket Masters piece starts from the same recipe: one gloss, one fill, a cut that flatters. Here is what
          goes into it.
        </p>
      </header>

      <ol className="jm-features__grid">
        {FEATURES.map(({ Icon, title, text }, i) => (
          <li key={title} className="jm-feature" data-reveal style={{ "--i": i } as CSSProperties}>
            <span className="jm-feature__top">
              <span className="jm-feature__num">0{i + 1}</span>
              <span className="jm-feature__icon">
                <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
              </span>
            </span>
            <h3 className="jm-feature__title">{title}</h3>
            <p className="jm-feature__text">{text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
