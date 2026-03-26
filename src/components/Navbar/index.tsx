"use client";

import { useState, useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { Home, Store, Tag, Menu, X } from "lucide-react";
import { useAppSelector } from "@/redux/store";
import { useSelector } from "react-redux";
import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import SearchBar from "./SearchBar";
import CartButton from "./CartButton";
import UserDropdown from "./UserDropdown";
import LanguageDropdown from "./LanguageDropdown";

function Navbar() {
  const locale = useLocale();
  const pathname = usePathname();
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);
  const { openCartModal } = useCartModalContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

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

  const isHomePage =
    pathname === `/${locale}` || pathname === `/${locale}/`;

  const reveal = isHomePage ? scrolled || mobileMenuOpen : true;

  return (
    <>
      <nav
        className={cn(
          "fixed inset-x-0 top-0 z-[100] w-full px-3 py-2 will-change-transform",
          "transition-[transform,background-color,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "motion-reduce:transition-colors motion-reduce:duration-200",
          reveal
            ? "translate-y-0 pointer-events-auto"
            : "translate-y-0 md:-translate-y-full md:pointer-events-none",
          reveal
            ? "bg-white/95 shadow-md backdrop-blur-md border-b border-gray-200/80"
            : "bg-white/90 backdrop-blur-sm border-b border-gray-100/60 md:bg-transparent md:shadow-none md:backdrop-blur-none md:border-transparent"
        )}
        ref={menuRef}
      >
      <div className="flex items-center justify-between gap-3 h-[60px]">
        {/* Mobile: Hamburger */}
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-md text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>

        {/* Group 1: Logo + Links (desktop) */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={`/${locale}`}
            className="flex items-center justify-center shrink-0"
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

          <div className="hidden md:flex items-center gap-1">
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
          </div>
        </div>

        {/* Group 2: Search Bar (desktop) */}
        <div className="hidden md:block flex-1 max-w-md mx-2">
          <SearchBar />
        </div>

        {/* Group 3: Cart + User + Language */}
        <div className="flex items-center gap-1 shrink-0">
          <CartButton
            cartItems={cartItems}
            totalPrice={totalPrice}
            locale={locale}
            onOpenCart={openCartModal}
          />
          <UserDropdown />
          <LanguageDropdown />
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
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
        </div>
      </div>
    </nav>
      <div
        className={cn("h-[76px] shrink-0", !reveal && "md:h-0")}
        aria-hidden
      />
    </>
  );
}

export default Navbar;
