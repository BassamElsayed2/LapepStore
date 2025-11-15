import apiClient, { ApiResponse } from './apiClient';

export interface EasykashPaymentRequest {
  order_id: string;
  amount: number;
  name: string;
  email?: string;
  mobile: string;
  currency?: 'EGP' | 'USD' | 'SAR' | 'EUR';
}

export interface EasykashPaymentResponse {
  redirectUrl: string;
  order_id: string;
  paymentId?: string;
}

export interface PaymentStatus {
  id: string;
  order_id: string;
  payment_method: string;
  payment_provider?: string;
  amount: number;
  payment_status: 'pending' | 'completed' | 'failed';
  transaction_id?: string;
  easykash_ref?: string;
  easykash_product_code?: string;
  voucher?: string;
  customer_reference?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Initiate payment with Easykash
 */
export async function initiateEasykashPayment(
  paymentData: EasykashPaymentRequest
): Promise<{ data: EasykashPaymentResponse | null; error: string | null }> {
  try {
    const response = await apiClient.post<ApiResponse<EasykashPaymentResponse>>(
      '/payment/initiate',
      paymentData
    );

    if (response.data.success && response.data.data) {
      return { data: response.data.data, error: null };
    }

    return {
      data: null,
      error: response.data.error || 'Failed to initiate payment',
    };
  } catch (error: any) {
    console.error('Error initiating payment:', error);
    return {
      data: null,
      error: error.message || 'حدث خطأ في بدء عملية الدفع',
    };
  }
}

/**
 * Get payment status for an order
 */
export async function getPaymentStatus(
  orderId: string
): Promise<{ payment: PaymentStatus | null; error: string | null }> {
  try {
    const response = await apiClient.get<ApiResponse<PaymentStatus>>(
      `/payment/${orderId}/status`
    );

    if (response.data.success && response.data.data) {
      return { payment: response.data.data, error: null };
    }

    return {
      payment: null,
      error: response.data.error || 'Payment not found',
    };
  } catch (error: any) {
    console.error('Error fetching payment status:', error);
    return {
      payment: null,
      error: error.message || 'حدث خطأ في جلب حالة الدفع',
    };
  }
}


