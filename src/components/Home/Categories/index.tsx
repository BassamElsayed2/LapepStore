"use client";
import { useRef, useState, useEffect } from "react";
import SingleItem from "./SingleItem";
import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/apiCat";
import DynamicSlider from "@/components/Common/DynamicSlider";

const Categories = () => {
  const locale = useLocale();
  const sliderRef = useRef<any>(null);
  const [slidesToShow, setSlidesToShow] = useState(2); // Start with 2 for mobile-first
  const [isMounted, setIsMounted] = useState(false);

  // Calculate initial slidesToShow based on window width
  useEffect(() => {
    const calculateSlidesToShow = () => {
      if (typeof window === "undefined") return 2;

      const width = window.innerWidth;
      if (width >= 1280) return 6;
      if (width >= 1024) return 4;
      if (width >= 768) return 3;
      if (width >= 640) return 2;
      if (width >= 480) return 2;
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

  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    retry: (failureCount, error: any) => {
      // Don't retry on 429 (Too Many Requests)
      if (error?.isRateLimit || error?.status === 429) {
        return false;
      }
      // Retry up to 1 time for other errors
      return failureCount < 1;
    },
    retryDelay: (attemptIndex, error: any) => {
      // If it's a rate limit error, use the retry-after header value
      if (error?.isRateLimit || error?.status === 429) {
        return error.retryAfter || 60000; // Default 60 seconds
      }
      // Exponential backoff for other errors
      return Math.min(1000 * 2 ** attemptIndex, 30000);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - categories don't change often
  });

  return (
    <section className="overflow-hidden pt-17.5">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 pb-15 border-b border-gray-3">
        <div className="react-slick-categories categories-carousel common-carousel">
          {/* <!-- section title --> */}
          <div className="mb-10 flex items-center justify-between">
            <div>
              <span className="flex items-center gap-2.5 font-medium text-green-dark mb-1.5 ">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_834_7356)">
                    <path
                      d="M3.94024 13.4474C2.6523 12.1595 2.00832 11.5155 1.7687 10.68C1.52908 9.84449 1.73387 8.9571 2.14343 7.18231L2.37962 6.15883C2.72419 4.66569 2.89648 3.91912 3.40771 3.40789C3.91894 2.89666 4.66551 2.72437 6.15865 2.3798L7.18213 2.14361C8.95692 1.73405 9.84431 1.52927 10.6798 1.76889C11.5153 2.00851 12.1593 2.65248 13.4472 3.94042L14.9719 5.46512C17.2128 7.70594 18.3332 8.82635 18.3332 10.2186C18.3332 11.6109 17.2128 12.7313 14.9719 14.9721C12.7311 17.2129 11.6107 18.3334 10.2184 18.3334C8.82617 18.3334 7.70576 17.2129 5.46494 14.9721L3.94024 13.4474Z"
                      stroke="#92b18c"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="7.17245"
                      cy="7.39917"
                      r="1.66667"
                      transform="rotate(-45 7.17245 7.39917)"
                      stroke=" #92b18c"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M9.61837 15.4164L15.4342 9.6004"
                      stroke="#92b18c"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_834_7356">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                {locale === "ar" ? "الاقسام" : "Categories"}
              </span>
              <h2 className="font-semibold text-lg xl:text-heading-5 text-dark">
                {locale === "ar" ? "تصفح حسب النوع" : "Browse by Category"}
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

          {isMounted && (
            <DynamicSlider
              ref={sliderRef}
              slidesToShow={slidesToShow}
              slidesToScroll={1}
              infinite={true}
              arrows={false}
              dots={false}
              rtl={locale === "ar"}
              key={slidesToShow}
              responsive={[
                {
                  breakpoint: 1280,
                  settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                  },
                },
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                  },
                },
                {
                  breakpoint: 768,
                  settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                  },
                },
                {
                  breakpoint: 640,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                  },
                },
                {
                  breakpoint: 480,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                  },
                },
                {
                  breakpoint: 375,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                  },
                },
              ]}
            >
              {categories?.map((item, key) => (
                <div key={key} className="px-2">
                  <SingleItem item={item} />
                </div>
              ))}
            </DynamicSlider>
          )}
        </div>
      </div>
    </section>
  );
};

export default Categories;
