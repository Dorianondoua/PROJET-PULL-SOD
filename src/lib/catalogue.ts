import type { ParsedUrlQuery } from "querystring";
import { CATEGORIES, COLOURS, JACKET_SIZES, ONE_SIZE, PRODUCTS, formatPrice, type Category, type Flavor, type Product } from "@/data/products";

/* Catalogue filtering, sorting and the URL format that carries them
   (/products?category=Vests&colour=noir,rouge&size=38&min=90&max=200&sale=1&sort=price-asc). */

export const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "new", label: "Newest" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "rating", label: "Top rated" },
] as const;
export type SortId = (typeof SORTS)[number]["id"];

export const PRICE_MIN = Math.min(...PRODUCTS.map((p) => p.price));
export const PRICE_MAX = Math.max(...PRODUCTS.map((p) => p.price));
export const PRICE_STEP = 5;
export const ALL_SIZES = [...JACKET_SIZES, ...ONE_SIZE];
export const ALL_COLOURS = Object.keys(COLOURS) as Flavor[];

export type Filters = {
  category: Category | null;
  colours: Flavor[];
  sizes: string[];
  min: number;
  max: number;
  sale: boolean;
  sort: SortId;
};

export const DEFAULT_FILTERS: Filters = {
  category: null,
  colours: [],
  sizes: [],
  min: PRICE_MIN,
  max: PRICE_MAX,
  sale: false,
  sort: "featured",
};

const inStock = (p: Product, size: string) => p.sizes.includes(size) && !p.soldOut?.includes(size);

function matches(p: Product, f: Filters) {
  return (
    (!f.category || p.category === f.category) &&
    (f.colours.length === 0 || f.colours.includes(p.theme)) &&
    (f.sizes.length === 0 || f.sizes.some((s) => inStock(p, s))) &&
    p.price >= f.min &&
    p.price <= f.max &&
    (!f.sale || p.oldPrice !== undefined)
  );
}

function sortProducts(list: Product[], sort: SortId) {
  const out = [...list];
  switch (sort) {
    case "new":
      return out.sort((a, b) => Number(b.badge === "New") - Number(a.badge === "New") || b.id - a.id);
    case "price-asc":
      return out.sort((a, b) => a.price - b.price);
    case "price-desc":
      return out.sort((a, b) => b.price - a.price);
    case "rating":
      return out.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    default:
      return out;
  }
}

export const applyFilters = (f: Filters) => sortProducts(PRODUCTS.filter((p) => matches(p, f)), f.sort);

/** How many results an option would give: the option's own facet is replaced, the others stay. */
export const countWith = (f: Filters, patch: Partial<Filters>) => PRODUCTS.filter((p) => matches(p, { ...f, ...patch })).length;

/** Number of active filters, for the mobile "Filters (n)" button. Category and sort don't count: they're always visible. */
export const activeCount = (f: Filters) =>
  f.colours.length + f.sizes.length + Number(f.min !== PRICE_MIN || f.max !== PRICE_MAX) + Number(f.sale);

/** Removable chips for every active filter. */
export function activeChips(f: Filters): { key: string; label: string; patch: Partial<Filters> }[] {
  return [
    ...f.colours.map((c) => ({ key: `c-${c}`, label: COLOURS[c].name, patch: { colours: f.colours.filter((x) => x !== c) } })),
    ...f.sizes.map((s) => ({ key: `s-${s}`, label: s === "One size" ? s : `Size ${s}`, patch: { sizes: f.sizes.filter((x) => x !== s) } })),
    ...(f.min !== PRICE_MIN || f.max !== PRICE_MAX
      ? [{ key: "price", label: `${formatPrice(f.min)}–${formatPrice(f.max)}`, patch: { min: PRICE_MIN, max: PRICE_MAX } }]
      : []),
    ...(f.sale ? [{ key: "sale", label: "On sale", patch: { sale: false } }] : []),
  ];
}

/* ---------- URL <-> filters ---------- */

const clampPrice = (n: number, fallback: number) =>
  Number.isFinite(n) && n > 0 ? Math.min(PRICE_MAX, Math.max(PRICE_MIN, n)) : fallback;

export function filtersFromQuery(q: ParsedUrlQuery): Filters {
  const str = (k: string) => {
    const v = q[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const list = (k: string) => str(k)?.split(",").filter(Boolean) ?? [];
  const min = clampPrice(Number(str("min")), PRICE_MIN);
  const max = clampPrice(Number(str("max")), PRICE_MAX);
  return {
    category: CATEGORIES.find((c) => c === str("category")) ?? null,
    colours: list("colour").filter((c): c is Flavor => (ALL_COLOURS as string[]).includes(c)),
    sizes: list("size").filter((s) => ALL_SIZES.includes(s)),
    min: Math.min(min, max),
    max: Math.max(min, max),
    sale: str("sale") === "1",
    sort: SORTS.find((s) => s.id === str("sort"))?.id ?? "featured",
  };
}

/** Only what differs from the defaults, so a clean catalogue keeps a clean URL. */
export function filtersToQuery(f: Filters): Record<string, string> {
  const q: Record<string, string> = {};
  if (f.category) q.category = f.category;
  if (f.colours.length) q.colour = f.colours.join(",");
  if (f.sizes.length) q.size = f.sizes.join(",");
  if (f.min !== PRICE_MIN) q.min = String(f.min);
  if (f.max !== PRICE_MAX) q.max = String(f.max);
  if (f.sale) q.sale = "1";
  if (f.sort !== "featured") q.sort = f.sort;
  return q;
}
