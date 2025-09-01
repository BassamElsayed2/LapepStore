export type ProductAttribute = {
  attribute_name: string;
  attribute_value: string;
};

export type Product = {
  name_ar: string;
  name_en: string;
  id: number;
  image_url: string | string[];
  offer_price: number;
  price: number;
  reviews: number;
  // Additional fields that might come from the database
  title?: string;
  discountedPrice?: number;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
  stock: number;
  description_ar: string;
  description_en: string;
  description?: string;
  is_best_seller?: boolean;
  limited_time_offer?: boolean;
  attributes?: ProductAttribute[];
};
