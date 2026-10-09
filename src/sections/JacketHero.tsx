import gsap from "gsap";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Image from "next/image";
import { createRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { SHOWCASE_FLAVORS, SIZES } from "@/data/products";
import { useShop } from "@/lib/shop";

const FLAVORS = SHOWCASE_FLAVORS;
const COUNT = FLAVORS.length;
/* Auto-advance until the visitor touches anything, like the reference reel. */
const AUTOPLAY_MS = 6000;
/* Initial state of the stacked jackets; GSAP owns visibility after mount. */
const HIDDEN = { opacity: 0, visibility: "hidden" } as const;

/**
 * Full-screen hero, one colourway at a time. Every jacket image is mounted
 * once and stacked; GSAP moves the outgoing one out and the incoming one in,
 * while the card's radial gradient blends through the @property transition in
 * jacket-masters.css (data-theme). Three separate layers per jacket, so the
 * animations never fight over one transform: GSAP swap (outer), mouse
 * parallax (tilt), CSS idle float (.jm-float).
 */
export function JacketHero() {
  const { addToCart, wishlist, toggleWishlist } = useShop();
  const rootRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const itemRefs = useMemo(() => FLAVORS.map(() => createRef<HTMLDivElement>()), []);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const priceRef = useRef<HTMLParagraphElement>(null);

  const [active, setActive] = useState(0);
  const [size, setSize] = useState(SIZES[0].id);

  const activeRef = useRef(0);
  const busyRef = useRef(false);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reducedRef = useRef(false);

  const flavor = FLAVORS[active];
  const next = FLAVORS[(active + 1) % COUNT];

  /* ---------- Intro: title lines rise, the rest follows, jacket lands ---------- */
  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    itemRefs.forEach((r, i) => r.current && gsap.set(r.current, { autoAlpha: i === 0 ? 1 : 0 }));
    if (reducedRef.current) return;

    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      // fromTo, not from: StrictMode runs this twice, and a from() started while
      // a CSS opacity transition is mid-way would read ~0 as its end value.
      const end = { clearProps: "transform,opacity,visibility" };
      tl.fromTo(".jm-hero__title .line > span", { yPercent: 115 }, { yPercent: 0, duration: 1.1, stagger: 0.12, ...end }, 0.15)
        .fromTo("[data-intro]", { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.07, ...end }, 0.1)
        .fromTo(".jm-stage__slot", { y: 80, scale: 0.9, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 1.3, ...end }, 0.3);
    }, root);
    return () => ctx.revert();
  }, [itemRefs]);

  /* ---------- Colourway swap ---------- */
  const goTo = useCallback(
    (target: number, dir: 1 | -1) => {
      const to = (target + COUNT) % COUNT;
      const from = activeRef.current;
      if (to === from || busyRef.current) return;
      activeRef.current = to;
      setActive(to);

      const out = itemRefs[from].current;
      const inc = itemRefs[to].current;
      if (!out || !inc) return;
      if (reducedRef.current) {
        gsap.set(out, { autoAlpha: 0 });
        gsap.set(inc, { autoAlpha: 1, x: 0, rotation: 0, scale: 1, filter: "blur(0px)" });
        return;
      }

      busyRef.current = true;
      const tl = gsap.timeline({ onComplete: () => void (busyRef.current = false) });
      tl.to(out, { xPercent: -45 * dir, rotation: -8 * dir, scale: 0.82, autoAlpha: 0, filter: "blur(6px)", duration: 0.6, ease: "power2.in" }, 0)
        .fromTo(
          inc,
          { xPercent: 45 * dir, rotation: 8 * dir, scale: 0.82, autoAlpha: 0, filter: "blur(6px)" },
          { xPercent: 0, rotation: 0, scale: 1, autoAlpha: 1, filter: "blur(0px)", duration: 0.9, ease: "power3.out" },
          0.35,
        );
      if (priceRef.current) {
        tl.fromTo(priceRef.current.children, { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.06, ease: "power2.out" }, 0.4);
      }
      if (thumbRef.current) {
        tl.fromTo(thumbRef.current, { y: 20, scale: 0.7, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.7, ease: "back.out(1.6)" }, 0.5);
      }
    },
    [itemRefs],
  );

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = null;
  }, []);

  const step = useCallback(
    (dir: 1 | -1) => {
      stopAutoplay();
      goTo(activeRef.current + dir, dir);
    },
    [goTo, stopAutoplay],
  );

  useEffect(() => {
    if (reducedRef.current) return;
    autoplayRef.current = setInterval(() => goTo(activeRef.current + 1, 1), AUTOPLAY_MS);
    return stopAutoplay;
  }, [goTo, stopAutoplay]);

  /* ---------- Keyboard and swipe ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest("input, textarea")) return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    let startX = 0;
    const root = rootRef.current;
    const onTouchStart = (e: TouchEvent) => void (startX = e.touches[0].clientX);
    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    root?.addEventListener("touchstart", onTouchStart, { passive: true });
    root?.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      root?.removeEventListener("touchstart", onTouchStart);
      root?.removeEventListener("touchend", onTouchEnd);
    };
  }, [step]);

  /* ---------- Mouse parallax on the jacket ---------- */
  useEffect(() => {
    const root = rootRef.current;
    const tilt = tiltRef.current;
    if (!root || !tilt || reducedRef.current || !window.matchMedia("(pointer: fine)").matches) return;
    gsap.set(tilt, { transformPerspective: 900 });
    const opts = { duration: 0.8, ease: "power3.out" };
    const rx = gsap.quickTo(tilt, "rotationY", opts);
    const ry = gsap.quickTo(tilt, "rotationX", opts);
    const tx = gsap.quickTo(tilt, "x", opts);
    const ty = gsap.quickTo(tilt, "y", opts);
    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      rx(x * 12);
      ry(-y * 8);
      tx(x * 24);
      ty(y * 14);
    };
    const onLeave = () => {
      rx(0);
      ry(0);
      tx(0);
      ty(0);
    };
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    return () => {
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="jm-card" data-theme={flavor.key} ref={rootRef} onPointerDown={stopAutoplay}>
      <div className="jm-card__inner">
        <SiteHeader intro />

        <section className="jm-hero">
          <div className="jm-hero__copy">
            <div className="jm-arrows" data-intro>
              <button type="button" className="jm-arrow" aria-label="Previous colour" onClick={() => step(-1)}>
                <ChevronLeft size={14} strokeWidth={1.5} />
              </button>
              <button type="button" className="jm-arrow" aria-label="Next colour" onClick={() => step(1)}>
                <ChevronRight size={14} strokeWidth={1.5} />
              </button>
            </div>
            <h1 className="jm-hero__title">
              <span className="line">
                <span>Stand out</span>
              </span>
              <span className="line">
                <span>Without trying</span>
              </span>
            </h1>
            <p className="jm-hero__text" data-intro>
              It&apos;s not just about staying warm. It&apos;s about stepping outside and instantly feeling confident,
              comfortable, and completely yourself. Designed to elevate even the simplest outfit, this jacket wraps you in
              lightweight warmth.
            </p>
            <div className="jm-hero__ctas" data-intro>
              <button type="button" className="jm-btn" onClick={() => addToCart(flavor.id, size)}>
                Get the look <ChevronRight size={12} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                className="jm-icon-btn"
                aria-label={wishlist.includes(flavor.id) ? `Remove ${flavor.name} from wishlist` : `Save ${flavor.name} to wishlist`}
                aria-pressed={wishlist.includes(flavor.id)}
                onClick={() => toggleWishlist(flavor.id)}
              >
                <Heart size={16} strokeWidth={1.5} fill={wishlist.includes(flavor.id) ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          <SocialLinks className="jm-hero__social" data-intro />

          <div className="jm-stage jm-hero__stage">
            <div className="jm-stage__figure">
              <div className="jm-stage__slot">
                <div ref={tiltRef} style={{ position: "absolute", inset: 0 }}>
                  <div className="jm-float">
                    {FLAVORS.map((f, i) => (
                      <div
                        key={f.id}
                        ref={itemRefs[i]}
                        className="jm-stage__item"
                        aria-hidden={i !== active}
                        style={i === 0 ? undefined : HIDDEN}
                      >
                        <Image src={f.image} alt={f.name} priority={i === 0} fill sizes="(max-width: 900px) 90vw, 640px" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="jm-stage__shadow" />
              </div>
            </div>
            <p className="jm-slogan" data-intro>
              Confidence,
              <br />
              wrapped in warmth
            </p>
          </div>

          <div className="jm-hero__buy">
            <p className="jm-price" ref={priceRef} data-intro>
              <span className="jm-price__now">
                <span className="jm-sr-only">Now </span>
                {flavor.price}
              </span>
              <s className="jm-price__old">
                <span className="jm-sr-only">was </span>
                {flavor.oldPrice}
              </s>
            </p>
            <div className="jm-size" role="radiogroup" aria-labelledby="jm-size-label" data-intro>
              <span className="jm-size__label" id="jm-size-label">
                Choose your size:
              </span>
              <div className="jm-size__row">
                {SIZES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    role="radio"
                    aria-checked={size === s.id}
                    className="jm-size__opt"
                    onClick={() => setSize(s.id)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="jm-thumb jm-hero__thumb"
            data-intro
            aria-label={`See the ${next.name}`}
            onClick={() => step(1)}
          >
            <span className="jm-thumb__img" ref={thumbRef}>
              <Image src={next.image} alt="" fill sizes="92px" />
            </span>
          </button>
        </section>
      </div>
      <p className="jm-sr-only" aria-live="polite">
        {flavor.name}
      </p>
    </div>
  );
}
