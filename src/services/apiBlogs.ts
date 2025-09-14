import supabase from "./supabase";

export interface BlogData {
  id: string;
  title_ar: string;
  title_en: string;
  content_ar: string | null;
  content_en: string;
  user_id: string | null;
  images: string[] | null;
  created_at: string | null;
  yt_code: string | null;
  author: string | null;
}

export async function getBlogs(): Promise<BlogData[]> {
  try {
    const { data, error } = await supabase
      .from("blog")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching blogs:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Unexpected error fetching blogs:", error);
    return [];
  }
}

export async function getBlogById(id: string): Promise<BlogData | null> {
  try {
    const { data, error } = await supabase
      .from("blog")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching blog:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Unexpected error fetching blog:", error);
    return null;
  }
}
