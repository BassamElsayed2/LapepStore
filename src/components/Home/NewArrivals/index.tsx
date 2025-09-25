"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import ProductItem from "@/components/Common/ProductItem";
import shopData from "@/components/Shop/shopData";
import {
  getProducts,
  getLimitedTimeOfferProducts,
} from "@/services/apiProducts";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

const NewArrival = () => {
  const locale = useLocale();
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const {
    data: limitedTimeProducts,
    isLoading: limitedTimeLoading,
    error: limitedTimeError,
  } = useQuery({
    queryKey: ["limitedTimeOfferProducts"],
    queryFn: getLimitedTimeOfferProducts,
  });

  return (
    <section className="overflow-hidden pt-15">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* <!-- section title --> */}
        <div className="mb-7 flex items-center justify-between">
          <div>
            <span className="flex items-center gap-2.5 font-medium text-green-dark mb-1.5 ">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.11826 15.4622C4.11794 16.6668 5.97853 16.6668 9.69971 16.6668H10.3007C14.0219 16.6668 15.8825 16.6668 16.8821 15.4622M3.11826 15.4622C2.11857 14.2577 2.46146 12.429 3.14723 8.77153C3.63491 6.17055 3.87875 4.87006 4.8045 4.10175M3.11826 15.4622C3.11826 15.4622 3.11826 15.4622 3.11826 15.4622ZM16.8821 15.4622C17.8818 14.2577 17.5389 12.429 16.8532 8.77153C16.3655 6.17055 16.1216 4.87006 15.1959 4.10175M16.8821 15.4622C16.8821 15.4622 16.8821 15.4622 16.8821 15.4622ZM15.1959 4.10175C14.2701 3.33345 12.947 3.33345 10.3007 3.33345H9.69971C7.0534 3.33345 5.73025 3.33345 4.8045 4.10175M15.1959 4.10175C15.1959 4.10175 15.1959 4.10175 15.1959 4.10175ZM4.8045 4.10175C4.8045 4.10175 4.8045 4.10175 4.8045 4.10175Z"
                  stroke="#22AD5C"
                  strokeWidth="1.5"
                />
                <path
                  d="M7.64258 6.66678C7.98578 7.63778 8.91181 8.33345 10.0003 8.33345C11.0888 8.33345 12.0149 7.63778 12.3581 6.66678"
                  stroke="#22AD5C"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              {locale === "ar" ? "هذا الأسبوع" : "This Week’s"}
            </span>
            <h2 className="font-semibold text-lg xl:text-heading-5 text-dark">
              {locale === "ar" ? "المنتجات الجديدة" : "New Arrivals"}
            </h2>
          </div>

          <Link
            href={`/${locale}/shop`}
            className="inline-flex font-medium text-custom-sm py-2.5 px-7 rounded-md border-gray-3 border text-gray-1 bg-green-dark ease-out duration-200 hover:bg-green hover:text-white hover:border-transparent"
          >
            {locale === "ar" ? "عرض الكل" : "View All"}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-7.5 gap-y-9">
          {/* <!-- New Arrivals item --> */}
          {products?.slice(-8).map((item, key) => (
            <ProductItem item={item} key={key} />
          ))}
        </div>
      </div>

      {/* <!-- Limited Time Offers Section --> */}
    </section>
  );
};

export default NewArrival;
