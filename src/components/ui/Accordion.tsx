import { Plus } from "lucide-react";
import { useId, useState, type ReactNode } from "react";

export type AccordionItem = { id: string; title: string; content: ReactNode };

/* One panel open at a time. The panel animates its height through
   grid-template-rows (0fr -> 1fr), so no measuring is needed. */
export function Accordion({ items, defaultOpen = null }: { items: AccordionItem[]; defaultOpen?: string | null }) {
  const [open, setOpen] = useState<string | null>(defaultOpen);
  const uid = useId();

  return (
    <div className="jm-acc">
      {items.map((it) => {
        const isOpen = open === it.id;
        const btn = `${uid}-${it.id}-btn`;
        const panel = `${uid}-${it.id}-panel`;
        return (
          <div key={it.id} className="jm-acc__item" data-open={isOpen}>
            <h3 className="jm-acc__heading">
              <button
                id={btn}
                type="button"
                className="jm-acc__btn"
                aria-expanded={isOpen}
                aria-controls={panel}
                onClick={() => setOpen(isOpen ? null : it.id)}
              >
                {it.title}
                <Plus className="jm-acc__icon" size={16} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </h3>
            <div id={panel} role="region" aria-labelledby={btn} className="jm-acc__panel" inert={!isOpen}>
              <div className="jm-acc__clip">
                <div className="jm-acc__content">{it.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
