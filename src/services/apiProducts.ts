import supabase from "./supabase";

export async function getProducts() {
  const { data, error } = await supabase.from("products").select("*");

  if (error) throw error;
  return data;
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching product:", error);
    throw error;
  }

  if (!data) {
    throw new Error("Product not found");
  }

  return data;
}

export async function getBestSellerProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_best_seller", true);

  if (error) throw error;
  return data;
}

export async function getLimitedTimeOfferProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("limited_time_offer", true);

  if (error) throw error;
  return data;
}

export async function getProductAttributes(productId: string) {
  const { data, error } = await supabase
    .from("product_attributes")
    .select("attribute_name, attribute_value")
    .eq("product_id", productId);

  if (error) throw error;
  return data;
}
