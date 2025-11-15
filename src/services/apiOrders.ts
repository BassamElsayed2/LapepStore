import apiClient, { ApiResponse } from './apiClient';

export interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
}

export interface CreateOrderData {
  user_id?: string | null;
  total_price: number;
  items: OrderItem[];
  payment_method: 'easykash' | 'cod';
  notes?: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_phone: string;
  customer_email?: string | null;
  customer_street_address: string;
  customer_city: string;
  customer_state?: string;
  customer_postcode?: string;
}

export interface Order {
  id: string;
  user_id?: string | null;
  status: 'pending' | 'paid' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  total_price: number;
  created_at: string;
  updated_at: string;
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
    product?: {
      id: string;
      title: string;
      price: number;
      images: string[];
    };
  }[];
  payments?: {
    id: string;
    payment_method: string;
    payment_provider?: string;
    amount: number;
    payment_status: string;
    transaction_id?: string;
    easykash_ref?: string;
    voucher?: string;
    created_at: string;
  }[];
}

/**
 * Create a new order
 */
export async function createOrder(
  orderData: CreateOrderData
): Promise<{ order: Order | null; error: string | null }> {
  try {
    const response = await apiClient.post<ApiResponse<Order>>('/orders', orderData);

    if (response.data.success && response.data.data) {
      return { order: response.data.data, error: null };
    }

    return {
      order: null,
      error: response.data.error || 'Failed to create order',
    };
  } catch (error: any) {
    console.error('Error creating order:', error);
    return {
      order: null,
      error: error.message || 'حدث خطأ غير متوقع',
    };
  }
}

/**
 * Get user orders (requires authentication)
 */
export async function getUserOrders(
  page?: number,
  limit?: number
): Promise<{ orders: Order[] | null; error: string | null }> {
  try {
    const response = await apiClient.get<ApiResponse<Order[]>>('/orders/my-orders', {
      params: { page, limit },
    });

    if (response.data.success) {
      return { orders: response.data.data || [], error: null };
    }

    return {
      orders: null,
      error: response.data.error || 'Failed to fetch orders',
    };
  } catch (error: any) {
    console.error('Error fetching user orders:', error);
    return {
      orders: null,
      error: error.message || 'حدث خطأ غير متوقع',
    };
  }
}

/**
 * Get order by ID
 */
export async function getOrderById(
  orderId: string
): Promise<{ order: Order | null; error: string | null }> {
  try {
    const response = await apiClient.get<ApiResponse<Order>>(`/orders/${orderId}`);

    if (response.data.success && response.data.data) {
      return { order: response.data.data, error: null };
    }

    return {
      order: null,
      error: response.data.error || 'Order not found',
    };
  } catch (error: any) {
    console.error('Error fetching order:', error);
    return {
      order: null,
      error: error.message || 'حدث خطأ غير متوقع',
    };
  }
}

/**
 * Update order status (Admin only)
 */
export async function updateOrderStatus(
  orderId: string,
  status: 'pending' | 'paid' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
): Promise<{ success: boolean; error: string | null }> {
  try {
    const response = await apiClient.put<ApiResponse>(`/orders/${orderId}/status`, {
      status,
    });

    if (response.data.success) {
      return { success: true, error: null };
    }

    return {
      success: false,
      error: response.data.error || 'Failed to update order status',
    };
  } catch (error: any) {
    console.error('Error updating order status:', error);
    return {
      success: false,
      error: error.message || 'حدث خطأ غير متوقع',
    };
  }
}
