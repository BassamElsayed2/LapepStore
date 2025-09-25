import { Menu } from "@/types/Menu";

export const menuData: Menu[] = [
  {
    id: 1,
    title_ar: "الرئيسية",
    title_en: "Home",
    newTab: false,
    path: "/",
  },
  {
    id: 2,
    title_ar: "المتجر",
    title_en: "Shop",
    newTab: false,
    path: "/shop",
  },
  {
    id: 3,
    title_ar: "العروض المحدودة",
    title_en: "Limited Offers",
    newTab: false,
    path: "/shop?filter=limited-offers",
  },
  {
    id: 4,
    title_ar: "تتبع الطلب",
    title_en: "Track Order",
    newTab: false,
    path: "/track-order",
  },
  {
    id: 5,
    title_ar: "فروعنا",
    title_en: "Branches",
    newTab: false,
    path: "/branches",
  },
  {
    id: 6,
    title_ar: "اتصل بنا",
    title_en: "Contact",
    newTab: false,
    path: "/contact",
  },
];
