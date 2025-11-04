import apiClient, { ApiResponse } from './apiClient';

export interface TestimonialData {
  id: number;
  name_ar: string | null;
  name_en: string | null;
  message_ar: string | null;
  message_en: string | null;
  image: string | null;
  created_at: string;
}

/**
 * Get all testimonials
 */
export async function getTestimonials(): Promise<TestimonialData[]> {
  try {
    const response = await apiClient.get<ApiResponse<TestimonialData[]>>('/content/testimonials');

    if (response.data.success) {
      return response.data.data || [];
    }

    throw new Error(response.data.error || 'Failed to fetch testimonials');
  } catch (error: any) {
    console.error('Error fetching testimonials:', error);
    throw error;
  }
}
