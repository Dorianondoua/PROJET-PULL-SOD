/* The four entries of the main navigation, shared by the header pill nav,
   the mobile menu and the footer. */
export const NAV = [
  { href: "/", label: "Puffer jacket" },
  { href: "/products", label: "All products" },
  { href: "/about", label: "About us" },
  { href: "/contact", label: "Contact" },
] as const;

/** "/" only matches the home page; every other entry also covers its sub-pages. */
export function isCurrent(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
