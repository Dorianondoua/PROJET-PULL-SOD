import { Dribbble, Facebook, Instagram } from "lucide-react";
import type { ComponentProps } from "react";

const ICON = { size: 16, strokeWidth: 1.75 } as const;

const SOCIALS = [
  { label: "Instagram", icon: <Instagram {...ICON} /> },
  { label: "Facebook", icon: <Facebook {...ICON} /> },
  { label: "Dribbble", icon: <Dribbble {...ICON} /> },
  { label: "Behance", icon: "Bē" },
];

export function SocialLinks({ className = "", ...rest }: ComponentProps<"ul">) {
  return (
    <ul className={`jm-social ${className}`} aria-label="Social" {...rest}>
      {SOCIALS.map((s) => (
        <li key={s.label}>
          <a className="jm-social__link" href="#" aria-label={s.label}>
            {s.icon}
          </a>
        </li>
      ))}
    </ul>
  );
}
