"use client";

import { useSyncExternalStore, type CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "@/context/RoleContext";
import { useNotification } from "@/context/NotificationContext";
import { useLayout } from "@/context/LayoutContext";

const mainNav = [
  { icon: "dashboard", label: "Overview", href: "/" },
  { icon: "payments", label: "Transactions", href: "/transactions" },
  { icon: "insights", label: "Insights", href: "/insights" },
  { icon: "settings", label: "Settings", href: "/settings" },
];

const PROFILE_STORAGE_KEY = "aetheris-profile-settings";
const PROFILE_UPDATED_EVENT = "aetheris-profile-updated";
const DEFAULT_USER_NAME = "Julian Sterling";
const DEFAULT_USER_SNAPSHOT = JSON.stringify({ fullName: DEFAULT_USER_NAME });

const parseEnrolledUserName = (snapshot: string) => {
  try {
    const parsed = JSON.parse(snapshot) as { fullName?: unknown };
    if (typeof parsed.fullName === "string" && parsed.fullName.trim().length > 0) {
      return parsed.fullName.trim();
    }
  } catch {
    // Keep fallback user name when parsing fails.
  }

  return DEFAULT_USER_NAME;
};

const getEnrolledUserSnapshot = () => {
  if (typeof window === "undefined") return DEFAULT_USER_SNAPSHOT;

  try {
    return window.localStorage.getItem(PROFILE_STORAGE_KEY) ?? DEFAULT_USER_SNAPSHOT;
  } catch {
    return DEFAULT_USER_SNAPSHOT;
  }
};

const getEnrolledUserServerSnapshot = () => DEFAULT_USER_SNAPSHOT;

const subscribeEnrolledUser = (onStoreChange: () => void) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key && event.key !== PROFILE_STORAGE_KEY) return;
    onStoreChange();
  };

  const handleProfileUpdated = () => {
    onStoreChange();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdated);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdated);
  };
};

const getNavItemStyle = (isActive: boolean): CSSProperties =>
  isActive
    ? {
        color: "var(--theme-primary)",
        background: "color-mix(in srgb, var(--theme-primary) 11%, transparent)",
        border: "1px solid color-mix(in srgb, var(--theme-primary) 26%, transparent)",
        boxShadow: "0 8px 18px color-mix(in srgb, var(--theme-primary) 14%, transparent)",
        fontWeight: 700,
      }
    : {
        color: "var(--theme-on-surface-variant)",
        border: "1px solid transparent",
      };

