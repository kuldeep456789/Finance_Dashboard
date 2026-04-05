"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "@/context/RoleContext";
import { useNotification } from "@/context/NotificationContext";
import { useTheme } from "@/context/ThemeContext";
import { useLayout } from "@/context/LayoutContext";

const tabs = [
  { label: "Overview", href: "/" },
  { label: "Transactions", href: "/transactions" },
  { label: "Insights", href: "/insights" },
];

const actionButtonStyle: CSSProperties = {
  color: "var(--theme-on-surface-variant)",
  border: "1px solid color-mix(in srgb, var(--theme-outline-variant) 76%, transparent)",
  background: "color-mix(in srgb, var(--theme-surface-container-low) 94%, transparent)",
  boxShadow: "inset 0 1px 0 color-mix(in srgb, white 8%, transparent)",
};

const getTabStyle = (isActive: boolean): CSSProperties =>
  isActive
    ? {
        color: "var(--theme-primary)",
        background: "color-mix(in srgb, var(--theme-primary) 14%, transparent)",
        border: "1px solid color-mix(in srgb, var(--theme-primary) 26%, transparent)",
        boxShadow: "0 6px 14px color-mix(in srgb, var(--theme-primary) 15%, transparent)",
      }
    : {
        color: "var(--theme-on-surface-variant)",
        border: "1px solid transparent",
      };

