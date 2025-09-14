import supabase from "./supabase";

export interface TestimonialData {
  id: number;
  created_at: string;
  name_ar: string | null;
  name_en: string | null;
  image: string | null;
  message_ar: string | null;
  message_en: string | null;
}

export async function getTestimonials(): Promise<TestimonialData[]> {
  try {
    const { data, error } = await supabase
      .from("testemonial")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching testimonials:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Unexpected error fetching testimonials:", error);
    return [];
  }
}
