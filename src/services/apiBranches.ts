import apiClient, { ApiResponse } from './apiClient';
import { Branch } from '@/types/branch';

/**
 * Get all branches
 */
export async function getBranches(): Promise<Branch[]> {
  try {
    const response = await apiClient.get<ApiResponse<Branch[]>>('/content/branches');

    if (response.data.success) {
      return response.data.data || [];
    }

    throw new Error(response.data.error || 'Failed to fetch branches');
  } catch (error: any) {
    console.error('Error fetching branches:', error);
    throw error;
  }
}
