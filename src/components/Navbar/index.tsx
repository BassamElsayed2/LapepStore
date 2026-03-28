"use client";

import { useState, useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import {
  Home,
  Store,
  Tag,
  Menu,
  X,
  ChevronDown,
  LayoutGrid,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/redux/store";
import { useSelector } from "react-redux";
import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { getCategories } from "@/services/apiCat";
import SearchBar from "./SearchBar";
import CartButton from "./CartButton";
import UserDropdown from "./UserDropdown";
import LanguageDropdown from "./LanguageDropdown";

function Navbar() {
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);
  const { openCartModal } = useCartModalContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    retry: (failureCount, error: unknown) => {
      const err = error as { isRateLimit?: boolean; status?: number };
      if (err?.isRateLimit || err?.status === 429) return false;
      return failureCount < 1;
    },
    retryDelay: (attemptIndex, error: unknown) => {
      const err = error as {
        isRateLimit?: boolean;
        status?: number;
        retryAfter?: number;
      };
      if (err?.isRateLimit || err?.status === 429) {
        return err.retryAfter || 60000;
      }
      return Math.min(1000 * 2 ** attemptIndex, 30000);
    },
    staleTime: 10 * 60 * 1000,
  });

  const categoriesLabel = locale === "ar" ? "التصنيفات" : "Categories";

  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoriesOpen(false);
  }, [pathname, categoryParam]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
        setCategoriesOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        categoriesOpen &&
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(e.target as Node)
      ) {
        setCategoriesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [categoriesOpen]);

  const navLinks = [
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
  ];

  return (
    <>
      <nav
        className={cn(
          "fixed inset-x-0 top-0 z-[100] w-full px-3 py-2",
          "bg-white shadow-md border-b border-gray-200",
          "transition-[background-color,box-shadow,border-color] duration-200 motion-reduce:transition-none",
        )}
        ref={menuRef}
      >
        <div
          className={cn(
            "flex w-full items-center h-[60px] gap-2 sm:gap-3 px-0 lg:px-30",
            "justify-center md:gap-4 lg:gap-6",
          )}
        >
          {/* اللوجو: موبايل — يمين في العربية (أول عنصر في RTL) ويمين في الإنجليزية (order-2) */}
          <Link
            href={`/${locale}`}
            className={cn(
              "flex items-center justify-center shrink-0",
              locale === "en" && "order-2 md:order-none",
            )}
          >
            <Image
              src="/llogo.png"
              alt="Lapip Store"
              width={120}
              height={60}
              priority
              className="h-10 md:h-13 w-auto object-contain"
            />
          </Link>

          {/* Desktop: روابط + تصنيفات + بحث */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-3 min-w-0 lg:gap-8">
            <div className="flex items-center gap-1 shrink-0">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Icon className="w-4 h-4 text-[#92b18c]" strokeWidth={2} />
                    <span className="text-s font-normal whitespace-nowrap">
                      {item.label}
                    </span>
                  </Link>
                );
              })}

              {categories && categories.length > 0 && (
                <div className="relative" ref={categoryDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setCategoriesOpen((v) => !v)}
                    disabled={categoriesLoading}
                    className={cn(
                      "group relative flex items-center gap-2 px-3.5 py-2 rounded-full",
                      "border border-[#92b18c]/30 bg-gradient-to-br from-[#92b18c]/[0.07] via-white/90 to-white/70",
                      "text-gray-800 shadow-sm",
                      "hover:border-[#92b18c]/55 hover:shadow-md hover:from-[#92b18c]/12",
                      "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      "active:scale-[0.97] motion-reduce:transition-colors motion-reduce:active:scale-100",
                      categoriesLoading &&
                        "opacity-55 cursor-not-allowed pointer-events-none border-gray-200",
                      categoriesOpen &&
                        "border-[#92b18c] bg-[#92b18c]/12 shadow-md ring-2 ring-[#92b18c]/20 from-[#92b18c]/15",
                    )}
                    aria-expanded={categoriesOpen}
                    aria-haspopup="true"
                  >
                    <span className="absolute inset-0 rounded-full bg-[#92b18c]/0 group-hover:bg-[#92b18c]/5 transition-colors duration-300 pointer-events-none" />
                    <LayoutGrid
                      className={cn(
                        "relative w-4 h-4 shrink-0 text-[#92b18c] transition-transform duration-300 ease-out",
                        "group-hover:rotate-12 group-hover:scale-110",
                        categoriesOpen && "rotate-0 scale-110",
                      )}
                      strokeWidth={2}
                    />
                    <span className="relative text-sm font-medium whitespace-nowrap tracking-tight">
                      {categoriesLoading ? "…" : categoriesLabel}
                    </span>
                    <ChevronDown
                      className={cn(
                        "relative w-4 h-4 shrink-0 text-gray-500 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                        categoriesOpen && "rotate-180 text-[#92b18c]",
                      )}
                    />
                  </button>
                  {categoriesOpen && (
                    <div
                      className={cn(
                        "absolute start-0 top-full mt-2 min-w-[240px] max-h-72 overflow-y-auto z-[110] origin-top",
                        "rounded-xl border border-[#92b18c]/20 bg-white py-1.5 shadow-lg",
                        "shadow-xl shadow-[#92b18c]/[0.12]",
                        "animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200",
                      )}
                      role="menu"
                    >
                      {categories.map((cat, i) => {
                        const label =
                          locale === "ar" ? cat.name_ar : cat.name_en;
                        const href = `/${locale}/shop?category=${cat.id}`;
                        const active =
                          pathname.includes(`/${locale}/shop`) &&
                          categoryParam === String(cat.id);
                        return (
                          <Link
                            key={cat.id}
                            href={href}
                            role="menuitem"
                            style={{
                              animationDelay: `${Math.min(i, 12) * 28}ms`,
                            }}
                            className={cn(
                              "block px-3 py-2.5 text-sm rounded-lg mx-1 transition-colors duration-150",
                              "animate-in fade-in slide-in-from-top-1 fill-mode-both duration-200",
                              active
                                ? "bg-[#92b18c]/12 text-[#92b18c] font-semibold"
                                : "text-gray-700 hover:bg-[#92b18c]/8",
                            )}
                            onClick={() => setCategoriesOpen(false)}
                          >
                            {label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex-1 max-w-md min-w-0 mx-1 lg:mx-2">
              <SearchBar />
            </div>
          </div>

          {/* موبايل: برجر بجانب السلة والمستخدم واللغة — ديسكتوب: نفس الأيقونات فقط */}
          <div
            className={cn(
              "flex items-center gap-1 sm:gap-1.5 shrink-0",
              locale === "en" && "order-1 md:order-none",
            )}
          >
            <CartButton
              cartItems={cartItems}
              totalPrice={totalPrice}
              locale={locale}
              onOpenCart={openCartModal}
            />
            <UserDropdown />
            <LanguageDropdown />
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className={cn(
                "md:hidden relative flex items-center justify-center w-10 h-10 shrink-0 rounded-full",
                "border border-gray-200 bg-white shadow-sm",
                "text-gray-700 hover:text-[#92b18c]  hover:bg-[#92b18c]/8 hover:shadow-md",
                "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                "active:scale-95 motion-reduce:transition-colors motion-reduce:active:scale-100",
                mobileMenuOpen &&
                  "border-[#92b18c]/45 bg-[#92b18c]/10 text-[#92b18c] shadow-md ring-2 ring-[#92b18c]/15",
              )}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <span
                className={cn(
                  "inline-flex transition-transform duration-300 ease-out",
                  mobileMenuOpen && "rotate-90",
                )}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" strokeWidth={2.25} />
                ) : (
                  <Menu className="w-5 h-5" strokeWidth={2.25} />
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-[max-height,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-opacity",
            mobileMenuOpen
              ? "max-h-[min(85vh,640px)] opacity-100 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-300"
              : "max-h-0 opacity-0 pointer-events-none",
          )}
        >
          <div className="py-3 space-y-3 border-t border-gray-200">
            <SearchBar />

            <div className="flex flex-col gap-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? "bg-[#92b18c]/10 text-[#92b18c]"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5 text-[#92b18c]" strokeWidth={2} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {categories && categories.length > 0 && (
              <div className="pt-2 border-t border-gray-100">
                <p className="px-3 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {categoriesLabel}
                </p>
                <div className="flex flex-col gap-0.5 max-h-56 overflow-y-auto">
                  {categories.map((cat) => {
                    const label = locale === "ar" ? cat.name_ar : cat.name_en;
                    const href = `/${locale}/shop?category=${cat.id}`;
                    const active =
                      pathname.includes(`/${locale}/shop`) &&
                      categoryParam === String(cat.id);
                    return (
                      <Link
                        key={cat.id}
                        href={href}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                          active
                            ? "bg-[#92b18c]/10 text-[#92b18c] font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
      <div className="h-[76px] shrink-0" aria-hidden />
    </>
  );
}

export default Navbar;
