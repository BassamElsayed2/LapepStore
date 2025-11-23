"use client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Image from "next/image";
import { Link } from "@/app/i18n/navigation";
import { useLocale } from "next-intl";
import {
  getLimitedTimeOfferProducts,
  getBestSellerProducts,
  getProducts,
} from "@/services/apiProducts";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types/product";

const HeroCarousal = () => {
  const locale = useLocale();

  // Fetch products with offer first
  const { data: offerProducts, isLoading: isLoadingOffers } = useQuery({
    queryKey: ["limitedTimeOfferProducts"],
    queryFn: getLimitedTimeOfferProducts,
  });

  // Fetch best sellers as fallback
  const { data: bestSellerProducts, isLoading: isLoadingBestSellers } =
    useQuery({
      queryKey: ["bestSellerProducts"],
      queryFn: getBestSellerProducts,
      enabled:
        !isLoadingOffers && (!offerProducts || offerProducts.length === 0),
    });

  // Fetch random products as final fallback
  const { data: randomProducts, isLoading: isLoadingRandom } = useQuery({
    queryKey: ["randomProducts"],
    queryFn: () => getProducts({ limit: 10 }),
    enabled:
      !isLoadingOffers &&
      !isLoadingBestSellers &&
      (!offerProducts || offerProducts.length === 0) &&
      (!bestSellerProducts || bestSellerProducts.length === 0),
  });

  // Determine which products to show based on priority
  let productsToShow: Product[] = [];
  let productType: "offer" | "bestSeller" | "random" = "random";

  if (offerProducts && offerProducts.length > 0) {
    productsToShow = offerProducts.slice(0, 2);
    productType = "offer";
  } else if (bestSellerProducts && bestSellerProducts.length > 0) {
    productsToShow = bestSellerProducts.slice(0, 2);
    productType = "bestSeller";
  } else if (randomProducts && randomProducts.length > 0) {
    productsToShow = randomProducts.slice(0, 2);
    productType = "random";
  }

  const isLoading = isLoadingOffers || isLoadingBestSellers || isLoadingRandom;

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[358px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-dark"></div>
      </div>
    );
  }

  // Show empty state if no products found
  if (productsToShow.length === 0) {
    return (
      <div className="flex items-center justify-center h-[358px] p-6">
        <div className="text-center">
          <p className="text-lg text-dark-4">
            {locale === "en"
              ? "No products available at the moment"
              : "لا توجد منتجات متاحة في الوقت الحالي"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Slider
      slidesToShow={1}
      slidesToScroll={1}
      infinite={true}
      autoplay={true}
      autoplaySpeed={3500}
      arrows={false}
      dots={true}
      className="hero-carousel"
    >
      {productsToShow.map((product, index) => (
        <div key={product.id}>
          <div className="flex items-center justify-between pt-6 sm:pt-0 flex-col-reverse sm:flex-row bg-gradient-to-r from-[#fff] to-[#f4f1f1] ">
            <div
              className={`max-w-[394px] flex flex-col items-center justify-center md:block  ${
                locale === "en"
                  ? "pl-4 sm:pl-7.5 lg:pl-12.5"
                  : "pr-4 sm:pr-7.5 lg:pr-12.5"
              }`}
            >
              {product.offer_price !== null &&
                product.offer_price !== undefined &&
                product.offer_price > 0 &&
                product.price > product.offer_price && (
                  <div className="flex items-center gap-4 mb-7.5 sm:mb-10">
                    <span className="block font-semibold text-heading-3 sm:text-heading-1 text-red">
                      {Math.round(
                        ((product.price - product.offer_price) /
                          product.price) *
                          100
                      )}
                      %
                    </span>
                    <span className="block text-dark text-sm sm:text-custom-1 sm:leading-[24px]">
                      {locale === "en" ? "Sale" : "تخفيض"}
                      <br />
                      {locale === "en" ? "Off" : "محدود"}
                    </span>
                  </div>
                )}

              <h1 className="font-semibold text-dark text-xl sm:text-3xl mb-3 sm:text-center mt-2">
                <Link href={`/shop-details?id=${product.id}`}>
                  {locale === "en" ? product.name_en : product.name_ar}
                </Link>
              </h1>

              <p className="text-sm sm:text-base text-center sm:text-left">
                {productType === "offer"
                  ? locale === "en"
                    ? "Limited time offer - Don't miss this amazing deal!"
                    : "عرض محدود - لا تفوت هذه الفرصة المذهلة!"
                  : productType === "bestSeller"
                  ? locale === "en"
                    ? "Best Seller - Most popular product!"
                    : "الأكثر مبيعاً - المنتج الأكثر شهرة!"
                  : locale === "en"
                  ? "Discover our amazing products!"
                  : "اكتشف منتجاتنا المميزة!"}
              </p>

              <div className="flex items-center gap-3 mb-4">
                <span className="font-medium text-heading-5 text-red">
                  {product.offer_price !== null &&
                  product.offer_price !== undefined &&
                  product.offer_price > 0
                    ? product.offer_price
                    : product.price}{" "}
                  {locale === "ar" ? "جنية" : "Pound"}
                </span>
                {product.offer_price !== null &&
                  product.offer_price !== undefined &&
                  product.offer_price > 0 &&
                  product.price > product.offer_price && (
                    <span className="font-medium text-2xl text-dark-4 line-through">
                      {product.price} {locale === "ar" ? "جنية" : "Pound"}
                    </span>
                  )}
              </div>

              <Link
                href={`/shop-details?id=${product.id}`}
                className="inline-flex font-medium text-white text-custom-sm rounded-md bg-green-dark py-3 px-9 ease-out duration-200 hover:bg-green mt-10 mb-10"
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
                className="object-cover rounded-[30px]"
              />
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default HeroCarousal;
