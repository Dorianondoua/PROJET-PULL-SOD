import { ArrowLeft, ArrowRight, Check, Info, Lock, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type CSSProperties, type FormEvent } from "react";
import { BRAND_LABEL, CardPreview, detectBrand } from "@/components/checkout/CardPreview";
import { SelectField, TextField } from "@/components/checkout/Field";
import { OrderSummary, type Totals } from "@/components/checkout/OrderSummary";
import { Logo } from "@/components/layout/Logo";
import { COLOURS, PRODUCTS, formatPrice, type Flavor } from "@/data/products";
import { FREE_SHIPPING_FROM, priceCart, useShop, type CartLine } from "@/lib/shop";
import { scrollBehavior } from "@/lib/motion";
import { useForm, type Rules } from "@/lib/useForm";
import { Meta } from "@/components/layout/Meta";

/* Mock checkout: delivery -> payment -> confirmation. Nothing leaves the
   browser; the payment step says so, and only fakes a short processing state. */

type Step = "delivery" | "payment" | "done";
const STEPS: { id: Step; label: string }[] = [
  { id: "delivery", label: "Delivery" },
  { id: "payment", label: "Payment" },
  { id: "done", label: "Confirmation" },
];

const COUNTRIES = ["France", "Belgium", "Switzerland", "Germany", "Netherlands", "Spain", "Italy", "United Kingdom"];

const METHODS = [
  { id: "standard", label: "Standard", eta: "2–3 working days", days: 3, price: (sub: number) => (sub >= FREE_SHIPPING_FROM ? 0 : 8) },
  { id: "express", label: "Express", eta: "Next working day, before 1 pm", days: 1, price: () => 15 },
  { id: "pickup", label: "Pickup point", eta: "3–4 working days", days: 4, price: () => 4 },
] as const;
type MethodId = (typeof METHODS)[number]["id"];

const PAYMENTS = [
  { id: "card", label: "Card", note: "Visa, Mastercard, Amex" },
  { id: "applepay", label: "Apple Pay", note: "Confirm with Face ID" },
  { id: "paypal", label: "PayPal", note: "Pay with your account" },
  { id: "klarna", label: "Klarna", note: "3 interest-free payments" },
] as const;
type PaymentId = (typeof PAYMENTS)[number]["id"];

type Address = {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  postcode: string;
  city: string;
  country: string;
  phone: string;
};
type Card = { number: string; name: string; expiry: string; cvc: string };

const required = (msg: string) => (v: string) => (v.trim() ? null : msg);

const ADDRESS_RULES: Rules<Address> = {
  email: (v) => (!v.trim() ? "Enter your email." : /^\S+@\S+\.\S+$/.test(v.trim()) ? null : "That email doesn't look right."),
  firstName: required("Enter your first name."),
  lastName: required("Enter your last name."),
  address: required("Enter your street address."),
  postcode: (v) => (/^[A-Za-z0-9][A-Za-z0-9 -]{2,9}$/.test(v.trim()) ? null : "Enter a valid postcode."),
  city: required("Enter your city."),
  phone: (v) => (!v.trim() || /^\+?[\d\s().-]{7,}$/.test(v.trim()) ? null : "Enter a valid phone number, or leave it empty."),
};

const digitsOf = (v: string) => v.replace(/\D/g, "");

const CARD_RULES: Rules<Card> = {
  number: (v) => {
    const d = digitsOf(v);
    const len = detectBrand(d) === "amex" ? 15 : 16;
    return d.length === len ? null : "Enter the full card number.";
  },
  name: required("Enter the name on the card."),
  expiry: (v) => {
    const m = /^(\d{2})\/(\d{2})$/.exec(v);
    if (!m || +m[1] < 1 || +m[1] > 12) return "Use the MM/YY format.";
    const now = new Date();
    const end = new Date(2000 + +m[2], +m[1]); // first day of the month after expiry
    return end > now ? null : "This card has expired.";
  },
  cvc: (v) => (/^\d{3,4}$/.test(v) ? null : "Enter the 3 or 4 digits on the back."),
};

