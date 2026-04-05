"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  icon: string;
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { icon: "dashboard", label: "Home", href: "/" },
  { icon: "payments", label: "Txns", href: "/transactions" },
  { icon: "insights", label: "Insights", href: "/insights" },
  { icon: "settings", label: "Settings", href: "/settings" },
];

const getItemClassName = (isActive: boolean) =>
  `mobile-nav-item${isActive ? " mobile-nav-item-active" : ""}`;

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="mobile-nav lg:hidden" aria-label="Mobile navigation">
      <div className="mobile-nav-shell">
        {navItems.map(({ href, icon, label }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={getItemClassName(isActive)}
            >
              <span className="mobile-nav-item-icon-wrap">
                <span className="material-symbols-outlined mobile-nav-item-icon">{icon}</span>
              </span>
              <span className="mobile-nav-item-label">{label}</span>
              <span className="mobile-nav-item-indicator" aria-hidden />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
