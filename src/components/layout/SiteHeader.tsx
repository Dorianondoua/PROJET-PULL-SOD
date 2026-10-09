import { Heart, Menu, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useShop } from "@/lib/shop";
import { Logo } from "./Logo";
import { NAV, isCurrent } from "./nav";

const ICON = { size: 16, strokeWidth: 1.5 } as const;

export type SiteHeaderProps = {
  /** Tags each block with data-intro so the home hero's GSAP intro picks it up. */
  intro?: boolean;
};

/* Logo left, pill nav centred, icon rail right. Under 560px of card width the
   pill nav gives way to the burger, which opens <MobileMenu>. The bag and
   heart open their drawers (mounted in _app). */
export function SiteHeader({ intro = false }: SiteHeaderProps) {
  const { pathname } = useRouter();
  const { cartCount, wishlist, menuOpen, openMenu, panel, openPanel } = useShop();
  const introAttr = intro ? { "data-intro": "" } : {};

  return (
    <header className="jm-header">
      <Logo className="jm-header__logo" {...introAttr} />
      <nav className="jm-nav" aria-label="Main" {...introAttr}>
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="jm-nav__tab"
            aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="jm-actions jm-header__actions" {...introAttr}>
        <button
          type="button"
          className="jm-icon-btn"
          aria-label={`Bag, ${cartCount} items`}
          aria-haspopup="dialog"
          aria-expanded={panel === "bag"}
          aria-controls="jm-bag"
          onClick={() => openPanel("bag")}
        >
          <ShoppingCart {...ICON} />
          {cartCount > 0 && <span className="jm-badge">{cartCount}</span>}
        </button>
        <button
          type="button"
          className="jm-icon-btn"
          aria-label={`Wishlist, ${wishlist.length} items`}
          aria-haspopup="dialog"
          aria-expanded={panel === "wishlist"}
          aria-controls="jm-wishlist"
          onClick={() => openPanel("wishlist")}
        >
          <Heart {...ICON} fill={wishlist.length ? "currentColor" : "none"} />
          {wishlist.length > 0 && <span className="jm-badge">{wishlist.length}</span>}
        </button>
        <button
          type="button"
          className="jm-icon-btn jm-burger"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="jm-menu"
          onClick={openMenu}
        >
          <Menu {...ICON} />
        </button>
      </div>
    </header>
  );
}
