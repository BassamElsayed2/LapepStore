"use client";

import React from "react";
import { useRouter, usePathname } from "@/app/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { routing } from "@/app/i18n/routing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const LanguageDropdown = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLocale = useLocale();

  const handleLanguageChange = (locale: string) => {
    // Preserve search params when changing language
    const params = new URLSearchParams(searchParams.toString());
    const queryString = params.toString();
    const newPath = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(newPath, { locale });
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
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 hover:bg-gray-50"
        >
          <Globe className="h-4 w-4 text-[#92b18c]" />
          <span className="hidden md:inline">
            {getLanguageLabel(currentLocale)}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {routing.locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLanguageChange(locale)}
            className={`cursor-pointer ${
              currentLocale === locale
                ? "bg-[#92b18c] bg-opacity-10 text-[#92b18c]"
                : ""
            }`}
          >
            {getLanguageLabel(locale)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageDropdown;
