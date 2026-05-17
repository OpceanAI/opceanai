import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ScrollProgress from "@/components/ui/ScrollProgress";
import WaterRipple from "@/components/ui/WaterRipple";
import { ToastProvider } from "@/components/ui/Toast";
import SpotlightSearch from "@/components/ui/SpotlightSearch";
import Preloader from "@/components/preloader/Preloader";
import Scanlines from "@/components/effects/Scanlines";

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
        url: "/og-image.png",
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
    images: ["/og-image.png"],
    creator: "@opceanai",
  },
  icons: {
    icon: "/favicon.ico",
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
        <Preloader />
        <Scanlines />
        <ToastProvider>
          <ScrollProgress />
          <WaterRipple />
          <SpotlightSearch />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
