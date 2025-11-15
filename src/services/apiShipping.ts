const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: 'حدث خطأ في الاتصال بالخادم',
    }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export interface ShippingFee {
  id: number;
  governorate_name_ar: string;
  governorate_name_en: string;
  fee: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Governorate {
  ar: string;
  en: string;
}

/**
 * Get shipping fee by governorate name
 * Returns null if shipping is not available for this governorate
 */
export async function getShippingFeeByGovernorate(
  governorateName: string
): Promise<number | null> {
  try {
    const response = await apiFetch<{ success: boolean; data: { governorate: string; fee: number | null } }>(
      `/shipping/fee?governorate=${encodeURIComponent(governorateName)}`
    );
    const fee = response.data.fee;
    // If success is false or fee is null, shipping is not available
    if (!response.success || fee === null || fee === undefined) {
      return null;
    }
    // Fee can be 0 for free shipping (governorate exists but fee is 0)
    // Fee is null only if governorate doesn't exist in shipping_fees table
    return fee;
  } catch (error: any) {
    console.error('خطأ في جلب سعر الشحن:', error);
    // Return null if error (shipping not available)
    return null;
  }
}

/**
 * Get active shipping fees
 */
export async function getActiveShippingFees(): Promise<ShippingFee[]> {
  try {
    const response = await apiFetch<{ success: boolean; data: ShippingFee[] }>(
      '/shipping/fees/active'
    );
    return response.data;
  } catch (error: any) {
    console.error('خطأ في جلب أسعار الشحن:', error);
    return [];
  }
}

/**
 * Get Egyptian governorates list
 */
export async function getGovernorates(): Promise<Governorate[]> {
  try {
    const response = await apiFetch<{ success: boolean; data: Governorate[] }>(
      '/shipping/governorates'
    );
    return response.data;
  } catch (error: any) {
    console.error('خطأ في جلب المحافظات:', error);
    // Return static list as fallback
    return [
      { ar: "القاهرة", en: "Cairo" },
      { ar: "الجيزة", en: "Giza" },
      { ar: "الإسكندرية", en: "Alexandria" },
      { ar: "الدقهلية", en: "Dakahlia" },
      { ar: "البحيرة", en: "Beheira" },
      { ar: "المنيا", en: "Minya" },
      { ar: "القليوبية", en: "Qalyubia" },
      { ar: "سوهاج", en: "Sohag" },
      { ar: "أسيوط", en: "Asyut" },
      { ar: "الشرقية", en: "Sharqia" },
      { ar: "المنوفية", en: "Monufia" },
      { ar: "كفر الشيخ", en: "Kafr El Sheikh" },
      { ar: "الغربية", en: "Gharbia" },
      { ar: "بني سويف", en: "Beni Suef" },
      { ar: "قنا", en: "Qena" },
      { ar: "أسوان", en: "Aswan" },
      { ar: "الأقصر", en: "Luxor" },
      { ar: "البحر الأحمر", en: "Red Sea" },
      { ar: "الوادي الجديد", en: "New Valley" },
      { ar: "مطروح", en: "Matruh" },
      { ar: "شمال سيناء", en: "North Sinai" },
      { ar: "جنوب سيناء", en: "South Sinai" },
      { ar: "الإسماعيلية", en: "Ismailia" },
      { ar: "بورسعيد", en: "Port Said" },
      { ar: "السويس", en: "Suez" },
      { ar: "دمياط", en: "Damietta" },
      { ar: "الفيوم", en: "Faiyum" },
    ];
  }
}

