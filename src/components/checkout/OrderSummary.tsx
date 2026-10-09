import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { COLOURS, PRODUCTS, formatPrice } from "@/data/products";
import { PROMO, type CartLine } from "@/lib/shop";

export type Totals = { subtotal: number; discount: number; shipping: number; total: number };

/* Right column of the checkout (sticky); on phones it folds into a
   "Show order summary" bar above the form. */
export function OrderSummary({ lines, totals, shippingLabel }: { lines: CartLine[]; totals: Totals; shippingLabel?: string }) {
  const [open, setOpen] = useState(false);
  const count = lines.reduce((s, l) => s + l.qty, 0);

  return (
    <aside className="jm-summary" data-open={open} aria-labelledby="jm-summary-title">
      <button type="button" className="jm-summary__toggle" aria-expanded={open} aria-controls="jm-summary-body" onClick={() => setOpen((o) => !o)}>
        <span>
          {open ? "Hide" : "Show"} order summary <ChevronDown size={14} strokeWidth={1.5} aria-hidden="true" />
        </span>
        <strong>{formatPrice(totals.total)}</strong>
      </button>

      <div className="jm-summary__body" id="jm-summary-body">
        <h2 className="jm-summary__title" id="jm-summary-title">
          Order summary <span>{count} {count === 1 ? "item" : "items"}</span>
        </h2>
        <ul className="jm-summary__lines">
          {lines.map((l) => {
            const p = PRODUCTS.find((x) => x.id === l.productId)!;
            return (
              <li key={`${l.productId}-${l.size}`}>
                <span className="jm-summary__img" data-theme={p.theme}>
                  <Image src={p.image} alt="" fill sizes="64px" />
                  <span className="jm-summary__qty" aria-label={`Quantity ${l.qty}`}>
                    {l.qty}
                  </span>
                </span>
                <span className="jm-summary__info">
                  <strong>{p.name}</strong>
                  <span>
                    {COLOURS[p.theme].name} · {l.size === "One size" ? l.size : `Size ${l.size}`}
                  </span>
                </span>
                <span className="jm-summary__price">{formatPrice(p.price * l.qty)}</span>
              </li>
            );
          })}
        </ul>
        <dl className="jm-totals">
          <div>
            <dt>Subtotal</dt>
            <dd>{formatPrice(totals.subtotal)}</dd>
          </div>
          {totals.discount > 0 && (
            <div>
              <dt>Discount · {PROMO.code}</dt>
              <dd>−{formatPrice(totals.discount)}</dd>
            </div>
          )}
          <div>
            <dt>Delivery{shippingLabel ? ` · ${shippingLabel}` : ""}</dt>
            <dd>{totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}</dd>
          </div>
          <div className="jm-totals__total">
            <dt>Total</dt>
            <dd>{formatPrice(totals.total)}</dd>
          </div>
        </dl>
        <p className="jm-summary__fine">Taxes included. Duties paid within the EU, UK and Switzerland.</p>
      </div>
    </aside>
  );
}
