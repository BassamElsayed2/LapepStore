import type { Middleware } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { addItemToCart } from "../features/cart-slice";

/**
 * يعرض toast عند نجاح إضافة المنتج للسلة فعلياً (بعد تطبيق الـ reducer).
 * (بدون استيراد RootState من store لتفادي دائرة استيراد)
 */
export const cartToastMiddleware: Middleware =
  (store) => (next) => (action) => {
    if (!addItemToCart.match(action)) {
      return next(action);
    }

    const payload = action.payload;
    const prevItems = store.getState().cartReducer.items as {
      id: number;
      quantity: number;
    }[];
    const prevEntry = prevItems.find((i) => i.id === payload.id);
    const prevQty = prevEntry?.quantity ?? 0;

    const result = next(action);

    const nextItems = store.getState().cartReducer.items as {
      id: number;
      quantity: number;
    }[];
    const nextEntry = nextItems.find((i) => i.id === payload.id);
    const nextQty = nextEntry?.quantity ?? 0;

    if (nextQty > prevQty && typeof document !== "undefined") {
      const lang = document.documentElement.lang || "ar";
      const isAr = lang.toLowerCase().startsWith("ar");
      toast.success(
        isAr ? "تم إضافة المنتج إلى السلة" : "Product added to cart",
        {
          duration: 2800,
          position: "top-center",
          style: {
            marginTop: "max(8px, env(safe-area-inset-top, 0px))",
          },
        },
      );
    }

    return result;
  };
