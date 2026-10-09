import { Check } from "lucide-react";
import { COLOURS, formatPrice } from "@/data/products";
import {
  ALL_COLOURS,
  ALL_SIZES,
  DEFAULT_FILTERS,
  PRICE_MAX,
  PRICE_MIN,
  PRICE_STEP,
  activeCount,
  countWith,
  type Filters,
} from "@/lib/catalogue";

export type FilterPanelProps = {
  filters: Filters;
  /** `animate: false` for continuous inputs (the price slider), so the grid doesn't Flip on every pixel. */
  onChange: (patch: Partial<Filters>, animate?: boolean) => void;
};

const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
const pct = (v: number) => ((v - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

/* Colour, size, price and offers. Rendered in the desktop sidebar and in the
   mobile sheet. Counts show what each option would
   return given the other active filters. */
export function FilterPanel({ filters: f, onChange }: FilterPanelProps) {
  return (
    <div className="jm-filters">
      <fieldset className="jm-filters__group">
        <legend className="jm-filters__legend">Colour</legend>
        <ul className="jm-filters__colours">
          {ALL_COLOURS.map((c) => {
            const on = f.colours.includes(c);
            const n = countWith(f, { colours: [c] });
            return (
              <li key={c}>
                <button
                  type="button"
                  className="jm-filters__colour"
                  aria-pressed={on}
                  disabled={!on && n === 0}
                  onClick={() => onChange({ colours: toggle(f.colours, c) })}
                >
                  <span className="jm-filters__swatch" style={{ background: COLOURS[c].hex }}>
                    {on && <Check size={12} strokeWidth={2.5} aria-hidden="true" />}
                  </span>
                  <span className="jm-filters__label">{COLOURS[c].name}</span>
                  <span className="jm-filters__count">{n}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <fieldset className="jm-filters__group">
        <legend className="jm-filters__legend">Size</legend>
        <div className="jm-filters__sizes">
          {ALL_SIZES.map((s) => {
            const on = f.sizes.includes(s);
            const n = countWith(f, { sizes: [s] });
            return (
              <button
                key={s}
                type="button"
                className="jm-filters__size"
                aria-pressed={on}
                disabled={!on && n === 0}
                aria-label={`${s === "One size" ? s : `Size ${s}`}, ${n} pieces in stock`}
                onClick={() => onChange({ sizes: toggle(f.sizes, s) })}
              >
                {s}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="jm-filters__group">
        <legend className="jm-filters__legend">Price</legend>
        <div className="jm-range">
          <div className="jm-range__track" aria-hidden="true">
            <span className="jm-range__fill" style={{ left: `${pct(f.min)}%`, right: `${100 - pct(f.max)}%` }} />
          </div>
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={PRICE_STEP}
            value={f.min}
            aria-label="Minimum price"
            aria-valuetext={formatPrice(f.min)}
            onChange={(e) => onChange({ min: Math.min(Number(e.target.value), f.max - PRICE_STEP) }, false)}
          />
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={PRICE_STEP}
            value={f.max}
            aria-label="Maximum price"
            aria-valuetext={formatPrice(f.max)}
            onChange={(e) => onChange({ max: Math.max(Number(e.target.value), f.min + PRICE_STEP) }, false)}
          />
        </div>
        <p className="jm-range__values">
          <span>{formatPrice(f.min)}</span>
          <span>{formatPrice(f.max)}</span>
        </p>
      </fieldset>

      <fieldset className="jm-filters__group">
        <legend className="jm-filters__legend">Offers</legend>
        <button
          type="button"
          role="switch"
          aria-checked={f.sale}
          className="jm-switch"
          onClick={() => onChange({ sale: !f.sale })}
        >
          <span className="jm-switch__track" aria-hidden="true">
            <span className="jm-switch__thumb" />
          </span>
          On sale only
          <span className="jm-filters__count">{countWith(f, { sale: true })}</span>
        </button>
      </fieldset>

      {activeCount(f) > 0 && (
        <button
          type="button"
          className="jm-link jm-filters__reset"
          onClick={() =>
            onChange({ colours: [], sizes: [], min: DEFAULT_FILTERS.min, max: DEFAULT_FILTERS.max, sale: false })
          }
        >
          Reset filters
        </button>
      )}
    </div>
  );
}
