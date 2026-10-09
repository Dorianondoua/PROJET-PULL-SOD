import { Star } from "lucide-react";

/* Five stars, filled to the nearest whole; the number is spoken, not the icons. */
export function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  const full = Math.round(rating);
  return (
    <span className="jm-stars" role="img" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} strokeWidth={1.5} fill={n <= full ? "currentColor" : "none"} aria-hidden="true" />
      ))}
    </span>
  );
}
