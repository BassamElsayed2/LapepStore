"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000, // 30 seconds - تقليل الوقت
            gcTime: 5 * 60 * 1000, // 5 minutes - garbage collection
            refetchOnWindowFocus: true, // إعادة التحميل عند العودة للصفحة
            refetchOnMount: true, // إعادة التحميل عند mount
            retry: (failureCount, error: any) => {
              // Don't retry on 429 (Too Many Requests)
              if (error?.isRateLimit || error?.status === 429) {
                return false;
              }
              // Retry up to 1 time for other errors
              return failureCount < 1;
            },
            retryDelay: (attemptIndex, error: any) => {
              // If it's a rate limit error, use the retry-after header value
              if (error?.isRateLimit || error?.status === 429) {
                return error.retryAfter || 60000; // Default 60 seconds
              }
              // Exponential backoff for other errors
              return Math.min(1000 * 2 ** attemptIndex, 30000);
            },
            refetchInterval: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}
