"use client";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { getTestimonials } from "@/services/apiTestimonials";
import { TestimonialData } from "@/types/testimonial";
import SingleItem from "./SingleItem";
import DynamicSlider from "@/components/Common/DynamicSlider";

const Testimonials = () => {
  const sliderRef = useRef<any>(null);
  const t = useTranslations("testimonials");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await getTestimonials();
        setTestimonials(data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Don't render the section if there are no testimonials
  if (loading) {
    return null;
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden pb-16.5">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="">
          <div className="swiper testimonial-carousel common-carousel p-5">
            {/* <!-- section title --> */}
            <div className="mb-10 flex items-center justify-between">
              <div>
                <span className="flex items-center gap-2.5 font-medium text-dark mb-1.5">
                  <Image
                    src="/images/icons/icon-08.svg"
                    alt="icon"
                    width={17}
                    height={17}
                  />
                  {t("title")}
                </span>
                <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">
                  {t("userFeedbacks")}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <div
                  onClick={() =>
                    isRTL
                      ? sliderRef.current?.slickNext()
                      : sliderRef.current?.slickPrev()
                  }
                  className="swiper-button-prev"
                >
                  <svg
                    className="fill-current"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ transform: isRTL ? "scaleX(-1)" : "none" }}
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M15.4881 4.43057C15.8026 4.70014 15.839 5.17361 15.5694 5.48811L9.98781 12L15.5694 18.5119C15.839 18.8264 15.8026 19.2999 15.4881 19.5695C15.1736 19.839 14.7001 19.8026 14.4306 19.4881L8.43056 12.4881C8.18981 12.2072 8.18981 11.7928 8.43056 11.5119L14.4306 4.51192C14.7001 4.19743 15.1736 4.161 15.4881 4.43057Z"
                      fill=""
                    />
                  </svg>
                </div>

                <div
                  onClick={() =>
                    isRTL
                      ? sliderRef.current?.slickPrev()
                      : sliderRef.current?.slickNext()
                  }
                  className="swiper-button-next"
                >
                  <svg
                    className="fill-current"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ transform: isRTL ? "scaleX(-1)" : "none" }}
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.51192 4.43057C8.82641 4.161 9.29989 4.19743 9.56946 4.51192L15.5695 11.5119C15.8102 11.7928 15.8102 12.2072 15.5695 12.4881L9.56946 19.4881C9.29989 19.8026 8.82641 19.839 8.51192 19.5695C8.19743 19.2999 8.161 18.8264 8.43057 18.5119L14.0122 12L8.43057 5.48811C8.161 5.17361 8.19743 4.70014 8.51192 4.43057Z"
                      fill=""
                    />
                  </svg>
                </div>
              </div>
            </div>

            <DynamicSlider
              ref={sliderRef}
              slidesToShow={3}
              slidesToScroll={1}
              infinite={false}
              arrows={false}
              dots={false}
              rtl={isRTL}
              responsive={[
                {
                  breakpoint: 1200,
                  settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                  },
                },
                {
                  breakpoint: 1000,
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
              ]}
            >
              {testimonials.map((item, key) => (
                <div key={item.id} className="px-2">
                  <SingleItem testimonial={item} />
                </div>
              ))}
            </DynamicSlider>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
