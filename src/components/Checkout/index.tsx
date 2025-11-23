"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { useAppSelector } from "@/redux/store";
import {
  removeItemFromCart,
  updateCartItemQuantity,
  selectTotalPrice,
} from "@/redux/features/cart-slice";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import Image from "next/image";
import Link from "next/link";
import { Link as I18nLink } from "@/app/i18n/navigation";
import Breadcrumb from "../Common/Breadcrumb";
import { getAddresses, type Address } from "@/services/apiAddresses";
import { getShippingFeeByGovernorate } from "@/services/apiShipping";
import { useAuth } from "@/hooks/useAuth";
import { createOrder, type CreateOrderData } from "@/services/apiOrders";
import { initiateEasykashPayment } from "@/services/apiPayment";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const Checkout = () => {
  const locale = useLocale();
  const t = useTranslations("checkout");
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const router = useRouter();
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [shippingFee, setShippingFee] = useState<number | null>(null);
  const [loadingShipping, setLoadingShipping] = useState(false);

  // Fetch user addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) return;

      setLoadingAddresses(true);
      try {
        const response = await getAddresses();
        if (response.success && response.data) {
          setAddresses(response.data);
          // Select default address if available
          const defaultAddress = response.data.find((addr) => addr.is_default);
          if (defaultAddress) {
            setSelectedAddress(defaultAddress);
          } else if (response.data.length > 0) {
            setSelectedAddress(response.data[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, [user]);

  // Fetch shipping fee when address is selected
  useEffect(() => {
    const fetchShippingFee = async () => {
      if (!selectedAddress?.city) return;

      setLoadingShipping(true);
      try {
        const fee = await getShippingFeeByGovernorate(selectedAddress.city);
        setShippingFee(fee);
      } catch (error) {
        console.error("Error fetching shipping fee:", error);
        setShippingFee(null);
      } finally {
        setLoadingShipping(false);
      }
    };

    fetchShippingFee();
  }, [selectedAddress]);

  const handleRemoveFromCart = (itemId: number) => {
    dispatch(removeItemFromCart(itemId));
  };

  const handleIncreaseQuantity = (
    itemId: number,
    currentQuantity: number,
    stock: number
  ) => {
    if (currentQuantity < stock) {
      dispatch(
        updateCartItemQuantity({ id: itemId, quantity: currentQuantity + 1 })
      );
    }
  };

  const handleDecreaseQuantity = (itemId: number, currentQuantity: number) => {
    if (currentQuantity > 1) {
      dispatch(
        updateCartItemQuantity({ id: itemId, quantity: currentQuantity - 1 })
      );
    }
  };

  const calculateTotal = () => {
    const subtotal = totalPrice;
    const shipping = shippingFee !== null ? shippingFee : 0;
    return subtotal + shipping;
  };

  const handleEasyKashPayment = async () => {
    // Validate required fields
    if (!selectedAddress) {
      toast.error(
        locale === "ar"
          ? "يرجى اختيار عنوان التوصيل"
          : "Please select a delivery address"
      );
      return;
    }

    // Check if shipping is available for selected address
    if (shippingFee === null && !loadingShipping) {
      toast.error(
        locale === "ar"
          ? "عذراً، التوصيل غير متاح لهذا العنوان. يرجى اختيار عنوان آخر."
          : "Sorry, delivery is not available for this address. Please select another address."
      );
      return;
    }

    if (!user) {
      toast.error(
        locale === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please login first"
      );
      router.push(`/${locale}/login`);
      return;
    }

    if (cartItems.length === 0) {
      toast.error(locale === "ar" ? "سلة التسوق فارغة" : "Cart is empty");
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Prepare order data
      const orderData: CreateOrderData = {
        user_id: user.id || null,
        total_price: calculateTotal(),
        items: cartItems.map((item) => ({
          product_id: String(item.id),
          quantity: item.quantity,
          price: item.discountedPrice,
        })),
        payment_method: "easykash",
        customer_first_name:
          user.full_name?.split(" ")[0] || user.name?.split(" ")[0] || "",
        customer_last_name:
          user.full_name?.split(" ").slice(1).join(" ") ||
          user.name?.split(" ").slice(1).join(" ") ||
          "",
        customer_phone: user.phone || "",
        customer_email: user.email || null,
        customer_street_address: `${selectedAddress.street || ""}${
          selectedAddress.building
            ? `, ${locale === "ar" ? "مبنى" : "Building"} ${
                selectedAddress.building
              }`
            : ""
        }${
          selectedAddress.floor
            ? `, ${locale === "ar" ? "طابق" : "Floor"} ${selectedAddress.floor}`
            : ""
        }${
          selectedAddress.apartment
            ? `, ${locale === "ar" ? "شقة" : "Apt"} ${
                selectedAddress.apartment
              }`
            : ""
        }`.trim(),
        customer_city: selectedAddress.city || "",
        customer_state: selectedAddress.area || undefined,
      };

      // Create order
      const { order, error: orderError } = await createOrder(orderData);

      if (orderError || !order) {
        toast.error(
          locale === "ar"
            ? `فشل إنشاء الطلب: ${orderError}`
            : `Failed to create order: ${orderError}`
        );
        setIsProcessingPayment(false);
        return;
      }

      // Initiate EasyKash payment
      const { data: paymentData, error: paymentError } =
        await initiateEasykashPayment({
          order_id: order.id,
          amount: calculateTotal(),
          name: user.full_name || user.name || "",
          email: user.email || undefined,
          mobile: user.phone || "",
          currency: "EGP",
        });

      if (paymentError || !paymentData) {
        toast.error(
          locale === "ar"
            ? `فشل بدء عملية الدفع: ${paymentError}`
            : `Failed to initiate payment: ${paymentError}`
        );
        setIsProcessingPayment(false);
        return;
      }

      // Redirect to EasyKash payment page
      if (paymentData.redirectUrl) {
        window.location.href = paymentData.redirectUrl;
      } else {
        toast.error(
          locale === "ar"
            ? "لم يتم الحصول على رابط الدفع"
            : "Payment URL not received"
        );
        setIsProcessingPayment(false);
      }
    } catch (error: any) {
      console.error("Error processing payment:", error);
      toast.error(
        locale === "ar"
          ? "حدث خطأ أثناء معالجة الدفع"
          : "An error occurred while processing payment"
      );
      setIsProcessingPayment(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <>
        <Breadcrumb title={t("checkout")} pages={[t("checkout")]} />
        <section className="overflow-hidden py-20 bg-gray-2">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="bg-white rounded-[10px] shadow-1 p-8 text-center">
              <p className="text-dark text-lg mb-4">{t("emptyCart")}</p>
              <Link
                href={`/${locale}/shop`}
                className="inline-block font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark"
              >
                {locale === "ar" ? "مواصلة التسوق" : "Continue Shopping"}
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Breadcrumb title={t("checkout")} pages={[t("checkout")]} />
      <section className="overflow-hidden py-20 bg-gray-2 ">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col lg:flex-row gap-7.5">
            {/* Order Items Section */}
            <div className="lg:flex-1">
              <div className="bg-white rounded-[10px] shadow-1 mb-7.5">
                <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                  <h2 className="font-medium text-xl text-dark">
                    {t("yourOrder")}
                  </h2>
                </div>

                <div className="p-4 sm:px-8.5">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 py-5 border-b border-gray-3 last:border-0"
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-20 h-20 rounded-[5px] bg-gray-2 overflow-hidden">
                        {item.imgs?.thumbnails?.[0] && (
                          <Image
                            width={80}
                            height={80}
                            src={item.imgs.thumbnails[0]}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-dark mb-1">
                          {item.title}
                        </h3>
                        <p className="text-gray-5 text-sm">
                          {locale === "ar" ? "السعر:" : "Price:"}{" "}
                          {locale === "ar" ? "ج.م" : "EGP"}{" "}
                          {item.discountedPrice}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center rounded-md border border-gray-3">
                          <button
                            onClick={() =>
                              handleDecreaseQuantity(item.id, item.quantity)
                            }
                            disabled={item.quantity <= 1}
                            className="flex items-center justify-center w-10 h-10 ease-out duration-200 hover:text-blue disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Decrease quantity"
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
                                fill="currentColor"
                              />
                            </svg>
                          </button>

                          <span className="flex items-center justify-center w-12 h-10 border-x border-gray-4 text-dark">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              handleIncreaseQuantity(
                                item.id,
                                item.quantity,
                                item.stock
                              )
                            }
                            disabled={item.quantity >= item.stock}
                            className="flex items-center justify-center w-10 h-10 ease-out duration-200 hover:text-blue disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Increase quantity"
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
                                fill="currentColor"
                              />
                              <path
                                d="M9.99967 16.6667C9.53944 16.6667 9.16634 16.2936 9.16634 15.8334L9.16634 4.16671C9.16634 3.70647 9.53944 3.33337 9.99967 3.33337C10.4599 3.33337 10.833 3.70647 10.833 4.16671L10.833 15.8334C10.833 16.2936 10.4599 16.6667 9.99967 16.6667Z"
                                fill="currentColor"
                              />
                            </svg>
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="min-w-[80px] text-right">
                          <p className="font-medium text-dark">
                            {locale === "ar" ? "ج.م" : "EGP"}{" "}
                            {(item.discountedPrice * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="flex items-center justify-center rounded-lg w-9 h-9 bg-gray-2 border border-gray-3 text-dark ease-out duration-200 hover:bg-red-light-6 hover:border-red-light-4 hover:text-red"
                          aria-label="Remove item"
                        >
                          <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 22 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M9.45017 2.06252H12.5498C12.7482 2.06239 12.921 2.06228 13.0842 2.08834C13.7289 2.19129 14.2868 2.59338 14.5883 3.17244C14.6646 3.319 14.7192 3.48298 14.7818 3.6712L14.8841 3.97819C14.9014 4.03015 14.9064 4.04486 14.9105 4.05645C15.0711 4.50022 15.4873 4.80021 15.959 4.81217C15.9714 4.81248 15.9866 4.81254 16.0417 4.81254H18.7917C19.1714 4.81254 19.4792 5.12034 19.4792 5.50004C19.4792 5.87973 19.1714 6.18754 18.7917 6.18754H3.20825C2.82856 6.18754 2.52075 5.87973 2.52075 5.50004C2.52075 5.12034 2.82856 4.81254 3.20825 4.81254H5.95833C6.01337 4.81254 6.02856 4.81248 6.04097 4.81217C6.51273 4.80021 6.92892 4.50024 7.08944 4.05647C7.09366 4.0448 7.09852 4.03041 7.11592 3.97819L7.21823 3.67122C7.28083 3.48301 7.33538 3.319 7.41171 3.17244C7.71324 2.59339 8.27112 2.19129 8.91581 2.08834C9.079 2.06228 9.25181 2.06239 9.45017 2.06252ZM8.25739 4.81254C8.30461 4.71993 8.34645 4.6237 8.38245 4.52419C8.39338 4.49397 8.4041 4.4618 8.41787 4.42048L8.50936 4.14601C8.59293 3.8953 8.61217 3.84416 8.63126 3.8075C8.73177 3.61448 8.91773 3.48045 9.13263 3.44614C9.17345 3.43962 9.22803 3.43754 9.49232 3.43754H12.5077C12.772 3.43754 12.8265 3.43962 12.8674 3.44614C13.0823 3.48045 13.2682 3.61449 13.3687 3.8075C13.3878 3.84416 13.4071 3.89529 13.4906 4.14601L13.5821 4.42031L13.6176 4.52421C13.6535 4.62372 13.6954 4.71994 13.7426 4.81254H8.25739Z"
                              fill="currentColor"
                            />
                            <path
                              d="M5.42208 7.74597C5.39683 7.36711 5.06923 7.08047 4.69038 7.10572C4.31152 7.13098 4.02487 7.45858 4.05013 7.83743L4.47496 14.2099C4.55333 15.3857 4.61663 16.3355 4.76511 17.0808C4.91947 17.8557 5.18203 18.5029 5.72432 19.0103C6.26662 19.5176 6.92987 19.7365 7.7133 19.839C8.46682 19.9376 9.41871 19.9376 10.5971 19.9375H11.4028C12.5812 19.9376 13.5332 19.9376 14.2867 19.839C15.0701 19.7365 15.7334 19.5176 16.2757 19.0103C16.818 18.5029 17.0805 17.8557 17.2349 17.0808C17.3834 16.3355 17.4467 15.3857 17.525 14.2099L17.9499 7.83743C17.9751 7.45858 17.6885 7.13098 17.3096 7.10572C16.9308 7.08047 16.6032 7.36711 16.5779 7.74597L16.1563 14.0702C16.0739 15.3057 16.0152 16.1654 15.8864 16.8122C15.7614 17.4396 15.5869 17.7717 15.3363 18.0062C15.0857 18.2406 14.7427 18.3926 14.1084 18.4756C13.4544 18.5612 12.5927 18.5625 11.3545 18.5625H10.6455C9.40727 18.5625 8.54559 18.5612 7.89164 18.4756C7.25731 18.3926 6.91433 18.2406 6.6637 18.0062C6.41307 17.7717 6.2386 17.4396 6.11361 16.8122C5.98476 16.1654 5.92607 15.3057 5.8437 14.0702L5.42208 7.74597Z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address Section */}
              <div className="bg-white rounded-[10px] shadow-1">
                <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                  <h2 className="font-medium text-xl text-dark">
                    {locale === "ar" ? "عنوان التوصيل" : "Delivery Address"}
                  </h2>
                </div>

                <div className="p-4 sm:px-8.5 py-6">
                  {loadingAddresses ? (
                    <div className="text-center py-8">
                      <p className="text-gray-5">
                        {locale === "ar" ? "جاري التحميل..." : "Loading..."}
                      </p>
                    </div>
                  ) : addresses.length > 0 ? (
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          onClick={() => setSelectedAddress(address)}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedAddress?.id === address.id
                              ? "border-blue bg-blue-light-1"
                              : "border-gray-3 hover:border-gray-4"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              {address.is_default && (
                                <span className="inline-block mb-2 px-2 py-1 text-xs font-medium text-blue bg-blue-light-2 rounded">
                                  {locale === "ar" ? "افتراضي" : "Default"}
                                </span>
                              )}
                              <p className="font-medium text-dark mb-1">
                                {address.street && `${address.street}, `}
                                {address.building &&
                                  `${locale === "ar" ? "مبنى" : "Building"} ${
                                    address.building
                                  }`}
                                {address.floor &&
                                  `, ${locale === "ar" ? "طابق" : "Floor"} ${
                                    address.floor
                                  }`}
                                {address.apartment &&
                                  `, ${locale === "ar" ? "شقة" : "Apt"} ${
                                    address.apartment
                                  }`}
                              </p>
                              {address.area && (
                                <p className="text-gray-5 text-sm mb-1">
                                  {locale === "ar" ? "المنطقة:" : "Area:"}{" "}
                                  {address.area}
                                </p>
                              )}
                              {address.city && (
                                <p className="text-gray-5 text-sm">
                                  {locale === "ar" ? "المدينة:" : "City:"}{" "}
                                  {address.city}
                                </p>
                              )}
                              {address.notes && (
                                <p className="text-gray-5 text-sm mt-2">
                                  {locale === "ar" ? "ملاحظات:" : "Notes:"}{" "}
                                  {address.notes}
                                </p>
                              )}
                            </div>
                            {selectedAddress?.id === address.id && (
                              <div className="ml-4">
                                <svg
                                  className="w-6 h-6 text-blue"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-dark mb-4">
                        {locale === "ar"
                          ? "لا يوجد لديك عناوين محفوظة"
                          : "You don't have any saved addresses"}
                      </p>
                      <I18nLink
                        href={`/profile?tab=addresses`}
                        className="inline-block font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark"
                      >
                        {locale === "ar"
                          ? "إضافة عنوان جديد"
                          : "Add New Address"}
                      </I18nLink>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="lg:max-w-[400px] w-full">
              <div className="bg-white shadow-1 rounded-[10px] sticky top-5">
                <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                  <h3 className="font-medium text-xl text-dark">
                    {locale === "ar" ? "ملخص الطلب" : "Order Summary"}
                  </h3>
                </div>

                <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                  {/* Subtotal */}
                  <div className="flex items-center justify-between py-5 border-b border-gray-3">
                    <div>
                      <p className="text-dark">{t("subtotal")}</p>
                    </div>
                    <div>
                      <p className="text-dark text-right">
                        {locale === "ar" ? "ج.م" : "EGP"}{" "}
                        {totalPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Shipping Fee */}
                  <div className="flex items-center justify-between py-5 border-b border-gray-3">
                    <div>
                      <p className="text-dark">{t("shippingFee")}</p>
                    </div>
                    <div>
                      {loadingShipping ? (
                        <p className="text-gray-5 text-sm text-right">
                          {locale === "ar"
                            ? "جاري الحساب..."
                            : "Calculating..."}
                        </p>
                      ) : shippingFee !== null ? (
                        <p className="text-dark text-right">
                          {locale === "ar" ? "ج.م" : "EGP"}{" "}
                          {shippingFee.toFixed(2)}
                        </p>
                      ) : selectedAddress ? (
                        <p className="text-gray-5 text-sm text-right">
                          {locale === "ar" ? "غير متاح" : "Not available"}
                        </p>
                      ) : (
                        <p className="text-gray-5 text-sm text-right">
                          {locale === "ar" ? "اختر عنوان" : "Select address"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between pt-5">
                    <div>
                      <p className="font-medium text-lg text-dark">
                        {t("total")}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-lg text-dark text-right">
                        {locale === "ar" ? "ج.م" : "EGP"}{" "}
                        {calculateTotal().toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* EasyKash Payment Button */}
                  <button
                    onClick={handleEasyKashPayment}
                    disabled={
                      isProcessingPayment ||
                      !selectedAddress ||
                      cartItems.length === 0 ||
                      !user ||
                      (shippingFee === null && !loadingShipping)
                    }
                    className="w-full flex items-center justify-center gap-2 font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark disabled:opacity-50 disabled:cursor-not-allowed mt-7.5"
                  >
                    {isProcessingPayment ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>
                          {locale === "ar"
                            ? "جاري المعالجة..."
                            : "Processing..."}
                        </span>
                      </>
                    ) : (
                      <>
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
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                        <span>{t("easykashPayment")}</span>
                      </>
                    )}
                  </button>

                  {!selectedAddress && (
                    <p className="text-sm text-gray-5 text-center mt-2">
                      {locale === "ar"
                        ? "يرجى اختيار عنوان التوصيل أولاً"
                        : "Please select a delivery address first"}
                    </p>
                  )}
                  {selectedAddress &&
                    shippingFee === null &&
                    !loadingShipping && (
                      <p className="text-sm text-red text-center mt-2">
                        {locale === "ar"
                          ? "⚠️ التوصيل غير متاح لهذا العنوان"
                          : "⚠️ Delivery is not available for this address"}
                      </p>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Checkout;
