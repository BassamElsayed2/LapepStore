import dynamic from "next/dynamic";
import { ComponentType, Suspense } from "react";

interface LoadingProps {
  text?: string;
}

const DefaultLoader = ({ text = "Loading..." }: LoadingProps) => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  </div>
);

export function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  loadingComponent?: ComponentType<LoadingProps>
) {
  const Loader = loadingComponent || DefaultLoader;
  
  return dynamic(importFunc, {
    loading: () => <Loader />,
    ssr: true,
  });
}

export function withSuspense<T extends ComponentType<any>>(
  Component: T,
  fallback?: React.ReactNode
): T {
  const FallbackComponent = fallback || <DefaultLoader />;
  
  const WrappedComponent = (props: any) => (
    <Suspense fallback={FallbackComponent}>
      <Component {...props} />
    </Suspense>
  );
  
  return WrappedComponent as T;
}