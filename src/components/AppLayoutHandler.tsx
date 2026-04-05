"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";
import { MobileNav } from "./MobileNav";
import { useLayout } from "@/context/LayoutContext";

export function AppLayoutHandler({ children }: { children: React.ReactNode }) {
  const { isSidebarCollapsed } = useLayout();

  return (
    <>
      <TopHeader />
      <Sidebar />
      <main
        style={{
          transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          // Use CSS custom property so tailwind can override it via a class on mobile
          "--desktop-margin": isSidebarCollapsed ? "80px" : "256px",
        } as React.CSSProperties}
        className="relative z-10 pt-24 px-4 sm:px-6 lg:px-8 pb-32 sm:pb-28 lg:pb-12 transition-all duration-300 ml-0 lg:ml-[var(--desktop-margin)]"
      >
        {children}
      </main>
      <MobileNav />
    </>
  );
}
