"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, ShoppingBag, Heart, LogOut, UserCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

const UserDropdown = () => {
  const locale = useLocale();
  const t = useTranslations("common");
  const router = useRouter();
  const { user, signOut } = useAuth();

  console.log("👤 UserDropdown: Received user:", user ? user.email : "null");

  const isGuest = !user;

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success(
        locale === "ar" ? "تم تسجيل الخروج بنجاح" : "Logged out successfully"
      );
      router.push(`/${locale}/login`);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(
        locale === "ar" ? "حدث خطأ أثناء تسجيل الخروج" : "Error logging out"
      );
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-gray-50 h-8 w-8 sm:h-10 sm:w-10"
        >
          <UserCircle className="h-5 w-5 sm:h-6 sm:w-6 text-[#22AD5C]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={locale === "ar" ? "start" : "end"}
        className="w-48 sm:w-56"
      >
        <DropdownMenuLabel>
          {isGuest ? (
            locale === "ar" ? (
              "مرحباً بك"
            ) : (
              "Welcome"
            )
          ) : (
            <div>
              <div className="font-medium">
                {user.full_name || user.name || user.email}
              </div>
              <div className="text-xs text-gray-500 font-normal">
                {user.email}
              </div>
            </div>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {isGuest ? (
          <>
            <DropdownMenuItem asChild>
              <Link
                href={`/${locale}/login`}
                className="flex items-center cursor-pointer"
              >
                <User className="mr-2 h-4 w-4 text-[#22AD5C]" />
                <span>{t("login")}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/${locale}/register`}
                className="flex items-center cursor-pointer"
              >
                <UserCircle className="mr-2 h-4 w-4 text-[#22AD5C]" />
                <span>{t("register")}</span>
              </Link>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link
                href={`/${locale}/profile`}
                className="flex items-center cursor-pointer"
              >
                <User className="mr-2 h-4 w-4 text-[#22AD5C]" />
                <span>{locale === "ar" ? "الملف الشخصي" : "Profile"}</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                href={`/${locale}/profile?tab=orders`}
                className="flex items-center cursor-pointer"
              >
                <ShoppingBag className="mr-2 h-4 w-4 text-[#22AD5C]" />
                <span>{t("orders")}</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{locale === "ar" ? "تسجيل الخروج" : "Logout"}</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
