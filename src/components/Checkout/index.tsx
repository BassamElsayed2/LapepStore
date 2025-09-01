"use client";
import React, { useState, FormEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/app/i18n/navigation";
import toast from "react-hot-toast";
import Breadcrumb from "../Common/Breadcrumb";
import PaymentMethod from "./PaymentMethod";
import {
  selectCartItems,
  selectTotalPrice,
  removeAllItemsFromCart,
} from "../../redux/features/cart-slice";
import { createOrder } from "../../services/apiOrders";
import { useAuth } from "../../hooks/useAuth";

const Checkout = () => {
  const t = useTranslations("checkout");
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectTotalPrice);
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, loading } = useAuth();
  const locale = useLocale();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shippingFee = 15.0;
  const finalTotal = totalPrice + shippingFee;

  // توجيه المستخدم لصفحة تسجيل الدخول إذا لم يكن مسجل
  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [user, loading, router]);

  // لا تعرض الصفحة إذا كان المستخدم غير مسجل أو في حالة تحميل
  if (loading || !user) {
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError(t("loginFirst"));
      return;
    }

    if (cartItems.length === 0) {
      setError(t("emptyCart"));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const orderData = {
        user_id: user.id,
        total_price: finalTotal,
        payment_method: paymentMethod as "cod",
        notes: notes || undefined,
        items: cartItems.map((item) => ({
          product_id: item.id.toString(), // تحويل إلى string لأن قاعدة البيانات تستخدم UUID
          quantity: item.quantity,
          price: item.discountedPrice,
        })),
      };

      const { order, error: orderError } = await createOrder(orderData);

      if (orderError) {
        setError(orderError);
        return;
      }

      if (order) {
        // إفراغ السلة بعد نجاح الطلب
        dispatch(removeAllItemsFromCart());

        // إظهار رسالة نجاح
        toast.success(t("orderPlaced"));

        // إعادة توجيه إلى صفحة الملف الشخصي
        router.push(`/profile?tab=orders&orderId=${order.id}`);
      }
    } catch (err) {
      console.error("Error placing order:", err);
      setError(t("orderError"));
      toast.error(t("orderError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb
        title={locale === "ar" ? "الدفع" : "Checkout"}
        pages={[locale === "ar" ? "الدفع" : "Checkout"]}
      />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
              {/* <!-- checkout right --> */}
              <div className="max-w-[455px] w-full">
                {/* <!-- order list box --> */}
                <div className="bg-white shadow-1 rounded-[10px]">
                  <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                    <h3 className="font-medium text-xl text-dark">
                      {t("yourOrder")}
                    </h3>
                  </div>

                  <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                    {/* <!-- title --> */}
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <div>
                        <h4 className="font-medium text-dark">
                          {t("product")}
                        </h4>
                      </div>
                      <div>
                        <h4 className="font-medium text-dark text-start">
                          {t("subtotal")}
                        </h4>
                      </div>
                    </div>

                    {/* عرض عناصر السلة */}
                    {cartItems.length === 0 ? (
                      <div className="flex items-center justify-center py-10">
                        <p className="text-dark-5">{t("emptyCart")}</p>
                      </div>
                    ) : (
                      cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start justify-between py-5 border-b border-gray-3"
                        >
                          <div className="flex-1">
                            <p className="text-dark font-medium">
                              {item.title}
                            </p>
                            <p className="text-sm text-dark-5 mt-1">
                              {t("quantity")}: {item.quantity}
                            </p>
                          </div>
                          <div className="text-start">
                            <p className="text-dark font-medium">
                              $
                              {(item.discountedPrice * item.quantity).toFixed(
                                2
                              )}
                            </p>
                          </div>
                        </div>
                      ))
                    )}

                    {/* رسوم الشحن */}
                    {cartItems.length > 0 && (
                      <div className="flex items-center justify-between py-5 border-b border-gray-3">
                        <div>
                          <p className="text-dark">{t("shippingFee")}</p>
                        </div>
                        <div>
                          <p className="text-dark text-start">
                            ${shippingFee.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* المجموع الكلي */}
                    {cartItems.length > 0 && (
                      <div className="flex items-center justify-between pt-5">
                        <div>
                          <p className="font-medium text-lg text-dark">
                            {t("total")}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-lg text-dark text-start">
                            ${finalTotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* <!-- payment box --> */}
                <PaymentMethod
                  selectedPayment={paymentMethod}
                  onPaymentChange={setPaymentMethod}
                />

                {/* رسالة الخطأ */}
                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {/* <!-- checkout button --> */}
                <button
                  type="submit"
                  disabled={isLoading || cartItems.length === 0 || !user}
                  className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5 disabled:bg-gray-4 disabled:cursor-not-allowed"
                >
                  {isLoading ? t("placingOrder") : t("processToCheckout")}
                </button>
              </div>

              {/* <!-- checkout left --> */}
              <div className="lg:max-w-[670px] w-full">
                {/* <!-- others note box --> */}
                <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
                  <div>
                    <label htmlFor="notes" className="block mb-2.5">
                      {t("otherNotes")}
                    </label>

                    <textarea
                      name="notes"
                      id="notes"
                      rows={5}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={t("notesPlaceholder")}
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                      dir="auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;
