"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "@/app/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { routing } from "@/app/i18n/routing";
import { useLocale } from "next-intl";

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLocale = useLocale();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (locale: string) => {
    // Preserve search params when changing language
    const params = new URLSearchParams(searchParams.toString());
    const queryString = params.toString();
    const newPath = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(newPath, { locale });
    setIsOpen(false);
  };

  const getLanguageLabel = (locale: string) => {
    switch (locale) {
      case "ar":
        return "العربية";
      case "en":
        return "English";
      default:
        return locale;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 font-medium text-custom-sm text-dark hover:text-blue transition-colors duration-200"
      >
        <span>{getLanguageLabel(currentLocale)}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-3 rounded-md shadow-lg z-50 min-w-[120px] language-switcher-dropdown">
          <div className="py-1">
            {routing.locales.map((locale) => (
              <button
                key={locale}
                onClick={() => handleLanguageChange(locale)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-1 transition-colors duration-200 ${
                  currentLocale === locale ? "bg-blue text-white" : "text-dark"
                }`}
              >
                {getLanguageLabel(locale)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
