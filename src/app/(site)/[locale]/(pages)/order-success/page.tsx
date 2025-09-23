"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { getOrderById, type Order } from "@/services/apiOrders";
import {
  createNotificationData,
  convertOrderToOrderDetails,
  sendWhatsAppNotificationDirect,
} from "@/utils/whatsappNotification";

const OrderSuccessPage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const locale = useLocale();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSendWhatsApp = () => {
    if (!order) return;

    try {
      // Convert order to order details format
      const orderDetails = convertOrderToOrderDetails(
        order,
        order.order_items || []
      );
      sendWhatsAppNotificationDirect(orderDetails);
    } catch (error) {
      console.error("Error sending WhatsApp notification:", error);
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("Order ID not found");
        setLoading(false);
        return;
      }

      try {
        const { order: fetchedOrder, error: fetchError } = await getOrderById(
          orderId
        );

        if (fetchError) {
          setError(fetchError);
        } else {
          setOrder(fetchedOrder);
        }
      } catch (err) {
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <>
        <Breadcrumb
          title={locale === "ar" ? "تم الطلب بنجاح" : "Order Success"}
          pages={[locale === "ar" ? "تم الطلب بنجاح" : "Order Success"]}
        />
        <section className="py-20 bg-gray-2">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="bg-white shadow-1 rounded-[10px] p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue mx-auto"></div>
              <p className="mt-4 text-dark-5">Loading order details...</p>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Breadcrumb
          title={locale === "ar" ? "خطأ في الطلب" : "Order Error"}
          pages={[locale === "ar" ? "خطأ في الطلب" : "Order Error"]}
        />
        <section className="py-20 bg-gray-2">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="bg-white shadow-1 rounded-[10px] p-8 text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-semibold text-dark mb-4">
                {locale === "ar" ? "حدث خطأ" : "Something went wrong"}
              </h2>
              <p className="text-dark-5 mb-6">{error}</p>
              <Link
                href="/"
                className="inline-block bg-blue text-white px-6 py-3 rounded-md hover:bg-blue-dark transition-colors"
              >
                {locale === "ar" ? "العودة للرئيسية" : "Return Home"}
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Breadcrumb
        title={locale === "ar" ? "تم الطلب بنجاح" : "Order Success"}
        pages={[locale === "ar" ? "تم الطلب بنجاح" : "Order Success"]}
      />
      <section className="py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white shadow-1 rounded-[10px] p-8">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="text-green-500 text-6xl mb-4">✅</div>
              <h1 className="text-3xl font-bold text-dark mb-2">
                {locale === "ar"
                  ? "تم إرسال طلبك بنجاح!"
                  : "Order Placed Successfully!"}
              </h1>
              <p className="text-dark-5">
                {locale === "ar"
                  ? "شكراً لك على طلبك. سنقوم بمعالجته في أقرب وقت ممكن."
                  : "Thank you for your order. We'll process it as soon as possible."}
              </p>
            </div>

            {/* Important Alert */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
              <div className="flex items-start">
                <div className="text-yellow-400 text-2xl ml-3">⚠️</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                    {locale === "ar" ? "تنبيه مهم" : "Important Notice"}
                  </h3>
                  <div className="text-yellow-700 space-y-2">
                    <p className="font-medium">
                      {locale === "ar"
                        ? `يرجى الاحتفاظ برقم الطلب: ${order.id}`
                        : `Please keep your order number: ${order.id}`}
                    </p>
                    <p>
                      {locale === "ar"
                        ? "للحصول على رد سريع وتسريع عملية التوصيل، يرجى إرسال رسالة واتساب برقم الطلب"
                        : "For quick response and faster delivery, please send a WhatsApp message with your order number"}
                    </p>
                    <button
                      onClick={handleSendWhatsApp}
                      className="mt-3 inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      <Image
                        src="/images/icons8-whatsapp.svg"
                        alt="WhatsApp"
                        width={40}
                        height={40}
                        className="ml-2"
                      />
                      {locale === "ar"
                        ? "إرسال رسالة واتساب الآن"
                        : "Send WhatsApp Message Now"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Status Tracker */}
            <div className="bg-white  rounded-xl p-8 mb-8 shadow-sm">
              {/* Current Order Status */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {locale === "ar"
                    ? "حالة الطلب الحالية"
                    : "Current Order Status"}
                </h3>

                <div className="inline-flex items-center justify-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg ${
                      order.status === "pending"
                        ? "bg-yellow-500"
                        : order.status === "paid"
                        ? "bg-blue-500"
                        : order.status === "shipped"
                        ? "bg-purple-500"
                        : order.status === "delivered"
                        ? "bg-green-500"
                        : order.status === "cancelled"
                        ? "bg-red-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {order.status === "pending" && "⏳"}
                    {order.status === "paid" && "💳"}
                    {order.status === "shipped" && "🚛"}
                    {order.status === "delivered" && "✅"}
                    {order.status === "cancelled" && "❌"}
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">
                    {order.status === "pending"
                      ? locale === "ar"
                        ? "في الانتظار"
                        : "Pending"
                      : order.status === "paid"
                      ? locale === "ar"
                        ? "تم الدفع"
                        : "Paid"
                      : order.status === "shipped"
                      ? locale === "ar"
                        ? "تم الشحن"
                        : "Shipped"
                      : order.status === "delivered"
                      ? locale === "ar"
                        ? "تم التوصيل"
                        : "Delivered"
                      : order.status === "cancelled"
                      ? locale === "ar"
                        ? "ملغي"
                        : "Cancelled"
                      : order.status}
                  </h4>
                  <p className="text-gray-600">
                    {order.status === "pending" &&
                      (locale === "ar"
                        ? "طلبك قيد المراجعة وسنتواصل معك قريباً"
                        : "Your order is being reviewed and we'll contact you soon")}
                    {order.status === "paid" &&
                      (locale === "ar"
                        ? "تم تأكيد طلبك وهو قيد التحضير للشحن"
                        : "Your order is confirmed and being prepared for shipping")}
                    {order.status === "shipped" &&
                      (locale === "ar"
                        ? "تم شحن طلبك وهو في الطريق إليك"
                        : "Your order has been shipped and is on its way")}
                    {order.status === "delivered" &&
                      (locale === "ar"
                        ? "تم توصيل طلبك بنجاح"
                        : "Your order has been delivered successfully")}
                    {order.status === "cancelled" &&
                      (locale === "ar"
                        ? "تم إلغاء طلبك"
                        : "Your order has been cancelled")}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="border-t border-gray-3 pt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order Info */}
                <div>
                  <h3 className="text-xl font-semibold text-dark mb-4">
                    {locale === "ar" ? "تفاصيل الطلب" : "Order Details"}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-dark-5">
                        {locale === "ar" ? "رقم الطلب:" : "Order ID:"}
                      </span>
                      <span className="font-medium text-dark">{order.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-5">
                        {locale === "ar" ? "تاريخ الطلب:" : "Order Date:"}
                      </span>
                      <span className="font-medium text-dark">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-5">
                        {locale === "ar" ? "حالة الطلب:" : "Status:"}
                      </span>
                      <span className="font-medium text-green-600 capitalize">
                        {order.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-5">
                        {locale === "ar" ? "المجموع:" : "Total:"}
                      </span>
                      <span className="font-bold text-dark text-lg">
                        ${order.total_price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                {(order.customer_first_name || order.customer_last_name) && (
                  <div>
                    <h3 className="text-xl font-semibold text-dark mb-4">
                      {locale === "ar"
                        ? "معلومات العميل"
                        : "Customer Information"}
                    </h3>
                    <div className="space-y-3">
                      {(order.customer_first_name ||
                        order.customer_last_name) && (
                        <div>
                          <span className="text-dark-5 block">
                            {locale === "ar" ? "الاسم:" : "Name:"}
                          </span>
                          <span className="font-medium text-dark">
                            {order.customer_first_name}{" "}
                            {order.customer_last_name}
                          </span>
                        </div>
                      )}
                      {order.customer_phone && (
                        <div>
                          <span className="text-dark-5 block">
                            {locale === "ar" ? "رقم الهاتف:" : "Phone:"}
                          </span>
                          <span className="font-medium text-dark">
                            {order.customer_phone}
                          </span>
                        </div>
                      )}
                      {order.customer_email && (
                        <div>
                          <span className="text-dark-5 block">
                            {locale === "ar" ? "البريد الإلكتروني:" : "Email:"}
                          </span>
                          <span className="font-medium text-dark">
                            {order.customer_email}
                          </span>
                        </div>
                      )}
                      {order.customer_street_address && (
                        <div>
                          <span className="text-dark-5 block">
                            {locale === "ar"
                              ? "عنوان التسليم:"
                              : "Delivery Address:"}
                          </span>
                          <span className="font-medium text-dark">
                            {order.customer_street_address}
                            <br />
                            {order.customer_city}, {order.customer_state}{" "}
                            {order.customer_postcode}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Order Items */}
              {order.order_items && order.order_items.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-3">
                  <h3 className="text-xl font-semibold text-dark mb-4">
                    {locale === "ar" ? "المنتجات المطلوبة" : "Order Items"}
                  </h3>
                  <div className="space-y-4">
                    {order.order_items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center py-3 border-b border-gray-3"
                      >
                        <div>
                          <h4 className="font-medium text-dark">
                            {item.products?.title ||
                              `Product ${item.product_id}`}
                          </h4>
                          <p className="text-sm text-dark-5">
                            {locale === "ar" ? "الكمية:" : "Quantity:"}{" "}
                            {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-dark">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Steps */}
              <div className="mt-8 pt-8  border-gray-3 text-center">
                <h3 className="text-xl font-semibold text-dark mb-4">
                  {locale === "ar" ? "ماذا بعد؟" : "What's Next?"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="p-4 bg-gray-1 rounded-lg">
                    <div className="text-blue text-2xl mb-2">📞</div>
                    <h4 className="font-medium text-dark mb-2">
                      {locale === "ar" ? "سنتواصل معك" : "We'll Contact You"}
                    </h4>
                    <p className="text-sm text-dark-5">
                      {locale === "ar"
                        ? "سنقوم بالاتصال بك لتأكيد الطلب وترتيب التسليم"
                        : "We'll call you to confirm your order and arrange delivery"}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-1 rounded-lg">
                    <div className="text-blue text-2xl mb-2">🚚</div>
                    <h4 className="font-medium text-dark mb-2">
                      {locale === "ar" ? "التسليم السريع" : "Fast Delivery"}
                    </h4>
                    <p className="text-sm text-dark-5">
                      {locale === "ar"
                        ? "سيتم توصيل طلبك في أقرب وقت ممكن"
                        : "Your order will be delivered as soon as possible"}
                    </p>
                  </div>
                </div>

                <div className="space-x-4">
                  <Link
                    href="/"
                    className="ml-4 inline-block bg-blue text-white px-6 py-3 rounded-md hover:bg-blue-dark transition-colors"
                  >
                    {locale === "ar" ? "متابعة التسوق" : "Continue Shopping"}
                  </Link>

                  <Link
                    href="/contact"
                    className="inline-block border border-blue text-blue px-6 py-3 rounded-md hover:bg-blue hover:text-white transition-colors"
                  >
                    {locale === "ar" ? "اتصل بنا" : "Contact Us"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrderSuccessPage;
