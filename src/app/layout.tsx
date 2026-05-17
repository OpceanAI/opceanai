import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ScrollProgress from "@/components/ui/ScrollProgress";
import WaterRipple from "@/components/ui/WaterRipple";
import { ToastProvider } from "@/components/ui/Toast";
import SpotlightSearch from "@/components/ui/SpotlightSearch";
import Preloader from "@/components/preloader/Preloader";
import Scanlines from "@/components/effects/Scanlines";
import BackToTop from "@/components/ui/BackToTop";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "OpceanAI — Intelligent Systems That Feel Natural",
  description: "A technology organization focused on AI models, infrastructure, and systems. From bots on a Snapdragon 685 phone to an ecosystem of models, systems, and infrastructure.",
  keywords: ["OpceanAI", "AI", "machine learning", "YuuKi", "Doki", "Android", "Docker", "infrastructure", "research", "NHE", "Tsuki"],
  authors: [{ name: "awa-omg" }],
  creator: "awa-omg",
  publisher: "OpceanAI",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://opceanai.com",
    siteName: "OpceanAI",
    title: "OpceanAI — A growing system of ideas that learned how to become real",
    description: "From bots on a Snapdragon 685 phone to an ecosystem of AI models, systems, and infrastructure. Built through constraints, not resources.",
    images: [
      {
        url: "/favicon/logo.jpg",
        width: 1200,
        height: 630,
        alt: "OpceanAI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OpceanAI — A growing system of ideas",
    description: "From bots on a Snapdragon 685 phone to an ecosystem of AI models, systems, and infrastructure.",
    images: ["/favicon/logo.jpg"],
    creator: "@opceanai",
  },
  icons: {
    icon: "/favicon/logo.jpg",
    shortcut: "/favicon/logo.jpg",
    apple: "/favicon/logo.jpg",
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
      className={`${cormorant.variable} ${inter.variable} ${jetbrains.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "OpceanAI",
              url: "https://opceanai.com",
              description: "A technology organization focused on AI models, infrastructure, and systems.",
              foundingDate: "2023-04-23",
              founder: {
                "@type": "Person",
                name: "awa-omg",
              },
              sameAs: [
                "https://github.com/OpceanAI",
                "https://huggingface.co/OpceanAI",
              ],
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <a href="#main-content" className="skip-link">Skip to content</a>

        {/* SVG Refraction Filter for Liquid Glass */}
        <svg style={{ display: "none" }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="lg-dist" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.008 0.008"
                numOctaves="2"
                seed="92"
                result="noise"
              />
              <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
              <feDisplacementMap
                in="SourceGraphic"
                in2="blurred"
                scale="8"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>

        <Preloader />
        <Scanlines />
        <ToastProvider>
          <ScrollProgress />
          <WaterRipple />
          <SpotlightSearch />
          <main id="main-content">{children}</main>
          <BackToTop />
        </ToastProvider>
      </body>
    </html>
  );
}
