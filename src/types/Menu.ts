export type Menu = {
  id: number;
  title_ar: string;
  title_en: string;
  path?: string;
  newTab: boolean;
  submenu?: Menu[];
};
