import type { StaticImageData } from "next/image";
import backBlackImg from "@/assets/IMAGES/back-black.webp";
import backOrangeImg from "@/assets/IMAGES/back-orange.webp";
import backRedImg from "@/assets/IMAGES/back-red.webp";
import backWhiteImg from "@/assets/IMAGES/back-white.webp";
import bagOrangeImg from "@/assets/IMAGES/bag-orange.webp";
import hoodBlackImg from "@/assets/IMAGES/hood-black.webp";
import hoodOrangeImg from "@/assets/IMAGES/hood-orange.webp";
import longBlackImg from "@/assets/IMAGES/long-black.webp";
import longSilverImg from "@/assets/IMAGES/long-silver.webp";
import pullBlancImg from "@/assets/IMAGES/pull_blanc.png";
import pullNoirImg from "@/assets/IMAGES/pull_noire.png";
import pullOrangeImg from "@/assets/IMAGES/pull_orange.png";
import pullRougeImg from "@/assets/IMAGES/pull_rouge.png";
import scarfRedImg from "@/assets/IMAGES/scarf-red.webp";
import vestBlackImg from "@/assets/IMAGES/vest-black.webp";
import vestRedImg from "@/assets/IMAGES/vest-red.webp";

/* Mock catalogue: everything the front end shows lives here, no back end. */

/** The four colourway themes shipped in styles/jacket-masters.css (data-theme). */
export type Flavor = "noir" | "gris" | "rouge" | "orange";

export type Colour = { name: string; hex: string };

/** Swatch name and colour for each theme. */
export const COLOURS: Record<Flavor, Colour> = {
  noir: { name: "Black", hex: "#141414" },
  gris: { name: "Silver", hex: "#c9cdd0" },
  rouge: { name: "Red", hex: "#c40000" },
  orange: { name: "Tangerine", hex: "#e2690c" },
};

export const CATEGORIES = ["Cropped puffers", "Long coats", "Hooded puffers", "Vests", "Accessories"] as const;
export type Category = (typeof CATEGORIES)[number];

export const JACKET_SIZES = ["34", "36", "38", "40", "42"];
export const ONE_SIZE = ["One size"];

export type Product = {
  id: number;
  /** URL segment of the product page: /products/[slug]. */
  slug: string;
  name: string;
  /** Products sharing a model are colourways of one another. */
  model: string;
  /** Short line under the name: cut and finish. */
  tagline: string;
  category: Category;
  /** Colourway, which is also the theme the page recolours to. */
  theme: Flavor;
  /** USD, whole dollars. */
  price: number;
  /** Crossed-out price shown next to the current one. */
  oldPrice?: number;
  badge?: "New" | "Bestseller" | "Last pieces";
  image: StaticImageData;
  /** Extra views after the main image (back view…). */
  gallery: StaticImageData[];
  description: string;
  details: string[];
  material: string;
  care: string[];
  sizes: string[];
  soldOut?: string[];
  rating: number;
  reviewCount: number;
};

const PUFFER_CARE = ["Machine wash cold, gentle cycle", "Tumble dry low with two tennis balls", "Do not iron or dry-clean"];
const GLOSS_SHELL = "Shell: 100% recycled nylon, high-gloss finish. Fill: 80% responsibly sourced down, 20% feather.";
const ACCESSORY_SHELL = "Shell: 100% recycled nylon, high-gloss finish. Fill: 100% recycled polyester.";

const CROPPED_DETAILS = [
  "Cropped at the waist, boxy through the body",
  "Funnel collar that zips up to the chin",
  "Two-way front zip and hidden welt pockets",
  "Elastic cuffs and hem lock the warmth in",
];
const LONG_DETAILS = [
  "Falls just below the knee",
  "Two-way zip so you can open it from the bottom",
  "Narrow baffles that keep the line slim",
  "Inner storm cuffs",
];
const HOODED_DETAILS = [
  "Relaxed, oversized fit: take your usual size",
  "Fixed hood with a deep, padded brim",
  "Hip length for full coverage",
  "Zipped hand pockets",
];
const VEST_DETAILS = ["Cropped, sleeveless cut", "High funnel collar", "Binding at the armholes", "Packs into its own pocket"];

