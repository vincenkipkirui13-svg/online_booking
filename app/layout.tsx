import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SafariLine | Book Your Bus Journey",
  description: "Find bus trips across Kenya, choose your seats and prepare your ticket in one simple booking experience.",
  applicationName: "SafariLine",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "SafariLine" }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0c3b32"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
