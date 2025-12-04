"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";

interface CartButtonProps {
  cartItems: any[];
  totalPrice: number;
  locale: string;
  onOpenCart: () => void;
}

const CartButton = ({
  cartItems,
  totalPrice,
  locale,
  onOpenCart,
}: CartButtonProps) => {
  const commonT = useTranslations("common");

  return (
    <Button
      variant="ghost"
      onClick={onOpenCart}
      className="relative flex items-center gap-1.5 sm:gap-2 hover:bg-gray-50 px-1.5 sm:px-2 md:px-3"
    >
      <div className="relative">
        <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-[#92b18c]" />
        {cartItems.length > 0 && (
          <Badge
            variant="default"
            className="absolute -top-1.5 sm:-top-2 -right-1.5 sm:-right-2 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 text-[10px] sm:text-xs bg-[#92b18c]"
          >
            {cartItems.length}
          </Badge>
        )}
      </div>
      <div className="hidden md:flex flex-col items-start">
        <span className="text-xs sm:text-sm font-medium text-gray-900">
          {totalPrice} {locale === "ar" ? "جنيه" : "EGP"}
        </span>
      </div>
    </Button>
  );
};

export default CartButton;
