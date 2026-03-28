"use client";

import React from "react";
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
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Button
      variant="ghost"
      onClick={onOpenCart}
      className="relative flex items-center gap-1.5 sm:gap-2 hover:bg-gray-50 px-1.5 sm:px-2 md:px-3"
    >
      <div className="relative">
        <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-[#92b18c]" />
        {itemCount > 0 && (
          <Badge
            variant="default"
            className={[
              "absolute z-10 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white p-0",
              "-top-2 -end-2 sm:-top-2.5 sm:-end-2.5",
              "text-[10px] font-bold leading-none sm:h-5 sm:min-w-[20px] sm:text-[11px]",
              "bg-[#92b18c] hover:bg-[#92b18c]",
            ].join(" ")}
          >
            {itemCount > 99 ? "99+" : itemCount}
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
