const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin("./src/app/i18n/request.ts");

const remotePatterns = [
  {
    protocol: "https",
    hostname: "lapip.net",
    port: "",
    pathname: "/uploads/**",
  },
  {
    protocol: "https",
    hostname: "*.ngrok-free.dev",
    port: "",
    pathname: "/uploads/**",
  },
  {
    protocol: "http",
    hostname: "localhost",
    port: "5000",
    pathname: "/uploads/**",
  },
  {
    protocol: "http",
    hostname: "127.0.0.1",
    port: "5000",
    pathname: "/uploads/**",
  },
  {
    protocol: "https",
    hostname: "kxbvftijipkulngbfdfv.supabase.co",
    port: "",
    pathname: "/storage/v1/object/public/**",
  },
  {
    protocol: "https",
    hostname: "uniksbqzhdxlarwcyrkj.supabase.co",
    port: "",
    pathname: "/storage/v1/object/public/**",
  },
  {
    protocol: "https",
    hostname: "**.supabase.co",
    port: "",
    pathname: "/storage/v1/object/public/**",
  },
  {
    protocol: "https",
    hostname: "images.unsplash.com",
    port: "",
    pathname: "/**",
  },
  {
    protocol: "https",
    hostname: "via.placeholder.com",
    port: "",
    pathname: "/**",
  },
];

try {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
  if (apiBase) {
    const u = new URL(apiBase);
    const protocol = u.protocol === "https:" ? "https" : "http";
    const port = u.port || "";
    const dup = remotePatterns.some(
      (p) =>
        p.hostname === u.hostname &&
        (p.port || "") === port &&
        p.protocol === protocol,
    );
    if (!dup) {
      remotePatterns.push({
        protocol,
        hostname: u.hostname,
        port,
        pathname: "/uploads/**",
      });
    }
  }
} catch {
  /* ignore invalid NEXT_PUBLIC_API_URL */
}

// Next.js 15+ blocks the image optimizer from fetching private IPs (localhost) by default (SSRF).
// Product uploads use http://localhost:5000/uploads/... in dev — allow that path only when needed.
const allowLocalImageUpstream =
  process.env.NODE_ENV === "development" ||
  process.env.NEXT_IMAGE_ALLOW_LOCAL === "1";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 375, 425, 640, 750, 828, 1080, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    dangerouslyAllowLocalIP: allowLocalImageUpstream,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns,
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
    emotion: true,
  },
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
    optimizePackageImports: ["react-redux", "@reduxjs/toolkit"],
  },
  // Mobile performance optimizations
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Optimize builds
  productionBrowserSourceMaps: false,
  generateEtags: true,
  // Headers for caching - تحسين الـ cache
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
      {
        source: "/fonts/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, immutable, max-age=31536000",
          },
        ],
      },
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, must-revalidate",
          },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