export const PRODUCTS: Product[] = [
  /* ---- Cropped puffer: the hero jacket, same order as the reel: noir → gris → rouge → orange ---- */
  {
    id: 1,
    slug: "cropped-puffer-black",
    name: "Cropped Puffer Black",
    model: "Cropped Puffer",
    tagline: "Cropped · gloss nylon",
    category: "Cropped puffers",
    theme: "noir",
    price: 149,
    oldPrice: 199,
    badge: "Bestseller",
    image: pullNoirImg,
    gallery: [backBlackImg],
    description: "Deep black gloss that catches every light. The one that goes with everything.",
    details: CROPPED_DETAILS,
    material: GLOSS_SHELL,
    care: PUFFER_CARE,
    sizes: JACKET_SIZES,
    rating: 4.8,
    reviewCount: 312,
  },
  {
    id: 2,
    slug: "cropped-puffer-silver",
    name: "Cropped Puffer Silver",
    model: "Cropped Puffer",
    tagline: "Cropped · gloss nylon",
    category: "Cropped puffers",
    theme: "gris",
    price: 149,
    oldPrice: 199,
    image: pullBlancImg,
    gallery: [backWhiteImg],
    description: "Soft silver-white, bright without being loud. Winter, but clean.",
    details: CROPPED_DETAILS,
    material: GLOSS_SHELL,
    care: PUFFER_CARE,
    sizes: JACKET_SIZES,
    soldOut: ["34"],
    rating: 4.7,
    reviewCount: 188,
  },
  {
    id: 3,
    slug: "cropped-puffer-red",
    name: "Cropped Puffer Red",
    model: "Cropped Puffer",
    tagline: "Cropped · gloss nylon",
    category: "Cropped puffers",
    theme: "rouge",
    price: 149,
    oldPrice: 199,
    image: pullRougeImg,
    gallery: [backRedImg],
    description: "Cherry red lacquer, made to be seen from across the street.",
    details: CROPPED_DETAILS,
    material: GLOSS_SHELL,
    care: PUFFER_CARE,
    sizes: JACKET_SIZES,
    rating: 4.9,
    reviewCount: 241,
  },
  {
    id: 4,
    slug: "cropped-puffer-tangerine",
    name: "Cropped Puffer Tangerine",
    model: "Cropped Puffer",
    tagline: "Cropped · gloss nylon",
    category: "Cropped puffers",
    theme: "orange",
    price: 149,
    oldPrice: 199,
    image: pullOrangeImg,
    gallery: [backOrangeImg],
    description: "Warm tangerine shine for the days that need a little more fire.",
    details: CROPPED_DETAILS,
    material: GLOSS_SHELL,
    care: PUFFER_CARE,
    sizes: JACKET_SIZES,
    soldOut: ["42"],
    rating: 4.8,
    reviewCount: 157,
  },

  /* ---- Long coat ---- */
  {
    id: 5,
    slug: "long-puffer-coat-black",
    name: "Long Puffer Coat Black",
    model: "Long Puffer Coat",
    tagline: "Knee length · gloss nylon",
    category: "Long coats",
    theme: "noir",
    price: 239,
    badge: "New",
    image: longBlackImg,
    gallery: [],
    description: "The cropped puffer's big sister: the same gloss, all the way to the knee, for the coldest walks home.",
    details: LONG_DETAILS,
    material: GLOSS_SHELL,
    care: PUFFER_CARE,
    sizes: JACKET_SIZES,
    rating: 4.9,
    reviewCount: 64,
  },
  {
    id: 6,
    slug: "long-puffer-coat-silver",
    name: "Long Puffer Coat Silver",
    model: "Long Puffer Coat",
    tagline: "Knee length · gloss nylon",
    category: "Long coats",
    theme: "gris",
    price: 239,
    badge: "New",
    image: longSilverImg,
    gallery: [],
    description: "A long column of silver-white. Quiet colour, loud silhouette.",
    details: LONG_DETAILS,
    material: GLOSS_SHELL,
    care: PUFFER_CARE,
    sizes: JACKET_SIZES,
    soldOut: ["34", "36"],
    rating: 4.7,
    reviewCount: 39,
  },

  /* ---- Hooded puffer ---- */
  {
    id: 7,
    slug: "hooded-puffer-tangerine",
    name: "Hooded Puffer Tangerine",
    model: "Hooded Puffer",
    tagline: "Oversized · fixed hood",
    category: "Hooded puffers",
    theme: "orange",
    price: 189,
    badge: "New",
    image: hoodOrangeImg,
    gallery: [],
    description: "Oversized, hooded, impossible to miss. Built for the weekend and the first snow.",
    details: HOODED_DETAILS,
    material: GLOSS_SHELL,
    care: PUFFER_CARE,
    sizes: JACKET_SIZES,
    rating: 4.6,
    reviewCount: 52,
  },
  {
    id: 8,
    slug: "hooded-puffer-black",
    name: "Hooded Puffer Black",
    model: "Hooded Puffer",
    tagline: "Oversized · fixed hood",
    category: "Hooded puffers",
    theme: "noir",
    price: 189,
    image: hoodBlackImg,
    gallery: [],
    description: "All the volume of the hooded cut, in a black that keeps it low-key.",
    details: HOODED_DETAILS,
    material: GLOSS_SHELL,
    care: PUFFER_CARE,
    sizes: JACKET_SIZES,
    rating: 4.8,
    reviewCount: 97,
  },

  /* ---- Vest ---- */
  {
    id: 9,
    slug: "puffer-vest-black",
    name: "Puffer Vest Black",
    model: "Puffer Vest",
    tagline: "Sleeveless · gloss nylon",
    category: "Vests",
    theme: "noir",
    price: 119,
    image: vestBlackImg,
    gallery: [],
    description: "Core warmth without the sleeves. Layer it over a hoodie or under a long coat.",
    details: VEST_DETAILS,
    material: GLOSS_SHELL,
    care: PUFFER_CARE,
    sizes: JACKET_SIZES,
    rating: 4.7,
    reviewCount: 83,
  },
  {
    id: 10,
    slug: "puffer-vest-red",
    name: "Puffer Vest Red",
    model: "Puffer Vest",
    tagline: "Sleeveless · gloss nylon",
    category: "Vests",
    theme: "rouge",
    price: 99,
    oldPrice: 119,
    badge: "Last pieces",
    image: vestRedImg,
    gallery: [],
    description: "Deep cherry gloss on a sleeveless cut. A colour hit for grey days.",
    details: VEST_DETAILS,
    material: GLOSS_SHELL,
    care: PUFFER_CARE,
    sizes: JACKET_SIZES,
    soldOut: ["34", "40", "42"],
    rating: 4.6,
    reviewCount: 41,
  },

  /* ---- Accessories ---- */
  {
    id: 11,
    slug: "puffer-scarf-red",
    name: "Puffer Scarf Red",
    model: "Puffer Scarf",
    tagline: "Quilted · one size",
    category: "Accessories",
    theme: "rouge",
    price: 59,
    image: scarfRedImg,
    gallery: [],
    description: "A long quilted scarf in the jacket's gloss. Wrap it twice, or let it hang.",
    details: ["180 cm long, 18 cm wide", "Quilted channels filled with recycled insulation", "Matches every Red piece in the range"],
    material: ACCESSORY_SHELL,
    care: ["Hand wash cold", "Dry flat", "Do not iron"],
    sizes: ONE_SIZE,
    rating: 4.5,
    reviewCount: 28,
  },
  {
    id: 12,
    slug: "puffer-tote-tangerine",
    name: "Puffer Tote Tangerine",
    model: "Puffer Tote",
    tagline: "Quilted · everyday tote",
    category: "Accessories",
    theme: "orange",
    price: 79,
    badge: "New",
    image: bagOrangeImg,
    gallery: [],
    description: "The puffer, turned into a bag. Soft, light, and big enough for a laptop.",
    details: ["38 × 30 × 12 cm, fits a 14\" laptop", "Puffy top handles", "Zip closure and an inner pocket", "Weighs 420 g"],
    material: ACCESSORY_SHELL,
    care: ["Wipe clean with a damp cloth", "Do not machine wash"],
    sizes: ONE_SIZE,
    rating: 4.8,
    reviewCount: 46,
  },
];

