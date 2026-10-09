import { X } from "lucide-react";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";

export type FilterSheetProps = {
  open: boolean;
  onClose: () => void;
  resultCount: number;
  children: ReactNode;
};

const noop = () => () => {};

/* Bottom sheet holding the filters on narrow screens. Portalled to <body>:
   inside the page card, position:fixed would be trapped by its containment. */
export function FilterSheet({ open, onClose, resultCount, children }: FilterSheetProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  // Portals need document: false on the server and during hydration, true after.
  const mounted = useSyncExternalStore(noop, () => true, () => false);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [open, onClose]);

  if (!mounted) return null;
  return createPortal(
    <div className="jm-sheet" data-theme="noir" data-open={open} inert={!open}>
      <div className="jm-sheet__scrim" onClick={onClose} aria-hidden="true" />
      <div className="jm-sheet__panel" role="dialog" aria-modal="true" aria-labelledby="jm-sheet-title">
        <div className="jm-sheet__head">
          <h2 className="jm-sheet__title" id="jm-sheet-title">
            Filters
          </h2>
          <button ref={closeRef} type="button" className="jm-icon-btn" aria-label="Close filters" onClick={onClose}>
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>
        <div className="jm-sheet__body">{children}</div>
        <div className="jm-sheet__foot">
          <button type="button" className="jm-btn jm-btn--block" onClick={onClose}>
            Show {resultCount} {resultCount === 1 ? "piece" : "pieces"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
