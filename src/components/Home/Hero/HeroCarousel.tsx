"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css/pagination";
import "swiper/css";

import Image from "next/image";
import { Link } from "@/app/i18n/navigation";
import { useLocale } from "next-intl";
import { getLimitedTimeOfferProducts } from "@/services/apiProducts";
import { useQuery } from "@tanstack/react-query";

const HeroCarousal = () => {
  const locale = useLocale();
  const {
    data: limitedTimeProducts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["limitedTimeOfferProducts"],
    queryFn: getLimitedTimeOfferProducts,
  });

  // Fallback data if no products available
  const fallbackProducts = [
    {
      id: 1,
      name_en: "True Wireless Noise Cancelling Headphone",
      name_ar: "سماعات لاسلكية مع إلغاء الضوضاء",
      offer_price: 299,
      price: 399,
      image_url: "/images/hero/hero-01.png",
    },
    {
      id: 2,
      name_en: "iPhone 14 Plus & 14 Pro Max",
      name_ar: "آيفون 14 بلس و 14 برو ماكس",
      offer_price: 699,
      price: 999,
      image_url: "/images/hero/hero-02.png",
    },
  ];

  const productsToShow =
    limitedTimeProducts && limitedTimeProducts.length > 0
      ? limitedTimeProducts.slice(0, 2)
      : fallbackProducts;

  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel"
    >
      {productsToShow.map((product, index) => (
        <SwiperSlide key={product.id}>
          <div className="flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row ">
            <div
              className={`max-w-[394px] py-10 sm:py-15 lg:py-24.5 ${
                locale === "en"
                  ? "pl-4 sm:pl-7.5 lg:pl-12.5"
                  : "pr-4 sm:pr-7.5 lg:pr-12.5"
              }`}
            >
              <div className="flex items-center gap-4 mb-7.5 sm:mb-10">
                <span className="block font-semibold text-heading-3 sm:text-heading-1 text-red">
                  {product.offer_price && product.price > product.offer_price
                    ? Math.round(
                        ((product.price - product.offer_price) /
                          product.price) *
                          100
                      )
                    : 30}
                  %
                </span>
                <span className="block text-dark text-sm sm:text-custom-1 sm:leading-[24px]">
                  {locale === "en" ? "Sale" : "تخفيض"}
                  <br />
                  {locale === "en" ? "Off" : "محدود"}
                </span>
              </div>

              <h1 className="font-semibold text-dark text-xl sm:text-3xl mb-3">
                <Link href={`/shop-details?id=${product.id}`}>
                  {locale === "en" ? product.name_en : product.name_ar}
                </Link>
              </h1>

              <p>
                {locale === "en"
                  ? "Limited time offer - Don't miss this amazing deal!"
                  : "عرض محدود - لا تفوت هذه الفرصة المذهلة!"}
              </p>

              <div className="flex items-center gap-3 mb-4">
                <span className="font-medium text-heading-5 text-red">
                  ${product.offer_price || product.price}
                </span>
                {product.offer_price && product.price > product.offer_price && (
                  <span className="font-medium text-2xl text-dark-4 line-through">
                    ${product.price}
                  </span>
                )}
              </div>

              <Link
                href={`/shop-details?id=${product.id}`}
                className="inline-flex font-medium text-white text-custom-sm rounded-md bg-dark py-3 px-9 ease-out duration-200 hover:bg-blue mt-10"
              >
                {locale === "en" ? "Shop Now" : "تسوق الآن"}
              </Link>
            </div>

            <div>
              <Image
                src={
                  Array.isArray(product.image_url)
                    ? product.image_url[0]
                    : product.image_url
                }
                alt={locale === "en" ? product.name_en : product.name_ar}
                width={351}
                height={358}
                className="object-cover"
              />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroCarousal;