export const formatPrice = (usd: number) => `$${usd}`;

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);

/** The other colours of the same model, this one included. */
export const getColourways = (product: Product) => PRODUCTS.filter((p) => p.model === product.model);

/** Same category first, then anything else; never the product's own model. */
export function getRelated(product: Product, count = 4) {
  const others = PRODUCTS.filter((p) => p.model !== product.model);
  const same = others.filter((p) => p.category === product.category);
  return [...same, ...others.filter((p) => p.category !== product.category)].slice(0, count);
}

/** Body measurements in cm, for the size guide. */
export const SIZE_GUIDE = {
  headers: ["Size", "Chest", "Waist", "Hips", "Sleeve"],
  rows: [
    ["34", "80–84", "62–66", "88–92", "59"],
    ["36", "84–88", "66–70", "92–96", "60"],
    ["38", "88–92", "70–74", "96–100", "61"],
    ["40", "92–96", "74–78", "100–104", "62"],
    ["42", "96–100", "78–82", "104–108", "63"],
  ],
};

/** The three sizes the home hero offers, as in the reference design. */
export const SIZES = [
  { id: "36", label: "36" },
  { id: "38", label: "38" },
  { id: "40", label: "40" },
];

export type ShowcaseFlavor = {
  id: number;
  key: Flavor;
  name: string;
  description: string;
  price: string;
  oldPrice: string;
  image: StaticImageData;
};

/** The home hero reel: the four cropped puffers. */
export const SHOWCASE_FLAVORS: ShowcaseFlavor[] = PRODUCTS.filter((p) => p.model === "Cropped Puffer").map((p) => ({
  id: p.id,
  key: p.theme,
  name: p.name,
  description: p.description,
  price: formatPrice(p.price),
  oldPrice: formatPrice(p.oldPrice ?? p.price),
  image: p.image,
}));
