import { useRouter } from "next/router";
import { useEffect } from "react";

const pathOf = (url: string) => url.split(/[?#]/)[0];

/**
 * Cross-page transitions with the View Transitions API (Chrome, Edge, Safari 18+;
 * other browsers just navigate). A transition opens on routeChangeStart and the
 * new state is captured once Next has rendered the next page. Skipped for
 * shallow/query-only changes (catalogue filters animate themselves with Flip)
 * and for visitors who prefer reduced motion. The animations are in globals.css.
 */
export function usePageTransitions() {
  const { events } = useRouter();

  useEffect(() => {
    if (!("startViewTransition" in document)) return;
    let finish: (() => void) | null = null;
    let timer = 0;

    const done = () => {
      window.clearTimeout(timer);
      finish?.();
      finish = null;
    };
    const start = (url: string, { shallow }: { shallow: boolean }) => {
      if (shallow || pathOf(url) === window.location.pathname) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      done();
      document.startViewTransition(() => new Promise<void>((resolve) => (finish = resolve)));
      // Rendering is frozen until the promise settles: never hold it long.
      timer = window.setTimeout(done, 2500);
    };

    events.on("routeChangeStart", start);
    events.on("routeChangeComplete", done);
    events.on("routeChangeError", done);
    return () => {
      events.off("routeChangeStart", start);
      events.off("routeChangeComplete", done);
      events.off("routeChangeError", done);
      done();
    };
  }, [events]);
}
