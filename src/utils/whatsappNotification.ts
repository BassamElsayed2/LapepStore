/**
 * WhatsApp Notification Utility for Guest Checkout
 *
 * This module provides functions to format and prepare WhatsApp messages
 * for order notifications to be sent to +201065223412
 */

export interface OrderDetails {
  orderId: string;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
  totalPrice: number;
  streetAddress: string;
  city: string;
  state: string;
  postcode: string;
  orderNotes?: string;
}

/**
 * Formats order details into a WhatsApp message for the business owner
 */
export function formatWhatsAppMessage(orderDetails: OrderDetails): string {
  const productCount = orderDetails.items.length;
  const productSummary = orderDetails.items
    .map(
      (item) =>
        `• ${item.quantity} × ${item.productName} - $${item.price.toFixed(2)}`
    )
    .join("\n");

  let message = `🛒 *طلب جديد من متجر لابيب*

📋 *تفاصيل الطلب:*
رقم الطلب: ${orderDetails.orderId}
التاريخ: ${new Date().toLocaleDateString("ar-EG")}
الوقت: ${new Date().toLocaleTimeString("ar-EG")}

👤 *معلومات العميل:*
الاسم: ${orderDetails.customerFirstName} ${orderDetails.customerLastName}
الهاتف: ${orderDetails.customerPhone}
عدد المنتجات: ${productCount} منتج
المجموع: $${orderDetails.totalPrice.toFixed(2)}

🛍️ *المنتجات المطلوبة:*
${productSummary}

📍 *عنوان التوصيل:*
${orderDetails.streetAddress}
${orderDetails.city}, ${orderDetails.state} ${orderDetails.postcode}`;

  if (orderDetails.orderNotes && orderDetails.orderNotes.trim()) {
    message += `\n\n📝 *ملاحظات العميل:*
${orderDetails.orderNotes}`;
  }

  message += `\n\n✅ *تم إنشاء الطلب بنجاح*
📞 *يرجى التواصل مع العميل لتأكيد الطلب*

---
🏪 *نظام طلبات متجر لابيب*`;

  return message;
}

/**
 * Formats phone number to include country code if missing
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // Remove any spaces, dashes, or other characters
  const cleanNumber = phoneNumber.replace(/[\s\-\(\)]/g, "");

  // If number starts with 0, replace with country code
  if (cleanNumber.startsWith("0")) {
    return "20" + cleanNumber.substring(1);
  }

  // If number starts with 20, it's already formatted
  if (cleanNumber.startsWith("20")) {
    return cleanNumber;
  }

  // If number doesn't start with country code, add it
  if (!cleanNumber.startsWith("+")) {
    return "20" + cleanNumber;
  }

  return cleanNumber.replace("+", "");
}

/**
 * Gets the configured WhatsApp notification number
 */
export function getWhatsAppNotificationNumber(): string {
  const envNumber = process.env.WHATSAPP_NOTIFICATION_NUMBER;
  const defaultNumber = "201065223412";

  if (envNumber) {
    return formatPhoneNumber(envNumber);
  }

  return defaultNumber;
}

/**
 * Generates a WhatsApp Web URL with pre-filled message
 */
export function generateWhatsAppUrl(
  message: string,
  phoneNumber?: string
): string {
  const recipient = phoneNumber || getWhatsAppNotificationNumber();
  const encodedMessage = encodeURIComponent(message);

  // Remove the + from phone number for WhatsApp Web URL
  const cleanNumber = recipient.replace("+", "");

  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}

/**
 * Copies text to clipboard with error handling
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers or non-secure contexts
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand("copy");
      textArea.remove();
      return success;
    }
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}

/**
 * Checks if WhatsApp notifications are enabled
 */
export function isWhatsAppNotificationEnabled(): boolean {
  // Default to true if environment variable is not set
  const envValue = process.env.NEXT_PUBLIC_ENABLE_WHATSAPP_NOTIFICATIONS;
  return envValue === undefined || envValue === "true";
}

/**
 * Creates a formatted message for dashboard display
 */
export function createNotificationData(orderDetails: OrderDetails) {
  const message = formatWhatsAppMessage(orderDetails);
  const whatsappUrl = generateWhatsAppUrl(message);
  const recipientNumber = getWhatsAppNotificationNumber();

  return {
    message,
    whatsappUrl,
    recipientNumber,
    timestamp: new Date().toISOString(),
    orderCount: orderDetails.items.length,
    totalAmount: orderDetails.totalPrice,
  };
}

/**
 * Sends WhatsApp notification automatically by opening WhatsApp Web
 */
export function sendWhatsAppNotification(
  orderDetails: OrderDetails,
  locale: string = "ar"
): void {
  if (!isWhatsAppNotificationEnabled()) {
    return;
  }

  const message = formatWhatsAppMessage(orderDetails);
  const whatsappUrl = generateWhatsAppUrl(message);

  // Show confirmation dialog before opening WhatsApp
  const confirmationText =
    locale === "ar"
      ? "سيتم فتح واتساب لإرسال تفاصيل الطلب. هل تريد المتابعة؟"
      : "WhatsApp will open to send order details. Do you want to continue?";

  const shouldOpen = window.confirm(confirmationText);

  if (shouldOpen) {
    // Open WhatsApp Web in a new tab
    window.open(whatsappUrl, "_blank");
  }
}

/**
 * Sends WhatsApp notification directly without confirmation dialog
 */
export function sendWhatsAppNotificationDirect(
  orderDetails: OrderDetails
): void {
  if (!isWhatsAppNotificationEnabled()) {
    return;
  }

  const message = formatWhatsAppMessage(orderDetails);
  const whatsappUrl = generateWhatsAppUrl(message);

  // Open WhatsApp Web in a new tab directly
  window.open(whatsappUrl, "_blank");
}

/**
 * Converts order data from API to OrderDetails format
 */
export function convertOrderToOrderDetails(
  order: any,
  cartItems: any[]
): OrderDetails {
  // Use order_items from database if available, otherwise fall back to cartItems
  const items =
    order.order_items && order.order_items.length > 0
      ? order.order_items.map((item: any) => ({
          productName: item.products?.title || `Product ${item.product_id}`,
          quantity: item.quantity,
          price: item.price,
        }))
      : cartItems.map((item) => ({
          productName: item.title,
          quantity: item.quantity,
          price: item.discountedPrice || item.price,
        }));

  const orderDetails = {
    orderId: order.id,
    customerFirstName: order.customer_first_name || "",
    customerLastName: order.customer_last_name || "",
    customerPhone: order.customer_phone || "",
    items: items,
    totalPrice: order.total_price,
    streetAddress: order.customer_street_address || "",
    city: order.customer_city || "",
    state: order.customer_state || "",
    postcode: order.customer_postcode || "",
    orderNotes: order.notes || order.order_notes || "",
  };

  return orderDetails;
}
