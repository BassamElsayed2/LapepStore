"use client";
import { Category } from "@/types/category";
import { useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import Link from "next/link";

const SingleItem = ({ item, index }: { item: Category; index: number }) => {
  const locale = useLocale();
  const [imgError, setImgError] = useState(false);
  const name = locale === "ar" ? item.name_ar : item.name_en;

  return (
    <Link
      href={`/${locale}/shop?category=${item.id}`}
      className="group relative flex flex-col items-center gap-3 bg-white rounded-xl shadow-md hover:shadow-lg p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 overflow-hidden before:absolute before:inset-0 before:rounded-xl before:border-2 before:border-green before:opacity-0 before:scale-95 before:transition-all before:duration-300 hover:before:opacity-100 hover:before:scale-100"
    >
      <div className="w-14 h-14 flex items-center justify-center text-green">
        {item.image_url && !imgError ? (
          <Image
            src={item.image_url}
            alt={name}
            width={56}
            height={56}
            className="w-14 h-14 object-contain rounded-full"
            onError={() => setImgError(true)}
            unoptimized
          />
        ) : (
          <span className="text-2xl font-bold text-green">
            {name.charAt(0)}
          </span>
        )}
      </div>
      <h3 className="text-sm sm:text-base font-semibold text-dark text-center leading-tight">
        {name}
      </h3>
    </Link>
  );
};

export default SingleItem;
