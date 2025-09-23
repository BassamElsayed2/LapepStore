"use client";
import React, { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Breadcrumb from "@/components/Common/Breadcrumb";
import OrderTracking from "@/components/OrderTracking";

const TrackOrderPage = () => {
  const locale = useLocale();
  const t = useTranslations("orderTracking");
  const [orderId, setOrderId] = useState("");
  const [showTracking, setShowTracking] = useState(false);

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) {
      setShowTracking(true);
    }
  };

  const handleReset = () => {
    setOrderId("");
    setShowTracking(false);
  };

  return (
    <>
      <Breadcrumb title={t("title")} pages={[t("title")]} />

      <section className="py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          {!showTracking ? (
            /* Order ID Input Form */
            <div className="bg-white shadow-1 rounded-[10px] p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-dark mb-4">
                  {t("title")}
                </h1>
                <p className="text-dark-5 text-lg">{t("enterOrderNumber")}</p>
              </div>

              <form onSubmit={handleTrackOrder} className="max-w-md mx-auto">
                <div className="mb-6">
                  <label
                    htmlFor="orderId"
                    className="block text-sm font-medium text-dark mb-2"
                  >
                    {t("orderNumber")}
                  </label>
                  <input
                    type="text"
                    id="orderId"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="12345678-1234-1234-1234-123456789abc"
                    className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue text-white py-3 px-6 rounded-md hover:bg-blue-dark transition-colors font-medium"
                >
                  {t("trackOrder")}
                </button>
              </form>

              {/* Quick Info */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                  <div className="text-blue text-2xl ml-3">💡</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-dark mb-2">
                      {locale === "ar" ? "نصائح مفيدة:" : "Helpful Tips:"}
                    </h3>
                    <ul className="text-sm text-blue-dark space-y-1">
                      <li>
                        {locale === "ar"
                          ? "• رقم الطلب يتكون من أرقام وحروف"
                          : "• Order number consists of numbers and letters"}
                      </li>
                      <li>
                        {locale === "ar"
                          ? "• إذا لم تجد رقم الطلب، يرجى الاتصال بخدمة العملاء"
                          : "• If you can't find your order number, please contact customer service"}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Order Tracking Results */
            <div className="space-y-6">
              {/* Back Button */}
              <div>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center text-blue hover:text-blue-dark transition-colors"
                >
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={locale === "ar" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
                    />
                  </svg>
                  {locale === "ar" ? "البحث عن طلب آخر" : "Track Another Order"}
                </button>
              </div>

              {/* Order Tracking Component */}
              <OrderTracking orderId={orderId} />
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default TrackOrderPage;
