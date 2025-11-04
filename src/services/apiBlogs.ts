import apiClient, { ApiResponse } from './apiClient';
import { BlogData } from '@/types/blogItem';

/**
 * Get all blogs
 */
export async function getBlogs(): Promise<BlogData[]> {
  try {
    const response = await apiClient.get<ApiResponse<BlogData[]>>('/content/blogs');

    if (response.data.success) {
      return response.data.data || [];
    }

    throw new Error(response.data.error || 'Failed to fetch blogs');
  } catch (error: any) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
}

/**
 * Get blog by ID
 */
export async function getBlogById(id: string): Promise<BlogData> {
  try {
    const response = await apiClient.get<ApiResponse<BlogData>>(`/content/blogs/${id}`);

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.error || 'Blog not found');
  } catch (error: any) {
    console.error('Error fetching blog:', error);
    throw error;
  }
}
