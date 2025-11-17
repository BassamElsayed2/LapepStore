"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { getBanners, Banner } from "@/services/apiBanners";
import { sanitizeHtml } from "@/utils/sanitize";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

const PromoBanner = () => {
  const locale = useLocale();
  const [currentLocale, setCurrentLocale] = useState(locale);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const isRTL = currentLocale === "ar";

  // Monitor locale changes
  useEffect(() => {
    setCurrentLocale(locale);
  }, [locale]);

  // Fetch banners from database
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const bannersData = await getBanners();
        setBanners(bannersData);
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <section className="overflow-hidden py-20">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue"></div>
          </div>
        </div>
      </section>
    );
  }

  // Main banner (first banner)
  const mainBanner = banners.length > 0 ? banners[0] : null;
  const sideBanners = banners.length > 1 ? banners.slice(1, 3) : [];

  return (
    <section className="overflow-hidden py-20">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* Main Promo Banner with Slider */}
        <div className="mb-7.5 rounded-lg bg-gradient-to-r from-[#F5F5F7] to-[#E8E8EA] overflow-hidden">
          <Swiper
            modules={[Autoplay, Pagination, Navigation, EffectFade]}
            spaceBetween={0}
            slidesPerView={1}
            effect="fade"
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={true}
            loop={true}
            className="promo-swiper"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {mainBanner ? (
              <SwiperSlide>
                <div className="flex flex-col md:flex-row items-center gap-8 px-6 py-8 min-h-[350px]">
                  <div
                    className={`flex-1 ${isRTL ? "text-right" : "text-left"} animate-fade-in-up`}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(
                          isRTL
                            ? mainBanner.desc_ar || ""
                            : mainBanner.desc_en || ""
                        ),
                      }}
                      className="force-font mb-6"
                    />
                    <Link
                      href={`/${currentLocale}/shop`}
                      className="inline-flex font-medium text-custom-sm text-white bg-blue py-[11px] px-9.5 rounded-md ease-out duration-200 hover:bg-blue-dark hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                    >
                      {isRTL ? "شراء الآن" : "Buy Now"}
                    </Link>
                  </div>

                  <div className="flex-shrink-0 animate-fade-in-right">
                    <img
                      src={mainBanner.image || "/images/promo/promo-01.png"}
                      alt="promo img"
                      className="h-[300px] w-[450px] object-contain transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              </SwiperSlide>
            ) : (
              <SwiperSlide>
                <div className="flex flex-col md:flex-row items-center gap-8 px-6 py-8 min-h-[350px]">
                  <div className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
                    <span className="block font-medium text-xl text-dark mb-3">
                      {isRTL ? "آيفون 14 بلس" : "Apple iPhone 14 Plus"}
                    </span>
                    <h2 className="font-bold text-xl lg:text-heading-4 xl:text-heading-3 text-dark mb-5">
                      {isRTL ? "أعلى 30% تخفيض" : "UP TO 30% OFF"}
                    </h2>
                    <p className="mb-6">
                      {isRTL
                        ? "آيفون 14 لديه نفس المعالج السريع المتطور الذي يستخدم في آيفون 13 برو، A15 Bionic، مع GPU 5-core يقوم بتشغيل جميع الميزات الأحدث."
                        : "iPhone 14 has the same superspeedy chip that's in iPhone 13 Pro, A15 Bionic, with a 5‑core GPU, powers all the latest features."}
                    </p>
                    <Link
                      href={`/${currentLocale}/shop`}
                      className="inline-flex font-medium text-custom-sm text-white bg-blue py-[11px] px-9.5 rounded-md ease-out duration-200 hover:bg-blue-dark hover:shadow-lg"
                    >
                      {isRTL ? "شراء الآن" : "Buy Now"}
                    </Link>
                  </div>
                  <div className="flex-shrink-0">
                    <img
                      src="/images/promo/promo-01.png"
                      alt="promo img"
                      className="h-[300px] w-[450px]"
                    />
                  </div>
                </div>
              </SwiperSlide>
            )}
          </Swiper>
        </div>

        {/* Side Banners Grid */}
        <div className="grid gap-7.5 grid-cols-1 lg:grid-cols-2">
          {/* Promo Banner Small 1 */}
          <div className="group flex flex-col md:flex-row items-center gap-4 rounded-lg bg-[#DBF4F3] py-4 px-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex-shrink-0 overflow-hidden rounded-lg">
              <Image
                src={
                  sideBanners[0]?.image || "/images/promo/promo-02.png"
                }
                alt="promo img"
                width={241}
                height={241}
                className="transform group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            <div
              className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}
            >
              {sideBanners[0] ? (
                <>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(
                        isRTL
                          ? sideBanners[0].desc_ar || ""
                          : sideBanners[0].desc_en || ""
                      ),
                    }}
                    className="mb-4"
                  />
                  <Link
                    href={`/${currentLocale}/shop`}
                    className="inline-flex font-medium text-custom-sm text-white bg-teal py-2.5 px-8.5 rounded-md ease-out duration-200 hover:bg-teal-dark hover:shadow-md transform hover:-translate-x-1 transition-all"
                  >
                    {isRTL ? "الآن" : "Grab Now"}
                  </Link>
                </>
              ) : (
                <>
                  <span className="block text-lg text-dark mb-1.5">
                    {isRTL
                      ? "مشاية متحركة قابلة للطي"
                      : "Foldable Motorised Treadmill"}
                  </span>
                  <h2 className="font-bold text-xl lg:text-heading-4 text-dark mb-2.5">
                    {isRTL ? "تمرين في المنزل" : "Workout At Home"}
                  </h2>
                  <p className="font-semibold text-custom-1 text-teal mb-4">
                    {isRTL ? "تخفيض 20%" : "Flat 20% off"}
                  </p>
                  <Link
                    href={`/${currentLocale}/shop`}
                    className="inline-flex font-medium text-custom-sm text-white bg-teal py-2.5 px-8.5 rounded-md ease-out duration-200 hover:bg-teal-dark"
                  >
                    {isRTL ? "الآن" : "Grab Now"}
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Promo Banner Small 2 */}
          <div className="group flex flex-col md:flex-row items-center gap-4 rounded-lg bg-[#FFECE1] py-4 px-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex-shrink-0 overflow-hidden rounded-lg">
              <Image
                src={
                  sideBanners[1]?.image || "/images/promo/promo-03.png"
                }
                alt="promo img"
                width={200}
                height={200}
                className="transform group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            <div
              className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}
            >
              {sideBanners[1] ? (
                <>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(
                        isRTL
                          ? sideBanners[1].desc_ar || ""
                          : sideBanners[1].desc_en || ""
                      ),
                    }}
                    className="mb-4"
                  />
                  <Link
                    href={`/${currentLocale}/shop`}
                    className="inline-flex font-medium text-custom-sm text-white bg-orange py-2.5 px-8.5 rounded-md ease-out duration-200 hover:bg-orange-dark hover:shadow-md transform hover:-translate-x-1 transition-all"
                  >
                    {isRTL ? "شراء الآن" : "Buy Now"}
                  </Link>
                </>
              ) : (
                <>
                  <span className="block text-lg text-dark mb-1.5">
                    {isRTL ? "ساعة آبل أولترا" : "Apple Watch Ultra"}
                  </span>
                  <h2 className="font-bold text-xl lg:text-heading-4 text-dark mb-2.5">
                    {isRTL ? "خصم يصل إلى 40%" : "Up to 40% off"}
                  </h2>
                  <p className="max-w-[285px] text-custom-sm mb-4">
                    {isRTL
                      ? "الحالة الفضائية من التيتانيوم تحقق التوازن المثالي لكل شيء."
                      : "The aerospace-grade titanium case strikes the perfect balance of everything."}
                  </p>
                  <Link
                    href={`/${currentLocale}/shop`}
                    className="inline-flex font-medium text-custom-sm text-white bg-orange py-2.5 px-8.5 rounded-md ease-out duration-200 hover:bg-orange-dark"
                  >
                    {isRTL ? "شراء الآن" : "Buy Now"}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .promo-swiper .swiper-button-next,
        .promo-swiper .swiper-button-prev {
          color: #0063F7;
          background: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .promo-swiper .swiper-button-next:after,
        .promo-swiper .swiper-button-prev:after {
          font-size: 16px;
        }

        .promo-swiper .swiper-pagination-bullet {
          background: #0063F7;
          opacity: 0.5;
        }

        .promo-swiper .swiper-pagination-bullet-active {
          opacity: 1;
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-fade-in-right {
          animation: fade-in-right 0.6s ease-out 0.2s both;
        }
      `}</style>
    </section>
  );
};

export default PromoBanner;
