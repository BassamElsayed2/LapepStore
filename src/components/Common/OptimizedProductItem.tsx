"use client";
import React, { memo, useCallback, useState } from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import { updateproductDetails } from "@/redux/features/product-details";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { Link } from "@/app/i18n/navigation";
import { useLocale } from "next-intl";
import OptimizedImage from "./OptimizedImage";

interface ProductItemProps {
  item: Product;
  priority?: boolean;
}

const ProductItem = memo(({ item, priority = false }: ProductItemProps) => {
  const { openModal } = useModalContext();
  const locale = useLocale();
  const dispatch = useDispatch<AppDispatch>();
  const [showCartSuccess, setShowCartSuccess] = useState(false);

  const productTitle = locale === "ar" ? item.name_ar : item.name_en;
  const productDescription =
    locale === "ar" ? item.description_ar : item.description_en;
  const productImage =
    item.imgs?.thumbnails?.[0] ||
    (Array.isArray(item.image_url) ? item.image_url[0] : item.image_url) ||
    "/images/products/product-1-bg-1.png";

  const handleQuickViewUpdate = useCallback(() => {
    dispatch(updateQuickView({ ...item }));
  }, [dispatch, item]);

  const handleAddToCart = useCallback(() => {
    // Check if product is in stock
    if (item.stock_quantity <= 0) {
      return;
    }

    const cartItem = {
      id: item.id,
      title: productTitle,
      price: item.price,
      discountedPrice:
        item.offer_price !== null &&
        item.offer_price !== undefined &&
        item.offer_price > 0
          ? item.offer_price
          : item.price,
      quantity: 1,
      stock: item.stock_quantity,
      imgs: {
        thumbnails:
          item.imgs?.thumbnails ||
          (Array.isArray(item.image_url) ? item.image_url : [item.image_url]),
        previews:
          item.imgs?.previews ||
          (Array.isArray(item.image_url) ? item.image_url : [item.image_url]),
      },
    };

    dispatch(addItemToCart(cartItem));
    setShowCartSuccess(true);
    setTimeout(() => setShowCartSuccess(false), 2000);
  }, [dispatch, item, productTitle]);

  const handleProductDetails = useCallback(() => {
    const productDetails = {
      title: productTitle,
      reviews: item.reviews || 0,
      price: item.price,
      discountedPrice: item.offer_price || item.price,
      img: Array.isArray(item.image_url) ? item.image_url[0] : item.image_url,
      images: Array.isArray(item.image_url) ? item.image_url : [item.image_url],
      id: item.id,
      imgs: {
        thumbnails:
          item.imgs?.thumbnails ||
          (Array.isArray(item.image_url) ? item.image_url : [item.image_url]),
        previews:
          item.imgs?.previews ||
          (Array.isArray(item.image_url) ? item.image_url : [item.image_url]),
      },
      description: productDescription,
      stock: item.stock_quantity,
      attributes: item.attributes || [],
    };
    dispatch(updateproductDetails(productDetails));
  }, [dispatch, item, productTitle, productDescription]);

  const discountPercentage = item.offer_price
    ? Math.round(((item.price - item.offer_price) / item.price) * 100)
    : 0;

  return (
    <div className="group relative">
      {showCartSuccess && (
        <div className="absolute top-4 right-4 z-10 bg-green-500 text-white px-3 py-1 rounded-md text-sm animate-fade-in">
          {locale === "ar" ? "تمت الإضافة إلى السلة" : "Added to cart!"}
        </div>
      )}

      <div className="relative overflow-hidden rounded-lg bg-[#F6F7FB] h-[320px] flex items-center justify-center mb-4">
        <div className="relative w-full h-full max-w-[280px] max-h-[280px] px-4 py-4">
          <OptimizedImage
            src={productImage}
            alt={productTitle}
            fill
            priority={priority}
            quality={75}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain"
          />
        </div>

        {discountPercentage > 0 && (
          <span className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 text-xs rounded">
            -{discountPercentage}%
          </span>
        )}

        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-12 group-hover:translate-y-0 transition-transform duration-300 flex gap-2">
          <button
            onClick={() => {
              handleQuickViewUpdate();
              openModal();
            }}
            className="bg-white p-2 rounded-full shadow-lg hover:bg-primary hover:text-white transition-colors"
            aria-label="Quick view"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>

          <button
            onClick={handleAddToCart}
            disabled={item.stock_quantity <= 0}
            className={`p-2 rounded-full shadow-lg transition-colors ${
              item.stock_quantity <= 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white hover:bg-primary hover:text-white"
            }`}
            aria-label={
              item.stock_quantity <= 0 ? "Out of stock" : "Add to cart"
            }
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      <Link href={`/shop-details?id=${item.id}`} onClick={handleProductDetails}>
        <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 hover:text-primary transition-colors">
          {productTitle}
        </h3>
      </Link>

      <div className="flex items-center gap-2">
        {item.offer_price !== null &&
        item.offer_price !== undefined &&
        item.offer_price > 0 ? (
          <>
            <span className="text-lg font-bold text-primary">
              ${item.offer_price.toFixed(2)}
            </span>
            <span className="text-sm text-gray-400 line-through">
              ${item.price.toFixed(2)}
            </span>
          </>
        ) : (
          <span className="text-lg font-bold text-primary">
            ${item.price.toFixed(2)}
          </span>
        )}
      </div>

      {item.stock_quantity && item.stock_quantity < 10 && (
        <p className="text-xs text-red-500 mt-1">
          {locale === "ar"
            ? `${item.stock_quantity} قطع متبقية فقط`
            : `Only ${item.stock_quantity} left in stock`}
        </p>
      )}
    </div>
  );
});

ProductItem.displayName = "ProductItem";

export default ProductItem;
