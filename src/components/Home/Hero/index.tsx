"use client";
import React from "react";
import HeroCarousel from "./HeroCarousel";
import HeroFeature from "./HeroFeature";
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

const Hero = () => {
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

  return (
    <section className="overflow-hidden mt-10">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="flex flex-wrap gap-5">
          <div className="xl:max-w-[757px] w-full">
            <div className="relative z-1 rounded-[10px] bg-white overflow-hidden">
              {/* <!-- bg shapes --> */}

              <HeroCarousel />
            </div>
          </div>

          <div className="xl:max-w-[393px] w-full">
            <div className="flex flex-col sm:flex-row xl:flex-col gap-5">
              {productsToShow.map((product, index) => (
                <div
                  key={product.id}
                  className="w-full relative rounded-[10px] bg-gradient-to-r from-[#fff] to-[#f4f1f1]  "
                >
                  <div className="flex items-center justify-between gap-14">
                    <div className="p-2">
                      <h2 className="max-w-[153px] font-semibold text-dark text-xl mb-10">
                        <Link href={`/shop-details?id=${product.id}`}>
                          {locale === "en" ? product.name_en : product.name_ar}
                        </Link>
                      </h2>

                      <div>
                        <p className="font-medium text-dark-4 text-custom-sm mb-1.5">
                          {productType === "offer"
                            ? locale === "en"
                              ? "Limited time offer"
                              : "عرض محدود"
                            : productType === "bestSeller"
                            ? locale === "en"
                              ? "Best Seller"
                              : "الأكثر مبيعاً"
                            : locale === "en"
                            ? "Featured Product"
                            : "منتج مميز"}
                        </p>
                        <span className="flex items-center gap-3">
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
                                {product.price}{" "}
                                {locale === "ar" ? "جنية" : "Pound"}
                              </span>
                            )}
                        </span>
                      </div>
                    </div>

                    <div>
                      <Image
                        src={
                          Array.isArray(product.image_url)
                            ? product.image_url[0]
                            : product.image_url
                        }
                        alt={
                          locale === "en" ? product.name_en : product.name_ar
                        }
                        width={153}
                        height={170}
                        className="object-cover rounded"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Hero features --> */}
      {/* <HeroFeature /> */}
    </section>
  );
};

export default Hero;
