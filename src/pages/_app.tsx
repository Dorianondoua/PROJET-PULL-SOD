import type { AppProps } from "next/app";
import Head from "next/head";
import localFont from "next/font/local";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { SITE_URL } from "@/components/layout/Meta";
import { BagDrawer } from "@/components/shop/BagDrawer";
import { Toasts } from "@/components/shop/Toasts";
import { WishlistDrawer } from "@/components/shop/WishlistDrawer";
import { ShopProvider } from "@/lib/shop";
import { usePageTransitions } from "@/lib/usePageTransitions";
import "@/styles/globals.css";

/* Jacket Masters faces, shipped as local variable woff2 files (latin subset)
   rather than next/font/google, which Turbopack's dev server fails to resolve.
   jacket-masters.css reads these variables. */
const display = localFont({
  src: "../assets/fonts/Montserrat-Variable.woff2",
  weight: "100 900",
  variable: "--jm-montserrat",
  display: "swap",
});
const body = localFont({
  src: "../assets/fonts/DMSans-Variable.woff2",
  weight: "100 1000",
  variable: "--jm-dm-sans",
  display: "swap",
});
const serif = localFont({
  src: "../assets/fonts/CormorantGaramond-Variable.woff2",
  weight: "300 700",
  variable: "--jm-cormorant",
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  usePageTransitions();
  return (
    <ShopProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0f0f0f" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta property="og:site_name" content="Jacket Masters" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${SITE_URL}/og.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Jacket Masters: a glossy cropped puffer jacket on a dark gradient." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={`${SITE_URL}/og.jpg`} />
      </Head>
      <div className={`${display.variable} ${body.variable} ${serif.variable}`}>
        <a href="#main" className="jm-skip">
          Skip to content
        </a>
        <Component {...pageProps} />
        <MobileMenu />
        <BagDrawer />
        <WishlistDrawer />
        <Toasts />
      </div>
    </ShopProvider>
  );
}
