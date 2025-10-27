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
  title: "Europe's Gate - AI chatbot",
  description: "Strategisch AI-adviseur voor Europe's Gate — een nieuw hoofdstuk in Europese infrastructuur, waar Londen en Amsterdam worden verbonden via een duurzame brug over de Noordzee, gebouwd op groene en circulaire principes.",
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
    locale: "nl_NL",
    url: "https://europes-gate.klarifai.nl",
    siteName: "Europe's Gate",
    title: "Europe's Gate - AI chatbot",
    description: "Strategisch AI-adviseur voor Europe's Gate — een nieuw hoofdstuk in Europese infrastructuur, waar Londen en Amsterdam worden verbonden via een duurzame brug over de Noordzee, gebouwd op groene en circulaire principes.",
    images: [
      {
        url: "https://opengraph.b-cdn.net/production/images/b52e59f8-6851-43b2-b4c8-ecba2bc7b304.png?token=maBnG04RGp4-BmMOPMZJs8UfKAaF1liEHsQbjCNsoRk&height=800&width=1200&expires=33297572610",
        width: 1200,
        height: 800,
        alt: "Europe's Gate - AI chatbot",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Europe's Gate - AI chatbot",
    description: "Strategisch AI-adviseur voor Europe's Gate — een nieuw hoofdstuk in Europese infrastructuur, waar Londen en Amsterdam worden verbonden via een duurzame brug over de Noordzee, gebouwd op groene en circulaire principes.",
    images: ["https://opengraph.b-cdn.net/production/images/b52e59f8-6851-43b2-b4c8-ecba2bc7b304.png?token=maBnG04RGp4-BmMOPMZJs8UfKAaF1liEHsQbjCNsoRk&height=800&width=1200&expires=33297572610"],
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
