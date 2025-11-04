import apiClient, { ApiResponse } from './apiClient';

export interface Address {
  id: string;
  user_id: string;
  street?: string;
  building?: string;
  floor?: string;
  apartment?: string;
  area?: string;
  city?: string;
  notes?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAddressData {
  street?: string;
  building?: string;
  floor?: string;
  apartment?: string;
  area?: string;
  city?: string;
  notes?: string;
  is_default?: boolean;
}

/**
 * Get all addresses for current user
 */
export async function getAddresses(): Promise<ApiResponse<Address[]>> {
  try {
    const response = await apiClient.get<ApiResponse<Address[]>>('/addresses');
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to get addresses',
    };
  }
}

/**
 * Get single address by ID
 */
export async function getAddress(id: string): Promise<ApiResponse<Address>> {
  try {
    const response = await apiClient.get<ApiResponse<Address>>(`/addresses/${id}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to get address',
    };
  }
}

/**
 * Create new address
 */
export async function createAddress(data: CreateAddressData): Promise<ApiResponse<Address>> {
  try {
    const response = await apiClient.post<ApiResponse<Address>>('/addresses', data);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to create address',
    };
  }
}

/**
 * Update address
 */
export async function updateAddress(
  id: string,
  data: Partial<CreateAddressData>
): Promise<ApiResponse<Address>> {
  try {
    const response = await apiClient.put<ApiResponse<Address>>(`/addresses/${id}`, data);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to update address',
    };
  }
}

/**
 * Delete address
 */
export async function deleteAddress(id: string): Promise<ApiResponse> {
  try {
    const response = await apiClient.delete<ApiResponse>(`/addresses/${id}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to delete address',
    };
  }
}

/**
 * Set address as default
 */
export async function setDefaultAddress(id: string): Promise<ApiResponse> {
  try {
    const response = await apiClient.patch<ApiResponse>(`/addresses/${id}/default`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to set default address',
    };
  }
}

