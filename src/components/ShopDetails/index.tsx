"use client";
import React, { use, useEffect, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Image from "next/image";
import Newsletter from "../Common/Newsletter";
import RecentlyViewdItems from "./RecentlyViewd";
import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import { useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addItemToCart } from "@/redux/features/cart-slice";
import { getProductAttributes, getProductById } from "@/services/apiProducts";
import { Link } from "@/app/i18n/navigation";
import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { sanitizeRichText } from "@/utils/sanitize";
import { updateproductDetails } from "@/redux/features/product-details";
import Categories from "../Home/Categories";

interface ShopDetailsProps {
  productId?: string;
}

const ShopDetails = ({ productId }: ShopDetailsProps) => {
  const { openPreviewModal } = usePreviewSlider();
  const [previewImg, setPreviewImg] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const [quantity, setQuantity] = useState(1);
  const locale = useLocale();
  const productFromRedux = useAppSelector(
    (state) => state.productDetailsReducer.value
  );

  // Fetch product data if productId is provided
  const {
    data: fetchedProduct,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId!),
    enabled: !!productId,
    retry: 1,
    retryDelay: 1000,
  });

  // Use fetched product if available, otherwise use product from Redux
  const product = fetchedProduct || productFromRedux;

  const [attributes, setAttributes] = useState<any[]>([]);

  // Update Redux store when product is fetched
  useEffect(() => {
    if (fetchedProduct) {
      const productDetails = {
        title:
          locale === "ar" ? fetchedProduct.name_ar : fetchedProduct.name_en,
        reviews: fetchedProduct.reviews || 0,
        price: fetchedProduct.price || 0,
        discountedPrice:
          fetchedProduct.offer_price || fetchedProduct.price || 0,
        img: Array.isArray(fetchedProduct.image_url)
          ? fetchedProduct.image_url[0]
          : fetchedProduct.image_url || "",
        images: Array.isArray(fetchedProduct.image_url)
          ? fetchedProduct.image_url
          : [fetchedProduct.image_url || ""],
        id: fetchedProduct.id,
        imgs: {
          thumbnails:
            fetchedProduct.imgs?.thumbnails ||
            (Array.isArray(fetchedProduct.image_url)
              ? fetchedProduct.image_url
              : [fetchedProduct.image_url || ""]),
          previews:
            fetchedProduct.imgs?.previews ||
            (Array.isArray(fetchedProduct.image_url)
              ? fetchedProduct.image_url
              : [fetchedProduct.image_url || ""]),
        },
        description:
          locale === "ar"
            ? fetchedProduct.description_ar || ""
            : fetchedProduct.description_en || "",
        stock_quantity: fetchedProduct.stock_quantity || 0,
        attributes: fetchedProduct.attributes || [],
      };
      dispatch(updateproductDetails(productDetails));
    }
  }, [fetchedProduct, locale, dispatch]);

  useEffect(() => {
    if (product && (product.title || product.name_ar || product.name_en)) {
      localStorage.setItem("productDetails", JSON.stringify(product));
    }
  }, [product]);

  useEffect(() => {
    const fetchAttributes = async () => {
      if (product.id) {
        try {
          const attrs = await getProductAttributes(product.id.toString());
          setAttributes(attrs || []);
        } catch (error) {
          console.error("Error fetching attributes:", error);
          setAttributes([]);
        }
      }
    };

    fetchAttributes();
  }, [product.id]);

  // pass the product here when you get the real data.
  const handlePreviewSlider = () => {
    openPreviewModal();
  };

  // add to cart functionality
  const handleAddToCart = () => {
    // Check if product is in stock and quantity doesn't exceed stock
    if (product.stock_quantity <= 0 || quantity > product.stock_quantity) {
      return;
    }

    const cartItem = {
      id: product.id,
      title:
        product.title || (locale === "ar" ? product.name_ar : product.name_en),
      price: product.price || 0,
      discountedPrice: product.discountedPrice || product.price || 0,
      quantity: quantity,
      stock: product.stock_quantity || 0,
      imgs: product.imgs || {
        thumbnails: Array.isArray(product.image_url)
          ? product.image_url
          : [product.image_url || ""],
        previews: Array.isArray(product.image_url)
          ? product.image_url
          : [product.image_url || ""],
      },
    };
    dispatch(addItemToCart(cartItem));
  };

  // Show loading state
  if (productId && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-dark mb-4">
            {locale === "ar" ? "جاري التحميل..." : "Loading..."}
          </h2>
          <p className="text-dark-4 mb-6">
            {locale === "ar"
              ? "جاري البحث عن المنتج في قاعدة البيانات..."
              : "Searching for the product in the database..."}
          </p>
          <div className="mt-4">
            <p className="text-sm text-gray-500">Product ID: {productId}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (productId && error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-dark mb-4">
            {locale === "ar" ? "حدث خطأ" : "Error occurred"}
          </h2>
          <p className="text-dark-4 mb-6">
            {locale === "ar"
              ? "حدث خطأ أثناء تحميل بيانات المنتج"
              : "An error occurred while loading product data"}
          </p>
          <p className="text-red-500 mb-6 text-sm">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
          <div className="mt-4 mb-6">
            <p className="text-sm text-gray-500">Product ID: {productId}</p>
          </div>
          <Link
            href={`/${locale}/shop`}
            className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark"
          >
            {locale === "ar" ? "العودة إلى المتجر" : "Back to shop"}
          </Link>
        </div>
      </div>
    );
  }

  // Debug logging for all cases (only if not loading)

  return (
    <>
      <Breadcrumb
        title={
          product.title ||
          (locale === "ar" ? product.name_ar : product.name_en) ||
          (locale === "ar" ? "تفاصيل المنتج" : "Product Details")
        }
        pages={locale === "ar" ? ["تفاصيل المنتج"] : ["Product Details"]}
      />

      {!product ||
      !product.id ||
      (!product.title && !product.name_ar && !product.name_en) ||
      (productId && !fetchedProduct && !isLoading) ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-dark mb-4">
              {productId
                ? isLoading
                  ? locale === "ar"
                    ? "جاري التحميل..."
                    : "Loading..."
                  : locale === "ar"
                  ? "المنتج غير موجود"
                  : "Product not found"
                : locale === "ar"
                ? "لا يوجد منتج محدد"
                : "No product selected"}
            </h2>
            <p className="text-dark-4 mb-6">
              {productId
                ? isLoading
                  ? locale === "ar"
                    ? "جاري البحث عن المنتج في قاعدة البيانات..."
                    : "Searching for the product in the database..."
                  : locale === "ar"
                  ? "المنتج المطلوب غير موجود في قاعدة البيانات"
                  : "The requested product was not found in the database"
                : locale === "ar"
                ? "يرجى اختيار منتج من صفحة المتجر لعرض تفاصيله"
                : "Please select a product from the store page to view details"}
            </p>
            <Link
              href={`/${locale}/shop`}
              className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark"
            >
              {locale === "ar" ? "العودة إلى المتجر" : "Back to shop"}
            </Link>
            {productId && !isLoading && (
              <div className="mt-4">
                <p className="text-sm text-gray-500">Product ID: {productId}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28">
            <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
              <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-17.5">
                <div className="lg:max-w-[570px] w-full">
                  <div className="lg:min-h-[512px] rounded-lg shadow-1 bg-gray-2 p-4 sm:p-7.5 relative flex items-center justify-center">
                    <div>
                      <button
                        onClick={handlePreviewSlider}
                        aria-label="button for zoom"
                        className="gallery__Image w-11 h-11 rounded-[5px] bg-gray-1 shadow-1 flex items-center justify-center ease-out duration-200 text-dark hover:text-blue absolute top-4 lg:top-6 right-4 lg:right-6 z-50"
                      >
                        <svg
                          className="fill-current"
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9.11493 1.14581L9.16665 1.14581C9.54634 1.14581 9.85415 1.45362 9.85415 1.83331C9.85415 2.21301 9.54634 2.52081 9.16665 2.52081C7.41873 2.52081 6.17695 2.52227 5.23492 2.64893C4.31268 2.77292 3.78133 3.00545 3.39339 3.39339C3.00545 3.78133 2.77292 4.31268 2.64893 5.23492C2.52227 6.17695 2.52081 7.41873 2.52081 9.16665C2.52081 9.54634 2.21301 9.85415 1.83331 9.85415C1.45362 9.85415 1.14581 9.54634 1.14581 9.16665L1.14581 9.11493C1.1458 7.43032 1.14579 6.09599 1.28619 5.05171C1.43068 3.97699 1.73512 3.10712 2.42112 2.42112C3.10712 1.73512 3.97699 1.43068 5.05171 1.28619C6.09599 1.14579 7.43032 1.1458 9.11493 1.14581ZM16.765 2.64893C15.823 2.52227 14.5812 2.52081 12.8333 2.52081C12.4536 2.52081 12.1458 2.21301 12.1458 1.83331C12.1458 1.45362 12.4536 1.14581 12.8333 1.14581L12.885 1.14581C14.5696 1.1458 15.904 1.14579 16.9483 1.28619C18.023 1.43068 18.8928 1.73512 19.5788 2.42112C20.2648 3.10712 20.5693 3.97699 20.7138 5.05171C20.8542 6.09599 20.8542 7.43032 20.8541 9.11494V9.16665C20.8541 9.54634 20.5463 9.85415 20.1666 9.85415C19.787 9.85415 19.4791 9.54634 19.4791 9.16665C19.4791 7.41873 19.4777 6.17695 19.351 5.23492C19.227 4.31268 18.9945 3.78133 18.6066 3.39339C18.2186 3.00545 17.6873 2.77292 16.765 2.64893ZM1.83331 12.1458C2.21301 12.1458 2.52081 12.4536 2.52081 12.8333C2.52081 14.5812 2.52227 15.823 2.64893 16.765C2.77292 17.6873 3.00545 18.2186 3.39339 18.6066C3.78133 18.9945 4.31268 19.227 5.23492 19.351C6.17695 19.4777 7.41873 19.4791 9.16665 19.4791C9.54634 19.4791 9.85415 19.787 9.85415 20.1666C9.85415 20.5463 9.54634 20.8541 9.16665 20.8541H9.11494C7.43032 20.8542 6.09599 20.8542 5.05171 20.7138C3.97699 20.5693 3.10712 20.2648 2.42112 19.5788C1.73512 18.8928 1.43068 18.023 1.28619 16.9483C1.14579 15.904 1.1458 14.5696 1.14581 12.885L1.14581 12.8333C1.14581 12.4536 1.45362 12.1458 1.83331 12.1458ZM20.1666 12.1458C20.5463 12.1458 20.8541 12.4536 20.8541 12.8333V12.885C20.8542 14.5696 20.8542 15.904 20.7138 16.9483C20.5693 18.023 20.2648 18.8928 19.5788 19.5788C18.8928 20.2648 18.023 20.5693 16.9483 20.7138C15.904 20.8542 14.5696 20.8542 12.885 20.8541H12.8333C12.4536 20.8541 12.1458 20.5463 12.1458 20.1666C12.1458 19.787 12.4536 19.4791 12.8333 19.4791C14.5812 19.4791 15.823 19.4777 16.765 19.351C17.6873 19.227 18.2186 18.9945 18.6066 18.6066C18.9945 18.2186 19.227 17.6873 19.351 16.765C19.4777 15.823 19.4791 14.5812 19.4791 12.8333C19.4791 12.4536 19.787 12.1458 20.1666 12.1458Z"
                            fill=""
                          />
                        </svg>
                      </button>

                      <Image
                        src={
                          product.imgs?.previews?.[previewImg] ||
                          (Array.isArray(product.image_url)
                            ? product.image_url[0]
                            : product.image_url) ||
                          "/images/products/product-1-bg-1.png"
                        }
                        alt="products-details"
                        width={400}
                        height={400}
                        onError={(e) => {
                          e.currentTarget.src =
                            "/images/products/product-1-bg-1.png";
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap gap-4.5 mt-6">
                    {(
                      product.imgs?.thumbnails ||
                      (Array.isArray(product.image_url)
                        ? product.image_url
                        : [product.image_url])
                    ).map((item: any, key: number) => (
                      <button
                        onClick={() => setPreviewImg(key)}
                        key={key}
                        className={`flex items-center justify-center w-15 sm:w-25 h-15 sm:h-25 overflow-hidden rounded-lg bg-gray-2 shadow-1 ease-out duration-200 border-2 hover:border-blue ${
                          key === previewImg
                            ? "border-blue"
                            : "border-transparent"
                        }`}
                      >
                        <Image
                          width={50}
                          height={50}
                          src={item || "/images/products/product-1-bg-1.png"}
                          alt="thumbnail"
                          onError={(e) => {
                            e.currentTarget.src =
                              "/images/products/product-1-bg-1.png";
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* <!-- product content --> */}
                <div className="max-w-[539px] w-full">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-xl sm:text-2xl xl:text-custom-3 text-dark">
                      {product.title ||
                        (locale === "ar" ? product.name_ar : product.name_en)}
                    </h2>

                    {product.discountedPrice &&
                      product.discountedPrice < product.price && (
                        <div className="inline-flex font-medium text-custom-sm text-white bg-blue rounded py-0.5 px-2.5">
                          {Math.round(
                            ((product.price - product.discountedPrice) /
                              product.price) *
                              100
                          )}
                          % OFF
                        </div>
                      )}
                  </div>

                  <div className="flex flex-wrap items-center gap-5.5 mb-4.5">
                    <div className="flex items-center gap-1.5">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_375_9221)">
                          <path
                            d="M10 0.5625C4.78125 0.5625 0.5625 4.78125 0.5625 10C0.5625 15.2188 4.78125 19.4688 10 19.4688C15.2188 19.4688 19.4688 15.2188 19.4688 10C19.4688 4.78125 15.2188 0.5625 10 0.5625ZM10 18.0625C5.5625 18.0625 1.96875 14.4375 1.96875 10C1.96875 5.5625 5.5625 1.96875 10 1.96875C14.4375 1.96875 18.0625 5.59375 18.0625 10.0312C18.0625 14.4375 14.4375 18.0625 10 18.0625Z"
                            fill={
                              product.stock_quantity > 0 ? "#92b18c" : "#FF4444"
                            }
                          />
                          <path
                            d="M12.6875 7.09374L8.9688 10.7187L7.2813 9.06249C7.00005 8.78124 6.56255 8.81249 6.2813 9.06249C6.00005 9.34374 6.0313 9.78124 6.2813 10.0625L8.2813 12C8.4688 12.1875 8.7188 12.2812 8.9688 12.2812C9.2188 12.2812 9.4688 12.1875 9.6563 12L13.6875 8.12499C13.9688 7.84374 13.9688 7.40624 13.6875 7.12499C13.4063 6.84374 12.9688 6.84374 12.6875 7.09374Z"
                            fill={
                              product.stock_quantity > 0 ? "#92b18c" : "#FF4444"
                            }
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_375_9221">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>

                      <span
                        className={
                          (product.stock_quantity || 0) > 0
                            ? "text-green"
                            : "text-red"
                        }
                      >
                        {(product.stock_quantity || 0) > 0
                          ? locale === "ar"
                            ? `متوفر (${product.stock_quantity || 0})`
                            : `In Stock (${product.stock_quantity || 0})`
                          : locale === "ar"
                          ? "غير متوفر"
                          : "Out of Stock"}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-medium text-custom-1 mb-4.5">
                    {product.offer_price !== null &&
                    product.offer_price !== undefined &&
                    product.offer_price > 0 &&
                    product.offer_price < product.price ? (
                      <>
                        <span className="text-lg sm:text-base text-dark">
                          {locale === "ar" ? "السعر:" : "Price:"}{" "}
                          {product.offer_price} {locale === "ar" ? "ج.م" : "$"}
                        </span>
                        <span className="line-through text-dark-4 ml-2 mr-2 text-sm">
                          {locale === "ar" ? "السعر:" : "Price:"}{" "}
                          {product.price || 0} {locale === "ar" ? "ج.م" : "$"}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg sm:text-base text-dark">
                        {locale === "ar" ? "السعر:" : "Price:"}{" "}
                        {product.price || 0} {locale === "ar" ? "ج.م" : "$"}
                      </span>
                    )}
                  </h3>

                  {/* Product Description */}
                  {(product.description ||
                    (locale === "ar"
                      ? product.description_ar
                      : product.description_en)) && (
                    <div className="mb-6">
                      <h4 className="font-medium text-dark mb-3">
                        {locale === "ar"
                          ? "وصف المنتج:"
                          : "Product Description:"}
                      </h4>
                      <div
                        className="text-dark-4 leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeRichText(
                            product.description ||
                              (locale === "ar"
                                ? product.description_ar
                                : product.description_en) ||
                              ""
                          ),
                        }}
                      />
                    </div>
                  )}

                  {/* Product Attributes */}
                  {attributes.length > 0 && (
                    <div className="border-y border-gray-3 mt-7.5 mb-9 py-9">
                      <h4 className="font-medium text-dark mb-4">
                        {locale === "ar"
                          ? "خصائص المنتج:"
                          : "Product Attributes:"}
                      </h4>
                      <div className="space-y-3">
                        {attributes.map((attr, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <div className="min-w-[120px]">
                              <h5 className="font-medium text-dark text-sm">
                                {attr.attribute_name}:
                              </h5>
                            </div>
                            <div className="w-full">
                              <p className="text-dark-4 text-sm">
                                {attr.attribute_value}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="flex flex-wrap items-center gap-4.5">
                      <div className="flex items-center rounded-md border border-gray-3">
                        <button
                          aria-label="button for remove product"
                          className="flex items-center justify-center w-12 h-12 ease-out duration-200 hover:text-blue"
                          onClick={() =>
                            quantity > 1 && setQuantity(quantity - 1)
                          }
                        >
                          <svg
                            className="fill-current"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M3.33301 10.0001C3.33301 9.53984 3.7061 9.16675 4.16634 9.16675H15.833C16.2932 9.16675 16.6663 9.53984 16.6663 10.0001C16.6663 10.4603 16.2932 10.8334 15.833 10.8334H4.16634C3.7061 10.8334 3.33301 10.4603 3.33301 10.0001Z"
                              fill=""
                            />
                          </svg>
                        </button>

                        <span className="flex items-center justify-center w-16 h-12 border-x border-gray-4">
                          {quantity}
                        </span>

                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          disabled={quantity >= product.stock_quantity}
                          aria-label="button for add product"
                          className={`flex items-center justify-center w-12 h-12 ease-out duration-200 ${
                            quantity >= product.stock_quantity
                              ? "text-gray-400 cursor-not-allowed"
                              : "hover:text-blue"
                          }`}
                        >
                          <svg
                            className="fill-current"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M3.33301 10C3.33301 9.5398 3.7061 9.16671 4.16634 9.16671H15.833C16.2932 9.16671 16.6663 9.5398 16.6663 10C16.6663 10.4603 16.2932 10.8334 15.833 10.8334H4.16634C3.7061 10.8334 3.33301 10.4603 3.33301 10Z"
                              fill=""
                            />
                            <path
                              d="M9.99967 16.6667C9.53944 16.6667 9.16634 16.2936 9.16634 15.8334L9.16634 4.16671C9.16634 3.70647 9.53944 3.33337 9.99967 3.33337C10.4599 3.33337 10.833 3.70647 10.833 4.16671L10.833 15.8334C10.833 16.2936 10.4599 16.6667 9.99967 16.6667Z"
                              fill=""
                            />
                          </svg>
                        </button>
                      </div>

                      <button
                        onClick={handleAddToCart}
                        disabled={
                          product.stock_quantity <= 0 ||
                          quantity > product.stock_quantity
                        }
                        className={`inline-flex font-medium py-3 px-7 rounded-md ease-out duration-200 ${
                          product.stock_quantity <= 0 ||
                          quantity > product.stock_quantity
                            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                            : "text-white bg-blue hover:bg-blue-dark"
                        }`}
                      >
                        {product.stock_quantity <= 0
                          ? locale === "ar"
                            ? "غير متوفر"
                            : "Out of Stock"
                          : quantity > product.stock_quantity
                          ? locale === "ar"
                            ? "الكمية غير متوفرة"
                            : "Quantity not available"
                          : locale === "ar"
                          ? "إضافة إلى السلة"
                          : "Add to Cart"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>

          {/* <RecentlyViewdItems /> */}
          <Categories />
        </>
      )}
    </>
  );
};

export default ShopDetails;
