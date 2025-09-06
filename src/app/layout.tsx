import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import ClientHeader from "@/components/ClientHeader";
import { RecapitulatifProvider } from "@/context/RecapitulatifContext";
import { CheckoutProvider } from "@/context/CheckoutContext";
import { SupabaseProvider } from "@/context/SupabaseProvider";
import SyncCookie from "@/components/SyncCookie";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Insight-X : L'analyse immersive du football",
  description:
    "Découvrez Insight-X, l'outil ultime pour vivre les matchs comme jamais auparavant. Analyses stratégiques, scénarios immersifs et statistiques détaillées pour chaque match.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // 👉 scroll-smooth pour ancres (#methode, #pricing, etc.)
    <html lang="fr" className="scroll-smooth">
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-C3HPY37296');
          `}
        </Script>

        {/* Open Graph */}
        <meta property="og:title" content="Insight-X : L'analyse immersive du football" />
        <meta
          property="og:description"
          content="Découvrez Insight-X, l'outil ultime pour vivre les matchs comme jamais auparavant. Analyses stratégiques, scénarios immersifs et statistiques détaillées pour chaque match."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.insight-x.fr/" />
        <meta property="og:image" content="https://www.insight-x.fr/logo-insight-x.png" />
        <meta property="og:site_name" content="Insight-X" />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}>
        <ClientHeader />
        <CheckoutProvider>
          <RecapitulatifProvider>
            <SupabaseProvider>
              <SyncCookie />
              {children}
            </SupabaseProvider>
          </RecapitulatifProvider>
        </CheckoutProvider>
        <Footer />
      </body>
    </html>
  );
}