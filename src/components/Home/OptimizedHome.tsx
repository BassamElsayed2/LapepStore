"use client";

import dynamic from "next/dynamic";
import { LazySection } from "@/components/Common/LazyComponent";
import { useMobilePerformance } from "@/hooks/useMobilePerformance";

// Critical components loaded immediately
import Hero from "./Hero";

// Lazy load all non-critical components
const Categories = dynamic(() => import("./Categories"), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse" />,
  ssr: true,
});

const NewArrivals = dynamic(() => import("./NewArrivals"), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse" />,
  ssr: false,
});

const BestSeller = dynamic(() => import("./BestSeller"), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse" />,
  ssr: false,
});

const Countdown = dynamic(() => import("./Countdown"), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse" />,
  ssr: false,
});

const PromoBanner = dynamic(() => import("./PromoBanner"), {
  loading: () => <div className="h-48 bg-gray-100 animate-pulse" />,
  ssr: false,
});

const Testimonials = dynamic(() => import("./Testimonials"), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse" />,
  ssr: false,
});

const News = dynamic(() => import("./News"), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse" />,
  ssr: false,
});

export default function OptimizedHome() {
  const { isMobile, isSlowConnection } = useMobilePerformance();

  // Adjust root margin based on device and connection
  const rootMargin = isMobile ? (isSlowConnection ? "50px" : "100px") : "200px";

  return (
    <>
      {/* Hero section loads immediately as it's above the fold */}
      <Hero />

      {/* Categories load with small delay */}
      <LazySection rootMargin="50px" className="py-8">
        <Categories />
      </LazySection>

      {/* New Arrivals lazy load */}
      <LazySection rootMargin={rootMargin} className="py-8">
        <NewArrivals />
      </LazySection>

      {/* Best Sellers lazy load */}
      <LazySection rootMargin={rootMargin} className="py-8">
        <BestSeller />
      </LazySection>

      {/* Only load countdown on faster connections */}
      {!isSlowConnection && (
        <LazySection rootMargin={rootMargin} className="py-8">
          <Countdown />
        </LazySection>
      )}

      {/* Promo Banner lazy load */}
      <LazySection rootMargin={rootMargin} className="py-8">
        <PromoBanner />
      </LazySection>

      {/* Testimonials load last */}
      <LazySection rootMargin="300px" className="py-8">
        <Testimonials />
      </LazySection>

      {/* News load last */}
      <LazySection rootMargin="300px" className="py-8">
        <News />
      </LazySection>
    </>
  );
}
