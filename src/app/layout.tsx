import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { I18nProvider } from "@/lib/i18n";
import { AppShell } from "@/components/shell/AppShell";
import { PwaInstallPrompt } from "@/components/pwa/PwaInstallPrompt";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#091428",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: "CareerIS — India Career, Skill & Labour-Market Intelligence Platform",
  description:
    "A connected national ecosystem combining career discovery, verifiable skills, ITI curriculum intelligence, employer hiring, and closed-loop labour-market feedback.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CAREERIS",
  },
  keywords: [
    "CareerIS",
    "Skill Intelligence",
    "India Labour Market",
    "Curriculum Alignment",
    "ITI Training",
    "Vocational Skills",
    "Maharashtra Skill Pilot",
    "Smart India Hackathon",
    "Explainable Job Matching",
  ],
  authors: [{ name: "CareerIS National Architecture Team" }],
  openGraph: {
    title: "CareerIS — India Career, Skill & Labour-Market Intelligence Platform",
    description: "Everything connects through skills. A national intelligence platform.",
    url: "https://careeris.gov.in",
    siteName: "CareerIS",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CAREERIS" />
      </head>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        <AuthProvider>
          <I18nProvider>
            <AppShell>{children}</AppShell>
            <PwaInstallPrompt />
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
