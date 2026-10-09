import Image from "next/image";
import type { CSSProperties } from "react";
import { PageHead, PageLayout } from "@/components/layout/PageLayout";
import { PRODUCTS } from "@/data/products";
import { CtaBand } from "@/sections/home/CtaBand";
import { Meta } from "@/components/layout/Meta";

const img = (id: number) => PRODUCTS.find((p) => p.id === id)!.image;
const rise = (i: number) => ({ "--i": i }) as CSSProperties;

const STATS = [
  { value: "2021", label: "First sketch, Paris" },
  { value: "41", label: "Samples before the first sale" },
  { value: "100%", label: "Recycled nylon shell" },
  { value: "48 h", label: "From our studio to your door" },
];

const TIMELINE = [
  { year: "2021", title: "A sketch on a napkin", text: "Léa Moreau, a pattern cutter tired of shapeless puffers, draws one that stops at the waist." },
  { year: "2022", title: "Forty-one samples", text: "A year chasing the right gloss: bright enough to catch light, tough enough for rain." },
  { year: "2023", title: "Black, first", text: "The Cropped Puffer launches in one colour. The first run sells out in nine days." },
  { year: "2024", title: "Red & tangerine", text: "Two loud colourways join the black and the silver. The reel on our home page is born." },
  { year: "2026", title: "Long, hooded, sleeveless", text: "The range grows to twelve pieces, every one in the same recycled gloss." },
];

const VALUES = [
  { title: "One gloss, done right", text: "We don't chase trends. Every piece shares one shell, one fill and one obsession with the finish." },
  { title: "Made to last ten winters", text: "Bar-tacked seams, YKK zips and a two-year warranty. Repairs are free for the first year." },
  { title: "Recycled by default", text: "The shell is spun from recycled nylon and the down is certified responsible. No exceptions." },
];

/* Story page on red: an opening with the jackets, key figures, then the
   timeline, values and founder's quote on ink, and the shared call to action. */
export default function AboutPage() {
  return (
    <PageLayout
      theme="rouge"
      after={
        <>
          <section className="jm-section" aria-labelledby="jm-timeline-title">
            <header className="jm-section__head" data-reveal>
              <div>
                <p className="jm-eyebrow">Since 2021</p>
                <h2 className="jm-h2" id="jm-timeline-title">
                  Five winters, <em>one jacket.</em>
                </h2>
              </div>
            </header>
            <ol className="jm-timeline">
              {TIMELINE.map((t, i) => (
                <li key={t.year} className="jm-timeline__item" data-reveal style={rise(i)}>
                  <span className="jm-timeline__dot" aria-hidden="true" />
                  <span className="jm-timeline__year">{t.year}</span>
                  <h3 className="jm-timeline__title">{t.title}</h3>
                  <p className="jm-timeline__text">{t.text}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="jm-section" aria-labelledby="jm-values-title">
            <header className="jm-section__head" data-reveal>
              <div>
                <p className="jm-eyebrow">What we stand for</p>
                <h2 className="jm-h2" id="jm-values-title">
                  Fewer things, <em>made better.</em>
                </h2>
              </div>
            </header>
            <ol className="jm-values">
              {VALUES.map((v, i) => (
                <li key={v.title} className="jm-values__row" data-reveal style={rise(i)}>
                  <span className="jm-values__num">0{i + 1}</span>
                  <h3 className="jm-values__title">{v.title}</h3>
                  <p className="jm-values__text">{v.text}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="jm-section" aria-label="Founder's word">
            <figure className="jm-quote" data-reveal>
              <blockquote>
                <p>
                  “I&apos;d rather make one jacket you keep for ten winters than ten you forget by spring.”
                </p>
              </blockquote>
              <figcaption>
                <span className="jm-quote__avatar" aria-hidden="true">
                  LM
                </span>
                <span>
                  <strong>Léa Moreau</strong>
                  Founder &amp; pattern cutter
                </span>
              </figcaption>
            </figure>
          </section>

          <CtaBand secondary={{ href: "/contact", label: "Talk to us" }} />
        </>
      }
    >
      <Meta
        title="About us — Jacket Masters"
        description="Jacket Masters makes one cropped puffer, in four colours, and makes it properly. Our story since 2021."
      />

      <div className="jm-about">
        <PageHead
          eyebrow="Our story"
          title={
            <>
              Made for the cold.
              <br />
              Cut for the street.
            </>
          }
          lead="We started with one question: why does a warm jacket have to look like a sleeping bag? Three winters of patterns later, the answer is a cropped puffer that keeps the heat in and the shape sharp."
        />
        <div className="jm-about__art jm-rise" style={rise(2)} aria-hidden="true">
          <span className="jm-about__jacket jm-about__jacket--back">
            <Image src={img(1)} alt="" fill sizes="30vw" />
          </span>
          <span className="jm-about__jacket jm-about__jacket--front">
            <Image src={img(3)} alt="" fill priority sizes="40vw" />
          </span>
          <span className="jm-about__jacket jm-about__jacket--side">
            <Image src={img(4)} alt="" fill sizes="20vw" />
          </span>
        </div>
      </div>

      <ul className="jm-stats">
        {STATS.map((s, i) => (
          <li key={s.label} className="jm-rise" style={rise(i + 3)}>
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </li>
        ))}
      </ul>
    </PageLayout>
  );
}
