export type CardBrand = "visa" | "mastercard" | "amex" | null;

export function detectBrand(digits: string): CardBrand {
  if (/^4/.test(digits)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "mastercard";
  if (/^3[47]/.test(digits)) return "amex";
  return null;
}

export const BRAND_LABEL: Record<Exclude<CardBrand, null>, string> = { visa: "VISA", mastercard: "Mastercard", amex: "AMEX" };

/** "4242424" -> "4242 424• •••• ••••" (Amex: 4-6-5). */
function masked(digits: string, brand: CardBrand) {
  const groups = brand === "amex" ? [4, 6, 5] : [4, 4, 4, 4];
  const padded = digits.padEnd(groups.reduce((a, b) => a + b, 0), "•");
  let i = 0;
  return groups.map((g) => padded.slice(i, (i += g))).join(" ");
}

export type CardPreviewProps = { digits: string; name: string; expiry: string; cvc: string; flipped: boolean };

/* Live card mock-up above the card form. Recolours per brand and turns over
   while the CVC field has focus. Decorative: the form fields carry the data. */
export function CardPreview({ digits, name, expiry, cvc, flipped }: CardPreviewProps) {
  const brand = detectBrand(digits);
  return (
    <div className="jm-cc" data-flipped={flipped} data-brand={brand ?? "none"} aria-hidden="true">
      <div className="jm-cc__inner">
        <div className="jm-cc__face jm-cc__front">
          <div className="jm-cc__top">
            <span className="jm-cc__chip" />
            <span className="jm-cc__brand">{brand ? BRAND_LABEL[brand] : "Card"}</span>
          </div>
          <p className="jm-cc__number">{masked(digits, brand)}</p>
          <div className="jm-cc__bottom">
            <span>
              <small>Card holder</small>
              {name.trim() || "Your name"}
            </span>
            <span>
              <small>Expires</small>
              {expiry || "MM/YY"}
            </span>
          </div>
        </div>
        <div className="jm-cc__face jm-cc__back">
          <span className="jm-cc__stripe" />
          <span className="jm-cc__sign">
            <span className="jm-cc__cvc">{cvc || "•••"}</span>
          </span>
          <span className="jm-cc__mark">JM</span>
        </div>
      </div>
    </div>
  );
}
