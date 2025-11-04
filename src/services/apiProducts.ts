import apiClient, { ApiResponse, PaginatedResponse } from "./apiClient";
import { Product, ProductAttribute } from "@/types/product";

export interface GetProductsParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
  isBestSeller?: boolean;
  limitedTimeOffer?: boolean;
}

/**
 * Get all products with optional filters
 */
export async function getProducts(
  params?: GetProductsParams
): Promise<Product[]> {
  try {
    const response = await apiClient.get<
      PaginatedResponse<Product> | ApiResponse<Product[]>
    >("/products", { params });

    if (response.data.success) {
      // Handle both paginated and non-paginated responses
      let products =
        "pagination" in response.data
          ? response.data.data
          : response.data.data || [];

      // Map images to image_url for backward compatibility
      products = products.map((product: any) => ({
        ...product,
        image_url: product.images || product.image_url, // Ensure compatibility
      }));

      return products;
    }

    throw new Error(response.data.error || "Failed to fetch products");
  } catch (error: any) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

/**
 * Get product by ID
 */
export async function getProductById(id: string): Promise<Product> {
  try {
    const response = await apiClient.get<ApiResponse<Product>>(
      `/products/${id}`
    );

    if (response.data.success && response.data.data) {
      const product: any = response.data.data;
      // Map images to image_url for backward compatibility
      return {
        ...product,
        image_url: product.images || product.image_url,
      };
    }

    throw new Error(response.data.error || "Product not found");
  } catch (error: any) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

/**
 * Get best seller products
 */
export async function getBestSellerProducts(): Promise<Product[]> {
  try {
    const response = await apiClient.get<ApiResponse<Product[]>>(
      "/products/best-sellers"
    );

    if (response.data.success) {
      const products = response.data.data || [];
      // Map images to image_url for backward compatibility
      return products.map((product: any) => ({
        ...product,
        image_url: product.images || product.image_url,
      }));
    }

    throw new Error(response.data.error || "Failed to fetch best sellers");
  } catch (error: any) {
    console.error("Error fetching best sellers:", error);
    throw error;
  }
}

/**
 * Get limited time offer products
 */
export async function getLimitedTimeOfferProducts(): Promise<Product[]> {
  try {
    const response = await apiClient.get<ApiResponse<Product[]>>(
      "/products/limited-offers"
    );

    if (response.data.success) {
      const products = response.data.data || [];
      // Map images to image_url for backward compatibility
      return products.map((product: any) => ({
        ...product,
        image_url: product.images || product.image_url,
      }));
    }

    throw new Error(response.data.error || "Failed to fetch limited offers");
  } catch (error: any) {
    console.error("Error fetching limited offers:", error);
    throw error;
  }
}

/**
 * Get product attributes
 */
export async function getProductAttributes(
  productId: string
): Promise<ProductAttribute[]> {
  try {
    const product = await getProductById(productId);
    return product.attributes || [];
  } catch (error: any) {
    console.error("Error fetching product attributes:", error);
    throw error;
  }
}
