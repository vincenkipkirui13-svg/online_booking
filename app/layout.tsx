import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prestige Shuttle | Daily Routes & Fares in Kenya",
  description: "Prestige Shuttle offers reliable daily shuttle routes and fares across Kenya. Send your booking request directly on WhatsApp.",
  applicationName: "Prestige Shuttle",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Prestige Shuttle" }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#102c46"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
