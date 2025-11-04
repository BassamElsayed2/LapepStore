"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Product } from "@/types/product";
import { getProducts } from "@/hooks/useProducts";
import { Search, Loader2 } from "lucide-react";

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
  const { data: products, isLoading } = useQuery({
    queryKey: ["search-products", debouncedQuery],
    queryFn: () => getProducts({
      search: debouncedQuery,
      limit: 8,
    }),
    enabled: debouncedQuery.length > 0,
  });

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
    setSearchQuery(e.target.value);
    setShowResults(true);
  };

  const handleProductClick = () => {
    setShowResults(false);
    setSearchQuery("");
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#22AD5C]" />
        <Input
          type="search"
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => searchQuery && setShowResults(true)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#22AD5C] focus:border-transparent"
        />
      </div>

      {/* Search Results Dropdown */}
      {showResults && searchQuery && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-[400px] overflow-y-auto z-[99999]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-[#22AD5C]" />
            </div>
          ) : products && products.length > 0 ? (
            <div className="py-2">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/${locale}/products/${product.id}`}
                  onClick={handleProductClick}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  {/* Product Image */}
                  {product.image_url && (
                    <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                      <img
                        src={Array.isArray(product.image_url) ? product.image_url[0] : product.image_url}
                        alt={
                          locale === "ar" ? product.name_ar : product.name_en
                        }
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {locale === "ar"
                        ? product.name_ar || product.title
                        : product.name_en || product.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-semibold text-[#22AD5C]">
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

