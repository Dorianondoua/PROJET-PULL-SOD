import { Check, Heart, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PRODUCTS } from "@/data/products";
import { useShop, type Toast } from "@/lib/shop";

const LIFETIME = 4000;

/* Stack of confirmations, bottom-right (bottom-centre on phones). One polite
   live region announces them; each dismisses itself unless hovered or focused. */
export function Toasts() {
  const { toasts } = useShop();
  return (
    <div className="jm-toasts" data-theme="noir" role="status" aria-live="polite">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}

function ToastItem({ toast }: { toast: Toast }) {
  const { dismissToast, openPanel } = useShop();
  const [paused, setPaused] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const remaining = useRef(LIFETIME);
  const product = PRODUCTS.find((p) => p.id === toast.productId)!;
  const bag = toast.kind === "bag";

  // Count down only while not paused, keeping what's left across pauses.
  useEffect(() => {
    if (paused || leaving) return;
    const start = Date.now();
    const t = setTimeout(() => setLeaving(true), remaining.current);
    return () => {
      clearTimeout(t);
      remaining.current -= Date.now() - start;
    };
  }, [paused, leaving]);

  // Let the exit animation play before leaving the list.
  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(() => dismissToast(toast.id), 300);
    return () => clearTimeout(t);
  }, [leaving, dismissToast, toast.id]);

  return (
    <div
      className="jm-toast"
      data-leaving={leaving}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span className="jm-toast__img" data-theme={product.theme}>
        <Image src={product.image} alt="" fill sizes="52px" />
        <span className="jm-toast__badge" aria-hidden="true">
          {bag ? <Check size={10} strokeWidth={3} /> : <Heart size={10} strokeWidth={2.5} fill="currentColor" />}
        </span>
      </span>
      <span className="jm-toast__text">
        <strong>{bag ? "Added to bag" : "Saved to wishlist"}</strong>
        <span>
          {product.name}
          {bag && toast.size && toast.size !== "One size" ? ` · ${toast.size}` : ""}
        </span>
      </span>
      <button
        type="button"
        className="jm-toast__action"
        onClick={() => {
          openPanel(bag ? "bag" : "wishlist");
          setLeaving(true);
        }}
      >
        View
      </button>
      <button type="button" className="jm-toast__close" aria-label="Dismiss" onClick={() => setLeaving(true)}>
        <X size={12} strokeWidth={2} />
      </button>
    </div>
  );
}
