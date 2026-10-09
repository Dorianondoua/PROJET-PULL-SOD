import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Logo } from "./Logo";
import { NAV } from "./nav";
import { SocialLinks } from "./SocialLinks";

const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  { heading: "Shop", links: NAV.map((n) => ({ label: n.label, href: n.href })) },
  {
    heading: "Help",
    links: [
      { label: "Shipping", href: "/contact" },
      { label: "Returns", href: "/contact" },
      { label: "Size guide", href: "/contact" },
      { label: "FAQ", href: "/contact" },
    ],
  },
  {
    heading: "Studio",
    links: [
      { label: "Our story", href: "/about" },
      { label: "Craft", href: "/about" },
      { label: "Journal", href: "/about" },
      { label: "Press", href: "/about" },
    ],
  },
];

/* Ink-black close to every page: newsletter, link columns, and the brand name
   set huge and hollow along the bottom edge. */
export function SiteFooter() {
  return (
    <footer className="jm-footer" data-theme="noir">
      <div className="jm-footer__top">
        <div className="jm-footer__pitch">
          <h2 className="jm-footer__title">
            New colours drop first
            <br />
            <em>in your inbox.</em>
          </h2>
          <form className="jm-newsletter" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="jm-newsletter-email" className="jm-sr-only">
              Email address
            </label>
            <input id="jm-newsletter-email" type="email" placeholder="Your email address" autoComplete="email" />
            <button type="submit" className="jm-btn">
              Join <ArrowRight size={12} strokeWidth={1.5} />
            </button>
          </form>
        </div>

        <div className="jm-footer__cols">
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="jm-footer__heading">{col.heading}</h3>
              <ul className="jm-footer__links">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="jm-footer__link">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="jm-footer__bar">
        <Logo />
        <p>© 2026 Jacket Masters. Confidence, wrapped in warmth.</p>
        <SocialLinks />
      </div>

      <p className="jm-footer__wordmark" aria-hidden="true">
        Jacket Masters
      </p>
    </footer>
  );
}
