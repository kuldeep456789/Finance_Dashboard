"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
const items = [
  { icon: "dashboard", label: "Home", href: "/" },
  { icon: "payments", label: "Txns", href: "/transactions" },
  { icon: "insights", label: "Insights", href: "/insights" },
  { icon: "settings", label: "Settings", href: "/settings" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="mobile-nav lg:hidden"
    >
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`mobile-nav-item ${isActive ? "mobile-nav-item-active" : ""}`}
          >
            <span className="material-symbols-outlined mobile-nav-item-icon">{item.icon}</span>
            <span className="text-[10px]">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
