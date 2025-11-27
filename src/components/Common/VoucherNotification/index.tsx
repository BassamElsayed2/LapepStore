"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import {
  getMyVouchers,
  Voucher,
  formatDiscountText,
} from "@/services/apiVouchers";

interface VoucherNotificationProps {
  showAsPopup?: boolean;
  className?: string;
}

const VoucherNotification: React.FC<VoucherNotificationProps> = ({
  showAsPopup = false,
  className = "",
}) => {
  const locale = useLocale();
  const { user } = useAuth();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const isRTL = locale === "ar";

  useEffect(() => {
    const fetchVouchers = async () => {
      if (!user) {
        setVouchers([]);
        setLoading(false);
        return;
      }

      try {
        const result = await getMyVouchers();
        if (result.success && result.data) {
          setVouchers(result.data);
          // Show popup if there are new vouchers
          if (showAsPopup && result.data.length > 0) {
            const hasSeenVouchers = localStorage.getItem("seenVoucherIds");
            const seenIds = hasSeenVouchers ? JSON.parse(hasSeenVouchers) : [];
            const newVouchers = result.data.filter(
              (v) => !seenIds.includes(v.id)
            );
            if (newVouchers.length > 0) {
              setShowPopup(true);
              // Mark as seen
              const allIds = result.data.map((v) => v.id);
              localStorage.setItem("seenVoucherIds", JSON.stringify(allIds));
            }
          }
        }
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, [user, showAsPopup]);

  if (loading || vouchers.length === 0) {
    return null;
  }

  // Badge notification (for navbar)
  if (!showAsPopup) {
    return (
      <Link
        href={`/${locale}/vouchers`}
        className={`relative group ${className}`}
        title={isRTL ? "كوبونات الخصم" : "Discount Vouchers"}
      >
        <div className="relative p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-all duration-200">
          {/* Ticket/Voucher Icon */}
          <svg
            className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-blue transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
            />
          </svg>
          {/* Badge */}
          <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-blue to-blue-dark  text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold shadow-lg">
            {vouchers.length}
          </span>
        </div>
      </Link>
    );
  }

  // Popup notification
  if (!showPopup) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setShowPopup(false)}
      />

      {/* Modal */}
      <div
        className={`relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all duration-300 scale-100 ${
          isRTL ? "text-right" : "text-left"
        }`}
        style={{ animation: "slideUp 0.3s ease-out" }}
      >
        {/* Decorative Header Background */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-blue via-blue-dark to-purple-600 opacity-90" />

        {/* Decorative circles */}
        <div className="absolute top-4 left-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
        <div className="absolute top-8 right-8 w-12 h-12 bg-white/10 rounded-full blur-lg" />

        {/* Close Button */}
        <button
          onClick={() => setShowPopup(false)}
          className="absolute top-4 right-4 z-10   transition-colors p-1 rounded-full hover:bg-white/10"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="relative pt-8 px-6 pb-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl">
              <svg
                className="w-12 h-12 text-blue"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6 mt-4">
            <h3 className="text-2xl font-bold text-dark  mb-2">
              {isRTL ? "🎁 مبروك! لديك خصم" : "🎁 Congratulations!"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {isRTL
                ? `لديك ${vouchers.length} ${
                    vouchers.length === 1 ? "كود خصم" : "أكواد خصم"
                  } متاحة`
                : `You have ${vouchers.length} discount ${
                    vouchers.length === 1 ? "code" : "codes"
                  } available`}
            </p>
          </div>

          {/* Vouchers List */}
          <div className="space-y-3 mb-6 max-h-[200px] overflow-y-auto custom-scrollbar">
            {vouchers.map((voucher) => (
              <div
                key={voucher.id}
                className="relative bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 overflow-hidden"
              >
                {/* Decorative ticket notches */}
                <div className="absolute top-1/2 -left-3 w-6 h-6 bg-white dark:bg-gray-900 rounded-full transform -translate-y-1/2" />
                <div className="absolute top-1/2 -right-3 w-6 h-6 bg-white dark:bg-gray-900 rounded-full transform -translate-y-1/2" />

                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-mono font-bold text-lg text-dark truncate">
                      {voucher.code}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {formatDiscountText(voucher, locale)}
                    </p>
                    {voucher.expires_at && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
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
                        {isRTL ? "ينتهي:" : "Expires:"}{" "}
                        {new Date(voucher.expires_at).toLocaleDateString(
                          locale === "ar" ? "ar-EG" : "en-US"
                        )}
                      </p>
                    )}
                  </div>

                  {/* Discount Badge */}
                  <div className="flex-shrink-0">
                    <div className="bg-blue  px-4 py-2 rounded-lg text-center shadow-lg">
                      <span className="text-xl font-bold block">
                        {voucher.discount_type === "percentage"
                          ? `${voucher.discount_value}%`
                          : voucher.discount_value}
                      </span>
                      {voucher.discount_type === "fixed" && (
                        <span className="text-xs opacity-90">
                          {isRTL ? "ج.م" : "EGP"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Link
              href={`/${locale}/vouchers`}
              className="flex-1 bg-blue  font-semibold py-3.5 px-4 rounded-xl text-center hover:bg-blue-dark transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isRTL ? "عرض الكوبونات" : "View Vouchers"}
            </Link>
            <Link
              href={`/${locale}/checkout`}
              onClick={() => setShowPopup(false)}
              className="flex-1 bg-green-500  font-semibold py-3.5 px-4 rounded-xl text-center hover:bg-green-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {isRTL ? "تسوق الآن" : "Shop Now"}
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default VoucherNotification;
