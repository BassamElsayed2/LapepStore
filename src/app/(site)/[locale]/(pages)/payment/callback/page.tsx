"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { getPaymentStatus } from "@/services/apiPayment";
import { getOrderById } from "@/services/apiOrders";

const PaymentCallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();

  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    // Get order_id from URL params
    const orderId = searchParams.get("order_id") || searchParams.get("customerReference");

    if (!orderId) {
      setStatus("failed");
      return;
    }

    // Check payment status
    checkPaymentStatus(orderId);
  }, [searchParams]);

  const checkPaymentStatus = async (orderId: string) => {
    try {
      // Get payment status
      const paymentResult = await getPaymentStatus(orderId);
      
      if (paymentResult.payment) {
        // Get order details
        const orderResult = await getOrderById(orderId);
        
        if (orderResult.order) {
          setOrderData(orderResult.order);
          
          // Check if payment is completed
          if (
            paymentResult.payment.payment_status === "completed" ||
            orderResult.order.status === "paid"
          ) {
            setStatus("success");
          } else if (paymentResult.payment.payment_status === "failed") {
            setStatus("failed");
          } else {
            // Payment is pending, keep checking
            setTimeout(() => checkPaymentStatus(orderId), 3000);
          }
        } else {
          setStatus("failed");
        }
      } else {
        setStatus("failed");
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
      setStatus("failed");
    }
  };

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
      <section className="overflow-hidden py-20">
        <div className="max-w-[570px] w-full mx-auto px-4 sm:px-8 xl:px-0">
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
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/orders/${orderData?.id}`}
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


