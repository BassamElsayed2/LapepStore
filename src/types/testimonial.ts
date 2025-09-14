export type Testimonial = {
  review: string;
  authorName: string;
  authorRole: string;
  authorImg: string;
};

export interface TestimonialData {
  id: number;
  created_at: string;
  name_ar: string | null;
  name_en: string | null;
  image: string | null;
  message_ar: string | null;
  message_en: string | null;
}
