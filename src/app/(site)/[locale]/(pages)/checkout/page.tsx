"use client";

import React, { useEffect } from "react";
import { useRouter } from "@/app/i18n/navigation";
import { useLocale } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import Checkout from "@/components/Checkout";
import Loading from "@/app/loading";

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
  if (loading) return <Loading />;

  if (!user) {
    // Don't render checkout if user is not authenticated
    return null;
  }

  return (
    <main>
      <Checkout />
    </main>
  );
};

export default CheckoutPage;
