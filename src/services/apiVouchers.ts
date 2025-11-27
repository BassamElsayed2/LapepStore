import apiClient from "./apiClient";

export interface Voucher {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  user_id: string;
  phone_number: string;
  is_active: boolean;
  is_used: boolean;
  used_at: string | null;
  used_order_id: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  user_name?: string;
  user_email?: string;
}

export interface ValidateVoucherResponse {
  valid: boolean;
  voucher?: Voucher;
  discount_amount?: number;
}

/**
 * Get current user's vouchers
 */
export async function getMyVouchers(): Promise<{
  success: boolean;
  data?: Voucher[];
  error?: string;
}> {
  try {
    const response = await apiClient.get<{ success: boolean; data: Voucher[] }>(
      "/vouchers/my-vouchers"
    );
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    console.error("Error fetching vouchers:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch vouchers",
    };
  }
}

/**
 * Validate a voucher code
 */
export async function validateVoucher(
  code: string,
  totalAmount?: number
): Promise<{
  success: boolean;
  data?: ValidateVoucherResponse;
  error?: string;
}> {
  try {
    const response = await apiClient.post<{
      success: boolean;
      data: ValidateVoucherResponse;
    }>("/vouchers/validate", {
      code,
      total_amount: totalAmount,
    });
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    console.error("Error validating voucher:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Invalid voucher code",
    };
  }
}

/**
 * Check if user has any active vouchers
 */
export async function hasActiveVouchers(): Promise<boolean> {
  try {
    const result = await getMyVouchers();
    return result.success && (result.data?.length || 0) > 0;
  } catch {
    return false;
  }
}

/**
 * Calculate discount based on voucher type and value
 */
export function calculateDiscount(
  voucher: Voucher,
  totalAmount: number
): number {
  if (voucher.discount_type === "percentage") {
    return (totalAmount * voucher.discount_value) / 100;
  }
  return Math.min(voucher.discount_value, totalAmount);
}

/**
 * Format discount display text
 */
export function formatDiscountText(
  voucher: Voucher,
  locale: string = "ar"
): string {
  if (voucher.discount_type === "percentage") {
    return locale === "ar"
      ? `${voucher.discount_value}% خصم`
      : `${voucher.discount_value}% off`;
  }
  return locale === "ar"
    ? `${voucher.discount_value} جنيه خصم`
    : `${voucher.discount_value} EGP off`;
}

