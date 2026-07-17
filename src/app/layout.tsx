import type { Metadata } from "next";
import localFont from "next/font/local";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import ScrollProgress from "@/components/ui/ScrollProgress";
import { ToastProvider } from "@/components/ui/Toast";
import SpotlightSearch from "@/components/ui/SpotlightSearch";
import BackToTop from "@/components/ui/BackToTop";

const sentient = localFont({
  src: [
    { path: "../../public/fonts/sentient/Sentient-Variable.woff2", style: "normal" },
    { path: "../../public/fonts/sentient/Sentient-VariableItalic.woff2", style: "italic" },
  ],
  variable: "--font-display",
  display: "swap",
});

const switzer = localFont({
  src: [
    { path: "../../public/fonts/switzer/Switzer-Variable.woff2", style: "normal" },
    { path: "../../public/fonts/switzer/Switzer-VariableItalic.woff2", style: "italic" },
  ],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OpceanAI — Intelligent systems, built like instruments",
  description: "OpceanAI builds AI models, container infrastructure, and evaluation research — engineered under real constraints.",
  keywords: ["OpceanAI", "AI", "machine learning", "YuuKi", "Doki", "Android", "Docker", "infrastructure", "research", "NHE", "Tsuki"],
  authors: [{ name: "OpceanAI" }],
  creator: "OpceanAI",
  publisher: "OpceanAI",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://opceanai.com",
    siteName: "OpceanAI",
    title: "OpceanAI — Intelligent Systems That Feel Natural",
    description: "AI models, infrastructure, and systems — container runtimes, a growing model catalog, and open research.",
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
    title: "OpceanAI — Intelligent Systems That Feel Natural",
    description: "AI models, infrastructure, and systems — container runtimes, a growing model catalog, and open research.",
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
      className={`${sentient.variable} ${switzer.variable} ${GeistMono.variable} dark`}
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

        <ToastProvider>
          <ScrollProgress />
          <SpotlightSearch />
          <main id="main-content">{children}</main>
          <BackToTop />
        </ToastProvider>
      </body>
    </html>
  );
}
