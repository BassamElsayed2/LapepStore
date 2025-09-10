export const fontOptimization = `
  /* Critical font loading with fallback */
  @font-face {
    font-family: 'Euclid Circular A';
    src: url('/fonts/EuclidCircularA-Regular.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }

  @font-face {
    font-family: 'Euclid Circular A';
    src: url('/fonts/EuclidCircularA-Medium.woff2') format('woff2');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }

  @font-face {
    font-family: 'Euclid Circular A';
    src: url('/fonts/EuclidCircularA-Bold.woff2') format('woff2');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }

  /* System font stack fallback */
  body {
    font-family: 'Euclid Circular A', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }

  /* Optimize font rendering */
  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  /* Preload critical fonts */
  link[rel="preload"][as="font"] {
    crossorigin: anonymous;
  }
`;

export const criticalCSS = `
  /* Critical CSS for above-the-fold content */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
  }

  body {
    min-height: 100vh;
    background: #ffffff;
    color: #1C274C;
  }

  .container {
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  @media (max-width: 768px) {
    html {
      font-size: 14px;
    }
    
    .container {
      padding: 0 0.75rem;
    }
  }

  /* Prevent layout shift */
  img, video, iframe {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Loading states */
  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }

  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* Reduce motion for accessibility */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

export function generatePreloadLinks(locale: string = "en") {
  const fonts = [
    "/fonts/EuclidCircularA-Regular.woff2",
    "/fonts/EuclidCircularA-Medium.woff2",
  ];

  return fonts.map(font => ({
    rel: "preload",
    href: font,
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  }));
}

export function generateResourceHints() {
  return [
    { rel: "dns-prefetch", href: "https://kxbvftijipkulngbfdfv.supabase.co" },
    { rel: "preconnect", href: "https://kxbvftijipkulngbfdfv.supabase.co" },
    { rel: "dns-prefetch", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  ];
}