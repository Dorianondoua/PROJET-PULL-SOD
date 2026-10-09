const ITEMS = [
  "Confidence, wrapped in warmth",
  "Recycled gloss nylon",
  "Free returns for 30 days",
  "Four colours, one attitude",
  "Shipped in 48 hours",
];

/* White band right under the hero: the brand lines scroll past endlessly.
   Two identical rows side by side, the track slides by exactly one row. */
export function Marquee() {
  return (
    <div className="jm-marquee">
      <div className="jm-marquee__track">
        {[0, 1].map((copy) => (
          <ul key={copy} className="jm-marquee__row" aria-hidden={copy === 1 || undefined}>
            {ITEMS.map((t) => (
              <li key={t}>
                {t}
                <span className="jm-marquee__star" aria-hidden="true">
                  ✦
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
