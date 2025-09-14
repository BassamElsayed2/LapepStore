export type BlogItem = {
  id: number;
  date: string;
  views: number;
  title: string;
  img: string;
};

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
