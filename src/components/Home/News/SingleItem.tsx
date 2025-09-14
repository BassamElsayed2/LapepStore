import Image from "next/image";
import { Link } from "@/app/i18n/navigation";
import { BlogData } from "@/types/blogItem";
import { useTranslations, useLocale } from "next-intl";

interface SingleItemProps {
  newsItem: BlogData;
}

const SingleItem = ({ newsItem }: SingleItemProps) => {
  const { id, title_ar, title_en, images, created_at } = newsItem;
  const t = useTranslations("news");
  const locale = useLocale();

  const displayTitle = locale === "ar" ? title_ar : title_en;

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const displayDate = formatDate(created_at);
  const displayImage =
    images && images.length > 0 ? images[0] : "/images/blog/blog-01.jpg";

  return (
    <div className="group">
      <div className="overflow-hidden rounded-[10px]">
        <Link href={`/news-details?id=${id}`} className="block">
          <Image
            src={displayImage}
            alt={displayTitle}
            width={370}
            height={239}
            className="w-full h-[239px] object-cover transition-all duration-300 group-hover:scale-105"
          />
        </Link>
      </div>

      <div className="pt-5">
        <div className="flex items-center gap-4 mb-3">
          <span className="flex items-center gap-1.5 text-sm text-gray-500">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 1V3M11 1V3M2 7H14M3 5H13C13.5523 5 14 5.44772 14 6V13C14 13.5523 13.5523 14 13 14H3C2.44772 14 2 13.5523 2 13V6C2 5.44772 2.44772 5 3 5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {displayDate}
          </span>
        </div>

        <h3 className="font-semibold text-lg text-dark hover:text-primary transition-colors duration-300">
          <Link href={`/news-details?id=${id}`} className="line-clamp-2">
            {displayTitle}
          </Link>
        </h3>
      </div>
    </div>
  );
};

export default SingleItem;
