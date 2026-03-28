"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Home,
  Store,
  ShoppingCart,
  Tag,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAppSelector } from "@/redux/store";
import { useSelector } from "react-redux";
import { selectTotalPrice } from "@/redux/features/cart-slice";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

/** ارتفاع منطقة الأيقونات + النصوص (بدون safe-area) — يُستخدم مع شريط السلة */
const NAV_CONTENT_MIN_PX = 56;

export default function BottomNav() {
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);
  const cartItemsCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const { user } = useAuth();

  const base = `/${locale}`;
  const accountPath = user ? `${base}/profile` : `${base}/login`;

  const isHome = pathname === base || pathname === `${base}/`;
  const isShopDetails = pathname.includes(`${base}/shop-details`);
  const filterParam = searchParams.get("filter");
  const isOffers =
    !isShopDetails &&
    pathname.startsWith(`${base}/shop`) &&
    filterParam === "limited-offers";
  const isShop =
    !isShopDetails &&
    !isOffers &&
    (pathname.includes("/shop-with-sidebar") ||
      (pathname.startsWith(`${base}/shop`) &&
        !pathname.startsWith(`${base}/shop-details`)));
  const isCartPage = pathname.includes(`${base}/cart`);
  const isAccount = user
    ? pathname.includes(`${base}/profile`)
    : pathname.includes(`${base}/login`) ||
      pathname.includes(`${base}/register`);

  const isCheckout = pathname.includes(`${base}/checkout`);

  const navItems = [
    {
      id: "home",
      label: locale === "ar" ? "الرئيسية" : "Home",
      href: base,
      icon: Home,
      isActive: isHome,
    },
    {
      id: "shop",
      label: locale === "ar" ? "المتجر" : "Shop",
      href: `${base}/shop`,
      icon: Store,
      isActive: isShop,
    },
    {
      id: "cart",
      label: locale === "ar" ? "السلة" : "Cart",
      href: `${base}/cart`,
      icon: ShoppingCart,
      isActive: isCartPage,
      badge: cartItemsCount,
    },
    {
      id: "offers",
      label: locale === "ar" ? "العروض" : "Offers",
      href: `${base}/shop?filter=limited-offers`,
      icon: Tag,
      isActive: isOffers,
    },
    {
      id: "account",
      label: locale === "ar" ? "حسابي" : "Account",
      href: accountPath,
      icon: User,
      isActive: isAccount,
    },
  ];

  const handleGoToCart = () => {
    router.push(`${base}/cart`);
  };

  if (isCheckout) {
    return null;
  }

  const CartChevron = locale === "ar" ? ChevronLeft : ChevronRight;

  return (
    <>
      <nav
        className={cn(
          "fixed bottom-0 left-0 right-0 z-[55] lg:hidden",
          "bg-white",
          "border-t border-gray-200",
          "shadow-[0_-2px_10px_rgba(0,0,0,0.05)]",
          "pb-[env(safe-area-inset-bottom,0px)]",
        )}
        aria-label={locale === "ar" ? "التنقل السفلي" : "Bottom navigation"}
      >
        <div
          className="flex w-full items-stretch justify-between"
          style={{ minHeight: NAV_CONTENT_MIN_PX }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.isActive;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-0.5 py-1.5",
                  "transition-colors duration-200 touch-manipulation select-none",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#92b18c]/40 focus-visible:ring-offset-2",
                  active
                    ? "text-[#92b18c]"
                    : "text-gray-500 active:text-gray-700",
                )}
              >
                {active && (
                  <span
                    className="absolute top-0 left-1/2 h-0.5 w-7 -translate-x-1/2 rounded-full bg-[#92b18c]"
                    aria-hidden
                  />
                )}
                <span
                  className={cn(
                    "relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors",
                    active && "bg-[#92b18c]/12",
                  )}
                >
                  <Icon
                    className="h-[22px] w-[22px]"
                    strokeWidth={active ? 2.25 : 1.85}
                  />
                  {item.badge != null && item.badge > 0 && (
                    <span
                      className={cn(
                        "absolute -top-1 -end-2 z-10 flex h-[18px] min-w-[18px] items-center justify-center",
                        "rounded-full border-2 border-white px-0.5 text-[10px] font-bold leading-none text-white",
                        "bg-[#92b18c] shadow-sm",
                      )}
                    >
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    "w-full px-0.5 text-center text-[10px] leading-tight sm:text-[11px]",
                    active
                      ? "font-semibold text-[#92b18c]"
                      : "font-medium text-gray-600",
                  )}
                  style={{ wordBreak: "break-word" }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
