"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const pathname = usePathname();

  return (
    <div className="top-bar">
      <div>
        <div className="top-bar-title-row">
          <Image
            src="/logo.png"
            alt="Aetheris Finance logo"
            width={24}
            height={24}
            className="top-bar-title-logo"
          />
          <h1 className="top-bar-title">{title}</h1>
        </div>
        {subtitle && (
          <p className="top-bar-subtitle">{subtitle}</p>
        )}
      </div>
      <div className="top-bar-links">
        <Link href="/" className={`top-bar-link ${pathname === "/" ? "active" : ""}`}>
          Dashboard
        </Link>
        <Link href="/insights" className={`top-bar-link ${pathname === "/insights" ? "active" : ""}`}>
          Reports
        </Link>
        <Link href="/settings" className={`top-bar-link ${pathname === "/settings" ? "active" : ""}`}>
          Account
        </Link>
      </div>
    </div>
  );
}
