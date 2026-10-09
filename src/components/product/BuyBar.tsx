import Image from "next/image";
import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";
import { createPortal } from "react-dom";
import { formatPrice, type Product } from "@/data/products";

const noop = () => () => {};

export type BuyBarProps = {
  product: Product;
  /** The page's own add-to-bag block: the bar shows once it has scrolled above the viewport. */
  watch: RefObject<HTMLElement | null>;
  label: string;
  onAdd: () => void;
};

/* Mobile-only sticky purchase bar (hidden over 860px in CSS). Portalled to
   <body> so position:fixed isn't trapped inside the page card. */
export function BuyBar({ product, watch, label, onAdd }: BuyBarProps) {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const [show, setShow] = useState(false);

  // A scroll listener rather than an IntersectionObserver: a jump straight
  // from below to above the block (anchor link, Home key) never "intersects",
  // so an observer would leave the bar in its old state.
  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const el = watch.current;
      setShow(Boolean(el && el.getBoundingClientRect().bottom < 0));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [watch]);

  if (!mounted) return null;
  return createPortal(
    <div className="jm-buybar" data-theme={product.theme} data-show={show} inert={!show}>
      <span className="jm-buybar__thumb">
        <Image src={product.image} alt="" fill sizes="48px" />
      </span>
      <span className="jm-buybar__text">
        <strong>{product.name}</strong>
        <span>{formatPrice(product.price)}</span>
      </span>
      <button type="button" className="jm-btn" onClick={onAdd}>
        {label}
      </button>
    </div>,
    document.body,
  );
}
