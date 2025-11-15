"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useAppSelector } from "@/redux/store";
import { useSelector } from "react-redux";
import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import { Menu, X } from "lucide-react";

// Components
import SearchBar from "./SearchBar";
import UserDropdown from "./UserDropdown";
import LanguageDropdown from "./LanguageDropdown";
import CartButton from "./CartButton";
import NavigationLinks from "./NavigationLinks";

const Navbar = () => {
  const [stickyMenu, setStickyMenu] = useState(false);
  const { openCartModal } = useCartModalContext();
  const t = useTranslations("header");
  const commonT = useTranslations("common");
  const locale = useLocale();

  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);

  // Sticky menu on scroll
  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
    return () => window.removeEventListener("scroll", handleStickyMenu);
  }, []);

  return (
    <>
      <header
        className={`fixed left-0 top-0 w-full z-[20] bg-white transition-all ease-in-out duration-300 ${
          stickyMenu ? "shadow-md" : ""
        }`}
      >
        <div className="w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div
            className={`flex items-center justify-between gap-2 transition-all duration-200 ${
              stickyMenu ? "py-2 sm:py-3" : "py-3 sm:py-4"
            }`}
          >
            {/* Logo */}
            <Link href={`/${locale}`} className="flex-shrink-0">
              <img
                src="/images/logo/logo.png"
                alt="Lapip Store"
                className="h-8 sm:h-10 md:h-12 w-auto object-contain"
              />
            </Link>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-4 xl:mx-8">
              <SearchBar />
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
              {/* Support Link - Desktop only */}
              <Link
                href={`/${locale}/contact`}
                className="hidden xl:flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
                title={t("contactUs")}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-shrink-0 text-[#22AD5C]"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <div className="text-left">
                  <span className="block text-xs text-gray-500">
                    {t("support")}
                  </span>
                  <p className="text-sm font-medium text-gray-900">
                    {t("contactUs")}
                  </p>
                </div>
              </Link>

              {/* Language Switcher */}
              <LanguageDropdown />

              {/* Cart Button */}
              <CartButton
                cartItems={cartItems}
                totalPrice={totalPrice}
                locale={locale}
                onOpenCart={openCartModal}
              />

              {/* User Dropdown */}
              <UserDropdown />
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="lg:hidden pb-3 sm:pb-4">
            <SearchBar />
          </div>
        </div>

        {/* Navigation Links */}
        <NavigationLinks stickyMenu={stickyMenu} />
      </header>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-[160px] sm:h-[170px] md:h-[180px] lg:h-[130px]" />
    </>
  );
};

export default Navbar;
