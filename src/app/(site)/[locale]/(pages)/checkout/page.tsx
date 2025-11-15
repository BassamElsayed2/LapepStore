"use client";

import React, { useEffect } from "react";
import { useRouter } from "@/app/i18n/navigation";
import { useLocale } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import Checkout from "@/components/Checkout";

const CheckoutPage = () => {
  const router = useRouter();
  const locale = useLocale();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#22AD5C] mx-auto mb-4"></div>
          <p className="text-gray-600">
            {locale === "ar" ? "جاري التحميل..." : "Loading..."}
          </p>
        </div>
      </main>
    );
  }

  // Don't render checkout if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <main>
      <Checkout />
    </main>
  );
};

export default CheckoutPage;
