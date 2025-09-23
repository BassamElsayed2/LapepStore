import supabase from "./supabase";

export interface Banner {
  id: number;
  created_at: string;
  desc_ar: string | null;
  desc_en: string | null;
  image: string | null;
}

// Get all banners
export const getBanners = async (): Promise<Banner[]> => {
  try {
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching banners:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in getBanners:", error);
    throw error;
  }
};
