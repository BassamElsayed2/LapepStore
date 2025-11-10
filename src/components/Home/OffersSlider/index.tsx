"use client";
import React, { useCallback, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useLimitedOffers } from "@/hooks/useProducts";
import { useLocale } from "next-intl";
import ProductItem from "@/components/Common/ProductItem";
import Image from "next/image";

// Import Swiper styles
import "swiper/css/navigation";
import "swiper/css";

const OffersSlider = () => {
  const locale = useLocale();
  const sliderRef = useRef<any>(null);

  const { data: products, isLoading, error } = useLimitedOffers();

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  // Don't render if no products
  if (!isLoading && (!products || products.length === 0)) {
    return null;
  }

  return (
    <section className="overflow-hidden pt-17.5">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 pb-15 border-b border-gray-3">
        <div className="swiper offers-carousel common-carousel">
          {/* Section title */}
          <div className="mb-10 flex items-center justify-between">
            <div>
              <span className="flex items-center gap-2.5 font-medium text-green-dark mb-1.5">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 3.33325V9.99992L13.3333 13.3333M17.5 9.99992C17.5 14.1419 14.1421 17.4999 10 17.4999C5.85786 17.4999 2.5 14.1419 2.5 9.99992C2.5 5.85778 5.85786 2.49992 10 2.49992C14.1421 2.49992 17.5 5.85778 17.5 9.99992Z"
                    stroke="#22AD5C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {locale === "ar" ? "عروض محدودة" : "Limited Time Offers"}
              </span>
              <h2 className="font-semibold text-lg xl:text-heading-5 text-dark">
                {locale === "ar"
                  ? "عروض خاصة لفترة محدودة"
                  : "Special Offers - Limited Time"}
              </h2>
            </div>

            <div
              className={`flex items-center gap-3 ${
                locale === "ar" ? "flex-row-reverse" : ""
              }`}
            >
              <button onClick={handlePrev} className="swiper-button-prev">
                <svg
                  className="fill-current"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.4881 4.43057C15.8026 4.70014 15.839 5.17361 15.5694 5.48811L9.98781 12L15.5694 18.5119C15.839 18.8264 15.8026 19.2999 15.4881 19.5695C15.1736 19.839 14.7001 19.8026 14.4306 19.4881L8.43056 12.4881C8.18981 12.2072 8.18981 11.7928 8.43056 11.5119L14.4306 4.51192C14.7001 4.19743 15.1736 4.161 15.4881 4.43057Z"
                    fill=""
                  />
                </svg>
              </button>

              <button onClick={handleNext} className="swiper-button-next">
                <svg
                  className="fill-current"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.51192 4.43057C8.82641 4.161 9.29989 4.19743 9.56946 4.51192L15.5695 11.5119C15.8102 11.7928 15.8102 12.2072 15.5695 12.4881L9.56946 19.4881C9.29989 19.8026 8.82641 19.839 8.51192 19.5695C8.19743 19.2999 8.161 18.8264 8.43057 18.5119L14.0122 12L8.43057 5.48811C8.161 5.17361 8.19743 4.70014 8.51192 4.43057Z"
                    fill=""
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-dark border-t-transparent"></div>
              <p className="mt-4 text-dark-4">
                {locale === "ar" ? "جاري التحميل..." : "Loading..."}
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20">
              <p className="text-red">
                {locale === "ar"
                  ? "حدث خطأ في تحميل العروض"
                  : "Error loading offers"}
              </p>
            </div>
          )}

          {/* Products Slider */}
          {!isLoading && !error && products && products.length > 0 && (
            <Swiper
              ref={sliderRef}
              slidesPerView={4}
              spaceBetween={30}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 25,
                },
                1280: {
                  slidesPerView: 4,
                  spaceBetween: 30,
                },
              }}
            >
              {products.map((product, index) => (
                <SwiperSlide key={product.id || index}>
                  <ProductItem item={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </section>
  );
};

export default OffersSlider;
