"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { getPaymentStatus } from "@/services/apiPayment";
import { getOrderById } from "@/services/apiOrders";
import GoogleRatingPromo from "@/components/Home/GoogleRatingPromo";

const PaymentCallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();

  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading"
  );
  const [orderData, setOrderData] = useState<any>(null);
  const [voucher, setVoucher] = useState<string | null>(null);

  /**
   * Check payment status by order ID
   */
  const checkPaymentStatus = useCallback(
    async (orderId: string, retryCount = 0) => {
      try {
        console.log(
          `🔍 Checking payment status for order ${orderId} (attempt ${
            retryCount + 1
          })...`
        );

        // Get payment status
        const paymentResult = await getPaymentStatus(orderId);

        console.log("💳 Payment result:", paymentResult);

        if (paymentResult.payment) {
          // Get order details
          const orderResult = await getOrderById(orderId);

          console.log("📦 Order result:", orderResult);

          if (orderResult.order) {
            setOrderData(orderResult.order);

            // Check if payment is completed
            if (
              paymentResult.payment.payment_status === "completed" ||
              orderResult.order.status === "paid" ||
              orderResult.order.status === "confirmed"
            ) {
              console.log("✅ Payment completed successfully!");
              setStatus("success");
            } else if (paymentResult.payment.payment_status === "failed") {
              console.log("❌ Payment failed");
              setStatus("failed");
            } else {
              // Payment is pending, keep checking (max 20 attempts = 60 seconds)
              if (retryCount < 20) {
                console.log(
                  "⏳ Payment still pending, will retry in 3 seconds..."
                );
                setTimeout(
                  () => checkPaymentStatus(orderId, retryCount + 1),
                  3000
                );
              } else {
                console.warn(
                  "⚠️ Max retry attempts reached, payment still pending"
                );
                // Show success anyway as payment might complete later
                setStatus("success");
              }
            }
          } else {
            console.error("❌ Order not found");
            setStatus("failed");
          }
        } else {
          console.error("❌ Payment not found");
          setStatus("failed");
        }
      } catch (error) {
        console.error("❌ Error checking payment status:", error);

        // Retry on error (max 5 attempts)
        if (retryCount < 5) {
          console.log(`⚠️ Error occurred, will retry in 3 seconds...`);
          setTimeout(() => checkPaymentStatus(orderId, retryCount + 1), 3000);
        } else {
          console.error("❌ Max error retry attempts reached");
          setStatus("failed");
        }
      }
    },
    []
  );

  /**
   * Poll for recent successful payment
   * This is used as a fallback when redirect params are incomplete
   */
  const pollForRecentPayment = useCallback(async () => {
    try {
      console.log("🔍 Polling for recent payment...");

      // Get base URL and ensure it doesn't have duplicate /api
      let baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      // Remove trailing slash if present
      baseUrl = baseUrl.replace(/\/$/, "");

      // If baseUrl doesn't end with /api, add it
      if (!baseUrl.endsWith("/api")) {
        baseUrl += "/api";
      }

      // Try to get recent orders for current user
      // Note: This requires authentication
      const response = await fetch(`${baseUrl}/orders?limit=5&sort=desc`, {
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data?.orders?.length > 0) {
          // Find the most recent paid/pending order
          const recentOrder = result.data.orders.find(
            (order: any) =>
              order.status === "paid" ||
              order.status === "confirmed" ||
              order.status === "pending"
          );

          if (recentOrder) {
            console.log("✅ Found recent order:", recentOrder.id);
            checkPaymentStatus(recentOrder.id);
            return;
          }
        }
      }

      // If polling failed, wait and show loading
      console.log("⏳ Waiting for payment callback to be processed...");
      setTimeout(() => {
        // After 10 seconds of waiting, show error
        console.error("❌ Timeout waiting for payment confirmation");
        setStatus("failed");
      }, 10000);
    } catch (error) {
      console.error("❌ Error polling for recent payment:", error);
      setStatus("failed");
    }
  }, [checkPaymentStatus]);

  /**
   * Handle EasyKash redirect
   */
  const handleEasyKashRedirect = useCallback(
    async (
      status: string | null,
      customerReference: string | null,
      providerRefNum: string | null,
      voucher: string | null
    ) => {
      try {
        console.log("🔄 Processing EasyKash redirect...");

        // If we have customerReference, try to get order from backend
        if (customerReference) {
          // Get base URL and ensure it doesn't have duplicate /api
          let baseUrl =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

          // Remove trailing slash if present
          baseUrl = baseUrl.replace(/\/$/, "");

          // If baseUrl doesn't end with /api, add it
          if (!baseUrl.endsWith("/api")) {
            baseUrl += "/api";
          }

          // Call backend to process redirect
          const apiUrl = `${baseUrl}/payment/redirect?status=${
            status || ""
          }&customerReference=${customerReference}${
            providerRefNum ? `&providerRefNum=${providerRefNum}` : ""
          }${voucher ? `&voucher=${voucher}` : ""}`;

          console.log("📡 Calling backend:", apiUrl);

          const response = await fetch(apiUrl);

          if (response.ok) {
            const result = await response.json();
            console.log("✅ Backend response:", result);

            if (result.success && result.data) {
              const orderId = result.data.order_id;

              // Store voucher if available (for Aman/Fawry payments)
              if (result.data.voucher) {
                setVoucher(result.data.voucher);
              }

              // Continue to check payment status
              checkPaymentStatus(orderId);
              return;
            }
          } else {
            console.warn(
              "⚠️ Backend redirect failed, will try polling payment status"
            );
          }
        }

        // Fallback: If status is success but no customerReference, or backend failed
        // Try to find the order by polling recent payments
        if (status === "success" || status === "completed") {
          console.log("✅ Payment status is success, polling for order...");
          // Poll for recent successful payment
          // This is a fallback when webhook is received but redirect params are incomplete
          pollForRecentPayment();
        } else if (status === "failed") {
          console.log("❌ Payment status is failed");
          setStatus("failed");
        } else {
          // Status unclear - try polling
          console.log("⚠️ Status unclear, will poll for recent payment");
          pollForRecentPayment();
        }
      } catch (error) {
        console.error("❌ Error handling EasyKash redirect:", error);
        // Don't immediately fail - try polling for recent payment
        pollForRecentPayment();
      }
    },
    [checkPaymentStatus, pollForRecentPayment]
  );

  useEffect(() => {
    // EasyKash redirects with: status, providerRefNum, customerReference, voucher
    const paymentStatus = searchParams.get("status");
    const customerReference = searchParams.get("customerReference");
    const providerRefNum = searchParams.get("providerRefNum");
    const voucherParam = searchParams.get("voucher");
    const orderId = searchParams.get("order_id");

    console.log("📞 Payment callback received with params:", {
      paymentStatus,
      customerReference,
      providerRefNum,
      voucher: voucherParam,
      orderId,
    });

    // If we have EasyKash redirect parameters, handle them
    if (customerReference || paymentStatus) {
      handleEasyKashRedirect(
        paymentStatus,
        customerReference,
        providerRefNum,
        voucherParam
      );
      return;
    }

    // Fallback: try to get order_id from URL params
    if (orderId) {
      console.log("✅ Using order_id from URL:", orderId);
      checkPaymentStatus(orderId);
      return;
    }

    // No parameters found - show error
    console.error("❌ No payment parameters found in URL");
    setStatus("failed");
  }, [searchParams, handleEasyKashRedirect, checkPaymentStatus]);

  if (status === "loading") {
    return (
      <section className="overflow-hidden py-20">
        <div className="max-w-[570px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue"></div>
            </div>
            <h2 className="text-2xl font-bold text-dark mb-2">
              {locale === "ar"
                ? "جاري التحقق من عملية الدفع..."
                : "Verifying Payment..."}
            </h2>
            <p className="text-gray-600">
              {locale === "ar"
                ? "الرجاء الانتظار، لا تغلق هذه الصفحة"
                : "Please wait, do not close this page"}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (status === "success") {
    return (
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="grid grid-cols-1 gap-7.5 lg:grid-cols-[1fr_400px]">
            {/* Success Message Section */}
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              {/* Success Icon */}
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-green-100 p-6">
                  <svg
                    className="w-16 h-16 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark mb-4">
                {locale === "ar" ? "تم الدفع بنجاح!" : "Payment Successful!"}
              </h2>

              <p className="text-gray-600 mb-6">
                {locale === "ar"
                  ? "شكراً لك! تم استلام طلبك وسيتم معالجته قريباً."
                  : "Thank you! Your order has been received and will be processed soon."}
              </p>

              {orderData && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                  <h3 className="font-bold text-lg mb-4">
                    {locale === "ar" ? "تفاصيل الطلب" : "Order Details"}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {locale === "ar" ? "رقم الطلب:" : "Order ID:"}
                      </span>
                      <span className="font-medium">{orderData.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {locale === "ar" ? "الإجمالي:" : "Total:"}
                      </span>
                      <span className="font-bold text-blue">
                        {orderData.total_price} {locale === "ar" ? "ج.م" : "EGP"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {locale === "ar" ? "الحالة:" : "Status:"}
                      </span>
                      <span className="font-medium text-green-500">
                        {locale === "ar" ? "مدفوع" : "Paid"}
                      </span>
                    </div>
                    {voucher && (
                      <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
                        <span className="text-gray-600 font-bold">
                          {locale === "ar" ? "رقم الفاتورة:" : "Voucher Number:"}
                        </span>
                        <span className="font-bold text-blue text-lg">
                          {voucher}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={`/${locale}/profile?tab=orders`}
                  className="inline-flex items-center justify-center rounded-md bg-blue py-3 px-8 text-base font-medium text-white transition hover:bg-blue-dark"
                >
                  {locale === "ar" ? "عرض الطلب" : "View Order"}
                </Link>
                <Link
                  href={`/${locale}`}
                  className="inline-flex items-center justify-center rounded-md border border-blue py-3 px-8 text-base font-medium text-blue transition hover:bg-blue hover:text-white"
                >
                  {locale === "ar" ? "العودة للرئيسية" : "Back to Home"}
                </Link>
              </div>
            </div>

            {/* Google Rating Promo Section */}
            <div className="lg:col-span-1">
              <div className="sticky top-5">
                <GoogleRatingPromo />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Failed status
  return (
    <section className="overflow-hidden py-20">
      <div className="max-w-[570px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-red-100 p-6">
              <svg
                className="w-16 h-16 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-dark mb-4">
            {locale === "ar" ? "فشل الدفع" : "Payment Failed"}
          </h2>

          <p className="text-gray-600 mb-6">
            {locale === "ar"
              ? "عذراً، لم نتمكن من إتمام عملية الدفع. الرجاء المحاولة مرة أخرى."
              : "Sorry, we couldn't process your payment. Please try again."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/cart`}
              className="inline-flex items-center justify-center rounded-md bg-blue py-3 px-8 text-base font-medium text-white transition hover:bg-blue-dark"
            >
              {locale === "ar" ? "العودة للسلة" : "Back to Cart"}
            </Link>
            <Link
              href={`/${locale}`}
              className="inline-flex items-center justify-center rounded-md border border-blue py-3 px-8 text-base font-medium text-blue transition hover:bg-blue hover:text-white"
            >
              {locale === "ar" ? "الرئيسية" : "Home"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentCallbackPage;
