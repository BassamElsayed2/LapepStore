import { cn } from "@/utils/cn";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "rectangular" | "circular";
  animation?: "pulse" | "wave" | "none";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className,
  variant = "rectangular",
  animation = "pulse",
  width,
  height,
}: SkeletonProps) {
  const baseClass = "bg-gray-200";
  
  const variantClasses = {
    text: "rounded",
    rectangular: "rounded-md",
    circular: "rounded-full",
  };
  
  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-shimmer",
    none: "",
  };

  return (
    <div
      className={cn(
        baseClass,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
    />
  );
}

export function ProductSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton height={320} className="rounded-lg" />
      <Skeleton variant="text" height={20} width="80%" />
      <Skeleton variant="text" height={16} width="40%" />
      <div className="flex gap-2">
        <Skeleton variant="text" height={24} width={80} />
        <Skeleton variant="text" height={20} width={60} />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
}

export function CartItemSkeleton() {
  return (
    <div className="flex gap-4 p-4 border-b">
      <Skeleton width={80} height={80} className="rounded-md" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" height={20} width="60%" />
        <Skeleton variant="text" height={16} width="30%" />
        <div className="flex gap-2">
          <Skeleton variant="text" height={24} width={80} />
          <Skeleton variant="text" height={24} width={100} />
        </div>
      </div>
    </div>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton height={200} className="rounded-lg" />
      <div className="space-y-2">
        <Skeleton variant="text" height={12} width="30%" />
        <Skeleton variant="text" height={24} width="90%" />
        <Skeleton variant="text" height={16} width="100%" />
        <Skeleton variant="text" height={16} width="80%" />
      </div>
    </div>
  );
}