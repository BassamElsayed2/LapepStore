import { Category } from "@/types/category";
import React from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import Link from "next/link";

const SingleItem = ({ item }: { item: Category }) => {
  const locale = useLocale();

  return (
    <Link
      href={`/${locale}/shop?category=${item.id}`}
      className="group flex flex-col items-center h-full"
    >
      <div className="max-w-[130px] w-full bg-[#F2F3F8] h-32.5 rounded-full flex items-center justify-center mb-4 overflow-hidden flex-shrink-0">
        <img
          src={item.image_url || "/images/category/default-category.png"}
          alt="Category"
          className="w-full h-full object-cover rounded-full"
          loading="lazy"
        />
      </div>

      <div className="flex justify-center">
        <h3 className="inline-block font-medium text-center text-dark bg-gradient-to-r from-blue to-blue bg-[length:0px_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 hover:bg-[length:100%_3px] group-hover:bg-[length:100%_1px] group-hover:text-blue">
          {locale === "ar" ? item.name_ar : item.name_en}
        </h3>
      </div>
    </Link>
  );
};

export default SingleItem;
