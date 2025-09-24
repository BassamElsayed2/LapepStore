"use client";
import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { getOrderByIdForTracking, type Order } from "@/services/apiOrders";
import {
  createNotificationData,
  convertOrderToOrderDetails,
  sendWhatsAppNotificationDirect,
} from "@/utils/whatsappNotification";
import { OrderProgress, type OrderStatusStep } from "./OrderProgress";

interface OrderTrackingProps {
  orderId: string;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ orderId }) => {
  const locale = useLocale();
  const t = useTranslations("orderTracking");
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
        setError(t("orderNotFound"));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { order: fetchedOrder, error: fetchError } =
          await getOrderByIdForTracking(orderId);

        if (fetchError || !fetchedOrder) {
          setError(fetchError || t("orderNotFound"));
          setOrder(null);
        } else {
          setOrder(fetchedOrder);
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(t("error"));
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, t]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "paid":
        return "💳";
      case "shipped":
        return "🚛";
      case "delivered":
        return "✅";
      case "cancelled":
        return "❌";
      default:
        return "📦";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "paid":
        return "bg-green-500";
      case "shipped":
        return "bg-purple-500";
      case "delivered":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return t("statusPending");
      case "paid":
        return t("statusPaid");
      case "shipped":
        return t("statusShipped");
      case "delivered":
        return t("statusDelivered");
      case "cancelled":
        return t("statusCancelled");
      default:
        return status;
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "pending":
        return t("statusPendingDesc");
      case "paid":
        return t("statusPaidDesc");
      case "shipped":
        return t("statusShippedDesc");
      case "delivered":
        return t("statusDeliveredDesc");
      case "cancelled":
        return t("statusCancelledDesc");
      default:
        return "";
    }
  };

  const getTrackingSteps = (currentStatus: string): OrderStatusStep[] => {
    const steps = [
      {
        status: "pending",
        label: t("trackingSteps.orderPlaced"),
        description: t("statusPendingDesc"),
        icon: "📝",
      },
      {
        status: "paid",
        label: t("trackingSteps.orderConfirmed"),
        description: t("statusPaidDesc"),
        icon: "✅",
      },
      {
        status: "shipped",
        label: t("trackingSteps.inTransit"),
        description: t("statusShippedDesc"),
        icon: "🚛",
      },
      {
        status: "delivered",
        label: t("trackingSteps.delivered"),
        description: t("statusDeliveredDesc"),
        icon: "🎯",
      },
    ];

    const statusOrder = ["pending", "paid", "shipped", "delivered"];
    const currentIndex = statusOrder.indexOf(currentStatus);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex && currentIndex >= 0,
      current: index === currentIndex,
    }));
  };

  if (loading) {
    return (
      <div className="bg-white shadow-1 rounded-[10px] p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue mx-auto mb-4"></div>
        <p className="text-dark-5">{t("loading")}</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-white shadow-1 rounded-[10px] p-8 text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-semibold text-dark mb-4">
          {t("orderNotFound")}
        </h2>
        <p className="text-dark-5 mb-6">{error || t("orderNotFoundDesc")}</p>
        <Link
          href="/"
          className="inline-block bg-blue text-white px-6 py-3 rounded-md hover:bg-blue-dark transition-colors"
        >
          {t("backToHome")}
        </Link>
      </div>
    );
  }

  const trackingSteps = getTrackingSteps(order.status);

  return (
    <div className="bg-white shadow-1 rounded-[10px] p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-blue text-6xl mb-4">📋</div>
        <h1 className="text-3xl font-bold text-dark mb-2">
          {t("orderDetails")}
        </h1>
        <p className="text-dark-5">
          {t("orderNumber")}: {order.id}
        </p>
      </div>

      {/* Order Progress Tracker */}
      <div className="bg-white rounded-xl p-8 mb-8 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">
          {locale === "ar" ? "تقدم الطلب" : "Order Progress"}
        </h3>

        {/* Progress Component */}
        <div className="bg-gradient-to-r from-gray-50 to-green-50 rounded-lg p-6 border border-gray-200">
          {order.status === "cancelled" ? (
            /* Cancelled Order Info */
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg bg-red-500">
                  ❌
                </div>
              </div>
              <h4 className="text-lg font-bold text-red-800 mb-2">
                {getStatusText(order.status)}
              </h4>
              <p className="text-red-600 text-sm mb-4">
                {getStatusDescription(order.status)}
              </p>
            </div>
          ) : (
            /* Normal Order Progress */
            <div>
              <OrderProgress steps={trackingSteps} />

              {/* Current Status Information */}
              <div className="mt-6 text-center">
                <div className="inline-flex items-center justify-center mb-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg transition-all duration-300 hover:shadow-xl ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                  </div>
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">
                  {getStatusText(order.status)}
                </h4>
                <p className="text-gray-600 text-sm">
                  {getStatusDescription(order.status)}
                </p>
              </div>
            </div>
          )}
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
                {locale === "ar" ? "معلومات العميل" : "Customer Information"}
              </h3>
              <div className="space-y-3">
                {(order.customer_first_name || order.customer_last_name) && (
                  <div>
                    <span className="text-dark-5 block">
                      {locale === "ar" ? "الاسم:" : "Name:"}
                    </span>
                    <span className="font-medium text-dark">
                      {order.customer_first_name} {order.customer_last_name}
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
                      {locale === "ar" ? "عنوان التسليم:" : "Delivery Address:"}
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
                      {item.products?.title || `Product ${item.product_id}`}
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
        <div className="mt-8 pt-8 border-gray-3 text-center">
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
  );
};

export default OrderTracking;
