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
    staleTime: 5 * 60 * 1000, // 5 minutes
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
  });
};

/**
 * Get best seller products
 */
export const useBestSellers = () => {
  return useQuery({
    queryKey: ['products', 'best-sellers'],
    queryFn: fetchBestSellers,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Get limited time offer products
 */
export const useLimitedOffers = () => {
  return useQuery({
    queryKey: ['products', 'limited-offers'],
    queryFn: fetchLimitedOffers,
    staleTime: 10 * 60 * 1000, // 10 minutes
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


