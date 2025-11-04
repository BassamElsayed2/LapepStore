import apiClient, { ApiResponse } from './apiClient';
import { Category } from '@/types/category';

/**
 * Get all categories
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await apiClient.get<ApiResponse<Category[]>>('/categories');

    if (response.data.success) {
      return response.data.data || [];
    }

    throw new Error(response.data.error || 'Failed to fetch categories');
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}
