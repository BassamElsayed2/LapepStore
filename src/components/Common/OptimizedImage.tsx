"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/utils/cn";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  className?: string;
  containerClassName?: string;
  sizes?: string;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  onLoad?: () => void;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  quality = 75,
  className,
  containerClassName,
  sizes,
  placeholder = "empty",
  blurDataURL,
  onLoad,
  objectFit = "cover",
}: OptimizedImageProps) {
  // تحسين: عدم عرض loading للصور ذات الأولوية
  const [isLoading, setIsLoading] = useState(!priority);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gray-100",
          containerClassName
        )}
        style={!fill ? { width, height } : undefined}
      >
        <div className="text-center p-4">
          <svg
            className="w-12 h-12 mx-auto text-gray-400 mb-2"
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
          <p className="text-sm text-gray-500">Image failed to load</p>
        </div>
      </div>
    );
  }

  const imageProps = fill ? { fill: true } : { width: width!, height: height! };

  return (
    <div className={cn("relative", containerClassName)}>
      {isLoading && (
        <div
          className={cn(
            "absolute inset-0 bg-gray-200 animate-pulse rounded",
            containerClassName
          )}
        />
      )}
      <Image
        src={src}
        alt={alt}
        {...imageProps}
        priority={priority}
        quality={quality}
        className={cn(
          "duration-300 ease-in-out",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        sizes={
          sizes ||
          (fill
            ? "(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            : undefined)
        }
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        style={{ objectFit }}
      />
    </div>
  );
}
