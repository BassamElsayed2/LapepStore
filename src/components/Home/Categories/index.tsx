"use client";
import React from "react";
import SingleItem from "./SingleItem";
import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/apiCat";

const Categories = () => {
  const locale = useLocale();

  const {
    data: categories,
    isLoading,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    retry: (failureCount, error: any) => {
      if (error?.isRateLimit || error?.status === 429) return false;
      return failureCount < 1;
    },
    retryDelay: (attemptIndex, error: any) => {
      if (error?.isRateLimit || error?.status === 429) {
        return error.retryAfter || 60000;
      }
      return Math.min(1000 * 2 ** attemptIndex, 30000);
    },
    staleTime: 10 * 60 * 1000,
  });

  return (
    <section className="relative z-10 -mt-12 pb-10">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center gap-3 animate-pulse"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-2" />
                  <div className="w-20 h-4 rounded bg-gray-2" />
                </div>
              ))
            : categories?.map((item, key) => (
                <SingleItem key={item.id ?? key} item={item} index={key} />
              ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
