import type { Metadata, Viewport } from "next";
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
  metadataBase: new URL('https://europes-gate.klarifai.nl'),
  title: "Europe's Gate - Intelligence Platform",
  description: "Strategic AI advisor for the €50-100B Europe's Gate megaproject: 360km North Sea bridge connecting London to Amsterdam/Rotterdam with green steel, hydrogen infrastructure, and circular urban innovation.",
  keywords: "Europe's Gate, North Sea Bridge, Green Steel, Hydrogen Infrastructure, Circular Economy, Megaproject, Infrastructure, AI Advisor",
  authors: [{ name: "Europe's Gate Team" }],
  creator: "Europe's Gate",
  publisher: "Europe's Gate",
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://europes-gate.klarifai.nl",
    siteName: "Europe's Gate",
    title: "Europe's Gate - Intelligence Platform",
    description: "Strategic AI advisor for the €50-100B Europe's Gate megaproject: 360km North Sea bridge connecting London to Amsterdam/Rotterdam with green steel, hydrogen infrastructure, and circular urban innovation.",
    images: [
      {
        url: "https://europes-gate.klarifai.nl/og-image.png",
        width: 1200,
        height: 630,
        alt: "Europe's Gate - North Sea Bridge Megaproject",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Europe's Gate - Intelligence Platform",
    description: "Strategic AI advisor for the €50-100B megaproject: 360km North Sea bridge with green steel, hydrogen infrastructure, and circular economy innovation.",
    images: ["https://europes-gate.klarifai.nl/og-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#4318FF" },
    { media: "(prefers-color-scheme: dark)", color: "#868CFF" },
  ],
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
