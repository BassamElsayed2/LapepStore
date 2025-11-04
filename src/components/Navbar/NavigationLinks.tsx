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
    <div className="border-t border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="w-full mx-auto">
        <nav className="flex items-center justify-start lg:justify-center overflow-x-auto scrollbar-hide">
          <ul className="flex items-center gap-0.5 sm:gap-1 md:gap-2 lg:gap-4 xl:gap-6 py-0 px-2 sm:px-4 md:px-6 lg:px-8">
            {menuData.map((menuItem) => {
              const itemPath = `/${locale}${menuItem.path}`;
              // Check if current path matches or starts with the menu path
              const isActive = 
                pathname === itemPath || 
                (menuItem.path !== "/" && pathname.startsWith(itemPath));
              
              return (
                <li
                  key={menuItem.id}
                  className="group relative flex-shrink-0"
                >
                  <Link
                    href={itemPath}
                    className={`
                      relative inline-flex items-center text-[10px] xs:text-xs sm:text-sm font-medium 
                      px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 md:py-4 whitespace-nowrap
                      transition-all duration-200
                      border-b-2 border-transparent
                      ${
                        isActive
                          ? "text-[#22AD5C] border-[#22AD5C]"
                          : "text-gray-700 hover:text-[#22AD5C] hover:border-gray-300"
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