export function Sidebar() {
  const pathname = usePathname();
  const { role } = useRole();
  const { showToast } = useNotification();
  const { isSidebarCollapsed, toggleSidebar, openCredentialPanel } = useLayout();
  const enrolledUserSnapshot = useSyncExternalStore(
    subscribeEnrolledUser,
    getEnrolledUserSnapshot,
    getEnrolledUserServerSnapshot
  );
  const enrolledUserName = parseEnrolledUserName(enrolledUserSnapshot);

  const handleOpenCredentialPanel = () => {
    openCredentialPanel();
    showToast("Credential Manager", "Secure credential form opened.", "info");
  };

  const sidebarWidth = isSidebarCollapsed ? "88px" : "272px";

  return (
    <aside
      className="fixed left-0 top-0 h-full hidden lg:flex flex-col py-6 px-4 transition-all duration-300 z-40"
      style={{
        background: "color-mix(in srgb, var(--theme-surface-container-low) 90%, transparent)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRight: "1px solid color-mix(in srgb, var(--theme-outline-variant) 82%, transparent)",
        boxShadow:
          "10px 0 30px rgba(2, 8, 23, 0.18), inset -1px 0 0 color-mix(in srgb, white 6%, transparent)",
        paddingTop: "6.15rem",
        width: sidebarWidth,
      }}
    >
      <div className={`flex items-center ${isSidebarCollapsed ? "justify-center mb-5" : "px-1 gap-2 mb-4"}`}>
        {!isSidebarCollapsed && (
          <div className="mr-auto min-w-0">
            <p
              style={{
                fontSize: "0.62rem",
                letterSpacing: "0.14em",
                fontWeight: 700,
                color: "var(--theme-primary)",
                margin: 0,
              }}
            >
              COMMAND CENTER
            </p>
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--theme-on-surface-variant)",
                margin: 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {enrolledUserName} • {role === "admin" ? "Admin Enrolled" : "Viewer Enrolled"}
            </p>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{
            background: "color-mix(in srgb, var(--theme-surface-container-low) 92%, transparent)",
            border: "1px solid color-mix(in srgb, var(--theme-outline-variant) 76%, transparent)",
            color: "var(--theme-on-surface-variant)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px",
            borderRadius: "12px",
            transition: "background 0.2s, color 0.2s",
          }}
          className="hover:bg-[var(--theme-surface-container-highest)] hover:text-[var(--theme-primary)]"
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "1.4rem" }}>
            {isSidebarCollapsed ? "right_panel_open" : "left_panel_close"}
          </span>
        </button>
      </div>

      {!isSidebarCollapsed && (
        <div
          className="mb-5 rounded-xl px-3 py-2.5"
          style={{
            border: "1px solid color-mix(in srgb, var(--theme-outline-variant) 82%, transparent)",
            background: "color-mix(in srgb, var(--theme-surface-container-low) 82%, transparent)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.68rem",
              color: "var(--theme-on-surface-variant)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontWeight: 700,
            }}
          >
            Today focus
          </p>
          <p
            style={{
              margin: "0.35rem 0 0",
              fontSize: "0.85rem",
              color: "var(--theme-on-surface)",
              fontWeight: 600,
            }}
          >
            $4,280 budget available
          </p>
        </div>
      )}

      <nav className="flex-1 space-y-1.5">
        {mainNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center transition-all duration-200 ${
                isSidebarCollapsed ? "px-0 justify-center w-12 h-12 mx-auto rounded-xl" : "px-2.5 py-2.5 gap-3 rounded-xl"
              }`}
              style={getNavItemStyle(isActive)}
              title={isSidebarCollapsed ? item.label : undefined}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isActive
                    ? "color-mix(in srgb, var(--theme-primary) 18%, transparent)"
                    : "color-mix(in srgb, var(--theme-surface-container-high) 74%, transparent)",
                  transition: "background 0.2s ease",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>
                  {item.icon}
                </span>
              </div>
              {!isSidebarCollapsed && (
                <span style={{ fontSize: "0.9rem", letterSpacing: "0.01em" }}>{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className={isSidebarCollapsed ? "px-1 mt-3" : "px-1 mt-3"}>
        <button
          onClick={handleOpenCredentialPanel}
          className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center transition-all duration-200 active:scale-95 hover:-translate-y-0.5 ${
            !isSidebarCollapsed ? "gap-2" : ""
          }`}
          style={{
            background: "linear-gradient(135deg, var(--theme-primary), var(--theme-primary-container))",
            color: "var(--theme-on-primary)",
            border: "1px solid color-mix(in srgb, var(--theme-primary) 30%, transparent)",
            boxShadow: "0 10px 20px color-mix(in srgb, var(--theme-primary) 22%, transparent)",
          }}
          title={isSidebarCollapsed ? "Add Credential" : undefined}
        >
          <span className="material-symbols-outlined">add</span>
          {!isSidebarCollapsed && "Add Credential"}
        </button>
      </div>

      {!isSidebarCollapsed && (
        <div
          className="mt-4 rounded-xl px-3 py-2.5"
          style={{
            border: "1px solid color-mix(in srgb, var(--theme-outline-variant) 80%, transparent)",
            background: "color-mix(in srgb, var(--theme-surface-container-low) 82%, transparent)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.68rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--theme-on-surface-variant)",
              fontWeight: 700,
            }}
          >
            Current Role
          </p>
          <div
            style={{
              marginTop: "0.35rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              color: role === "admin" ? "var(--theme-primary)" : "var(--theme-secondary)",
              fontSize: "0.82rem",
              fontWeight: 700,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
              shield
            </span>
            <span>{role === "admin" ? "Admin Mode" : "Viewer Mode"}</span>
          </div>
        </div>
      )}
    </aside>
  );
}
