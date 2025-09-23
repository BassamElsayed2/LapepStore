"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import Link from "next/link";
import { getBanners, Banner } from "@/services/apiBanners";

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

  return (
    <section className="overflow-hidden py-20">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* <!-- promo banner big --> */}
        <div className="flex flex-col md:flex-row items-center gap-8 rounded-lg bg-[#F5F5F7] px-2 mb-7.5">
          <div className={`flex-1 pt-5 ${isRTL ? "text-right" : "text-left"}`}>
            {banners.length > 0 ? (
              <>
                <div
                  dangerouslySetInnerHTML={{
                    __html: isRTL
                      ? banners[0].desc_ar || ""
                      : banners[0].desc_en || "",
                  }}
                />
                <Link
                  href={`/${currentLocale}/shop`}
                  className="inline-flex font-medium text-custom-sm text-white bg-blue py-[11px] px-9.5 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
                >
                  {isRTL ? "شراء الآن" : "Buy Now"}
                </Link>
              </>
            ) : (
              <>
                <span className="block font-medium text-xl text-dark mb-3">
                  {isRTL ? "آيفون 14 بلس" : "Apple iPhone 14 Plus"}
                </span>

                <h2 className="font-bold text-xl lg:text-heading-4 xl:text-heading-3 text-dark mb-5">
                  {isRTL ? "أعلى 30% تخفيض" : "UP TO 30% OFF"}
                </h2>

                <p>
                  {isRTL
                    ? "آيفون 14 لديه نفس المعالج السريع المتطور الذي يستخدم في آيفون 13 برو، A15 Bionic، مع GPU 5-core يقوم بتشغيل جميع الميزات الأحدث."
                    : "iPhone 14 has the same superspeedy chip that's in iPhone 13 Pro, A15 Bionic, with a 5‑core GPU, powers all the latest features."}
                </p>

                <Link
                  href={`/${currentLocale}/shop`}
                  className="inline-flex font-medium text-custom-sm text-white bg-blue py-[11px] px-9.5 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
                >
                  {isRTL ? "شراء الآن" : "Buy Now"}
                </Link>
              </>
            )}
          </div>

          <div className="flex-shrink-0">
            <Image
              src={
                banners.length > 0 && banners[0].image
                  ? banners[0].image
                  : "/images/promo/promo-01.png"
              }
              alt="promo img"
              width={274}
              height={350}
            />
          </div>
        </div>

        <div className="grid gap-7.5 grid-cols-1 lg:grid-cols-2">
          {/* <!-- promo banner small --> */}
          <div className="flex flex-col md:flex-row items-center gap-4 rounded-lg bg-[#DBF4F3] py-2 px-2">
            <div className="flex-shrink-0">
              <Image
                src={
                  banners.length > 1 && banners[1].image
                    ? banners[1].image
                    : "/images/promo/promo-02.png"
                }
                alt="promo img"
                width={241}
                height={241}
              />
            </div>

            <div
              className={`flex-1 pb-5 ${isRTL ? "text-right" : "text-left"}`}
            >
              {banners.length > 1 ? (
                <>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: isRTL
                        ? banners[1].desc_ar || ""
                        : banners[1].desc_en || "",
                    }}
                  />
                  <Link
                    href={`/${currentLocale}/shop`}
                    className="inline-flex font-medium text-custom-sm text-white bg-teal py-2.5 px-8.5 rounded-md ease-out duration-200 hover:bg-teal-dark mt-9"
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

                  <p className="font-semibold text-custom-1 text-teal">
                    {isRTL ? "تخفيض 20%" : "Flat 20% off"}
                  </p>

                  <Link
                    href={`/${currentLocale}/shop`}
                    className="inline-flex font-medium text-custom-sm text-white bg-teal py-2.5 px-8.5 rounded-md ease-out duration-200 hover:bg-teal-dark mt-9"
                  >
                    {isRTL ? "الآن" : "Grab Now"}
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* <!-- promo banner small --> */}
          <div className="flex flex-col md:flex-row items-center gap-4 rounded-lg bg-[#FFECE1] py-2 px-2">
            <div className="flex-shrink-0">
              <Image
                src={
                  banners.length > 2 && banners[2].image
                    ? banners[2].image
                    : "/images/promo/promo-03.png"
                }
                alt="promo img"
                width={200}
                height={200}
              />
            </div>

            <div
              className={`flex-1 pb-5 ${isRTL ? "text-right" : "text-left"}`}
            >
              {banners.length > 2 ? (
                <>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: isRTL
                        ? banners[2].desc_ar || ""
                        : banners[2].desc_en || "",
                    }}
                  />
                  <Link
                    href={`/${currentLocale}/shop`}
                    className="inline-flex font-medium text-custom-sm text-white bg-orange py-2.5 px-8.5 rounded-md ease-out duration-200 hover:bg-orange-dark mt-7.5"
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

                  <p className="max-w-[285px] text-custom-sm">
                    {isRTL
                      ? "الحالة الفضائية من التيتانيوم تحقق التوازن المثالي لكل شيء."
                      : "The aerospace-grade titanium case strikes the perfect balance of everything."}
                  </p>

                  <Link
                    href={`/${currentLocale}/shop`}
                    className="inline-flex font-medium text-custom-sm text-white bg-orange py-2.5 px-8.5 rounded-md ease-out duration-200 hover:bg-orange-dark mt-7.5"
                  >
                    {isRTL ? "شراء الآن" : "Buy Now"}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
