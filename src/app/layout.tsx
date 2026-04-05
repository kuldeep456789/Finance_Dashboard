import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
// Components imported dynamically via AppLayoutHandler now.
import { RoleProvider } from "@/context/RoleContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { LayoutProvider } from "@/context/LayoutContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AppLayoutHandler } from "@/components/AppLayoutHandler";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Aetheris Finance — Premium Dashboard",
  description:
    "A high-end animated finance dashboard with real-time portfolio analytics, transaction management, and intelligent financial insights.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} dark antialiased`}
    >
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
        />
      </head>
      <body
        className="min-h-screen overflow-x-hidden"
        style={{
          background: "var(--theme-surface)",
          color: "var(--theme-on-surface)",
          fontFamily: "var(--font-body), Inter, sans-serif",
          transition: "background 0.3s, color 0.3s",
        }}
      >
        <ThemeProvider>
          <RoleProvider>
            <NotificationProvider>
              <LayoutProvider>
                <AppLayoutHandler>{children}</AppLayoutHandler>
              </LayoutProvider>
            </NotificationProvider>
          </RoleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
