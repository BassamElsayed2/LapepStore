"use client";

import React from "react";
import { useLocale } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import { generateWhatsAppUrl } from "@/utils/whatsappNotification";

const GoogleRatingPromo = () => {
  const locale = useLocale();
  const { user } = useAuth();
  const isRTL = locale === "ar";

  // Google Maps/Business review link
  const googleReviewLink =
    "https://www.google.com/maps/place/LAPip+vape+%26+Lounge/@30.0203965,30.9696074,759m/data=!3m1!1e3!4m8!3m7!1s0x145859005b5c15b7:0xfb0f00738e667953!8m2!3d30.0203965!4d30.9696074!9m1!1b1!16s%2Fg%2F11zhmx_jst?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D";

  const handleGoogleReview = () => {
    window.open(googleReviewLink, "_blank");
  };

  const handleWhatsAppSend = () => {
    const userPhone = user?.phone || "";
    const message = isRTL
      ? `مرحباً، لقد قمت بتقييم المتجر على جوجل ⭐️

📱 رقم هاتفي: ${userPhone}

أرفق صورة التقييم للحصول على كود الخصم 🎁`
      : `Hello, I have rated the store on Google ⭐️

📱 My phone number: ${userPhone}

I'm attaching the rating screenshot to get my discount code 🎁`;

    const whatsappUrl = generateWhatsAppUrl(message);
    window.open(whatsappUrl, "_blank");
  };

  const steps = [
    {
      icon: "⭐",
      title: isRTL ? "قيّم المتجر" : "Rate Store",
      desc: isRTL
        ? "اضغط على زر جوجل وأضف تقييمك"
        : "Click Google button and add your review",
    },
    {
      icon: "📸",
      title: isRTL ? "خذ سكرين شوت" : "Take Screenshot",
      desc: isRTL ? "صوّر شاشة التقييم" : "Capture your review screen",
    },
    {
      icon: "📱",
      title: isRTL ? "أرسل واتساب" : "Send WhatsApp",
      desc: isRTL
        ? "أرسل الصورة مع رقمك"
        : "Send the screenshot with your number",
    },
    {
      icon: "🎁",
      title: isRTL ? "احصل على الخصم" : "Get Discount",
      desc: isRTL
        ? "استلم كود الخصم الخاص بك"
        : "Receive your exclusive discount code",
    },
  ];

  return (
    <div className="bg-white rounded-[10px] shadow-1">
      <div
        className={`border-b border-gray-3 py-5 px-4 sm:px-8.5 ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-2xl">⭐</span>
            <span className="text-2xl">⭐</span>
            <span className="text-2xl">⭐</span>
          </div>
          <h2 className="font-medium text-xl text-dark">
            {isRTL ? "قيّم متجرنا واحصل على خصم!" : "Rate Us & Get Discount!"}
          </h2>
        </div>
      </div>

      <div className="p-4 sm:px-8.5 py-6">
        {/* Description */}
        <div className="mb-6">
          <p className="text-gray-5 text-sm leading-relaxed">
            {isRTL
              ? "شاركنا رأيك على جوجل وأرسل لنا صورة التقييم عبر واتساب للحصول على كود خصم حصري 🎁"
              : "Share your experience on Google and send us a screenshot via WhatsApp to receive an exclusive discount code 🎁"}
          </p>
        </div>

        {/* Steps Section */}
        <div className="space-y-3 mb-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex items-start gap-3 pb-3 border-b border-gray-3 last:border-0"
            >
              {/* Step number and icon */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-blue-light-1 flex items-center justify-center text-blue font-medium">
                  {index + 1}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{step.icon}</span>
                  <h3 className="text-dark font-medium text-sm">
                    {step.title}
                  </h3>
                </div>
                <p className="text-gray-5 text-xs leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Google Review Button */}
          <button
            onClick={handleGoogleReview}
            className="w-full flex items-center justify-center gap-2 font-medium text-dark bg-gray-2 border border-gray-3 py-3 px-4 rounded-md ease-out duration-200 hover:bg-gray-3 hover:border-gray-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-sm">
              {isRTL ? "قيّم على جوجل" : "Rate on Google"}
            </span>
          </button>

          {/* WhatsApp Button */}
          <button
            onClick={handleWhatsAppSend}
            className="w-full flex items-center justify-center gap-2 font-medium text-white bg-[#25D366] py-3 px-4 rounded-md ease-out duration-200 hover:bg-[#20BA5A]"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span className="text-sm">
              {isRTL ? "أرسل على واتساب" : "Send on WhatsApp"}
            </span>
          </button>
        </div>

        {/* Login note for non-authenticated users */}
        {!user && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-start gap-2">
              <span className="text-lg flex-shrink-0">💡</span>
              <p className="text-gray-6 text-xs leading-relaxed">
                {isRTL
                  ? "سجل دخولك أولاً لإرسال رقم هاتفك تلقائياً"
                  : "Login first to automatically include your phone number"}
              </p>
            </div>
          </div>
        )}

        {/* Trust badges */}
        <div className="mt-5 pt-5 border-t border-gray-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-5 text-xs">
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                {isRTL ? "خصم فوري وحصري" : "Instant exclusive discount"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-5 text-xs">
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{isRTL ? "سهل وسريع" : "Quick & easy process"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleRatingPromo;
