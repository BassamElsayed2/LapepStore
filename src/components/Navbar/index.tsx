"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
import VoucherNotification from "@/components/Common/VoucherNotification";

// تحسين الأداء باستخدام React.memo
const Navbar = React.memo(() => {
  const [stickyMenu, setStickyMenu] = useState(false);
  const { openCartModal } = useCartModalContext();
  const t = useTranslations("header");
  const commonT = useTranslations("common");
  const locale = useLocale();

  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);

  // Sticky menu on scroll - only for desktop
  const handleStickyMenu = () => {
    // Only apply sticky behavior on desktop (lg breakpoint and above)
    if (window.innerWidth >= 1024) {
      if (window.scrollY >= 80) {
        setStickyMenu(true);
      } else {
        setStickyMenu(false);
      }
    } else {
      setStickyMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
    window.addEventListener("resize", handleStickyMenu);
    return () => {
      window.removeEventListener("scroll", handleStickyMenu);
      window.removeEventListener("resize", handleStickyMenu);
    };
  }, []);

  return (
    <>
      <header
        className={`relative lg:fixed left-1/2 -translate-x-1/2 top-0 lg:max-w-[1300px] w-full mx-auto  z-[20] bg-white lg:transition-all lg:ease-in-out lg:duration-300`}
      >
        {/* Top Green Bar - Only show when not sticky */}
        <div
          className={`bg-[#22AD5C] text-white transition-all duration-300 overflow-hidden ${
            stickyMenu
              ? "lg:max-h-0 lg:opacity-0"
              : "lg:max-h-10 lg:opacity-100"
          }`}
        >
          <div className="w-full mx-auto ">
            <div className="flex items-center justify-between py-2 px-3 sm:px-4 md:px-6 lg:px-8 text-xs sm:text-sm">
              {/* Left Section */}
              <div className="flex items-center gap-3 sm:gap-6">
                <p className="  transition-all">
                  {locale === "ar"
                    ? "متجر السجائر الالكتروني والاكسسوارات"
                    : "Vape Store And Accessories"}
                </p>
              </div>

              {/* Right Section - Optional Info */}
              <div className="hidden md:flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  {locale === "ar" ? "الدعم: 24/7" : "Support: 24/7"}
                </span>
                <span className="flex items-center gap-1">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {locale === "ar" ? "القاهرة، مصر" : "Cairo, Egypt"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div
          className={`shadow-md lg:shadow-none ${
            stickyMenu ? "lg:shadow-md" : ""
          }`}
        >
          <div className="w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <div
              className={`flex items-center lg:justify-center justify-between gap-2 py-3 sm:py-4 lg:transition-all lg:duration-200 ${
                stickyMenu ? "lg:!py-3" : ""
              }`}
            >
              {/* Logo */}
              <Link href={`/${locale}`} className="flex-shrink-0">
                <Image
                  src={`/images/logo/${
                    locale === "ar" ? "logoar.png" : "logoen.png"
                  }`}
                  alt="Lapip Store"
                  width={120}
                  height={60}
                  priority
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

                {/* Voucher Notification */}
                <VoucherNotification className="hidden md:inline-flex" />

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
        </div>
      </header>

      {/* Spacer to prevent content from going under fixed navbar - only on desktop */}
      <div
        className={`hidden lg:block ${
          stickyMenu ? "lg:h-[130px]" : "lg:h-[170px]"
        }`}
      />
    </>
  );
});

Navbar.displayName = "Navbar";

export default Navbar;