export function TopHeader() {
  const pathname = usePathname();
  const { role, setRole } = useRole();
  const { showToast } = useNotification();
  const { theme, cycleTheme } = useTheme();
  const { isSidebarCollapsed } = useLayout();
  const desktopSidebarWidth = isSidebarCollapsed ? 80 : 256;

  const handleThemeToggle = () => {
    cycleTheme();
    showToast("Theme Updated", "Switched theme mode.", "info");
  };

  return (
    <header
      className="fixed top-3 sm:top-4 left-1/2 lg:left-[var(--header-desktop-left)] -translate-x-1/2 z-[60] flex justify-between items-center px-3 sm:px-4 lg:px-5 h-[58px] lg:h-[66px] rounded-2xl transition-all duration-300 w-[var(--header-mobile-width)] lg:w-[var(--header-desktop-width)]"
      style={{
        "--header-mobile-width": "min(1120px, calc(100vw - 0.75rem))",
        "--header-desktop-width": `min(1120px, calc(100vw - ${desktopSidebarWidth}px - 1.25rem))`,
        "--header-desktop-left": `calc(${desktopSidebarWidth}px + (100vw - ${desktopSidebarWidth}px) / 2)`,
        background: "color-mix(in srgb, var(--theme-surface-bright) 90%, transparent)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid color-mix(in srgb, var(--theme-outline-variant) 82%, transparent)",
        boxShadow:
          "0 10px 30px rgba(2, 8, 23, 0.18), inset 0 1px 0 color-mix(in srgb, white 9%, transparent)",
      } as CSSProperties}
    >
      <div className="flex min-w-0 items-center gap-2 lg:gap-5">
        <Link href="/" className="flex min-w-0 items-center gap-2.5" aria-label="Go to overview">
          <svg
            width="30"
            height="30"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform duration-200 hover:scale-105"
          >
            <path d="M4 16C9 8 18 8 26 12C20 18 12 18 4 16Z" fill="url(#gradient-logo-1)" />
            <path d="M28 16C23 24 14 24 6 20C12 14 20 14 28 16Z" fill="url(#gradient-logo-2)" />
            <defs>
              <linearGradient id="gradient-logo-1" x1="4" y1="8" x2="26" y2="18" gradientUnits="userSpaceOnUse">
                <stop stopColor="var(--theme-primary)" />
                <stop offset="1" stopColor="var(--theme-primary-container)" />
              </linearGradient>
              <linearGradient id="gradient-logo-2" x1="6" y1="14" x2="28" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="var(--theme-secondary)" />
                <stop offset="1" stopColor="var(--theme-on-surface-variant)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="hidden min-w-0 leading-tight sm:block">
            <p
              style={{
                margin: 0,
                fontSize: "0.62rem",
                letterSpacing: "0.16em",
                fontWeight: 700,
                color: "var(--theme-primary)",
              }}
            >
              AETHERIS
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "0.68rem",
                letterSpacing: "0.02em",
                color: "var(--theme-on-surface-variant)",
              }}
            >
              Finance Board
            </p>
          </div>
        </Link>

        <div
          className="hidden xl:flex items-center gap-1.5 rounded-full px-2.5 py-1"
          style={{
            border: "1px solid color-mix(in srgb, var(--theme-outline-variant) 78%, transparent)",
            background: "color-mix(in srgb, var(--theme-surface-container-low) 88%, transparent)",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "0.95rem", color: "var(--theme-tertiary)" }}>
            signal_cellular_alt
          </span>
          <span style={{ fontSize: "0.68rem", color: "var(--theme-on-surface-variant)", fontWeight: 600 }}>
            Markets stable
          </span>
        </div>

        <div
          className="hidden lg:flex items-center gap-1 p-1 rounded-xl"
          style={{
            background: "color-mix(in srgb, var(--theme-surface-container-low) 86%, transparent)",
            border: "1px solid color-mix(in srgb, var(--theme-outline-variant) 82%, transparent)",
          }}
        >
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="text-sm font-semibold tracking-[0.01em] transition-colors duration-200 px-3.5 py-1.5 rounded-lg"
                style={getTabStyle(isActive)}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div
          className="hidden lg:flex items-center relative rounded-xl p-1"
          style={{
            background: "color-mix(in srgb, var(--theme-surface-container-low) 88%, transparent)",
            border: "1px solid color-mix(in srgb, var(--theme-outline-variant) 82%, transparent)",
          }}
        >
          <div
            className="absolute h-8 rounded-lg transition-all duration-300"
            style={{
              width: 68,
              background: "color-mix(in srgb, var(--theme-surface-container-highest) 90%, transparent)",
              left: role === "admin" ? 4 : 74,
              boxShadow: "0 6px 12px rgba(2, 8, 23, 0.2)",
            }}
          />
          <button
            onClick={() => setRole("admin")}
            className="relative z-10 px-3 py-1 text-xs font-semibold transition-colors duration-200"
            style={{ color: role === "admin" ? "var(--theme-primary)" : "var(--theme-on-surface-variant)" }}
          >
            Admin
          </button>
          <button
            onClick={() => setRole("viewer")}
            className="relative z-10 px-3 py-1 text-xs font-semibold transition-colors duration-200"
            style={{ color: role === "viewer" ? "var(--theme-secondary)" : "var(--theme-on-surface-variant)" }}
          >
            Viewer
          </button>
        </div>

        <button
          onClick={handleThemeToggle}
          aria-label="Toggle theme"
          className="w-9 h-9 rounded-xl transition-colors flex items-center justify-center cursor-pointer hover:text-[var(--theme-primary)]"
          style={actionButtonStyle}
          title={`Current Theme: ${theme}`}
        >
          <span className="material-symbols-outlined">
            {theme === "light" ? "light_mode" : theme === "dark" ? "dark_mode" : "contrast"}
          </span>
        </button>

        <button
          onClick={() => showToast("No New Notifications", "You are all caught up.", "info")}
          aria-label="Show notifications"
          className="hidden sm:flex w-9 h-9 rounded-xl transition-colors relative items-center justify-center"
          style={actionButtonStyle}
        >
          <span className="material-symbols-outlined">notifications</span>
          <div
            style={{
              position: "absolute",
              top: 7,
              right: 7,
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "var(--theme-error)",
              border: "2px solid var(--theme-surface)",
            }}
          />
        </button>

        <Link href="/settings" aria-label="Open settings profile">
          <div
            className="w-9 h-9 rounded-xl overflow-hidden transition-all duration-200 hover:scale-[1.03]"
            style={{
              border: "1px solid color-mix(in srgb, var(--theme-primary) 30%, transparent)",
              background: "linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))",
              boxShadow: "0 6px 16px color-mix(in srgb, var(--theme-primary) 24%, transparent)",
              cursor: "pointer",
            }}
          >
            <div className="w-full h-full flex items-center justify-center text-xs font-bold" style={{ color: "var(--theme-on-primary)" }}>
              JS
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
}
