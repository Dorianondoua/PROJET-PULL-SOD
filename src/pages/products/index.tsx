import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { FilterPanel } from "@/components/catalogue/FilterPanel";
import { FilterSheet } from "@/components/catalogue/FilterSheet";
import { Meta } from "@/components/layout/Meta";
import { PageHead, PageLayout } from "@/components/layout/PageLayout";
import { ProductCard } from "@/components/product/ProductCard";
import { CATEGORIES } from "@/data/products";
import {
  DEFAULT_FILTERS,
  SORTS,
  activeChips,
  activeCount,
  applyFilters,
  countWith,
  filtersFromQuery,
  filtersToQuery,
  type Filters,
  type SortId,
} from "@/lib/catalogue";

if (typeof window !== "undefined") gsap.registerPlugin(Flip);

/* Catalogue: category tabs on top, filters in a sticky sidebar (a bottom
   sheet on mobile), the grid on the right. Every filter lives in the URL, so
   links from the home page (?category=…, ?colour=…) land pre-filtered and a
   filtered view can be shared. When the results change, the cards that stay
   glide to their new place (GSAP Flip) and the new ones fade in. */
export default function ProductsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sheetOpen, setSheetOpen] = useState(false);
  const results = useMemo(() => applyFilters(filters), [filters]);

  const gridRef = useRef<HTMLUListElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const fromUrl = useRef(false);

  /* ---------- URL -> state, once the static page knows its query ---------- */
  useEffect(() => {
    if (!router.isReady || fromUrl.current) return;
    fromUrl.current = true;
    setFilters(filtersFromQuery(router.query));
  }, [router.isReady, router.query]);

  /* ---------- state -> URL ---------- */
  useEffect(() => {
    if (!fromUrl.current) return;
    const query = filtersToQuery(filters);
    if (new URLSearchParams(query).toString() === window.location.search.slice(1)) return;
    router.replace({ pathname: "/products", query }, undefined, { shallow: true, scroll: false });
  }, [filters, router]);

  const update = useCallback((patch: Partial<Filters>, animate = true) => {
    const grid = gridRef.current;
    if (animate && grid && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      flipState.current = Flip.getState(grid.querySelectorAll("[data-flip-id]"));
    }
    setFilters((f) => ({ ...f, ...patch }));
  }, []);

  /* ---------- Flip: animate from the captured layout to the new one ---------- */
  useLayoutEffect(() => {
    const state = flipState.current;
    const grid = gridRef.current;
    if (!state || !grid) return;
    flipState.current = null;
    const tween = Flip.from(state, {
      targets: grid.querySelectorAll("[data-flip-id]"),
      duration: 0.6,
      ease: "power3.inOut",
      onEnter: (els) =>
        gsap.fromTo(els, { opacity: 0, y: 24, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, delay: 0.2, stagger: 0.04 }),
    });
    return () => void tween.kill();
  }, [results]);

  const chips = activeChips(filters);
  const nActive = activeCount(filters);
  const closeSheet = useCallback(() => setSheetOpen(false), []);
  const resetAll = () => update({ ...DEFAULT_FILTERS, sort: filters.sort });

  return (
    <PageLayout>
      <Meta
        title="All products — Jacket Masters"
        description="The full Jacket Masters collection: cropped, long and hooded gloss puffers, vests and accessories in four colours."
      />
      <PageHead
        eyebrow="The collection"
        title="All products"
        lead="Cropped, long, hooded or sleeveless: every piece in the same high-gloss nylon, in four colours. Pick the one that sounds like you."
      />

      <div className="jm-cat__tabs jm-rise" role="group" aria-label="Category" style={{ "--i": 3 } as CSSProperties}>
        {[null, ...CATEGORIES].map((c) => (
          <button
            key={c ?? "all"}
            type="button"
            className="jm-cat__tab"
            aria-pressed={filters.category === c}
            onClick={() => update({ category: c })}
          >
            {c ?? "All"}
            <span className="jm-cat__tab-count">{countWith(filters, { category: c })}</span>
          </button>
        ))}
      </div>

      <div className="jm-cat jm-rise" style={{ "--i": 4 } as CSSProperties}>
        <aside className="jm-cat__side" aria-label="Filters">
          <FilterPanel filters={filters} onChange={update} />
        </aside>

        <div className="jm-cat__main">
          <div className="jm-cat__bar">
            <button
              type="button"
              className="jm-cat__filters-btn"
              aria-haspopup="dialog"
              aria-expanded={sheetOpen}
              onClick={() => setSheetOpen(true)}
            >
              <SlidersHorizontal size={14} strokeWidth={1.5} aria-hidden="true" />
              Filters
              {nActive > 0 && <span className="jm-cat__filters-n">{nActive}</span>}
            </button>
            <p className="jm-cat__count" aria-live="polite">
              <strong>{results.length}</strong> {results.length === 1 ? "piece" : "pieces"}
            </p>
            <label className="jm-select">
              <span className="jm-select__label">Sort</span>
              <select value={filters.sort} onChange={(e) => update({ sort: e.target.value as SortId })}>
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} strokeWidth={1.5} aria-hidden="true" />
            </label>
          </div>

          {chips.length > 0 && (
            <ul className="jm-cat__chips" aria-label="Active filters">
              {chips.map((c) => (
                <li key={c.key}>
                  <button type="button" className="jm-cat__chip" onClick={() => update(c.patch)} aria-label={`Remove filter: ${c.label}`}>
                    {c.label}
                    <X size={12} strokeWidth={2} aria-hidden="true" />
                  </button>
                </li>
              ))}
              <li>
                <button type="button" className="jm-link" onClick={resetAll}>
                  Clear all
                </button>
              </li>
            </ul>
          )}

          <ul className="jm-cat__grid" ref={gridRef}>
            {results.map((p, i) => (
              <li key={p.id} data-flip-id={p.id}>
                <ProductCard product={p} priority={i < 3} />
              </li>
            ))}
          </ul>

          {results.length === 0 && (
            <div className="jm-cat__empty">
              <p className="jm-cat__empty-title">Nothing matches, yet.</p>
              <p>Try another size or widen the price range. New colours land every season.</p>
              <button type="button" className="jm-btn" onClick={resetAll}>
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      <FilterSheet open={sheetOpen} onClose={closeSheet} resultCount={results.length}>
        <FilterPanel filters={filters} onChange={update} />
      </FilterSheet>
    </PageLayout>
  );
}
