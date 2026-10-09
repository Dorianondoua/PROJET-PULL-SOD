import Link from "next/link";
import type { ComponentProps } from "react";

type LogoProps = Omit<ComponentProps<typeof Link>, "href" | "children">;

export function Logo({ className = "", ...rest }: LogoProps) {
  return (
    <Link href="/" className={`jm-logo ${className}`} aria-label="Jacket Masters, home" {...rest}>
      <span className="jm-logo__mark">JM</span>
      <span className="jm-logo__name">Jacket Masters</span>
    </Link>
  );
}
