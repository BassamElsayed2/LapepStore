import apiClient, { ApiResponse } from './apiClient';

export interface Banner {
  id: number;
  desc_ar: string | null;
  desc_en: string | null;
  image: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

/**
 * Get all banners
 */
export const getBanners = async (): Promise<Banner[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Banner[]>>('/content/banners');

    if (response.data.success) {
      return response.data.data || [];
    }

    throw new Error(response.data.error || 'Failed to fetch banners');
  } catch (error: any) {
    console.error('Error fetching banners:', error);
    throw error;
  }
};
