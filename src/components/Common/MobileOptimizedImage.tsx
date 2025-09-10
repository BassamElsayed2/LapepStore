"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/utils/cn";

interface MobileOptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  containerClassName?: string;
  mobileQuality?: number;
  desktopQuality?: number;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  eager?: boolean;
}

const MOBILE_BREAKPOINT = 768;
const BLUR_DATA_URL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=";

export default function MobileOptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  className,
  containerClassName,
  mobileQuality = 60,
  desktopQuality = 75,
  placeholder = "blur",
  blurDataURL = BLUR_DATA_URL,
  objectFit = "cover",
  eager = false,
}: MobileOptimizedImageProps) {
  const [isVisible, setIsVisible] = useState(eager || priority);
  const [hasError, setHasError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (eager || priority || isVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: isMobile ? "50px" : "200px",
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [eager, priority, isVisible, isMobile]);

  const quality = isMobile ? mobileQuality : desktopQuality;

  // Generate responsive sizes for mobile
  const generateSizes = () => {
    if (!fill) return undefined;
    
    if (isMobile) {
      return "(max-width: 375px) 100vw, (max-width: 640px) 95vw, 90vw";
    }
    return "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";
  };

  const imageProps = fill
    ? { fill: true }
    : { width: width!, height: height! };

  if (hasError) {
    return (
      <div
        ref={containerRef}
        className={cn(
          "flex items-center justify-center bg-gray-100",
          containerClassName
        )}
        style={!fill ? { width, height } : undefined}
      >
        <div className="text-center p-2">
          <svg
            className="w-8 h-8 mx-auto text-gray-400 mb-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-xs text-gray-500">Failed to load</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn("relative", containerClassName)}>
      {!isVisible && !priority ? (
        <div
          className={cn(
            "bg-gray-200 animate-pulse rounded",
            className
          )}
          style={!fill ? { width, height } : { position: "absolute", inset: 0 }}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          {...imageProps}
          quality={quality}
          priority={priority}
          className={cn(
            "duration-300 ease-in-out",
            className
          )}
          sizes={generateSizes()}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          onError={() => setHasError(true)}
          style={{ objectFit }}
          loading={priority ? "eager" : "lazy"}
        />
      )}
    </div>
  );
}