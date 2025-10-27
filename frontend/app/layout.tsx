import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/contexts/language-context";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Europe's Gate - Intelligence Platform",
  description: "Strategic AI advisor for the €50-100B Europe's Gate megaproject: 360km North Sea bridge connecting London to Amsterdam/Rotterdam, integrated with green steel production (100M tons/year), hydrogen infrastructure (5-10 GW), and circular urban nodes.",
  keywords: [
    "Europe's Gate",
    "North Sea Bridge",
    "Green Steel",
    "Hydrogen Infrastructure",
    "Circular Economy",
    "Megaproject",
    "Infrastructure",
    "AI Advisor",
    "Strategic Intelligence"
  ],
  authors: [{ name: "Europe's Gate Team" }],
  creator: "Europe's Gate",
  publisher: "Europe's Gate",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    alternateLocale: ["nl_NL"],
    url: "https://europesgate.com",
    siteName: "Europe's Gate",
    title: "Europe's Gate - Intelligence Platform",
    description: "Strategic AI advisor for the €50-100B Europe's Gate megaproject: 360km North Sea bridge connecting London to Amsterdam/Rotterdam with green steel, hydrogen infrastructure, and circular urban innovation.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Europe's Gate - North Sea Bridge Megaproject",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Europe's Gate - Intelligence Platform",
    description: "Strategic AI advisor for the €50-100B megaproject: 360km North Sea bridge with green steel, hydrogen infrastructure, and circular economy innovation.",
    images: ["/og-image.png"],
    creator: "@EuropesGate",
    site: "@EuropesGate",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://europesgate.com",
    languages: {
      'en-GB': 'https://europesgate.com/en',
      'nl-NL': 'https://europesgate.com/nl',
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#4318FF" },
    { media: "(prefers-color-scheme: dark)", color: "#868CFF" },
  ],
  category: "Infrastructure",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${dmSans.variable} antialiased h-full bg-white font-sans`}
        style={{ fontFamily: 'var(--font-dm-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
      >
        <LanguageProvider>
          <div id="__next" className="h-full">
            {children}
          </div>
          <Toaster richColors position="bottom-right" />
        </LanguageProvider>
      </body>
    </html>
  );
}
