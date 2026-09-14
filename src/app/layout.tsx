import type { Metadata } from "next";
import { Inter, Playfair_Display, Lato, Dancing_Script } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "700"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Matthew Journal — Bitácora de Crecimiento",
    template: `%s | Matthew Journal`,
  },
  description: "Una bitácora digital interactiva del crecimiento de Matthew, nacido el 31 de julio de 2026.",
  keywords: ["Matthew", "bitácora", "crecimiento", "bebé", "familia"],
  authors: [{ name: "Cristian Mosquera" }],
  creator: "Cristian Mosquera",
  publisher: "Matthew Journal",
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://matthew-journal.vercel.app",
    title: "Matthew Journal — Bitácora de Crecimiento",
    description: "Una bitácora digital interactiva del crecimiento de Matthew.",
    siteName: "Matthew Journal",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Matthew Journal — Bitácora de crecimiento",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Matthew Journal — Bitácora de Crecimiento",
    description: "Una bitácora digital interactiva del crecimiento de Matthew.",
    creator: "@cristianmosquera",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://matthew-journal.vercel.app",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#D4A59A",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#D4A59A" />
        <meta name="color-scheme" content="light" />
        <script
          dangerouslySetInnerHTML={{
          __html: `
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js');
              });
            }
          `,
        }} />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} ${lato.variable} ${dancingScript.variable} font-body antialiased bg-pearl-white text-taupe`}
      >
        {children}
      </body>
    </html>
  );
}
