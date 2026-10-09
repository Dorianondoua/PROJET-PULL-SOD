import { useEffect, useRef } from "react";

/**
 * Scroll reveal: every [data-reveal] inside the returned ref gets
 * data-revealed once it enters the viewport. The CSS (home.css) does the
 * motion, staggered by each element's --i, and skips it for reduced motion.
 * Elements added later (e.g. a product page swapping to another colourway
 * while the layout stays mounted) are picked up too.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const show = (el: Element) => ((el as HTMLElement).dataset.revealed = "");
    const pending = (scope: ParentNode) => scope.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])");

    if (!("IntersectionObserver" in window)) {
      pending(root).forEach(show);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          show(e.target);
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    pending(root).forEach((el) => io.observe(el));
    const mo = new MutationObserver(() => pending(root).forEach((el) => io.observe(el)));
    mo.observe(root, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return ref;
}
