import { ArrowRight, Lock, Minus, Plus, Tag, Trash2, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, type CSSProperties, type FormEvent } from "react";
import { COLOURS, PRODUCTS, formatPrice } from "@/data/products";
import { FREE_SHIPPING_FROM, MAX_QTY, PROMO, priceCart, useShop } from "@/lib/shop";
import { Drawer } from "./Drawer";

const byId = (id: number) => PRODUCTS.find((p) => p.id === id)!;

export function BagDrawer() {
  const { cart, cartCount, setQty, removeLine, panel, closePanel, promo: applied, applyPromo } = useShop();
  const [code, setCode] = useState("");
  const [invalid, setInvalid] = useState(false);
  const promo = applied ? "applied" : invalid ? "invalid" : "idle";

  const { subtotal, discount, shipping, total } = priceCart(cart, applied);
  const freeShipping = subtotal >= FREE_SHIPPING_FROM;
  const progress = Math.min(1, subtotal / FREE_SHIPPING_FROM);

  const applyCode = (e: FormEvent) => {
    e.preventDefault();
    setInvalid(!applyPromo(code));
  };

  return (
    <Drawer
      id="jm-bag"
      open={panel === "bag"}
      onClose={closePanel}
      title={
        <>
          Your bag <span className="jm-drawer__count">{cartCount}</span>
        </>
      }
      footer={
        cart.length > 0 && (
          <>
            <form className="jm-promo" onSubmit={applyCode}>
              <Tag size={14} strokeWidth={1.5} aria-hidden="true" />
              <label htmlFor="jm-promo-code" className="jm-sr-only">
                Promo code
              </label>
              <input
                id="jm-promo-code"
                value={code}
                placeholder="Promo code (try WELCOME10)"
                autoComplete="off"
                aria-invalid={promo === "invalid"}
                aria-describedby="jm-promo-msg"
                onChange={(e) => {
                  setCode(e.target.value);
                  setInvalid(false);
                }}
              />
              <button type="submit" className="jm-promo__apply" disabled={!code.trim() || promo === "applied"}>
                Apply
              </button>
            </form>
            <p className="jm-promo__msg" id="jm-promo-msg" role="status" data-state={promo}>
              {promo === "applied" && `${PROMO.code} applied: 10% off your order.`}
              {promo === "invalid" && "This code isn't valid."}
            </p>

            <dl className="jm-totals">
              <div>
                <dt>Subtotal</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              {discount > 0 && (
                <div>
                  <dt>Discount</dt>
                  <dd>−{formatPrice(discount)}</dd>
                </div>
              )}
              <div>
                <dt>Delivery</dt>
                <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
              </div>
              <div className="jm-totals__total">
                <dt>Total</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
            </dl>
            <Link href="/checkout" className="jm-btn jm-btn--block">
              <Lock size={14} strokeWidth={1.5} aria-hidden="true" /> Checkout · {formatPrice(total)}
            </Link>
            <p className="jm-drawer__fine">Taxes included · Card, Apple Pay, PayPal, Klarna</p>
          </>
        )
      }
    >
      {cart.length === 0 ? (
        <div className="jm-drawer__empty">
          <span className="jm-drawer__empty-img" data-theme="rouge">
            <Image src={byId(3).image} alt="" fill sizes="160px" />
          </span>
          <p className="jm-drawer__empty-title">Your bag is empty.</p>
          <p>Something glossy would look good in here.</p>
          <Link href="/products" className="jm-btn">
            Shop all products <ArrowRight size={12} strokeWidth={1.5} />
          </Link>
        </div>
      ) : (
        <>
          <div className="jm-ship" data-done={freeShipping}>
            <p>
              <Truck size={14} strokeWidth={1.5} aria-hidden="true" />
              {freeShipping ? (
                <>Free delivery unlocked.</>
              ) : (
                <>
                  <strong>{formatPrice(FREE_SHIPPING_FROM - subtotal)}</strong> away from free delivery
                </>
              )}
            </p>
            <span className="jm-ship__track" aria-hidden="true">
              <span className="jm-ship__fill" style={{ "--p": progress } as CSSProperties} />
            </span>
          </div>

          <ul className="jm-lines">
            {cart.map((l) => {
              const p = byId(l.productId);
              const label = `${p.name}, size ${l.size}`;
              return (
                <li key={`${l.productId}-${l.size}`} className="jm-line">
                  <Link href={`/products/${p.slug}`} className="jm-line__img" data-theme={p.theme} tabIndex={-1} aria-hidden="true">
                    <Image src={p.image} alt="" fill sizes="88px" />
                  </Link>
                  <div className="jm-line__info">
                    <div className="jm-line__top">
                      <Link href={`/products/${p.slug}`} className="jm-line__name">
                        {p.name}
                      </Link>
                      <span className="jm-line__price">{formatPrice(p.price * l.qty)}</span>
                    </div>
                    <p className="jm-line__meta">
                      {COLOURS[p.theme].name} · {l.size === "One size" ? l.size : `Size ${l.size}`}
                    </p>
                    <div className="jm-line__bottom">
                      <div className="jm-qty" role="group" aria-label={`Quantity, ${label}`}>
                        <button type="button" aria-label="Decrease quantity" onClick={() => setQty(l.productId, l.size, l.qty - 1)}>
                          <Minus size={12} strokeWidth={2} />
                        </button>
                        <output aria-live="polite">{l.qty}</output>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          disabled={l.qty >= MAX_QTY}
                          onClick={() => setQty(l.productId, l.size, l.qty + 1)}
                        >
                          <Plus size={12} strokeWidth={2} />
                        </button>
                      </div>
                      <button type="button" className="jm-line__remove" aria-label={`Remove ${label}`} onClick={() => removeLine(l.productId, l.size)}>
                        <Trash2 size={14} strokeWidth={1.5} aria-hidden="true" /> Remove
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </Drawer>
  );
}
