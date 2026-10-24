import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = "https://www.prestigeshuttle.online";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Prestige Shuttle | Online Shuttle Booking Across Kenya",
    template: "%s | Prestige Shuttle",
  },
  description:
    "Request shuttle journeys across Kenya with Prestige Shuttle. Enter your departure town, destination and travel date, then confirm route availability and fare with our team.",
  applicationName: "Prestige Shuttle",
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: siteUrl,
    siteName: "Prestige Shuttle",
    title: "Prestige Shuttle | Online Shuttle Booking Across Kenya",
    description:
      "Plan a journey across Kenya and send a shuttle booking request to Prestige Shuttle.",
  },
  twitter: {
    card: "summary",
    title: "Prestige Shuttle | Online Shuttle Booking Across Kenya",
    description:
      "Request a shuttle journey across Kenya and confirm route details with Prestige Shuttle.",
  },
  robots: { index: true, follow: true },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Prestige Shuttle" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#102c46",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Prestige Shuttle",
  url: siteUrl,
  email: "Pshuttleltd@gmail.com",
  telephone: "+254733672905",
  areaServed: { "@type": "Country", name: "Kenya" },
  description: "Shuttle journey enquiries and online booking requests for travel across Kenya.",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+254733672905",
    email: "Pshuttleltd@gmail.com",
    contactType: "booking enquiries",
    areaServed: "KE",
    availableLanguage: ["English", "Swahili"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-KE">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
