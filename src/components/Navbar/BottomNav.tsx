"use client";

import React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Home, Store, Tag, ShoppingCart, ArrowRight } from "lucide-react";
import { useAppSelector } from "@/redux/store";
import { useSelector } from "react-redux";
import { selectTotalPrice } from "@/redux/features/cart-slice";

const BottomNav = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("common");

  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);
  const cartItemsCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const isCartPage = pathname === `/${locale}/cart`;
  const isCheckoutPage = pathname === `/${locale}/checkout`;

  const navItems = [
    {
      id: "home",
      label: locale === "ar" ? "الرئيسية" : "Home",
      href: `/${locale}`,
      icon: Home,
    },
    {
      id: "shop",
      label: locale === "ar" ? "المتجر" : "Shop",
      href: `/${locale}/shop`,
      icon: Store,
    },
    {
      id: "offers",
      label: locale === "ar" ? "العروض" : "Offers",
      href: `/${locale}/shop?filter=limited-offers`,
      icon: Tag,
    },
    {
      id: "cart",
      label: locale === "ar" ? "السلة" : "Cart",
      href: `/${locale}/checkout`,
      icon: ShoppingCart,
      badge: cartItemsCount,
    },
  ];

  const handleGoToCart = () => {
    router.push(`/${locale}/checkout`);
  };

  // Don't show bottom nav in checkout page
  if (isCheckoutPage) {
    return null;
  }

  return (
    <>
      {/* Cart Summary Bar - Shows when cart has items and not on cart page */}
      <div
        className={`fixed left-0 right-0 bg-[#92b18c] text-white z-50 lg:hidden cursor-pointer overflow-hidden transition-all duration-500 ease-out ${
          cartItemsCount > 0 && !isCartPage
            ? "bottom-16 sm:bottom-18 opacity-100 translate-y-0"
            : "bottom-16 sm:bottom-18 opacity-0 translate-y-full pointer-events-none"
        }`}
        onClick={handleGoToCart}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3 animate-slideInLeft">
            <div className="bg-white/20 rounded-full p-2 transition-transform hover:scale-110">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">
                {cartItemsCount} {locale === "ar" ? "منتج" : "items"}
              </p>
              <p className="text-xs opacity-90">
                {locale === "ar" ? "في السلة" : "in cart"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 animate-slideInRight">
            <div className="text-right">
              <p className="text-lg font-bold">
                {totalPrice.toFixed(2)} {locale === "ar" ? "ج.م" : "EGP"}
              </p>
              <p className="text-xs opacity-90">
                {locale === "ar" ? "إجمالي" : "Total"}
              </p>
            </div>
            <ArrowRight
              className={`w-5 h-5 transition-transform ${
                locale === "ar" ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 lg:hidden">
        <div className="grid grid-cols-4 h-16 sm:h-18">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 relative transition-all duration-300 ${
                  isActive
                    ? "text-[#92b18c]"
                    : "text-gray-600 hover:text-[#92b18c]"
                }`}
              >
                <div className="relative transition-transform hover:scale-110 duration-200">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
                </div>
                <span className="text-[10px] sm:text-xs font-medium">
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#92b18c] rounded-t-full transition-all duration-300" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
