import { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1C274C" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://alaastore.com"),
  title: {
    default: "AlaaStore - Fast E-commerce",
    template: "%s | AlaaStore",
  },
  description: "High-performance e-commerce store with the best deals",
  applicationName: "AlaaStore",
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },
  openGraph: {
    type: "website",
    siteName: "AlaaStore",
    title: "AlaaStore - Fast E-commerce",
    description: "High-performance e-commerce store with the best deals",
  },
  twitter: {
    card: "summary_large_image",
    title: "AlaaStore",
    description: "High-performance e-commerce store with the best deals",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
};

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}