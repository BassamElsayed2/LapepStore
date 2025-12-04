"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Product } from "@/types/product";
import { getProducts } from "@/hooks/useProducts";
import { Search, Loader2 } from "lucide-react";
import Image from "next/image";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const t = useTranslations("header");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch products based on search query
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["search-products", debouncedQuery],
    queryFn: () =>
      getProducts({
        search: debouncedQuery,
        limit: 8,
      }),
    enabled: debouncedQuery.length > 0,
    retry: (failureCount, error: any) => {
      // Don't retry on 429 (Too Many Requests) or 500 (Server Error)
      if (
        error?.isRateLimit ||
        error?.status === 429 ||
        error?.status === 500
      ) {
        return false;
      }
      return failureCount < 1;
    },
  });

  // Show results when products are loaded or when there's an error
  useEffect(() => {
    if (debouncedQuery.length > 0 && (products !== undefined || error)) {
      setShowResults(true);
    }
  }, [debouncedQuery, products, error]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.length > 0) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const handleProductClick = () => {
    setShowResults(false);
    setSearchQuery("");
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#92b18c]" />
        <Input
          type="search"
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => {
            if (searchQuery.length > 0) {
              setShowResults(true);
            }
          }}
          className="w-full placeholder:text-[#92b18c] placeholder:text-[10px] text-[#92b18c] text-[11px] pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#92b18c] focus:border-transparent"
        />
      </div>

      {/* Search Results Dropdown */}
      {showResults && searchQuery && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-[400px] overflow-y-auto z-[99999]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-[#92b18c]" />
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <p className="text-sm text-red-500 mb-2">
                {locale === "ar"
                  ? "حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى."
                  : "An error occurred while searching. Please try again."}
              </p>
              <p className="text-xs text-gray-400">
                {locale === "ar" ? "خطأ في الخادم (500)" : "Server Error (500)"}
              </p>
            </div>
          ) : products && products.length > 0 ? (
            <div className="py-2">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/${locale}/shop-details?id=${product.id}`}
                  onClick={handleProductClick}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  {/* Product Image */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden bg-gray-100 relative">
                    {product.image_url ? (
                      <Image
                        src={
                          Array.isArray(product.image_url)
                            ? product.image_url[0]
                            : product.image_url
                        }
                        alt={
                          locale === "ar" ? product.name_ar : product.name_en
                        }
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {locale === "ar"
                        ? product.name_ar || product.title
                        : product.name_en || product.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-semibold text-[#92b18c]">
                        {product.offer_price || product.price}{" "}
                        {locale === "ar" ? "جنيه" : "EGP"}
                      </span>
                      {product.offer_price && (
                        <span className="text-xs text-gray-500 line-through">
                          {product.price} {locale === "ar" ? "جنيه" : "EGP"}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              <p className="text-sm">
                {locale === "ar"
                  ? "لم يتم العثور على منتجات"
                  : "No products found"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