/** "4242424242424242" -> "4242 4242 4242 4242" (Amex 4-6-5). */
function formatCardNumber(v: string) {
  const d = digitsOf(v);
  if (detectBrand(d) === "amex") return [d.slice(0, 4), d.slice(4, 10), d.slice(10, 15)].filter(Boolean).join(" ");
  return d.slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
}
const formatExpiry = (v: string) => {
  const d = digitsOf(v).slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

function addWorkingDays(from: Date, n: number) {
  const d = new Date(from);
  while (n > 0) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) n--;
  }
  return d;
}

type Order = {
  id: string;
  lines: CartLine[];
  totals: Totals;
  address: Address;
  method: (typeof METHODS)[number];
  payment: string;
  eta: string;
  theme: Flavor;
};

export default function CheckoutPage() {
  const { cart, promo, clearCart, addToCart, openPanel } = useShop();
  const [step, setStep] = useState<Step>("delivery");
  const [method, setMethod] = useState<MethodId>("standard");
  const [payment, setPayment] = useState<PaymentId>("card");
  const [flipped, setFlipped] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const formTop = useRef<HTMLDivElement>(null);

  const addr = useForm<Address>(
    { email: "", firstName: "", lastName: "", address: "", apartment: "", postcode: "", city: "", country: "France", phone: "" },
    ADDRESS_RULES,
  );
  const card = useForm<Card>({ number: "", name: "", expiry: "", cvc: "" }, CARD_RULES);

  const subtotal = priceCart(cart, promo).subtotal;
  const chosen = METHODS.find((m) => m.id === method)!;
  const totals = priceCart(cart, promo, chosen.price(subtotal));
  const cardDigits = digitsOf(card.values.number);
  const brand = detectBrand(cardDigits);

  const goTo = (s: Step) => {
    setStep(s);
    formTop.current?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
  };

  const focusField = (id: string) => document.getElementById(id)?.focus();

  const submitDelivery = (e: FormEvent) => {
    e.preventDefault();
    const bad = addr.validate();
    if (bad) return focusField(`co-${String(bad)}`);
    goTo("payment");
  };

  const submitPayment = (e: FormEvent) => {
    e.preventDefault();
    if (payment === "card") {
      const bad = card.validate();
      if (bad) return focusField(`cc-${String(bad)}`);
    }
    setProcessing(true);
    // Pretend to talk to a payment provider.
    setTimeout(() => {
      const first = PRODUCTS.find((p) => p.id === cart[0].productId)!;
      setOrder({
        id: `JM-${Math.floor(100000 + Math.random() * 900000)}`,
        lines: cart,
        totals,
        address: addr.values,
        method: chosen,
        payment: payment === "card" ? `${brand ? BRAND_LABEL[brand] : "Card"} •••• ${cardDigits.slice(-4)}` : PAYMENTS.find((p) => p.id === payment)!.label,
        eta: new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" }).format(addWorkingDays(new Date(), chosen.days)),
        theme: first.theme,
      });
      clearCart();
      setProcessing(false);
      goTo("done");
    }, 1600);
  };

  const fillSample = () => {
    addToCart(1, "38");
    addToCart(12, "One size");
  };

  const a = addr.values;
  const stepIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <>
      <Meta title="Checkout — Jacket Masters">
        <meta name="robots" content="noindex" />
      </Meta>
      <div className="jm-card" data-theme={order?.theme ?? "noir"}>
        <div className="jm-card__inner jm-checkout">
          <header className="jm-checkout__top">
            <Logo />
            <p className="jm-checkout__secure">
              <Lock size={14} strokeWidth={1.5} aria-hidden="true" /> Secure checkout
            </p>
            <Link href="/products" className="jm-link jm-checkout__back">
              Continue shopping
            </Link>
          </header>

          <main className="jm-checkout__main" id="main" ref={formTop}>
            {step === "done" && order ? (
              <Confirmation order={order} />
            ) : cart.length === 0 ? (
              <div className="jm-checkout__empty jm-rise">
                <span className="jm-checkout__empty-icon">
                  <ShoppingBag size={28} strokeWidth={1.25} aria-hidden="true" />
                </span>
                <h1 className="jm-pagehead__title">Your bag is empty.</h1>
                <p>Add a piece or two first, or walk through the checkout with a sample bag.</p>
                <div className="jm-checkout__empty-actions">
                  <button type="button" className="jm-btn" onClick={fillSample}>
                    Try with a sample bag <ArrowRight size={12} strokeWidth={1.5} />
                  </button>
                  <Link href="/products" className="jm-link">
                    Shop all products
                  </Link>
                </div>
              </div>
            ) : (
              <div className="jm-checkout__grid">
                <div className="jm-checkout__form">
                  <ol className="jm-steps" aria-label="Checkout steps">
                    {STEPS.map((s, i) => {
                      const state = i < stepIndex ? "done" : i === stepIndex ? "current" : "todo";
                      return (
                        <li key={s.id} className="jm-steps__item" data-state={state} aria-current={state === "current" ? "step" : undefined}>
                          {state === "done" ? (
                            <button type="button" onClick={() => goTo(s.id)}>
                              <span className="jm-steps__dot">
                                <Check size={12} strokeWidth={2.5} aria-hidden="true" />
                              </span>
                              {s.label}
                            </button>
                          ) : (
                            <span>
                              <span className="jm-steps__dot">{i + 1}</span>
                              {s.label}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ol>

                  {step === "delivery" && (
                    <form className="jm-co-form jm-rise" onSubmit={submitDelivery} noValidate>
                      <fieldset className="jm-co-group">
                        <legend className="jm-co-legend">Contact</legend>
                        <TextField id="co-email" label="Email" type="email" autoComplete="email" inputMode="email" placeholder="you@example.com" {...addr.field("email")} />
                      </fieldset>

                      <fieldset className="jm-co-group">
                        <legend className="jm-co-legend">Shipping address</legend>
                        <div className="jm-co-row">
                          <TextField id="co-firstName" label="First name" autoComplete="given-name" {...addr.field("firstName")} />
                          <TextField id="co-lastName" label="Last name" autoComplete="family-name" {...addr.field("lastName")} />
                        </div>
                        <TextField id="co-address" label="Street address" autoComplete="address-line1" {...addr.field("address")} />
                        <TextField id="co-apartment" label="Apartment, floor" optional autoComplete="address-line2" {...addr.field("apartment")} />
                        <div className="jm-co-row jm-co-row--3">
                          <TextField id="co-postcode" label="Postcode" autoComplete="postal-code" {...addr.field("postcode")} />
                          <TextField id="co-city" label="City" autoComplete="address-level2" {...addr.field("city")} />
                          <SelectField id="co-country" label="Country" options={COUNTRIES} autoComplete="country-name" {...addr.field("country")} />
                        </div>
                        <TextField id="co-phone" label="Phone" optional type="tel" autoComplete="tel" inputMode="tel" placeholder="For the courier only" {...addr.field("phone")} />
                      </fieldset>

                      <fieldset className="jm-co-group">
                        <legend className="jm-co-legend">Delivery method</legend>
                        <div className="jm-options">
                          {METHODS.map((m) => {
                            const price = m.price(subtotal);
                            return (
                              <label key={m.id} className="jm-option" data-checked={method === m.id}>
                                <input type="radio" name="method" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} />
                                <span className="jm-option__radio" aria-hidden="true" />
                                <span className="jm-option__text">
                                  <strong>{m.label}</strong>
                                  <span>{m.eta}</span>
                                </span>
                                <span className="jm-option__price">{price === 0 ? "Free" : formatPrice(price)}</span>
                              </label>
                            );
                          })}
                        </div>
                      </fieldset>

                      <div className="jm-co-actions">
                        <button type="button" className="jm-link" onClick={() => openPanel("bag")}>
                          <ArrowLeft size={14} strokeWidth={1.5} /> Back to bag
                        </button>
                        <button type="submit" className="jm-btn jm-co-submit">
                          Continue to payment <ArrowRight size={12} strokeWidth={1.5} />
                        </button>
                      </div>
                    </form>
                  )}

                  {step === "payment" && (
                    <form className="jm-co-form jm-rise" onSubmit={submitPayment} noValidate aria-busy={processing}>
                      <div className="jm-recap">
                        <div>
                          <span>Contact</span>
                          <p>{a.email}</p>
                        </div>
                        <div>
                          <span>Ship to</span>
                          <p>
                            {a.address}
                            {a.apartment && `, ${a.apartment}`}, {a.postcode} {a.city}, {a.country}
                          </p>
                        </div>
                        <div>
                          <span>Method</span>
                          <p>
                            {chosen.label} · {chosen.eta}
                          </p>
                        </div>
                        <button type="button" className="jm-link" onClick={() => goTo("delivery")}>
                          Change
                        </button>
                      </div>

                      <p className="jm-demo-note">
                        <Info size={14} strokeWidth={1.5} aria-hidden="true" />
                        Design demo: no payment is taken and nothing is sent. Use any test number, like 4242 4242 4242 4242.
                      </p>

                      <fieldset className="jm-co-group">
                        <legend className="jm-co-legend">Payment</legend>
                        <div className="jm-options jm-options--grid">
                          {PAYMENTS.map((p) => (
                            <label key={p.id} className="jm-option" data-checked={payment === p.id}>
                              <input type="radio" name="payment" value={p.id} checked={payment === p.id} onChange={() => setPayment(p.id)} />
                              <span className="jm-option__radio" aria-hidden="true" />
                              <span className="jm-option__text">
                                <strong>{p.label}</strong>
                                <span>{p.note}</span>
                              </span>
                            </label>
                          ))}
                        </div>

                        {payment === "card" ? (
                          <div className="jm-cardform">
                            <CardPreview digits={cardDigits} name={card.values.name} expiry={card.values.expiry} cvc={card.values.cvc} flipped={flipped} />
                            <div className="jm-cardform__fields">
                              <TextField
                                id="cc-number"
                                label="Card number"
                                inputMode="numeric"
                                autoComplete="cc-number"
                                placeholder="1234 1234 1234 1234"
                                adornment={brand ? BRAND_LABEL[brand] : null}
                                {...card.field("number")}
                                onChange={(v) => card.field("number").onChange(formatCardNumber(v))}
                              />
                              <TextField id="cc-name" label="Name on card" autoComplete="cc-name" {...card.field("name")} />
                              <div className="jm-co-row">
                                <TextField
                                  id="cc-expiry"
                                  label="Expiry"
                                  inputMode="numeric"
                                  autoComplete="cc-exp"
                                  placeholder="MM/YY"
                                  {...card.field("expiry")}
                                  onChange={(v) => card.field("expiry").onChange(formatExpiry(v))}
                                />
                                <TextField
                                  id="cc-cvc"
                                  label="CVC"
                                  inputMode="numeric"
                                  autoComplete="cc-csc"
                                  placeholder="123"
                                  maxLength={4}
                                  {...card.field("cvc")}
                                  onChange={(v) => card.field("cvc").onChange(digitsOf(v).slice(0, 4))}
                                  onFocus={() => setFlipped(true)}
                                  onBlur={() => {
                                    setFlipped(false);
                                    card.field("cvc").onBlur();
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="jm-redirect">
                            You&apos;ll confirm in the {PAYMENTS.find((p) => p.id === payment)!.label} window after clicking Pay. In this demo,
                            nothing opens: the order goes straight through.
                          </p>
                        )}
                      </fieldset>

                      <div className="jm-co-actions">
                        <button type="button" className="jm-link" onClick={() => goTo("delivery")}>
                          <ArrowLeft size={14} strokeWidth={1.5} /> Delivery
                        </button>
                        <button type="submit" className="jm-btn jm-co-submit" disabled={processing}>
                          {processing ? (
                            <>
                              <span className="jm-spinner" aria-hidden="true" /> Processing…
                            </>
                          ) : (
                            <>
                              <Lock size={14} strokeWidth={1.5} aria-hidden="true" /> Pay {formatPrice(totals.total)}
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                <OrderSummary lines={cart} totals={totals} shippingLabel={chosen.label} />
              </div>
            )}
          </main>

          <p className="jm-checkout__fine">© 2026 Jacket Masters · A design demo store: no real orders or payments.</p>
        </div>
      </div>
    </>
  );
}

/* Thank-you screen. The card recolours to the first piece in the order. */
function Confirmation({ order }: { order: Order }) {
  const a = order.address;
  return (
    <div className="jm-confirm">
      <div className="jm-confirm__head">
        <svg className="jm-confirm__check" viewBox="0 0 52 52" aria-hidden="true">
          <circle cx="26" cy="26" r="24" />
          <path d="M15 27l7 7 15-16" />
        </svg>
        <p className="jm-eyebrow jm-rise" style={{ "--i": 1 } as CSSProperties}>
          Order {order.id}
        </p>
        <h1 className="jm-pagehead__title jm-rise" style={{ "--i": 2 } as CSSProperties}>
          Thank you, {a.firstName}.
        </h1>
        <p className="jm-pagehead__lead jm-rise" style={{ "--i": 3 } as CSSProperties}>
          Your order is confirmed. A receipt is on its way to <strong>{a.email}</strong>, and we&apos;ll email you again when
          it ships.
        </p>
      </div>

      <div className="jm-confirm__grid jm-rise" style={{ "--i": 4 } as CSSProperties}>
        <ul className="jm-confirm__items">
          {order.lines.map((l) => {
            const p = PRODUCTS.find((x) => x.id === l.productId)!;
            return (
              <li key={`${l.productId}-${l.size}`}>
                <span className="jm-confirm__img" data-theme={p.theme}>
                  <Image src={p.image} alt="" fill sizes="96px" />
                </span>
                <span>
                  <strong>{p.name}</strong>
                  <span>
                    {COLOURS[p.theme].name} · {l.size === "One size" ? l.size : `Size ${l.size}`} · Qty {l.qty}
                  </span>
                </span>
                <span>{formatPrice(p.price * l.qty)}</span>
              </li>
            );
          })}
        </ul>

        <dl className="jm-confirm__details">
          <div>
            <dt>Estimated delivery</dt>
            <dd>{order.eta}</dd>
          </div>
          <div>
            <dt>Ship to</dt>
            <dd>
              {a.firstName} {a.lastName}
              <br />
              {a.address}
              {a.apartment && `, ${a.apartment}`}
              <br />
              {a.postcode} {a.city}, {a.country}
            </dd>
          </div>
          <div>
            <dt>Delivery</dt>
            <dd>{order.method.label}</dd>
          </div>
          <div>
            <dt>Paid with</dt>
            <dd>{order.payment}</dd>
          </div>
          <div className="jm-confirm__total">
            <dt>Total paid</dt>
            <dd>{formatPrice(order.totals.total)}</dd>
          </div>
        </dl>
      </div>

      <div className="jm-confirm__actions jm-rise" style={{ "--i": 5 } as CSSProperties}>
        <Link href="/products" className="jm-btn">
          Continue shopping <ArrowRight size={12} strokeWidth={1.5} />
        </Link>
        <Link href="/" className="jm-link">
          Back to home
        </Link>
      </div>
    </div>
  );
}
