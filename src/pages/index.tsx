import { SiteFooter } from "@/components/layout/SiteFooter";
import { useReveal } from "@/lib/useReveal";
import { JacketHero } from "@/sections/JacketHero";
import { ColourStory } from "@/sections/home/ColourStory";
import { CtaBand } from "@/sections/home/CtaBand";
import { Features } from "@/sections/home/Features";
import { Marquee } from "@/sections/home/Marquee";
import { Reviews } from "@/sections/home/Reviews";
import { ShopByCut } from "@/sections/home/ShopByCut";
import { Meta } from "@/components/layout/Meta";

/* The full-screen hero, then the story sections on ink, then the footer. */
export default function Home() {
  const revealRef = useReveal<HTMLDivElement>();

  return (
    <>
      <Meta
        title="Jacket Masters — Puffer Jacket"
        description="Stand out without trying. Glossy cropped puffer jackets in four colours. Confidence, wrapped in warmth."
      />
      <main id="main">
        <JacketHero />
        <Marquee />
        <div className="jm-home" data-theme="noir" ref={revealRef}>
          <Features />
          <ShopByCut />
          <ColourStory />
          <Reviews />
          <CtaBand />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
