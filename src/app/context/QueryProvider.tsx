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
            retry: 1,
            refetchInterval: false, // عدم التحديث التلقائي
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
