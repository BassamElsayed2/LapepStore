import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient, { ApiResponse, PaginatedResponse } from "../services/apiClient";
import { Product, ProductAttribute } from "@/types/product";

export interface GetProductsParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
  isBestSeller?: boolean;
  limitedTimeOffer?: boolean;
}

// =====================================================
// Query Functions
// =====================================================

const fetchProducts = async (params?: GetProductsParams): Promise<Product[]> => {
  try {
    const response = await apiClient.get<PaginatedResponse<Product> | ApiResponse<Product[]>>(
      '/products',
      { params }
    );

    if (response.data.success) {
      let products = 'pagination' in response.data ? response.data.data : (response.data.data || []);
      
      // Map images to image_url for backward compatibility
      products = products.map((product: any) => ({
        ...product,
        image_url: product.images || product.image_url,
      }));
      
      return products;
    }

    throw new Error(response.data.error || 'Failed to fetch products');
  } catch (error: any) {
    // Preserve error status for retry logic
    if (error.response?.status) {
      const enhancedError = new Error(error.message || 'Failed to fetch products') as Error & { status?: number };
      enhancedError.status = error.response.status;
      throw enhancedError;
    }
    throw error;
  }
};

const fetchProductById = async (id: string): Promise<Product> => {
  const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);

  if (response.data.success && response.data.data) {
    const product: any = response.data.data;
    // Map images to image_url for backward compatibility
    return {
      ...product,
      image_url: product.images || product.image_url,
    };
  }

  throw new Error(response.data.error || 'Product not found');
};

const fetchBestSellers = async (): Promise<Product[]> => {
  const response = await apiClient.get<ApiResponse<Product[]>>('/products/best-sellers');

  if (response.data.success) {
    const products = response.data.data || [];
    // Map images to image_url for backward compatibility
    return products.map((product: any) => ({
      ...product,
      image_url: product.images || product.image_url,
    }));
  }

  throw new Error(response.data.error || 'Failed to fetch best sellers');
};

const fetchLimitedOffers = async (): Promise<Product[]> => {
  const response = await apiClient.get<ApiResponse<Product[]>>('/products/limited-offers');

  if (response.data.success) {
    const products = response.data.data || [];
    // Map images to image_url for backward compatibility
    return products.map((product: any) => ({
      ...product,
      image_url: product.images || product.image_url,
    }));
  }

  throw new Error(response.data.error || 'Failed to fetch limited offers');
};

// =====================================================
// React Query Hooks
// =====================================================

/**
 * Get all products with filters
 */
export const useProducts = (params?: GetProductsParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => fetchProducts(params),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: (failureCount, error: any) => {
      // Don't retry on 429 (Too Many Requests)
      if (error?.isRateLimit || error?.status === 429) {
        return false;
      }
      // Retry up to 1 time for other errors
      return failureCount < 1;
    },
    retryDelay: (attemptIndex, error: any) => {
      // If it's a rate limit error, use the retry-after header value
      if (error?.isRateLimit || error?.status === 429) {
        return error.retryAfter || 60000; // Default 60 seconds
      }
      // Exponential backoff for other errors
      return Math.min(1000 * 2 ** attemptIndex, 30000);
    },
  });
};

/**
 * Get product by ID
 */
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
    enabled: !!id, // Only run if id exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 429 (Too Many Requests)
      if (error?.isRateLimit || error?.status === 429) {
        return false;
      }
      // Retry up to 1 time for other errors
      return failureCount < 1;
    },
    retryDelay: (attemptIndex, error: any) => {
      // If it's a rate limit error, use the retry-after header value
      if (error?.isRateLimit || error?.status === 429) {
        return error.retryAfter || 60000; // Default 60 seconds
      }
      // Exponential backoff for other errors
      return Math.min(1000 * 2 ** attemptIndex, 30000);
    },
  });
};

/**
 * Get best seller products
 */
export const useBestSellers = () => {
  return useQuery({
    queryKey: ['products', 'best-sellers'],
    queryFn: fetchBestSellers,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 60 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: (failureCount, error: any) => {
      // Don't retry on 429 (Too Many Requests)
      if (error?.isRateLimit || error?.status === 429) {
        return false;
      }
      // Retry up to 1 time for other errors
      return failureCount < 1;
    },
    retryDelay: (attemptIndex, error: any) => {
      // If it's a rate limit error, use the retry-after header value
      if (error?.isRateLimit || error?.status === 429) {
        return error.retryAfter || 60000; // Default 60 seconds
      }
      // Exponential backoff for other errors
      return Math.min(1000 * 2 ** attemptIndex, 30000);
    },
  });
};

/**
 * Get limited time offer products
 */
export const useLimitedOffers = () => {
  return useQuery({
    queryKey: ['products', 'limited-offers'],
    queryFn: fetchLimitedOffers,
    staleTime: 30 * 60 * 1000, // 30 minutes - البيانات تبقى "طازجة" لمدة 30 دقيقة
    gcTime: 60 * 60 * 1000, // 60 minutes - البيانات تبقى في الـ cache لمدة ساعة
    refetchOnMount: false, // لا تعيد الطلب عند mount إذا كانت البيانات موجودة
    refetchOnWindowFocus: false, // لا تعيد الطلب عند العودة للنافذة
    refetchOnReconnect: false, // لا تعيد الطلب عند إعادة الاتصال
    retry: (failureCount, error: any) => {
      // Don't retry on 429 (Too Many Requests)
      if (error?.isRateLimit || error?.status === 429) {
        return false;
      }
      // Retry up to 1 time for other errors
      return failureCount < 1;
    },
    retryDelay: (attemptIndex, error: any) => {
      // If it's a rate limit error, use the retry-after header value
      if (error?.isRateLimit || error?.status === 429) {
        return error.retryAfter || 60000; // Default 60 seconds
      }
      // Exponential backoff for other errors
      return Math.min(1000 * 2 ** attemptIndex, 30000);
    },
  });
};

// =====================================================
// For backward compatibility
// =====================================================

export async function getProducts(params?: GetProductsParams): Promise<Product[]> {
  return fetchProducts(params);
}

export async function getProductById(id: string): Promise<Product> {
  return fetchProductById(id);
}

export async function getBestSellerProducts(): Promise<Product[]> {
  return fetchBestSellers();
}

export async function getLimitedTimeOfferProducts(): Promise<Product[]> {
  return fetchLimitedOffers();
}

export async function getProductAttributes(productId: string): Promise<ProductAttribute[]> {
  const product = await fetchProductById(productId);
  return product.attributes || [];
}


