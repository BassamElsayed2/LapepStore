import supabase from "./supabase";

export interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
}

export interface CreateOrderData {
  user_id: string | null; // Allow null for guest orders
  total_price: number;
  items: OrderItem[];
  payment_method: "cod" | "paypal" | "stripe";
  notes?: string;
  // Guest checkout fields
  customer_first_name?: string;
  customer_last_name?: string;
  customer_phone?: string;
  customer_email?: string | null;
  customer_street_address?: string;
  customer_city?: string;
  customer_state?: string;
  customer_postcode?: string;
}

export interface Order {
  id: string;
  user_id: string | null; // Allow null for guest orders
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  total_price: number;
  created_at: string;
  updated_at: string;
  // Guest checkout fields
  customer_first_name?: string;
  customer_last_name?: string;
  customer_phone?: string;
  customer_email?: string | null;
  customer_street_address?: string;
  customer_city?: string;
  customer_state?: string;
  customer_postcode?: string;
  order_notes?: string;
  order_items?: {
    id: string;
    product_id: string;
    quantity: number;
    price: number;
    products?: {
      id: string;
      title: string;
      price: number;
      images: string[];
    };
  }[];
  payments?: {
    id: string;
    payment_method: string;
    amount: number;
    payment_status: string;
    transaction_id?: string;
    created_at: string;
  }[];
}

// إنشاء طلب جديد
export async function createOrder(
  orderData: CreateOrderData
): Promise<{ order: Order | null; error: string | null }> {
  try {
    // إنشاء الطلب الأساسي
    const orderInsertData: any = {
      user_id: orderData.user_id,
      total_price: orderData.total_price,
      status: "pending",
    };

    // Add guest customer data if provided
    if (orderData.customer_first_name) {
      orderInsertData.customer_first_name = orderData.customer_first_name;
    }
    if (orderData.customer_last_name) {
      orderInsertData.customer_last_name = orderData.customer_last_name;
    }
    if (orderData.customer_phone) {
      orderInsertData.customer_phone = orderData.customer_phone;
    }
    if (orderData.customer_email) {
      orderInsertData.customer_email = orderData.customer_email;
    }
    if (orderData.customer_street_address) {
      orderInsertData.customer_street_address =
        orderData.customer_street_address;
    }
    if (orderData.customer_city) {
      orderInsertData.customer_city = orderData.customer_city;
    }
    if (orderData.customer_state) {
      orderInsertData.customer_state = orderData.customer_state;
    }
    if (orderData.customer_postcode) {
      orderInsertData.customer_postcode = orderData.customer_postcode;
    }
    if (orderData.notes) {
      orderInsertData.order_notes = orderData.notes;
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert(orderInsertData)
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      return { order: null, error: orderError.message };
    }

    // إنشاء عناصر الطلب
    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Error creating order items:", itemsError);
      // حذف الطلب إذا فشل إنشاء العناصر
      await supabase.from("orders").delete().eq("id", order.id);
      return { order: null, error: itemsError.message };
    }

    // إنشاء سجل الدفع
    const { error: paymentError } = await supabase.from("payments").insert({
      order_id: order.id,
      payment_method: orderData.payment_method,
      amount: orderData.total_price,
      payment_status:
        orderData.payment_method === "cod" ? "pending" : "pending",
    });

    if (paymentError) {
      console.error("Error creating payment record:", paymentError);
      // يمكن المتابعة حتى لو فشل إنشاء سجل الدفع
    }

    return { order, error: null };
  } catch (error) {
    console.error("Unexpected error creating order:", error);
    return { order: null, error: "حدث خطأ غير متوقع" };
  }
}

// جلب طلبات المستخدم
export async function getUserOrders(
  userId: string
): Promise<{ orders: Order[] | null; error: string | null }> {
  try {
    const { data: orders, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          *,
          products (
            id,
            title,
            price,
            images
          )
        ),
        payments (*)
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user orders:", error);
      return { orders: null, error: error.message };
    }

    return { orders: orders || [], error: null };
  } catch (error) {
    console.error("Unexpected error fetching orders:", error);
    return { orders: null, error: "حدث خطأ غير متوقع" };
  }
}

// جلب تفاصيل طلب محدد
export async function getOrderById(
  orderId: string
): Promise<{ order: Order | null; error: string | null }> {
  try {
    const { data: order, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          *,
          products (
            id,
            title,
            price,
            images
          )
        ),
        payments (*)
      `
      )
      .eq("id", orderId)
      .single();

    if (error) {
      console.error("Error fetching order:", error);
      return { order: null, error: error.message };
    }

    return { order, error: null };
  } catch (error) {
    console.error("Unexpected error fetching order:", error);
    return { order: null, error: "حدث خطأ غير متوقع" };
  }
}

// جلب تفاصيل طلب محدد للتتبع العام (بدون الحاجة لمعرف المستخدم)
export async function getOrderByIdForTracking(
  orderId: string
): Promise<{ order: Order | null; error: string | null }> {
  try {
    // التحقق من صحة معرف الطلب
    if (!orderId || orderId.trim().length === 0) {
      return { order: null, error: "رقم الطلب مطلوب" };
    }

    const { data: order, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          *,
          products (
            id,
            title,
            price,
            images
          )
        ),
        payments (*)
      `
      )
      .eq("id", orderId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
        return { order: null, error: "لم يتم العثور على الطلب" };
      }
      console.error("Error fetching order for tracking:", error);
      return { order: null, error: "حدث خطأ في جلب بيانات الطلب" };
    }

    return { order, error: null };
  } catch (error) {
    console.error("Unexpected error fetching order for tracking:", error);
    return { order: null, error: "حدث خطأ غير متوقع" };
  }
}

// تحديث حالة الطلب
export async function updateOrderStatus(
  orderId: string,
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled"
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from("orders")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (error) {
      console.error("Error updating order status:", error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Unexpected error updating order status:", error);
    return { success: false, error: "حدث خطأ غير متوقع" };
  }
}

// تحديث حالة الدفع
export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: "pending" | "completed" | "failed",
  transactionId?: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const updateData: any = { payment_status: paymentStatus };
    if (transactionId) {
      updateData.transaction_id = transactionId;
    }

    const { error } = await supabase
      .from("payments")
      .update(updateData)
      .eq("order_id", orderId);

    if (error) {
      console.error("Error updating payment status:", error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Unexpected error updating payment status:", error);
    return { success: false, error: "حدث خطأ غير متوقع" };
  }
}
