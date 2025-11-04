"use client";
import React from "react";
import SingleItem from "./SingleItem";
import Image from "next/image";
import Link from "next/link";
import shopData from "@/components/Shop/shopData";
import { useLocale } from "next-intl";
import { useBestSellers } from "@/hooks/useProducts";

const BestSeller = () => {
  const locale = useLocale();

  const {
    data: products,
    isLoading,
    error,
  } = useBestSellers();

  return (
    <section className="overflow-hidden">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* <!-- section title --> */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <span className="flex items-center gap-2.5 font-medium text-green-dark mb-1.5">
              <Image
                src="/images/icons/icon-07.svg"
                alt="icon"
                width={17}
                height={17}
              />
              {locale === "ar" ? "هذا الشهر" : "This Month"}
            </span>
            <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">
              {locale === "ar" ? "المنتجات الأكثر مبيعا" : "Best Sellers"}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7.5">
          {/* <!-- Best Sellers item --> */}
          {isLoading ? (
            <div className="col-span-full text-center py-8">
              {locale === "ar" ? "جاري التحميل..." : "Loading..."}
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-8 text-red-500">
              {locale === "ar"
                ? "حدث خطأ في تحميل البيانات"
                : "Error loading data"}
            </div>
          ) : products && products.length > 0 ? (
            products
              .slice(0, 6)
              .map((item, key) => <SingleItem item={item} key={key} />)
          ) : (
            <div className="col-span-full text-center py-8">
              {locale === "ar"
                ? "لا توجد منتجات متاحة"
                : "No products available"}
            </div>
          )}
        </div>

        <div className="text-center mt-12.5">
          <Link
            href={`/${locale}/shop`}
            className="inline-flex font-medium text-custom-sm py-3 px-7 sm:px-12.5 rounded-md border-gray-3 border text-gray-1 bg-green-dark ease-out duration-200 hover:bg-green hover:text-white hover:border-transparent"
          >
            {locale === "ar" ? "عرض الكل" : "View All"}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSeller;
