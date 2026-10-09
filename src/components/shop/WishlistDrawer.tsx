import { ArrowRight, Heart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { COLOURS, PRODUCTS, formatPrice } from "@/data/products";
import { useShop } from "@/lib/shop";
import { Drawer } from "./Drawer";

const byId = (id: number) => PRODUCTS.find((p) => p.id === id)!;

/* Saved pieces. "Move to bag" opens the size row inline (one-size pieces go
   straight in); picking a size moves the piece from the wishlist to the bag. */
export function WishlistDrawer() {
  const { wishlist, toggleWishlist, addToCart, panel, closePanel, openPanel } = useShop();
  const [picking, setPicking] = useState<number | null>(null);

  const move = (id: number, size: string) => {
    addToCart(id, size);
    toggleWishlist(id);
    setPicking(null);
  };

  return (
    <Drawer
      id="jm-wishlist"
      open={panel === "wishlist"}
      onClose={closePanel}
      title={
        <>
          Wishlist <span className="jm-drawer__count">{wishlist.length}</span>
        </>
      }
      footer={
        wishlist.length > 0 && (
          <button type="button" className="jm-btn jm-btn--ghost jm-btn--block" onClick={() => openPanel("bag")}>
            Go to bag <ArrowRight size={12} strokeWidth={1.5} />
          </button>
        )
      }
    >
      {wishlist.length === 0 ? (
        <div className="jm-drawer__empty">
          <span className="jm-drawer__empty-icon">
            <Heart size={28} strokeWidth={1.25} aria-hidden="true" />
          </span>
          <p className="jm-drawer__empty-title">Nothing saved yet.</p>
          <p>Tap the heart on any piece to keep it here for later.</p>
          <Link href="/products" className="jm-btn">
            Browse the collection <ArrowRight size={12} strokeWidth={1.5} />
          </Link>
        </div>
      ) : (
        <ul className="jm-lines">
          {wishlist.map((id) => {
            const p = byId(id);
            const oneSize = p.sizes.length === 1;
            return (
              <li key={id} className="jm-line">
                <Link href={`/products/${p.slug}`} className="jm-line__img" data-theme={p.theme} tabIndex={-1} aria-hidden="true">
                  <Image src={p.image} alt="" fill sizes="88px" />
                </Link>
                <div className="jm-line__info">
                  <div className="jm-line__top">
                    <Link href={`/products/${p.slug}`} className="jm-line__name">
                      {p.name}
                    </Link>
                    <span className="jm-line__price">{formatPrice(p.price)}</span>
                  </div>
                  <p className="jm-line__meta">
                    {COLOURS[p.theme].name} · {p.tagline}
                  </p>

                  {picking === id ? (
                    <div className="jm-line__sizes" role="group" aria-label={`Choose a size for ${p.name}`}>
                      {p.sizes.map((s) => (
                        <button key={s} type="button" disabled={p.soldOut?.includes(s)} onClick={() => move(id, s)}>
                          {s}
                        </button>
                      ))}
                      <button type="button" className="jm-line__cancel" aria-label="Cancel" onClick={() => setPicking(null)}>
                        <X size={12} strokeWidth={2} />
                      </button>
                    </div>
                  ) : (
                    <div className="jm-line__bottom">
                      <button
                        type="button"
                        className="jm-line__move"
                        onClick={() => (oneSize ? move(id, p.sizes[0]) : setPicking(id))}
                      >
                        Move to bag
                      </button>
                      <button type="button" className="jm-line__remove" aria-label={`Remove ${p.name} from wishlist`} onClick={() => toggleWishlist(id)}>
                        <Heart size={14} strokeWidth={1.5} fill="currentColor" aria-hidden="true" /> Remove
                      </button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Drawer>
  );
}
