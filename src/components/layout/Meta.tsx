import Head from "next/head";
import type { ReactNode } from "react";

/* Set NEXT_PUBLIC_SITE_URL at deploy time so share previews get absolute URLs. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");

/* Per-page <title>, description and their Open Graph / Twitter twins.
   Site-wide tags (favicon, og:image, theme colour) live in _app. */
export function Meta({ title, description, children }: { title: string; description?: string; children?: ReactNode }) {
  return (
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta name="twitter:title" content={title} />
      {description && (
        <>
          <meta name="description" content={description} />
          <meta property="og:description" content={description} />
          <meta name="twitter:description" content={description} />
        </>
      )}
      {children}
    </Head>
  );
}
