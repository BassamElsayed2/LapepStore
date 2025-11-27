"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import {
  getMyVouchers,
  Voucher,
  formatDiscountText,
} from "@/services/apiVouchers";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Loading from "@/app/loading";
import Link from "next/link";
import toast from "react-hot-toast";

const VouchersPage = () => {
  const locale = useLocale();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const isRTL = locale === "ar";

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/${locale}/login`);
      return;
    }

    const fetchVouchers = async () => {
      if (!user) return;

      try {
        const result = await getMyVouchers();
        if (result.success && result.data) {
          setVouchers(result.data);
        }
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchVouchers();
    }
  }, [user, authLoading, router, locale]);

  if (authLoading || loading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(isRTL ? "تم نسخ الكود!" : "Code copied!");
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error(isRTL ? "فشل نسخ الكود" : "Failed to copy code");
    }
  };

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb
        title={isRTL ? "كوبونات الخصم" : "Discount Vouchers"}
        pages={[isRTL ? "كوبونات الخصم" : "Vouchers"]}
      />

      {/* Main Content */}
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-5 mb-7.5">
            <div>
              <h2 className="font-medium text-dark text-2xl mb-1">
                {isRTL ? "كوبونات الخصم الخاصة بك" : "Your Discount Vouchers"}
              </h2>
              <p className="text-gray-5">
                {isRTL
                  ? "استخدم هذه الأكواد للحصول على خصم على طلبك القادم"
                  : "Use these codes to get a discount on your next order"}
              </p>
            </div>
            <Link
              href={`/${locale}/checkout`}
              className="inline-flex font-medium text-custom-sm text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark"
            >
              {isRTL ? "اذهب للدفع" : "Go to Checkout"}
            </Link>
          </div>

          {vouchers.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-[10px] shadow-1 p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="mx-auto mb-7.5">
                  <svg
                    className="mx-auto"
                    width="100"
                    height="100"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="50" cy="50" r="50" fill="#F3F4F6" />
                    <path
                      d="M35 35h30v30H35V35z"
                      stroke="#8D93A5"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M45 45l10 10M55 45l-10 10"
                      stroke="#8D93A5"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M50 30v5M50 65v5M30 50h5M65 50h5"
                      stroke="#8D93A5"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-xl text-dark mb-2">
                  {isRTL ? "لا توجد كوبونات حالياً" : "No vouchers yet"}
                </h3>
                <p className="text-gray-5 mb-6">
                  {isRTL
                    ? "قيّم متجرنا على جوجل للحصول على كود خصم حصري!"
                    : "Rate our store on Google to get an exclusive discount code!"}
                </p>
                <Link
                  href={`/${locale}`}
                  className="inline-flex font-medium text-custom-sm text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark"
                >
                  {isRTL ? "ارجع للصفحة الرئيسية" : "Go to Home"}
                </Link>
              </div>
            </div>
          ) : (
            /* Vouchers Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vouchers.map((voucher) => (
                <div
                  key={voucher.id}
                  className="bg-white rounded-[10px] shadow-1 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Voucher Header */}
                  <div className="bg-blue py-4 px-5">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm font-medium">
                        {isRTL ? "كوبون خصم" : "Discount Voucher"}
                      </span>
                      <div className="bg-white/20 rounded-md px-3 py-1">
                        <span className="text-white font-bold">
                          {voucher.discount_type === "percentage"
                            ? `${voucher.discount_value}%`
                            : `${voucher.discount_value} ${
                                isRTL ? "ج.م" : "EGP"
                              }`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Voucher Body */}
                  <div className="p-5">
                    {/* Code */}
                    <div className="bg-gray-2 rounded-md p-4 mb-4">
                      <p className="text-xs text-gray-5 mb-1">
                        {isRTL ? "كود الخصم" : "Discount Code"}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="font-mono font-bold text-xl text-dark">
                          {voucher.code}
                        </p>
                        <button
                          onClick={() => copyToClipboard(voucher.code)}
                          className="text-blue hover:text-blue-dark transition-colors p-1"
                          title={isRTL ? "نسخ" : "Copy"}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Discount Info */}
                    <p className="text-gray-5 text-sm mb-4">
                      {formatDiscountText(voucher, locale)}
                    </p>

                    {/* Expiry Date */}
                    {voucher.expires_at && (
                      <div className="flex items-center gap-2 text-sm text-gray-5 mb-4 border-t border-gray-3 pt-4">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>
                          {isRTL ? "صالح حتى:" : "Valid until:"}{" "}
                          {new Date(voucher.expires_at).toLocaleDateString(
                            locale === "ar" ? "ar-EG" : "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    )}

                    {/* Use Now Button */}
                    <button
                      onClick={() => router.push(`/${locale}/checkout`)}
                      className="w-full font-medium text-white bg-blue py-3 rounded-md ease-out duration-200 hover:bg-blue-dark"
                    >
                      {isRTL ? "استخدم الآن" : "Use Now"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Info Card */}
          <div className="mt-9 bg-white rounded-[10px] shadow-1 p-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-light-5 rounded-full p-3 flex-shrink-0">
                <svg
                  className="w-6 h-6 text-blue"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-dark mb-1">
                  {isRTL
                    ? "كيفية استخدام كود الخصم"
                    : "How to use the discount code"}
                </h4>
                <p className="text-gray-5 text-sm">
                  {isRTL
                    ? "أدخل كود الخصم في صفحة الدفع قبل إتمام الطلب لتطبيق الخصم على مشترياتك."
                    : "Enter the discount code on the checkout page before completing your order to apply the discount."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default VouchersPage;
