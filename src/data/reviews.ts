/* Mock customer reviews, for the home testimonials and the product pages. */
export type Review = {
  id: number;
  productId: number;
  author: string;
  city: string;
  rating: number;
  title: string;
  text: string;
  /** ISO date. */
  date: string;
  size: string;
};

export const REVIEWS: Review[] = [
  { id: 1, productId: 1, author: "Inès M.", city: "Paris", rating: 5, title: "I get stopped in the street", text: "The gloss looks even better in person. Warm enough for January without the sleeping-bag look.", date: "2026-01-14", size: "36" },
  { id: 2, productId: 3, author: "Chloé R.", city: "Lyon", rating: 5, title: "That red", text: "Bought it for the colour, kept it for how light it is. The cropped length works with high-waisted everything.", date: "2026-02-02", size: "38" },
  { id: 3, productId: 5, author: "Amara D.", city: "Brussels", rating: 5, title: "Finally a long one that isn't shapeless", text: "The narrow baffles make a real difference. The bottom zip means I can actually cycle in it.", date: "2026-01-28", size: "38" },
  { id: 4, productId: 2, author: "Léa B.", city: "Bordeaux", rating: 4, title: "Beautiful, runs a little big", text: "Lovely silver tone that goes with everything. I sized down and it's perfect.", date: "2025-12-19", size: "34" },
  { id: 5, productId: 7, author: "Sofia K.", city: "Geneva", rating: 5, title: "Weekend uniform", text: "The hood is huge in the best way. Orange is brighter than the photos, which I love.", date: "2026-02-11", size: "40" },
  { id: 6, productId: 12, author: "Nadia L.", city: "Marseille", rating: 5, title: "Everyone asks about the bag", text: "My laptop, a book and lunch fit inside, and it weighs nothing. Wipes clean too.", date: "2026-02-20", size: "One size" },
  { id: 7, productId: 9, author: "Camille T.", city: "Lille", rating: 4, title: "Great layering piece", text: "Wear it over a hoodie most days. Packs into its pocket for travel.", date: "2026-01-06", size: "36" },
  { id: 8, productId: 4, author: "Yasmine A.", city: "Nantes", rating: 5, title: "Happy colour", text: "The tangerine is a mood booster on grey mornings. Elastic cuffs keep the wind out.", date: "2026-01-31", size: "38" },
];

export const reviewsFor = (productId: number) => REVIEWS.filter((r) => r.productId === productId);
