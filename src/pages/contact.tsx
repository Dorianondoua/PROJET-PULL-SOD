import { ArrowRight, Check, Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { useState, type CSSProperties, type FormEvent } from "react";
import { SelectField, TextField } from "@/components/checkout/Field";
import { PageHead, PageLayout } from "@/components/layout/PageLayout";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { Accordion } from "@/components/ui/Accordion";
import { FREE_SHIPPING_FROM } from "@/lib/shop";
import { useForm, type Rules } from "@/lib/useForm";
import { Meta } from "@/components/layout/Meta";

const rise = (i: number) => ({ "--i": i }) as CSSProperties;

const TOPICS = ["An order", "Sizing advice", "A return", "Press & partnerships", "Something else"];
const NEEDS_ORDER = ["An order", "A return"];
const MAX_MESSAGE = 600;

type Message = { name: string; email: string; topic: string; order: string; message: string };

const RULES: Rules<Message> = {
  name: (v) => (v.trim() ? null : "Tell us your name."),
  email: (v) => (!v.trim() ? "Enter your email." : /^\S+@\S+\.\S+$/.test(v.trim()) ? null : "That email doesn't look right."),
  order: (v, all) =>
    !NEEDS_ORDER.includes(all.topic) || /^JM-?\d{6}$/i.test(v.trim()) ? null : "Order numbers look like JM-123456.",
  message: (v) => (v.trim().length < 10 ? "A few more words, please (10 characters minimum)." : null),
};

const CHANNELS = [
  { Icon: Mail, label: "Email", value: "hello@jacketmasters.example", note: "Replies within a working day" },
  { Icon: Phone, label: "Phone", value: "+33 1 23 45 67 89", note: "Mon–Fri, 9:00–18:00 CET" },
  { Icon: MapPin, label: "Studio", value: "Paris 11e, France", note: "Fittings by appointment" },
];

const FAQ = [
  {
    id: "ship",
    title: "How long does delivery take?",
    content: <p>Standard delivery takes 2–3 working days across Europe and is free from ${FREE_SHIPPING_FROM}. Express arrives the next working day for $15.</p>,
  },
  {
    id: "returns",
    title: "Can I return a piece?",
    content: <p>Yes: within 30 days, unworn and with the tags on. The return label is free, and refunds land within 5 working days of the parcel reaching us.</p>,
  },
  {
    id: "size",
    title: "Which size should I take?",
    content: (
      <p>
        The cropped and long cuts are true to size; the hooded puffer is roomy by design. Between two sizes, go up to layer a hoodie
        underneath. Every product page has a size guide.
      </p>
    ),
  },
  {
    id: "care",
    title: "How do I wash a gloss puffer?",
    content: <p>Machine wash cold on a gentle cycle, then tumble dry low with two tennis balls to bring the down back to life. No iron, no dry-cleaning.</p>,
  },
  {
    id: "repair",
    title: "Do you repair jackets?",
    content: <p>Repairs are free for the first year and at cost afterwards. Write to us with a photo and we&apos;ll send a prepaid label.</p>,
  },
];

/* Contact on tangerine: the form and the direct channels side by side, the
   FAQ on ink below. The form only fakes sending. */
export default function ContactPage() {
  const form = useForm<Message>({ name: "", email: "", topic: TOPICS[0], order: "", message: "" }, RULES);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const needsOrder = NEEDS_ORDER.includes(form.values.topic);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const bad = form.validate();
    if (bad) return document.getElementById(`ct-${String(bad)}`)?.focus();
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 1200);
  };

  return (
    <PageLayout
      theme="orange"
      after={
        <section className="jm-section jm-section--tight jm-faq" aria-labelledby="jm-faq-title">
          <header className="jm-faq__head" data-reveal>
            <p className="jm-eyebrow">FAQ</p>
            <h2 className="jm-h2" id="jm-faq-title">
              Quick <em>answers.</em>
            </h2>
            <p className="jm-section__lead">The questions we hear most. Anything else, the form above reaches a real person.</p>
          </header>
          <div data-reveal style={rise(1)}>
            <Accordion items={FAQ} defaultOpen="ship" />
          </div>
        </section>
      }
    >
      <Meta title="Contact — Jacket Masters" description="Questions about sizing, orders or returns? Talk to the Jacket Masters team." />

      <PageHead
        eyebrow="Contact"
        title={
          <>
            Let&apos;s talk
            <br />
            warmth.
          </>
        }
        lead="Sizing doubts, an order on its way, a return to sort out: write to us and a real person answers within a day."
      />

      <div className="jm-contact">
        <div className="jm-contact__panel jm-rise" style={rise(3)}>
          {status === "sent" ? (
            <div className="jm-contact__sent" role="status">
              <span className="jm-contact__sent-icon">
                <Check size={28} strokeWidth={2} aria-hidden="true" />
              </span>
              <h2>Message sent.</h2>
              <p>
                Thanks, {form.values.name.trim().split(" ")[0]}. We&apos;ll reply to <strong>{form.values.email}</strong> within a
                working day.
              </p>
              <p className="jm-contact__demo">Design demo: nothing was actually sent.</p>
              <Link href="/products" className="jm-btn">
                Back to the collection <ArrowRight size={12} strokeWidth={1.5} />
              </Link>
            </div>
          ) : (
            <form className="jm-co-form" onSubmit={submit} noValidate aria-busy={status === "sending"}>
              <div className="jm-co-row">
                <TextField id="ct-name" label="Name" autoComplete="name" {...form.field("name")} />
                <TextField id="ct-email" label="Email" type="email" inputMode="email" autoComplete="email" {...form.field("email")} />
              </div>
              <div className="jm-co-row">
                <SelectField id="ct-topic" label="It's about" options={TOPICS} {...form.field("topic")} />
                {needsOrder && <TextField id="ct-order" label="Order number" placeholder="JM-123456" {...form.field("order")} />}
              </div>
              <div className="jm-field" data-invalid={Boolean(form.field("message").error)}>
                <label htmlFor="ct-message" className="jm-field__label">
                  Message
                </label>
                <textarea
                  id="ct-message"
                  className="jm-field__input jm-field__textarea"
                  rows={6}
                  maxLength={MAX_MESSAGE}
                  value={form.values.message}
                  onChange={(e) => form.field("message").onChange(e.target.value)}
                  onBlur={form.field("message").onBlur}
                  aria-invalid={Boolean(form.field("message").error)}
                  aria-describedby="ct-message-count ct-message-error"
                />
                <div className="jm-field__foot">
                  {form.field("message").error ? (
                    <p className="jm-field__error" id="ct-message-error">
                      {form.field("message").error}
                    </p>
                  ) : (
                    <span />
                  )}
                  <span className="jm-field__count" id="ct-message-count">
                    {form.values.message.length}/{MAX_MESSAGE}
                  </span>
                </div>
              </div>
              <button type="submit" className="jm-btn jm-co-submit jm-contact__send" disabled={status === "sending"}>
                {status === "sending" ? (
                  <>
                    <span className="jm-spinner" aria-hidden="true" /> Sending…
                  </>
                ) : (
                  <>
                    Send message <ArrowRight size={12} strokeWidth={1.5} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <aside className="jm-contact__aside" aria-label="Other ways to reach us">
          <ul className="jm-channels">
            {CHANNELS.map(({ Icon, label, value, note }, i) => (
              <li key={label} className="jm-channel jm-rise" style={rise(4 + i)}>
                <span className="jm-channel__icon">
                  <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span>
                  <small>{label}</small>
                  <strong>{value}</strong>
                  <span>{note}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="jm-channel jm-channel--row jm-rise" style={rise(7)}>
            <span className="jm-channel__icon">
              <Clock size={18} strokeWidth={1.5} aria-hidden="true" />
            </span>
            <span>
              <small>Follow the drops</small>
              <SocialLinks />
            </span>
          </div>
        </aside>
      </div>
    </PageLayout>
  );
}
