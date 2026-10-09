import { ArrowUpRight, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, type CSSProperties } from "react";
import { useShop } from "@/lib/shop";
import { Logo } from "./Logo";
import { NAV, isCurrent } from "./nav";
import { SocialLinks } from "./SocialLinks";

/* Full-screen menu for narrow screens. Mounted once in _app, outside every
   .jm-card, so position:fixed is never trapped by the card's containment.
   It opens as a circle growing out of the burger, then the links rise one by one. */
export function MobileMenu() {
  const { pathname } = useRouter();
  const { menuOpen, closeMenu } = useShop();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const opener = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMenu();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [menuOpen, closeMenu]);

  useEffect(closeMenu, [pathname, closeMenu]);

  return (
    <div
      id="jm-menu"
      className="jm-menu"
      data-theme="noir"
      data-open={menuOpen}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      inert={!menuOpen}
    >
      <div className="jm-menu__top">
        <Logo />
        <button ref={closeRef} type="button" className="jm-icon-btn" aria-label="Close menu" onClick={closeMenu}>
          <X size={16} strokeWidth={1.5} />
        </button>
      </div>

      <nav aria-label="Main">
        <ol className="jm-menu__list">
          {NAV.map((item, i) => (
            <li key={item.href} className="jm-menu__item" style={{ "--i": i } as CSSProperties}>
              <Link
                href={item.href}
                className="jm-menu__link"
                aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                onClick={closeMenu}
              >
                <span className="jm-menu__num">0{i + 1}</span>
                <span className="jm-menu__label">{item.label}</span>
                <ArrowUpRight className="jm-menu__arrow" size={20} strokeWidth={1.5} />
              </Link>
            </li>
          ))}
        </ol>
      </nav>

      <div className="jm-menu__item jm-menu__foot" style={{ "--i": NAV.length } as CSSProperties}>
        <p className="jm-menu__slogan">
          Confidence,
          <br />
          wrapped in warmth
        </p>
        <SocialLinks />
      </div>
    </div>
  );
}
