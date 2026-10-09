import type { CSSProperties, ReactNode } from "react";
import type { Flavor } from "@/data/products";
import { useReveal } from "@/lib/useReveal";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export type PageLayoutProps = {
  /** Colourway of the page's card; a product page takes its jacket's colour. */
  theme?: Flavor;
  children: ReactNode;
  /** Sections after the card, on ink (reviews, related products…). Scroll-revealed. */
  after?: ReactNode;
};

/* Every page except home: the same full-screen card as the hero, with the
   content flowing below the header, then optional ink sections, then the footer. */
export function PageLayout({ theme = "noir", children, after }: PageLayoutProps) {
  const revealRef = useReveal<HTMLDivElement>();
  return (
    <>
      <div className="jm-card" data-theme={theme}>
        <div className="jm-card__inner jm-page">
          <SiteHeader />
          <main className="jm-page__main" id="main">{children}</main>
        </div>
      </div>
      {after && (
        <div className="jm-home" data-theme="noir" ref={revealRef}>
          {after}
        </div>
      )}
      <SiteFooter />
    </>
  );
}

export type PageHeadProps = {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
};

/* Opening block of an inner page: eyebrow, big title, lead. Rises in on load. */
export function PageHead({ eyebrow, title, lead }: PageHeadProps) {
  return (
    <header className="jm-pagehead">
      <p className="jm-eyebrow jm-rise" style={{ "--i": 0 } as CSSProperties}>
        {eyebrow}
      </p>
      <h1 className="jm-pagehead__title jm-rise" style={{ "--i": 1 } as CSSProperties}>
        {title}
      </h1>
      {lead && (
        <p className="jm-pagehead__lead jm-rise" style={{ "--i": 2 } as CSSProperties}>
          {lead}
        </p>
      )}
    </header>
  );
}
