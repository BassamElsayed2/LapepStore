"use client";
import React, { useRef, useState, useEffect } from "react";
import { useLimitedOffers } from "@/hooks/useProducts";
import { useLocale } from "next-intl";
import ProductItem from "@/components/Common/ProductItem";
import Image from "next/image";
import DynamicSlider from "@/components/Common/DynamicSlider";

const OffersSlider = () => {
  const locale = useLocale();
  const sliderRef = useRef<any>(null);
  const [slidesToShow, setSlidesToShow] = useState(1); // Start with 1 for mobile-first
  const [isMounted, setIsMounted] = useState(false);

  const { data: productsData, isLoading, error } = useLimitedOffers();

  // عكس ترتيب المنتجات لعرض الأحدث أولاً
  const products = productsData ? [...productsData].reverse() : [];

  // Calculate initial slidesToShow based on window width
  useEffect(() => {
    const calculateSlidesToShow = () => {
      if (typeof window === "undefined") return 1;

      const width = window.innerWidth;
      if (width >= 1280) return 4;
      if (width >= 1024) return 3;
      if (width >= 768) return 2;
      if (width >= 640) return 2;
      return 1;
    };

    // Set initial value
    setSlidesToShow(calculateSlidesToShow());
    setIsMounted(true);

    // Update on resize
    const handleResize = () => {
      setSlidesToShow(calculateSlidesToShow());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Don't render if no products
  if (!isLoading && (!products || products.length === 0)) {
    return null;
  }

  return (
    <section className="overflow-hidden pt-17.5">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 pb-15 border-b border-gray-3">
        <div className="react-slick offers-carousel common-carousel">
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
                    stroke="#92b18c"
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
              <button
                onClick={() => sliderRef.current?.slickPrev()}
                className="swiper-button-prev"
              >
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

              <button
                onClick={() => sliderRef.current?.slickNext()}
                className="swiper-button-next"
              >
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
          {!isLoading &&
            !error &&
            products &&
            products.length > 0 &&
            isMounted && (
              <DynamicSlider
                ref={sliderRef}
                slidesToShow={slidesToShow}
                slidesToScroll={1}
                infinite={true}
                arrows={false}
                dots={false}
                key={slidesToShow}
                responsive={[
                  {
                    breakpoint: 1280,
                    settings: {
                      slidesToShow: 3,
                      slidesToScroll: 1,
                    },
                  },
                  {
                    breakpoint: 1024,
                    settings: {
                      slidesToShow: 2,
                      slidesToScroll: 1,
                    },
                  },
                  {
                    breakpoint: 768,
                    settings: {
                      slidesToShow: 2,
                      slidesToScroll: 1,
                    },
                  },
                  {
                    breakpoint: 640,
                    settings: {
                      slidesToShow: 1,
                      slidesToScroll: 1,
                    },
                  },
                  {
                    breakpoint: 480,
                    settings: {
                      slidesToShow: 1,
                      slidesToScroll: 1,
                    },
                  },
                ]}
              >
                {products.map((product, index) => (
                  <div key={product.id || index} className="px-3">
                    <ProductItem item={product} />
                  </div>
                ))}
              </DynamicSlider>
            )}
        </div>
      </div>
    </section>
  );
};

export default OffersSlider;
