"use client";

import { ReactNode, Suspense } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { ProductSkeleton } from "./Skeleton";

interface LazyComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
  enabled?: boolean;
  skeleton?: "product" | "cart" | "blog" | "custom";
}

export default function LazyComponent({
  children,
  fallback,
  rootMargin = "50px",
  threshold = 0.01,
  className = "",
  enabled = true,
  skeleton = "custom",
}: LazyComponentProps) {
  const { ref, isIntersecting } = useIntersectionObserver({
    rootMargin,
    threshold,
    enabled,
    triggerOnce: true,
  });

  const renderSkeleton = () => {
    if (fallback) return fallback;
    
    switch (skeleton) {
      case "product":
        return <ProductSkeleton />;
      case "cart":
        return <div className="h-24 bg-gray-200 animate-pulse rounded" />;
      case "blog":
        return <div className="h-64 bg-gray-200 animate-pulse rounded" />;
      default:
        return <div className="h-32 bg-gray-200 animate-pulse rounded" />;
    }
  };

  return (
    <div ref={ref as any} className={className}>
      {!isIntersecting ? (
        renderSkeleton()
      ) : (
        <Suspense fallback={renderSkeleton()}>
          {children}
        </Suspense>
      )}
    </div>
  );
}

export function LazySection({
  children,
  className = "",
  rootMargin = "100px",
}: {
  children: ReactNode;
  className?: string;
  rootMargin?: string;
}) {
  const { ref, isIntersecting } = useIntersectionObserver({
    rootMargin,
    threshold: 0.01,
    triggerOnce: true,
  });

  return (
    <section ref={ref as any} className={className}>
      {isIntersecting ? children : (
        <div className="min-h-[200px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}
    </section>
  );
}