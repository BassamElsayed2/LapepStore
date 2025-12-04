"use client";

import React from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { menuData } from "@/components/Header/menuData";

interface NavigationLinksProps {
  stickyMenu: boolean;
}

const NavigationLinks = ({ stickyMenu }: NavigationLinksProps) => {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div
      className="border-t border-gray-200 shadow-sm overflow-hidden text-white"
      style={{
        backgroundImage: "url('/menubg.png')",
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "repeat",
      }}
    >
      <div className="w-full mx-auto">
        <nav className="flex items-center justify-center overflow-x-auto scrollbar-hide">
          <ul className="flex items-center gap-1 py-0 px-2 sm:px-4 md:px-6 lg:px-8 border-l border-gray-300 last:border-l-0">
            {menuData.map((menuItem) => {
              const itemPath = `/${locale}${menuItem.path}`;
              // Check if current path matches or starts with the menu path
              const isActive =
                pathname === itemPath ||
                (menuItem.path !== "/" && pathname.startsWith(itemPath));

              return (
                <li
                  key={menuItem.id}
                  className="group relative flex-shrink-0 border-l border-gray-300 last:border-l-0"
                >
                  <Link
                    href={itemPath}
                    className={`
                      relative inline-flex items-center text-[10px] text-xs  
                      px-2  py-2.5  whitespace-nowrap
                      transition-all duration-200
                      border-b-2 border-transparent
                      ${
                        isActive
                          ? "border-[#92b18c]"
                          : "text-gray-700 hover:border-white transition-all duration-200"
                      }
                    `}
                  >
                    {locale === "ar" ? menuItem.title_ar : menuItem.title_en}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default NavigationLinks;
