import { X } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useRef, type ReactNode } from "react";

export type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  /** Used for the dialog's id and its title's id. */
  id: string;
  children: ReactNode;
  footer?: ReactNode;
};

/* Right-hand side panel over a dimmed page. Mounted in _app, outside every
   page card, so position:fixed is never trapped. Escape, the scrim and any
   navigation close it; focus moves in on open and back out on close. */
export function Drawer({ open, onClose, title, id, children, footer }: DrawerProps) {
  const { asPath } = useRouter();
  const closeRef = useRef<HTMLButtonElement>(null);

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

  useEffect(onClose, [asPath, onClose]);

  return (
    <div className="jm-drawer" data-theme="noir" data-open={open} inert={!open}>
      <div className="jm-drawer__scrim" onClick={onClose} aria-hidden="true" />
      <div className="jm-drawer__panel" id={id} role="dialog" aria-modal="true" aria-labelledby={`${id}-title`}>
        <div className="jm-drawer__head">
          <h2 className="jm-drawer__title" id={`${id}-title`}>
            {title}
          </h2>
          <button ref={closeRef} type="button" className="jm-icon-btn" aria-label="Close" onClick={onClose}>
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>
        <div className="jm-drawer__body">{children}</div>
        {footer && <div className="jm-drawer__foot">{footer}</div>}
      </div>
    </div>
  );
}
