"use client";
import React from "react";
import Image from "next/image";
import { Link } from "@/app/i18n/navigation";
import { useLocale } from "next-intl";

const HeroBanner = () => {
  const locale = useLocale();

  return (
    <section className="overflow-hidden pt-10">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="relative rounded-[10px] overflow-hidden bg-gradient-to-r from-[#f8f9fa] to-[#e9ecef] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[400px] md:min-h-[500px]">
            {/* Content Side */}
            <div
              className={`flex items-center p-8 md:p-12 lg:p-16 ${
                locale === "ar" ? "lg:order-2" : ""
              }`}
            >
              <div
                className={`w-full ${
                  locale === "ar" ? "text-right" : "text-left"
                }`}
              >
                {/* Small tag */}
                <span className="inline-flex items-center gap-2 font-medium text-green-dark mb-3">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.94024 13.4474C2.6523 12.1595 2.00832 11.5155 1.7687 10.68C1.52908 9.84449 1.73387 8.9571 2.14343 7.18231L2.37962 6.15883C2.72419 4.66569 2.89648 3.91912 3.40771 3.40789C3.91894 2.89666 4.66551 2.72437 6.15865 2.3798L7.18213 2.14361C8.95692 1.73405 9.84431 1.52927 10.6798 1.76889C11.5153 2.00851 12.1593 2.65248 13.4472 3.94042L14.9719 5.46512C17.2128 7.70594 18.3332 8.82635 18.3332 10.2186C18.3332 11.6109 17.2128 12.7313 14.9719 14.9721C12.7311 17.2129 11.6107 18.3334 10.2184 18.3334C8.82617 18.3334 7.70576 17.2129 5.46494 14.9721L3.94024 13.4474Z"
                      stroke="#22AD5C"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="7.17245"
                      cy="7.39917"
                      r="1.66667"
                      transform="rotate(-45 7.17245 7.39917)"
                      stroke="#22AD5C"
                      strokeWidth="1.5"
                    />
                  </svg>
                  {locale === "en" ? "Premium Collection" : "مجموعة مميزة"}
                </span>

                {/* Main heading */}
                <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl text-dark mb-4 leading-tight">
                  {locale === "en" ? (
                    <>
                      Discover Your
                      <br />
                      <span className="text-green-dark">Perfect Vape</span>
                    </>
                  ) : (
                    <>
                      اكتشف
                      <br />
                      <span className="text-green-dark">نكهتك المثالية</span>
                    </>
                  )}
                </h1>

                {/* Description */}
                <p className="text-base md:text-lg text-dark-4 mb-6 leading-relaxed">
                  {locale === "en"
                    ? "Explore our premium collection of vapes, e-liquids, and accessories."
                    : "استكشف مجموعتنا المميزة من الفيب والنكهات والإكسسوارات."}
                </p>

                {/* Button */}
                <Link href="/shop">
                  <button className="inline-flex font-medium text-custom-sm py-3 px-7 sm:px-12.5 rounded-md border-gray-3 border text-gray-1 bg-green-dark ease-out duration-200 hover:bg-green hover:text-white hover:border-transparent">
                    {locale === "en" ? "Shop Now" : "تسوق الآن"}
                  </button>
                </Link>

                {/* Features */}
                <div className="flex flex-wrap gap-4 mt-8">
                  <div className="flex items-center gap-2 text-dark-4 text-sm">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 10L8.33333 13.3333L15 6.66667"
                        stroke="#22AD5C"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-medium">
                      {locale === "en" ? "Premium Collection" : "مجموعة مميزة"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-dark-4 text-sm">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 10L8.33333 13.3333L15 6.66667"
                        stroke="#22AD5C"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-medium">
                      {locale === "en" ? "Best Quality" : "أفضل جودة"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-dark-4 text-sm">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 10L8.33333 13.3333L15 6.66667"
                        stroke="#22AD5C"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-medium">
                      {locale === "en" ? "Authentic" : "أصلي 100%"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Side */}
            <div
              className={`relative min-h-[300px] lg:min-h-full ${
                locale === "ar" ? "lg:order-1" : ""
              }`}
            >
              <Image
                src="/images/hero/vape-hero.jpg"
                alt={locale === "en" ? "Vape Collection" : "مجموعة الفيب"}
                fill
                className="object-cover"
                priority
                quality={90}
              />
              {/* Decorative gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-${
                  locale === "ar" ? "l" : "r"
                } from-transparent via-transparent to-[#f8f9fa]/50`}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
