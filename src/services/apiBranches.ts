import supabase from "./supabase";
import { Branch } from "@/types/branch";

export const getBranches = async (): Promise<Branch[]> => {
  try {
    const { data, error } = await supabase
      .from("branches")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching branches:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in getBranches:", error);
    throw error;
  }
};

export const getBranchById = async (id: number): Promise<Branch | null> => {
  try {
    const { data, error } = await supabase
      .from("branches")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching branch:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in getBranchById:", error);
    throw error;
  }
};
